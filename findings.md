# Findings & Decisions — 倔驴科技 GPT 头像重做

## Requirements
- 头像生成改用 GPT 风格
- 保持当前仪表盘头像文件命名不变
- 最终覆盖 12 位成员的圆形头像

## Research Findings

### 头像引用位置
- `dashboard.html` 的 `AGENTS` 数组中，12 位成员都通过 `/avatars/avatar-*-donkey.png` 引用头像。
- 团队总头像单独使用 `/avatars/avatar-team-donkey.png`。

### 当前 12 个成员头像文件名
- `avatar-pm-alpha-donkey.png`
- `avatar-pm-beta-donkey.png`
- `avatar-competitor-donkey.png`
- `avatar-dev-lead-donkey.png`
- `avatar-designer-donkey.png`
- `avatar-doc-writer-donkey.png`
- `avatar-tester-donkey.png`
- `avatar-frontend-donkey.png`
- `avatar-backend-donkey.png`
- `avatar-ops-devops-donkey.png`
- `avatar-ops-security-donkey.png`
- `avatar-ops-manager-donkey.png`

### 静态头像目录
- 后端通过 `server.js` 中的 `AVATARS_DIR` 暴露头像：
  `/Users/wongpeter/.cursor/projects/Users-wongpeter-Desktop-usdt-exchange-page/assets`

### 现有视觉规律
- 都是“驴角色 + 岗位道具/身份特征”的构图。
- 适合统一为：
  圆形徽章、深色背景、卡通驴脸、岗位专属道具、中文名字、岗位主色。

### 12 位成员岗位映射
| Agent | 名称 | 岗位 | 主色 |
|------|------|------|------|
| pm-alpha | 驴来疯 | 创新产品经理 | 蓝 |
| pm-beta | 驴得稳 | 务实产品经理 | 绿 |
| competitor | 驴透社 | 竞品分析师 | 黄 |
| designer | 驴毕加索 | 原型设计师 | 红 |
| doc-writer | 驴不停蹄 | 策划文档 | 紫 |
| dev-lead | 驴本事 | 技术负责人 | 青蓝 |
| frontend | 驴码师 | 前端工程师 | 青绿 |
| backend | 驴架子 | 后端工程师 | 紫蓝 |
| tester | 驴找茬 | 测试工程师 | 橙 |
| ops-devops | 驴铁柱 | DevOps 工程师 | 玫红 |
| ops-security | 驴门神 | 安全审计师 | 青 |
| ops-manager | 驴管家 | 平台运维 | 紫红 |

## Decisions
| Decision | Why |
|----------|-----|
| 继续沿用圆形徽章构图 | 与当前 UI 最匹配 |
| 每张头像带中文名 | 便于快速识别 |
| 岗位靠道具区分，不改文件名 | 降低接入成本 |

## Issues
| Issue | Resolution |
|-------|------------|
| `Glob` 未直接返回外部 assets 目录结果 | 改用 shell `ls` 确认头像文件存在 |

---
*Update this file after every 2 view/browser/search operations*
