# Findings & Decisions — 开奖网全平台审查

## Requirements
- H5 和 PC 前端功能对齐
- Admin 后台功能完整覆盖前端所有可管理项
- 识别缺失功能并制定补全计划
- 输出完整功能性脑图

## Research Findings

### 项目结构
| 项目 | 技术栈 | 文件数 | 定位 |
|------|--------|--------|------|
| lottery-h5 | 纯 HTML/CSS/JS | 57 | 移动端前端 |
| lottery-redesign | 纯 HTML/CSS/JS | 29 | PC端前端 |
| lottery-admin | React + Ant Design + Vite + TypeScript | 51 | 管理后台 |

### H5 全部页面清单 (22 个 HTML 页面)
| 页面 | 文件 | 功能 |
|------|------|------|
| 首页 | index.html + app.js | 彩种分类Tab、收藏、倒计时、开奖号码、搜索、滚动公告 |
| 走势分析 | trend.html + trend.js | 10种走势类型、彩种切换、收藏、骰子点阵、倒计时环 |
| 路子图 | roadmap.html + roadmap.js | 珠盘路/大路/大眼仔/小路/曱甴路、统计、看图指南 |
| 长龙排行 | dragon.html + dragon.js | 16种彩种、期数筛选、热标(≥5期)、倒计时 |
| 好路推荐 | goodroad.html + goodroad.js | 4组彩种、8种路型、瀑布图(6×20)、帮助弹窗 |
| 杀号计划 | killplan.html + killplan.js | 6种彩种、5位专家、金银铜排名、15期历史 |
| 彩民新闻 | news.html + news.js | 5分类、头条大图、热门排行、3种列表布局、搜索 |
| 帮助中心 | help.html + help.js | FAQ手风琴、搜索(防抖)、分类跳转、联系客服 |
| 登录 | login.html + login.js | 手机号+短信验证码、模拟登录 |
| 个人中心 | me.html + me.js | 联系方式、缓存管理、分享(QR码) |
| 收藏夹 | favorites.html + favorites.js | 收藏彩种列表、编辑、倒计时 |
| 浏览记录 | history.html + history.js | 按日期分组、筛选、清空 |
| 智能提醒 | reminder.html + reminder.js | 开奖/长龙/好路提醒、高低频彩种、提醒历史 |
| 消息中心 | message.html + message.js | 开奖/长龙/好路/结果通知、已读/未读 |
| 意见反馈 | feedback.html + feedback.js | 类型选择、图片上传(压缩)、历史 |
| 设置 | settings.html + settings.js | 昵称、推送/声音、字体、默认彩种、注销 |
| 关于我们 | about.html | 品牌信息、核心功能、联系方式 |
| 隐私政策 | privacy.html | 隐私政策静态页 |
| 服务条款 | terms.html | 服务条款静态页 |
| 开奖日历 | calendar.html + calendar.js | 低频彩开奖时间表、提醒切换 |
| 全局通知 | notification.js | 智能通知组件(开奖/长龙/好路/结果) |

### PC 全部页面清单 (10 个 HTML 页面)
| 页面 | 文件 | 功能 |
|------|------|------|
| 首页 | index.html + app.js | 英雄Banner、快捷入口、分类Tab、收藏、3D鼠标跟随 |
| 走势分析 | trend.html + trend.js | 侧栏导航、11项功能Tab(含玩法规则)、收藏 |
| 路子图 | roadmap.html + roadmap.js | 侧栏导航、珠盘路/大路/下三路、收藏 |
| 长龙排行 | dragon.html + dragon.js | 彩种分组、趋势点图、热标、30秒自动刷新 |
| 好路推荐 | goodroad.html + goodroad.js | 彩种分组、形态筛选、瀑布趋势图 |
| 杀号计划 | killplan.html + killplan.js | 多彩种切换、专家卡片、杀号结果表 |
| 彩民新闻 | news.html + news.js | 分类Tab、头条、热门侧栏、快讯滚动 |
| 帮助中心 | help.html | PC版帮助中心 |
| 个人中心 | user.html + user.js | 6Tab(资料/收藏/记录/提醒/反馈/设置) |
| 3D骰子 | dice-demo.html | Three.js 3D骰子开奖动画 Demo |
| 全局功能 | lottery-menu.js | 全部彩种菜单、顶部登录、通知铃铛 |

### Admin 全部页面清单 (21 个页面组件)
| 页面 | 路径 | 路由状态 | 功能 |
|------|------|----------|------|
| 数据概览 | dashboard | ✅ 已注册 | 统计卡片、数据源监控、趋势图 |
| 彩票列表 | lottery/list | ✅ 已注册 | 彩票CRUD、分类、状态 |
| 开奖结果 | lottery/results | ✅ 已注册 | 开奖查询、球号可视化 |
| 分类管理 | lottery/categories | ✅ 已注册 | 分类CRUD |
| 走势管理 | lottery/trends | ✅ 已注册 | 走势项CRUD、排序、启用/禁用 |
| 开奖源管理 | lottery/sources | ✅ 系统配置Tab | 数据源CRUD、状态开关 |
| 用户列表 | users/list | ✅ 已注册 | 用户管理、冻结/解冻 |
| 用户反馈 | users/feedback | ✅ 已注册 | 反馈查看、附件预览 |
| 文章管理 | operations/articles | ✅ 已注册 | 文章CRUD、富文本、置顶 |
| 通知管理 | operations/notifications | ✅ 已注册 | 通知CRUD、发布/草稿 |
| 新闻源管理 | operations/news | ✅ 系统配置Tab | 新闻源CRUD |
| 操作日志 | logs/operation (system/operation-log) | ✅ 已注册 | 操作日志查询 |
| 审计日志 | logs/audit (system/audit-log) | ✅ 已注册 | 审计日志、变更对比 |
| 爬虫日志 | logs/crawler (system/crawler) | ✅ 已注册 | 爬虫日志查询 |
| 系统配置 | system/config | ✅ 已注册 | 3Tab(基本/开奖源/新闻源) |
| 管理员账号 | system/admins | ✅ 已注册 | 管理员CRUD、2FA |
| 角色权限 | system/roles | ✅ 已注册 | 角色CRUD、权限树 |
| 彩票地区 | base-data/regions | ❌ 未注册 | 地区CRUD、时区 |
| 彩票公司 | base-data/companies | ❌ 未注册 | 公司CRUD |
| 货币管理 | base-data/currency | ❌ 未注册 | 货币CRUD、汇率 |
| 推广链接 | operations/links | ❌ 未注册 | 链接管理 |
| 数据统计 | statistics | ❌ 未注册 | 运营统计 |
| 综合日志 | logs (pages/logs/index.tsx) | ❌ 未注册 | 综合日志(可能重复) |

### 三端对齐矩阵
| 功能模块 | H5 | PC | Admin |
|----------|:---:|:---:|:-----:|
| 首页/开奖列表 | ✅ | ✅ | ✅ Dashboard |
| 走势分析 | ✅ | ✅(+玩法规则) | ✅ 走势管理 |
| 路子图 | ✅ | ✅ | ❌ |
| 长龙排行 | ✅ | ✅ | ❌ |
| 好路推荐 | ✅ | ✅ | ❌ |
| 杀号计划 | ✅ | ✅ | ❌ 专家管理 |
| 新闻 | ✅ | ✅ | ✅ 新闻源+文章 |
| 帮助中心 | ✅ | ✅ | ❌ FAQ管理 |
| 登录/注册 | ✅ 独立页 | ✅ 顶部栏 | ❌ 无真实API |
| 个人中心 | ✅ 独立页 | ✅ user.html | ✅ 用户列表 |
| 收藏 | ✅ 独立页 | ✅ Tab | ❌ 无同步 |
| 浏览记录 | ✅ 独立页 | ✅ Tab | ❌ 无同步 |
| 智能提醒 | ✅ 独立页 | ✅ Tab | ❌ 无服务 |
| 消息中心 | ✅ 独立页 | ✅ 铃铛弹窗 | ✅ 通知管理 |
| 意见反馈 | ✅ 独立页 | ✅ Tab | ✅ 反馈查看 |
| 设置 | ✅ 独立页 | ✅ Tab | ❌ |
| 关于我们 | ✅ | ❌ | ❌ |
| 隐私政策 | ✅ | ❌ | ❌ |
| 服务条款 | ✅ | ❌ | ❌ |
| 开奖日历 | ✅ | ❌ | ❌ |
| 3D骰子 | ❌ | ✅ demo | ❌ |
| 全局通知 | ✅ 组件 | ✅ 铃铛 | ❌ 无推送 |

### localStorage 依赖清单
| Key 前缀 | H5 | PC | 用途 |
|----------|:---:|:---:|------|
| h5_user / pc_user | ✅ | ✅ | 用户信息 |
| h5_token / pc_token | ✅ | ✅ | 登录 Token |
| h5_favorites / pc_favorites | ✅ | ✅ | 收藏彩种 |
| h5_history / pc_history | ✅ | ✅ | 浏览记录 |
| h5_smart_reminders | ✅ | ✅ | 智能提醒配置 |
| h5_feedback_history | ✅ | ❌ | 反馈历史 |
| h5_settings | ✅ | ❌ | 用户设置 |
| h5_cache_* | ✅ | ❌ | 各类缓存 |

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 三端分离部署 | H5/PC 纯静态、Admin React SPA，独立域名 |
| Mock 数据先行 | 前端先跑通，后续替换 API 时改动最小 |
| localStorage 作过渡 | 无后端时的最简方案，后续逐步替换为 API |
| Ant Design ProTable 封装 | Admin 表格统一交互规范 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Admin 6个页面无路由 | Phase 2 补注册 |
| PC 缺少法律/关于页面 | Phase 3 补充 |
| 用户数据无服务端持久化 | Phase 5 规划 API |

## Resources
- Admin 代码: `/Users/wongpeter/Desktop/usdt-exchange-page/lottery-admin/`
- H5 代码: `/Users/wongpeter/Desktop/usdt-exchange-page/lottery-h5/`
- PC 代码: `/Users/wongpeter/Desktop/usdt-exchange-page/lottery-redesign/`
- Admin Vercel: 已部署（之前的对话中完成）
- 脑图: `docs/mindmap.md`

---
*Update this file after every 2 view/browser/search operations*
