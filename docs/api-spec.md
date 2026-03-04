# 开奖网 API 接口规范

> 基于三端（H5/PC/Admin）完整功能审查，定义后端 API 接口清单
>
> Base URL: `https://api.kaijiang.com/v1`
>
> 认证方式: Bearer Token（登录后获取）
>
> 通用响应格式:
> ```json
> { "code": 0, "message": "success", "data": { ... } }
> ```

---

## 1. 认证模块 (Auth)

### POST /auth/send-code
发送短信验证码

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | Y | 手机号（+86格式） |

**响应:** `{ code: 0, message: "验证码已发送", data: { expireIn: 300 } }`

### POST /auth/login
手机号验证码登录（首次登录自动注册）

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | Y | 手机号 |
| code | string | Y | 短信验证码 |

**响应:**
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": 1001,
      "phone": "138****8001",
      "nickname": "张伟",
      "avatar": null,
      "createdAt": "2025-08-12T09:30:22Z"
    }
  }
}
```

### POST /auth/logout
退出登录（需认证）

### POST /auth/admin/login
管理员登录（用户名+密码+可选2FA）

---

## 2. 用户模块 (User)

### GET /user/profile
获取当前用户资料（需认证）

### PUT /user/profile
更新用户资料

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | N | 昵称 |

### GET /user/settings
获取用户设置

**响应:**
```json
{
  "pushEnabled": true,
  "soundEnabled": true,
  "fontSize": "normal",
  "defaultLottery": null,
  "autoRefresh": true
}
```

### PUT /user/settings
更新用户设置

### DELETE /user/account
注销账号（清除所有数据）

---

## 3. 收藏模块 (Favorites)

### GET /user/favorites
获取收藏列表

**响应:**
```json
{
  "data": [
    { "id": 1, "lotteryId": "k3", "lotteryName": "快三", "addedAt": "2026-02-01T10:00:00Z" }
  ]
}
```

### POST /user/favorites
添加收藏

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| lotteryId | string | Y | 彩种ID |

### DELETE /user/favorites/:lotteryId
取消收藏

### PUT /user/favorites/sort
更新收藏排序

---

## 4. 浏览记录 (History)

### GET /user/history
获取浏览记录

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | N | 页码（默认1） |
| limit | number | N | 每页数（默认20） |

### POST /user/history
记录浏览（由前端调用）

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | Y | lottery/trend/roadmap/news... |
| name | string | Y | 名称 |
| page | string | Y | 页面路径 |

### DELETE /user/history
清空浏览记录

---

## 5. 智能提醒 (Reminders)

### GET /user/reminders
获取提醒配置

**响应:**
```json
{
  "draw": {
    "enabled": true,
    "remindMinutes": 5,
    "methods": ["push", "sound"],
    "items": [{ "id": "k3", "enabled": true }]
  },
  "dragon": {
    "enabled": true,
    "threshold": 4,
    "monitorTypes": ["bigsmall", "oddeven"],
    "items": []
  },
  "goodroad": {
    "enabled": true,
    "patterns": ["dragon", "max3"],
    "items": []
  }
}
```

### PUT /user/reminders
更新提醒配置（全量替换）

### POST /user/reminders/:type/items
添加提醒项（type = draw/dragon/goodroad）

### DELETE /user/reminders/:type/items/:itemId
删除提醒项

---

## 6. 反馈模块 (Feedback)

### POST /user/feedback
提交反馈

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | Y | bug/feature/content/other |
| content | string | Y | 内容 |
| images | File[] | N | 图片附件（multipart） |

### GET /user/feedback
获取我的反馈历史

---

## 7. 彩票模块 (Lottery)

### GET /lottery/list
获取彩票列表

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | N | 分类 |
| region | string | N | 地区 |
| company | string | N | 公司 |

**响应:**
```json
{
  "data": [
    {
      "id": "k3",
      "name": "快三",
      "category": "快三系列",
      "icon": "🎲",
      "interval": 60,
      "status": "active",
      "latestResult": {
        "period": "20260227031277",
        "numbers": [3, 5, 2],
        "sum": 10,
        "bigSmall": "small",
        "oddEven": "even",
        "drawTime": "2026-02-27T21:00:00Z"
      },
      "nextDrawTime": "2026-02-27T21:01:00Z",
      "countdown": 45
    }
  ]
}
```

### GET /lottery/:id
获取单个彩票详情

### GET /lottery/:id/results
获取开奖结果

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | N | 页码 |
| limit | number | N | 每页数（默认30） |
| date | string | N | 日期（YYYY-MM-DD） |

### GET /lottery/:id/trend
获取走势数据

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | Y | history/analysis/position/numbeads/... |
| periods | number | N | 期数（默认60） |

### GET /lottery/:id/roadmap
获取路子图数据

### GET /lottery/:id/dragon
获取长龙数据

### GET /lottery/:id/goodroad
获取好路推荐数据

### GET /lottery/:id/killplan
获取杀号计划数据

### GET /lottery/categories
获取彩票分类列表

### GET /lottery/calendar
获取开奖日历排期

---

## 8. 新闻模块 (News)

### GET /news/list
获取新闻列表

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | N | 分类 |
| page | number | N | 页码 |
| limit | number | N | 每页数 |
| keyword | string | N | 搜索关键词 |

### GET /news/:id
获取新闻详情

---

## 9. 文章模块 (Articles)

### GET /articles/list
获取文章列表

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | N | 规则/心得 |
| page | number | N | 页码 |
| limit | number | N | 每页数 |

### GET /articles/:id
获取文章详情

---

## 10. 通知模块 (Notifications)

### GET /notifications
获取通知列表

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | N | system/draw/dragon/goodroad/result |
| read | boolean | N | 已读/未读筛选 |

### PUT /notifications/read
标记全部已读

### PUT /notifications/:id/read
标记单条已读

---

## 11. 内容模块 (Content)

### GET /content/:code
获取内容页面（about/privacy/terms/help）

### GET /content/faq
获取 FAQ 列表

---

## 12. 文件上传 (Upload)

### POST /upload/image
上传图片

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | Y | 图片文件（multipart） |
| type | string | N | avatar/feedback/article |

**响应:**
```json
{ "data": { "url": "https://cdn.kaijiang.com/uploads/xxx.jpg", "size": 102400 } }
```

---

## 13. Admin 管理端 API

> 所有管理端 API 需要管理员 Token + 角色权限校验
> Prefix: `/admin`

### 用户管理
- `GET /admin/users` — 用户列表（分页/筛选）
- `GET /admin/users/:id` — 用户详情
- `PUT /admin/users/:id` — 编辑用户
- `PUT /admin/users/:id/status` — 冻结/解冻
- `GET /admin/users/:id/feedback` — 用户反馈列表
- `DELETE /admin/feedback/:id` — 删除反馈

### 彩票管理
- `GET/POST/PUT/DELETE /admin/lottery` — 彩票 CRUD
- `GET/POST/PUT/DELETE /admin/lottery/categories` — 分类 CRUD
- `GET/PUT /admin/lottery/trends` — 走势项管理
- `GET/POST/PUT/DELETE /admin/lottery/sources` — 数据源 CRUD
- `GET/POST/PUT/DELETE /admin/lottery/calendar` — 排期 CRUD
- `GET/POST/PUT/DELETE /admin/lottery/experts` — 专家 CRUD

### 基础数据
- `GET/POST/PUT/DELETE /admin/base-data/regions` — 地区 CRUD
- `GET/POST/PUT/DELETE /admin/base-data/companies` — 公司 CRUD
- `GET/POST/PUT/DELETE /admin/base-data/currency` — 货币 CRUD

### 运营管理
- `GET/POST/PUT/DELETE /admin/articles` — 文章 CRUD
- `PUT /admin/articles/:id/publish` — 发布/撤回
- `GET/POST/PUT/DELETE /admin/notifications` — 通知 CRUD
- `PUT /admin/notifications/:id/publish` — 发布/撤回
- `GET/POST/PUT/DELETE /admin/news-sources` — 新闻源 CRUD
- `GET/POST/PUT/DELETE /admin/links` — 推广链接 CRUD
- `GET/POST/PUT/DELETE /admin/faq` — FAQ CRUD
- `GET/PUT /admin/content/:code` — 内容页面管理

### 系统设置
- `GET/PUT /admin/config` — 系统配置
- `GET/POST/PUT/DELETE /admin/admins` — 管理员 CRUD
- `PUT /admin/admins/:id/2fa` — 2FA 切换
- `GET/POST/PUT/DELETE /admin/roles` — 角色 CRUD

### 日志
- `GET /admin/logs/operation` — 操作日志
- `GET /admin/logs/audit` — 审计日志
- `GET /admin/logs/crawler` — 爬虫日志

### 统计
- `GET /admin/statistics/overview` — 统计总览
- `GET /admin/statistics/lottery` — 各彩票统计

---

## WebSocket 实时推送

### 连接
`wss://api.kaijiang.com/ws?token=xxx`

### 消息类型
```json
{ "type": "draw_result", "data": { "lotteryId": "k3", "period": "...", "numbers": [...] } }
{ "type": "dragon_alert", "data": { "lotteryId": "k3", "streak": 6, "type": "big" } }
{ "type": "goodroad_alert", "data": { "lotteryId": "k3", "pattern": "dragon", "duration": 8 } }
{ "type": "notification", "data": { "id": 1, "title": "...", "type": "system" } }
```
