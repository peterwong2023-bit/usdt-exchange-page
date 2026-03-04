# 开奖网全平台功能对齐 — 实施计划

> **Goal:** 完成三端功能审查、补全 Admin 路由、对齐 H5/PC 功能缺失，为 API 对接做准备
>
> **Architecture:** H5(纯静态) + PC(纯静态) + Admin(React SPA) 三端独立部署，共享后端 API（待建）
>
> **Tech Stack:** React 18 + TypeScript + Ant Design + Vite (Admin) / HTML+CSS+JS (H5 & PC)

---

## Task 1: Admin 路由注册 — 基础数据模块

**优先级:** 高 | **预计耗时:** 15 分钟

**Files:**
- Modify: `lottery-admin/src/router/index.tsx`
- Modify: `lottery-admin/src/components/Layout/Sidebar.tsx`
- Modify: `lottery-admin/src/components/Layout/HeaderBar.tsx`

**步骤:**

**Step 1:** 在 `router/index.tsx` 添加 lazy load 和路由

```typescript
// 添加 lazy load
const RegionsManagement = () => lazyLoad(() => import('@/pages/base-data/regions'))
const CompaniesManagement = () => lazyLoad(() => import('@/pages/base-data/companies'))
const CurrencyManagement = () => lazyLoad(() => import('@/pages/base-data/currency'))

// 在 children 数组中添加路由
{ path: 'base-data/regions', element: <RegionsManagement /> },
{ path: 'base-data/companies', element: <CompaniesManagement /> },
{ path: 'base-data/currency', element: <CurrencyManagement /> },
```

**Step 2:** 在 `Sidebar.tsx` 添加菜单项

```typescript
{
  key: '/base-data',
  icon: <DatabaseOutlined />,
  label: '基础数据',
  children: [
    { key: '/base-data/regions', icon: <GlobalOutlined />, label: '地区管理' },
    { key: '/base-data/companies', icon: <BankOutlined />, label: '公司管理' },
    { key: '/base-data/currency', icon: <DollarOutlined />, label: '货币管理' },
  ],
},
```

**Step 3:** 在 `HeaderBar.tsx` 的 `routeNameMap` 添加:

```typescript
'base-data': '基础数据',
'regions': '地区管理',
'companies': '公司管理',
'currency': '货币管理',
```

**验证:** 访问 `/base-data/regions`、`/base-data/companies`、`/base-data/currency` 均可正常渲染

---

## Task 2: Admin 路由注册 — 推广链接 & 数据统计

**优先级:** 高 | **预计耗时:** 10 分钟

**Files:**
- Modify: `lottery-admin/src/router/index.tsx`
- Modify: `lottery-admin/src/components/Layout/Sidebar.tsx`
- Modify: `lottery-admin/src/components/Layout/HeaderBar.tsx`

**步骤:**

**Step 1:** 在 `router/index.tsx` 添加

```typescript
const LinksManagement = () => lazyLoad(() => import('@/pages/operations/links'))
const Statistics = () => lazyLoad(() => import('@/pages/statistics'))

// 路由
{ path: 'operations/links', element: <LinksManagement /> },
{ path: 'statistics', element: <Statistics /> },
```

**Step 2:** 在 `Sidebar.tsx` 运营管理 children 中添加:

```typescript
{ key: '/operations/links', icon: <LinkOutlined />, label: '推广链接' },
```

添加统计菜单（在系统设置之前）:

```typescript
{
  key: '/statistics',
  icon: <PieChartOutlined />,
  label: '数据统计',
},
```

**Step 3:** 更新 `HeaderBar.tsx` routeNameMap

**验证:** 访问 `/operations/links` 和 `/statistics` 正常

---

## Task 3: 评估综合日志页面

**优先级:** 中 | **预计耗时:** 5 分钟

**分析:**
- `pages/logs/index.tsx` 是一个综合日志页面，功能上与 `logs/operation` + `logs/audit` + `logs/crawler` 三个子页面有重叠
- **建议:** 不注册路由，保留代码但不暴露入口。如需"一站式日志查看"可后续考虑

**决策:** 暂不注册，避免用户混淆

---

## Task 4: PC 补充 "关于我们" 页面

**优先级:** 中 | **预计耗时:** 30 分钟

**Files:**
- Create: `lottery-redesign/about.html`
- Reference: `lottery-h5/about.html`（内容一致，布局适配 PC）

**步骤:**
1. 复制 H5 的 about.html 内容
2. 替换头部为 PC 通用导航（参考 help.html 的头部结构）
3. 调整布局为 PC 宽屏
4. 页脚使用 PC 通用页脚

---

## Task 5: PC 补充 "隐私政策" & "服务条款" 页面

**优先级:** 中 | **预计耗时:** 30 分钟

**Files:**
- Create: `lottery-redesign/privacy.html`
- Create: `lottery-redesign/terms.html`
- Reference: `lottery-h5/privacy.html`, `lottery-h5/terms.html`

**步骤:** 同 Task 4，复制内容 + 适配 PC 布局

---

## Task 6: PC 补充 "开奖日历" 页面

**优先级:** 低 | **预计耗时:** 60 分钟

**Files:**
- Create: `lottery-redesign/calendar.html`
- Create: `lottery-redesign/calendar.js`
- Create: `lottery-redesign/calendar.css`
- Reference: `lottery-h5/calendar.html`, `lottery-h5/calendar.js`

**步骤:**
1. 参考 H5 版本的功能实现
2. 使用 PC 侧栏+主内容区布局
3. 日历组件适配宽屏（可展示整月）
4. 提醒切换联动 localStorage

---

## Task 7: H5 走势分析增加 "玩法规则" Tab

**优先级:** 低 | **预计耗时:** 20 分钟

**Files:**
- Modify: `lottery-h5/trend.js`
- Modify: `lottery-h5/trend.html`

**步骤:**
1. 在 trend.js 的走势类型数组中添加 `{ id: 'rules', name: '玩法规则' }` 
2. 在 renderContent 函数中添加对应的渲染逻辑
3. 参考 PC trend.js 中的玩法规则 Tab 内容

---

## Task 8: Admin 新增 — FAQ 内容管理页面

**优先级:** 中 | **预计耗时:** 45 分钟

**Files:**
- Create: `lottery-admin/src/pages/operations/help/index.tsx`
- Modify: `lottery-admin/src/router/index.tsx`
- Modify: `lottery-admin/src/components/Layout/Sidebar.tsx`

**设计:**
- ProTable 列表：分类 / 问题 / 排序 / 状态
- Modal 表单：分类选择、问题、答案（ReactQuill）、关键词、排序
- 启用/禁用开关
- 分类管理

---

## Task 9: Admin 新增 — 开奖日历排期管理

**优先级:** 低 | **预计耗时:** 45 分钟

**Files:**
- Create: `lottery-admin/src/pages/lottery/calendar/index.tsx`
- Modify: `lottery-admin/src/router/index.tsx`
- Modify: `lottery-admin/src/components/Layout/Sidebar.tsx`

**设计:**
- 彩种选择 + 日历视图
- 每日开奖时间配置
- 特殊日期标记（暂停/加开）

---

## Task 10: Admin 新增 — 杀号专家管理

**优先级:** 低 | **预计耗时:** 45 分钟

**Files:**
- Create: `lottery-admin/src/pages/lottery/experts/index.tsx`
- Modify: `lottery-admin/src/router/index.tsx`
- Modify: `lottery-admin/src/components/Layout/Sidebar.tsx`

**设计:**
- ProTable 专家列表：头像 / 昵称 / 称号 / 擅长彩种 / 准确率 / 状态
- Modal 表单：基本信息、擅长领域
- 启用/禁用

---

## Task 11: API 接口清单定义

**优先级:** 高（规划层面）| **预计耗时:** 60 分钟

**Files:**
- Create: `docs/api-spec.md`

**需定义的 API 模块:**

| 模块 | Endpoints | 说明 |
|------|-----------|------|
| Auth | POST /auth/send-code, POST /auth/login, POST /auth/logout | 手机号+验证码登录 |
| User | GET/PUT /user/profile, GET/PUT /user/settings | 个人信息+设置 |
| Favorites | GET/POST/DELETE /user/favorites | 收藏同步 |
| History | GET/POST/DELETE /user/history | 浏览记录同步 |
| Reminders | GET/POST/PUT/DELETE /user/reminders | 智能提醒配置 |
| Feedback | POST /user/feedback, GET /admin/feedback | 反馈提交+管理 |
| Lottery | GET /lottery/list, GET /lottery/{id}/results | 彩票+开奖 |
| News | GET /news/list, GET /news/{id} | 新闻列表+详情 |
| Articles | GET /articles/list, GET /articles/{id} | 文章列表+详情 |
| Notifications | GET /notifications, PUT /notifications/read | 通知 |
| Upload | POST /upload/image | 文件上传 |
| Admin | (所有管理端 CRUD) | 后台管理 API |

---

## Task 12: localStorage → API 迁移方案

**优先级:** 中（规划层面）| **预计耗时:** 30 分钟

**Files:**
- Create: `docs/migration-plan.md`

**迁移路径:**
1. 新增 API 层 service 文件
2. 登录后同步 localStorage → 服务端
3. 优先迁移：用户信息 → 收藏 → 提醒
4. 保留 localStorage 作为离线缓存
5. 冲突解决策略：服务端优先

---

## 执行顺序建议

```
高优先级（立即可做）
├── Task 1: Admin 基础数据路由注册     ← 15min
├── Task 2: Admin 推广链接+统计路由    ← 10min
└── Task 3: 综合日志评估             ← 5min

中优先级（功能补全）
├── Task 4: PC 关于我们              ← 30min
├── Task 5: PC 隐私+条款             ← 30min
├── Task 8: Admin FAQ管理            ← 45min
└── Task 11: API 接口清单             ← 60min

低优先级（增强功能）
├── Task 6: PC 开奖日历              ← 60min
├── Task 7: H5 玩法规则Tab           ← 20min
├── Task 9: Admin 日历排期            ← 45min
├── Task 10: Admin 专家管理           ← 45min
└── Task 12: 迁移方案文档             ← 30min
```

**总预计工时: ~7 小时**
