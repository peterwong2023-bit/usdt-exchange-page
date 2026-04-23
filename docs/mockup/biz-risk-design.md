# biz-risk-* 设计标准

> 适用范围：商户后台 `biz-risk-*` 系列页面（风控模式 / 风控配置 / 风险资金清算 / 后续相关页）。
> 目标：所有 biz-risk-* 页面共享一套 design tokens、颜色语义、组件库与交互约定，保证视觉一致、商户认知一致。
> 当 biz-risk-* 系列稳定后，再考虑提取为商户后台全站标准。

---

## 1. Design Tokens

### 1.1 字体

```css
font-family: 'Plus Jakarta Sans', 'Noto Sans SC',
             -apple-system, BlinkMacSystemFont,
             'PingFang SC', 'Microsoft YaHei', sans-serif;
font-feature-settings: "cv11" 1, "ss01" 1;
```

数字 / 地址 / hash 必须用 `.mono`：

```css
.mono {
  font-family: 'Plus Jakarta Sans', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1, "cv11" 1, "ss01" 1;
  letter-spacing: -0.01em;
}
```

字号梯度：

| 用途 | font-size | weight |
|---|---|---|
| 页头主标 (h1.title) | 20px | 700 |
| 页头副标 (p.subtitle) | 13px | 400 |
| 卡片标题 / section title | 13px | 600~700 |
| 正文 / 表单 | 13px | 400 |
| 表头 / 标签 | 11px | 600，letter-spacing .04em，UPPERCASE 可选 |
| 主数字（资金概览）| 22px | 700, mono |
| 辅助说明 / hint | 11~12px | 400~500，text-tertiary |

### 1.2 色板（必须严格使用 CSS 变量）

```css
:root {
  /* 中性 */
  --bg-main: #f3f5f9;
  --bg-card: #ffffff;
  --bg-soft: #f8fafc;
  --border: #e5e8f0;
  --border-dashed: #cbd5e1;
  --border-subtle: rgba(226, 232, 240, 0.6);
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-light: #94a3b8;

  /* 语义色 */
  --primary: #2563eb;          /* 蓝 = 主操作 / 出款侧 / 分桶模式 */
  --primary-soft: rgba(37, 99, 235, 0.08);
  --success: #10b981;          /* 绿 = 安全 / 入款侧 / 退回模式 / 已销账 */
  --success-soft: rgba(16, 185, 129, 0.08);
  --warning: #d97706;          /* 琥珀 = 待返还 / 未销账 / 阈值超出 */
  --warning-bg: #fef3c7;
  --warning-border: #fcd34d;
  --danger: #ef4444;           /* 红 = 不可逆 / 拒绝 / 严重风险 */
  --danger-soft: rgba(239, 68, 68, 0.08);
  --purple: #8b5cf6;           /* 留作风控规则 / 配置 */

  /* 风险评分四档（用于评分条 / 评分徽章）*/
  --tier-low:    #10b981;      /* 0–19   清洁 / 低 */
  --tier-mid:    #eab308;      /* 20–49  中 */
  --tier-high:   #f97316;      /* 50–79  高 */
  --tier-severe: #b91c1c;      /* 80–100 严重 */

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02);
  --shadow-md: 0 2px 4px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 4px 6px rgba(15, 23, 42, 0.05), 0 12px 32px rgba(15, 23, 42, 0.06);
}
```

### 1.3 间距 / 半径 / 阴影

- 页边距：`padding: 32px 24px 120px`
- 容器：`.page { max-width: 1160px }`
- 卡片：`padding: 14px 16px` · 卡间距 `margin-bottom: 16px`
- 卡片大间距区块（流水 / 概览）：`padding: 18px 18px`
- section 之间纵向间距：`margin-top: 24px`
- 卡片 radius 默认 `--radius-sm`（6px）；模态 / QR / 提示卡 `--radius-md`（10px）；图片 / 大块容器 `--radius-lg`（16px）
- 卡片默认阴影 `--shadow-sm`；浮起 / 悬浮态 `--shadow-md`；模态 `--shadow-lg`

---

## 2. 颜色语义约定（必须严格遵守，否则丢失语义记忆）

| 场景 | 颜色 | 变量 |
|---|---|---|
| 入款 / 退回模式 / 安全 / 已销账 / 已返还 | 绿 | `--success` |
| 出款 / 分桶模式 / 主操作按钮 / 桶能力开启 | 蓝 | `--primary` |
| 待返还 / 未销账 / 阈值超出 / 注意事项 | 琥珀 | `--warning` |
| 不可逆操作 / 拒绝 / 命中风险 / 严重等级 | 红 | `--danger` |
| 风控规则 / 配置项辅助 | 紫 | `--purple` |

**禁忌**：
- 不要用红色做出款主按钮（红色专留给"拒绝/不可逆"）。
- 不要用绿色做"风险出款"主按钮（绿色专留给"安全/退回"）。
- 不要把整页背景换成琥珀大色块——琥珀仅用于点状强调（pill / dot / 边框）。
- 不要混用警告色和危险色，二选一明确语义。

---

## 3. 通用组件

### 3.1 卡片 `.card`

```html
<div class="card">
  <div class="card-title">
    <div class="left"><span class="dot"></span>卡片标题</div>
    <div class="right">辅助说明</div>
  </div>
  <!-- 内容 -->
</div>
```

变体：
- `.card.no-pad` – 内容自带 padding 时使用，外层 `padding: 0; overflow: hidden`
- `.card.no-title` – 隐藏标题区
- 卡顶颜色条 `.dot` 默认 primary 渐变；`.warn` 用琥珀渐变；`.success` 用绿色渐变

### 3.2 标签 `.tag`

- `tag-success` / `tag-primary` / `tag-warn` / `tag-danger` / `tag-neutral` / `tag-purple`
- `font-size: 11px; padding: 2px 8px; border-radius: 10px`
- 必须自带 `border`，不要纯填色

### 3.3 表格 `.tbl`

```html
<table class="tbl">
  <thead><tr><th>列名</th></tr></thead>
  <tbody>
    <tr>
      <td class="mono">数字 / 时间</td>
      <td>普通文本</td>
      <td><span class="addr-cell">…地址 + icon</span></td>
    </tr>
  </tbody>
</table>
```

约定：
- 表头 `font-size: 11px`，灰色，UPPERCASE，浅底
- 数字 / 时间 / 地址 / hash 必须 `.mono`
- 金额列右对齐（`text-r`），出款 amount 用 `--warning`、入款 amount 用 `--success`
- 整行 hover 浅灰

### 3.4 链上地址 / hash 工具栏（本次新增 · 必须用 antd icon）

每个链上地址 / hash 字段后挂两个图标按钮，间距 6px：

```html
<span class="addr-cell">
  <span class="addr-text mono" title="<完整地址>">TQwEr5t...A0bC</span>
  <button class="ic-btn" data-action="copy" data-value="<完整地址>" aria-label="复制">
    <!-- antd CopyOutlined -->
    <svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor">
      <path d="M832 64H296c-4.4 0-8 3.6-8 8v56h-72c-39.8 0-72 32.2-72 72v680c0 39.8 32.2 72 72 72h440c39.8 0 72-32.2 72-72v-56h72c39.8 0 72-32.2 72-72V136c0-39.8-32.2-72-72-72zM664 880H232V256h432v624zm200-128H736V200c0-39.8-32.2-72-72-72H384V136c0-4.4 3.6-8 8-8h440c4.4 0 8 3.6 8 8v616z"/>
    </svg>
  </button>
  <a class="ic-btn" target="_blank" rel="noopener" href="https://tronscan.org/#/address/<addr>" aria-label="链上查询">
    <!-- antd LinkOutlined -->
    <svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor">
      <path d="M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"/>
    </svg>
  </a>
</span>
```

```css
.addr-cell { display: inline-flex; align-items: center; gap: 6px; }
.addr-text { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); }
.ic-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border: none; background: transparent;
  color: var(--text-light);
  border-radius: 4px;
  cursor: pointer;
  transition: all .15s ease;
}
.ic-btn:hover { color: var(--primary); background: var(--primary-soft); }
.ic-btn.copied { color: var(--success); }
```

链上跳转地址：
- 地址：`https://tronscan.org/#/address/<addr>`
- 交易：`https://tronscan.org/#/transaction/<hash>`

### 3.5 资金概览数字卡

每张数字卡的固定 5 元素：

| 元素 | 样式 |
|---|---|
| label | 11px / text-tertiary / letter-spacing .04em |
| help icon `?`（hover 显示口径）| 13px 圆形，灰底 |
| 主数字 | 22px / 700 / mono / `.value`，单位用 `.unit` 灰色小字 |
| breakdown / formula | 11px / text-tertiary，可选 |
| 呼吸点 `.pulse` | 仅"待返还"等需提醒的数字使用 |

### 3.6 表单控件

- `.form-input` / `.form-textarea`：`padding: 11px 12px; border-radius: 8px; border: 1px solid var(--border)`
- `:focus`：`border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft)`
- `.is-invalid`：`border-color: var(--danger)`，附加 `shake` 动画
- `.form-fixed`：锁死的字段（如链路）灰底，右上角带"已锁定"小字

### 3.7 按钮

| 类 | 用途 | 颜色 |
|---|---|---|
| `.btn-primary` | 主操作（提交 / 确认）| 蓝 `--primary` |
| `.btn-warn` | 涉及待返还的提交 | 琥珀 `--warning` |
| `.btn-danger` | 不可逆 / 删除 | 红 `--danger` |
| `.btn-ghost` | 次要操作（取消 / 清空）| 白底灰边 |

### 3.8 模态 `.modal-overlay` + `.modal`

- 背景：`rgba(15,23,42,.55) + backdrop-filter: blur(4px)`
- 主体：`max-width: 520px; border-radius: 14px`
- 头部图标按"语义"选色（提交=蓝；不可逆/危险=红；待返还=琥珀）

### 3.9 Section header

```html
<div class="section-header">
  <div class="bar"></div>
  <div class="title">分区标题</div>
  <div class="sub">· 副标</div>
  <div class="line"></div>
</div>
```

颜色条 `.bar` 默认蓝色渐变；如本区域语义为"待返还/警告"可换琥珀渐变。

---

## 4. 页面结构规范

```
┌──────────────────────────────────────────────────┐
│  h1.title           → 页面主标题                   │
│  p.subtitle         → 一句话说明 + 关键约束 (b 强调) │
├──────────────────────────────────────────────────┤
│  [资金概览 / 状态卡]  ← 必有，no-pad 大卡         │
├──────────────────────────────────────────────────┤
│  [section-header]                                 │
│  [操作主区 / 卡片]                                │
├──────────────────────────────────────────────────┤
│  [section-header]                                 │
│  [次要区 / 流水 / 历史]                            │
└──────────────────────────────────────────────────┘
```

`max-width: 1160px`；超过 960px 单列堆叠。

---

## 5. 交互规范

### 5.1 不可逆 / 上链广播操作

- 必须二次确认弹窗
- 双勾选项：① 我确认不可撤 ② 我承诺履行后续义务（如返还）
- 大额（默认 ≥ 阈值的 50%）触发短信 OTP（6 位）
- "确认"按钮在 ① + ② + OTP（如需）三项全过前必须 disabled

### 5.2 风险评分徽章

| 分数段 | 等级 | 配色变量 |
|---|---|---|
| 0–19 | 清洁 / 低 | `--tier-low` |
| 20–49 | 中 | `--tier-mid` |
| 50–79 | 高 | `--tier-high` |
| 80–100 | 严重 | `--tier-severe` |

徽章统一格式：`<分数> · <等级>`。提示作用，**不阻断业务**。

### 5.3 表单校验

- 失焦 + 即时双层校验
- 错误：边框 `--danger` + 抖动动画 + 行内红字提示
- 成功：边框 `--primary`（focus）/ 灰色（blur）

### 5.4 复制反馈

复制按钮点击后：
- 图标变 ✓（暂时切到 antd CheckOutlined）
- 颜色切 `--success`
- 1.6s 后还原
- 同时弹 toast "已复制"

### 5.5 Toast

- 顶部居中
- 深色背景 `rgba(15,23,42,.95)` + 白字
- 自动 2s 消失，淡出
- 类型：success（绿勾）/ warn（琥珀）/ error（红叉）

---

## 6. 命名公约

- 页面文件：`biz-risk-<功能>.html`
- 样式 class：BEM-lite，`.card-title__left`、`.summary-cell--warn`
- CSS 变量：`--<类别>-<子类>`，如 `--text-tertiary`、`--bg-soft`
- JS 状态：`state.<域>.<字段>`，如 `state.form.addr`、`state.summary.bucket`

---

## 7. 不要做

- ❌ 不要在卡片内大段使用纯橙色背景（之前 withdrawal 页的错误）
- ❌ 不要让"危险"和"警告"颜色出现在同一处操作上
- ❌ 不要在表格里用大色块染色，最多染金额一列文字
- ❌ 不要把 emoji 当 icon 用（必须 antd / 内联 SVG）
- ❌ 不要给商户暴露内部"桶 / 池"概念，统一用"可用余额 / 风险余额 / 待返还"等业务术语
