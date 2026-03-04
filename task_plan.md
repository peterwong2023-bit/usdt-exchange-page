# Task Plan: 开奖网全平台功能对齐 & 缺失功能补全

## Goal
完成 H5、PC、Admin 三端的功能审查与对齐，补全 Admin 未注册路由页面，建立完整功能脑图，为后续 API 对接和真实数据替换做准备。

## Current Phase
COMPLETED (all 6 phases done)

## Phases

### Phase 1: 审查与文档化
- [x] 完整审读三端所有源文件（H5: 57 files, PC: 29 files, Admin: 51 files）
- [x] 列出每个页面/模块的功能清单
- [x] 三端功能对比矩阵
- [x] 识别 Admin 未注册路由的页面
- [x] 识别 Admin 真正缺失的后台功能
- [x] 创建功能性脑图文件
- [x] 创建 planning files (task_plan.md, findings.md, progress.md)
- **Status:** complete

### Phase 2: Admin 路由补全
- [x] 注册 `base-data/regions` 路由 + 侧边栏入口
- [x] 注册 `base-data/companies` 路由 + 侧边栏入口
- [x] 注册 `base-data/currency` 路由 + 侧边栏入口
- [x] 注册 `operations/links` 路由 + 侧边栏入口
- [x] 注册 `statistics` 路由 + 侧边栏入口
- [x] 评估 `logs/index.tsx` → 决定暂不注册，避免与3个子页面重复
- [x] 验证：TypeScript 编译通过，Vite 构建成功
- **Status:** complete

### Phase 3: H5/PC 功能对齐
- [x] PC 补充 "关于我们" 页面 (about.html + legal.css)
- [x] PC 补充 "隐私政策" 页面 (privacy.html)
- [x] PC 补充 "服务条款" 页面 (terms.html)
- [x] PC 补充 "开奖日历" 页面 (calendar.html + calendar.js + calendar.css)
- [x] H5 走势分析 — 已有"玩法说明" Tab (data-type="rules")，无需修改
- [x] PC 登录保持集成在顶部栏（符合 PC 交互范式）
- **Status:** complete

### Phase 4: Admin 缺失功能页面
- [x] FAQ / 帮助中心内容管理页面 (operations/help)
- [x] 开奖日历 / 排期管理页面 (lottery/calendar)
- [x] 杀号专家管理页面 (lottery/experts)
- [x] 法律条款内容管理 (operations/legal) — Drawer + ReactQuill
- [x] 全部路由已注册，侧边栏已添加，TypeScript + Build 通过
- **Status:** complete

### Phase 5: 数据层准备（API 对接前置）
- [x] 定义前端需要的 API 接口列表 → docs/api-spec.md
- [x] 标注每个接口的请求/响应格式（含 WebSocket 推送）
- [x] 规划 localStorage → API 的迁移路径 → docs/migration-plan.md
- [x] 文件上传服务方案（POST /upload/image）
- **Status:** complete

### Phase 6: 验证与交付
- [x] 全部路由可访问验证 — TypeScript + Vite Build 零错误
- [x] 三端功能对照表最终确认 — 脑图已更新
- [x] 更新脑图文件 — 所有 🆕 标记已添加
- [x] 交付给用户
- **Status:** complete

## Key Questions
1. 后端 API 使用什么技术栈？（Node.js/Python/Go？）
2. 用户账号体系要做到什么程度？（纯手机号登录 vs 第三方登录？）
3. 推送服务用什么方案？（WebSocket / SSE / 轮询？）
4. 数据库选型？（MySQL / PostgreSQL / MongoDB？）
5. `logs/index.tsx` 综合日志页面是否保留？（与 logs/operation, logs/audit, logs/crawler 可能重复）
6. `dice-demo.html` 3D 骰子是否需要移植到 H5？（移动端性能考量）

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 将开奖源和新闻源合并到系统配置 Tab | 减少侧边栏层级，系统配置页面聚合相关设置 |
| H5 用独立页面、PC 用 Tab 集成 | 两端交互范式不同：H5 屏幕小需独立页面，PC 空间大用 Tab 更高效 |
| localStorage 模拟用户数据 | 当前无后端，前端先跑通全流程，后续替换为 API |
| Admin 使用 Mock 数据 | 快速搭建前端界面，后续对接真实 API |
| base-data 三个页面需补路由 | 已有完整组件代码，仅缺路由注册和侧边栏 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (暂无) | - | - |

## Notes
- 三端所有文件已完整审读，功能清单见 findings.md
- 脑图文件见 docs/mindmap.md
- Admin 有 6 个已写好但未注册路由的页面
- 前端用户数据全部存在 localStorage，是最大的技术债务
