# localStorage → API 迁移方案

> 当前三端前端全部使用 localStorage 存储用户数据，本文档规划向服务端 API 迁移的路径。

---

## 1. 迁移原则

1. **渐进式迁移** — 不一次性替换全部 localStorage，按模块逐步切换
2. **服务端优先** — 登录后以服务端数据为准，localStorage 作为离线缓存
3. **向下兼容** — 迁移期间支持未登录用户继续使用 localStorage
4. **数据不丢失** — 首次登录时将本地数据同步到服务端

---

## 2. 迁移优先级

| 优先级 | 模块 | localStorage Key | 迁移难度 | 说明 |
|--------|------|-----------------|----------|------|
| P0 | 用户认证 | h5_user/pc_user, h5_token/pc_token | 低 | 替换为真实登录 API + JWT |
| P1 | 收藏 | h5_favorites/pc_favorites | 低 | 简单 CRUD，数据量小 |
| P1 | 智能提醒 | h5_smart_reminders | 中 | 结构较复杂（3种提醒类型） |
| P2 | 用户设置 | h5_settings | 低 | Key-Value 结构 |
| P2 | 反馈 | h5_feedback_history | 中 | 需要文件上传服务 |
| P3 | 浏览记录 | h5_history/pc_history | 低 | 写入频繁，建议仍以本地为主 |
| P3 | 缓存数据 | h5_cache_* | - | 不迁移，保持本地缓存 |

---

## 3. 迁移架构

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   H5/PC 前端     │────▶│  API Gateway  │────▶│   Database   │
│                 │     │              │     │              │
│  ┌───────────┐  │     │  JWT 验证     │     │  PostgreSQL  │
│  │localStorage│  │     │  Rate Limit  │     │              │
│  │ (缓存层)   │  │     │  CORS        │     │  Redis       │
│  └───────────┘  │     └──────────────┘     │  (缓存/会话)  │
└─────────────────┘                          └──────────────┘
```

### 3.1 Service 层抽象

在前端创建统一的 Service 层，封装 localStorage 和 API 调用：

```javascript
// services/favorites.js
class FavoritesService {
    async getAll() {
        if (this.isLoggedIn()) {
            const data = await api.get('/user/favorites');
            localStorage.setItem('favorites_cache', JSON.stringify(data));
            return data;
        }
        return JSON.parse(localStorage.getItem('h5_favorites') || '[]');
    }

    async add(lotteryId) {
        if (this.isLoggedIn()) {
            await api.post('/user/favorites', { lotteryId });
        }
        // 同时更新本地缓存
        const local = this.getLocal();
        local.push({ lotteryId, addedAt: new Date().toISOString() });
        localStorage.setItem('h5_favorites', JSON.stringify(local));
    }

    async syncOnLogin() {
        const local = this.getLocal();
        if (local.length > 0) {
            await api.post('/user/favorites/sync', { items: local });
        }
        const serverData = await api.get('/user/favorites');
        localStorage.setItem('h5_favorites', JSON.stringify(serverData));
    }
}
```

### 3.2 登录后同步流程

```
用户点击登录
    ↓
调用 POST /auth/login
    ↓
获得 Token + User Info
    ↓
存储 Token 到 localStorage / Cookie
    ↓
同步本地数据到服务端（首次登录）:
    ├── POST /user/favorites/sync  ← h5_favorites
    ├── PUT /user/reminders        ← h5_smart_reminders
    ├── PUT /user/settings         ← h5_settings
    └── POST /user/history/sync    ← h5_history (可选)
    ↓
拉取服务端最新数据覆盖本地缓存
    ↓
后续所有操作走 API（本地缓存同步更新）
```

---

## 4. 冲突解决策略

当本地数据和服务端数据不一致时：

| 场景 | 策略 |
|------|------|
| 首次登录，本地有数据 | 本地数据同步到服务端（Merge） |
| 已登录，多设备使用 | 服务端数据优先，覆盖本地 |
| 离线使用后恢复 | 本地变更队列，恢复后批量同步 |
| 收藏冲突 | 合并（取并集） |
| 提醒冲突 | 服务端优先 |
| 设置冲突 | 最后修改时间戳优先 |

---

## 5. 各模块迁移详情

### 5.1 用户认证 (P0)

**当前:** 
- H5: `login.js` 模拟登录，存 `h5_user`/`h5_token`
- PC: `lottery-menu.js` 自动创建 demo 用户

**迁移:**
1. 替换登录逻辑为 `POST /auth/send-code` + `POST /auth/login`
2. Token 存储在 `localStorage` + Cookie (HttpOnly for API)
3. 每次页面加载验证 Token 有效性
4. 移除 PC 端自动创建 demo 用户的逻辑

### 5.2 收藏 (P1)

**当前:** `h5_favorites` / `pc_favorites` 存储 `[{lotteryId, name, addedAt}]`

**迁移:**
1. 创建 `FavoritesService`
2. 登录时同步本地收藏到服务端
3. 后续操作调用 API + 更新本地缓存
4. 未登录用户继续使用 localStorage

### 5.3 智能提醒 (P1)

**当前:** `h5_smart_reminders` 存储复杂结构

**迁移:**
1. 结构映射到 API（draw/dragon/goodroad 三组）
2. 登录时上传完整配置
3. 后续增删改调用 API
4. WebSocket 推送替代前端轮询

### 5.4 用户设置 (P2)

**当前:** `h5_settings` 存储 `{pushEnabled, soundEnabled, fontSize, ...}`

**迁移:** Key-Value 结构直接映射 API

### 5.5 反馈 (P2)

**当前:** `h5_feedback_history` + 图片仅压缩存base64

**迁移:**
1. 图片先上传 `POST /upload/image`，获取 URL
2. 反馈提交 `POST /user/feedback`（含图片URL）
3. 历史从 API 获取，不再存本地

### 5.6 浏览记录 (P3)

**建议:** 以本地为主，定期批量上传
- 写入频率高（每次浏览），实时 API 不合适
- 方案：本地积累 → 每 5 分钟或退出时批量 POST

---

## 6. 实施步骤

```
Week 1: 后端 API 搭建
├── 数据库建表（users/favorites/reminders/settings/feedback/...）
├── 认证模块（SMS + JWT）
├── 用户模块 CRUD
└── 文件上传服务

Week 2: 前端 Service 层
├── 创建 services/ 目录
├── 实现各模块 Service 类
├── 统一 API 请求封装（interceptor, error handling）
└── 登录同步逻辑

Week 3: 模块迁移 — P0/P1
├── 替换登录逻辑
├── 收藏模块切换
├── 提醒模块切换
└── 测试多设备同步

Week 4: 模块迁移 — P2/P3 + WebSocket
├── 设置模块切换
├── 反馈+文件上传切换
├── 浏览记录批量同步
├── WebSocket 实时推送
└── 全面测试 + 上线
```

---

## 7. 回退方案

若 API 不可用，前端自动降级到 localStorage 模式：

```javascript
async function safeFetch(apiCall, localFallback) {
    try {
        return await apiCall();
    } catch (error) {
        console.warn('API unavailable, falling back to localStorage');
        return localFallback();
    }
}
```
