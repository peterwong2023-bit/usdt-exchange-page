# Task Plan: 倔驴科技 GPT 头像重做

## Goal
用 GPT 风格统一重做倔驴科技 12 位成员的圆形头像，直接覆盖当前仪表盘使用的 `/avatars/avatar-*-donkey.png` 资源，并确保前端路径无需再调整。

## Current Phase
COMPLETED

## Phases

### Phase 1: 现状盘点
- [x] 读取现有头像引用位置
- [x] 确认头像静态目录与命名规则
- [x] 读取当前规划文件，接管新任务
- **Status:** complete

### Phase 2: 角色设定统一
- [x] 固化 12 位成员的统一视觉规范
- [x] 为每位成员定义角色道具、神态、主色
- [x] 同时重做团队总头像
- **Status:** complete

### Phase 3: GPT 批量生成
- [x] 生成产品部 5 张头像
- [x] 生成开发部 4 张头像
- [x] 生成运维部 3 张头像
- [x] 生成团队总头像
- **Status:** complete

### Phase 4: 资源落位
- [x] 保存到 `/Users/wongpeter/.cursor/projects/Users-wongpeter-Desktop-usdt-exchange-page/assets`
- [x] 保持文件名与 `dashboard.html` 当前引用一致
- [x] 检查是否存在遗漏头像文件
- **Status:** complete

### Phase 5: 验证与交付
- [x] 抽查头像文件存在性
- [x] 检查 `dashboard.html` 引用是否完整
- [x] 明确本轮仅重做圆形头像，像素办公室精灵可单独继续
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 本轮优先重做圆形头像 | 用户明确要求“生成头像用 gpt” |
| 保持现有文件名不变 | 避免再次修改前端引用 |
| 采用统一风格批量生成 | 让 12 位成员视觉语言一致 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `session-catchup.py` 缺失 | 1 | 改为直接读取现有 `task_plan.md` / `findings.md` / `progress.md` 接管任务 |

## Notes
- 头像由 `.product-team/dashboard.html` 中的 `AGENTS` 数组引用。
- 静态头像目录为 `/Users/wongpeter/.cursor/projects/Users-wongpeter-Desktop-usdt-exchange-page/assets`。
- 当前命名规则包括：`avatar-pm-alpha-donkey.png`、`avatar-dev-lead-donkey.png`、`avatar-ops-manager-donkey.png` 等。
