# C2C 钱包内 Polymarket 集成（使用钱包货币预测）- 竞品分析 v1.1

| 版本 | 日期 | 变更摘要 |
|---|---|---|
| v1.0 | 2026-03-11 | 首版：基于“钱包内用稳定币余额参与预测 + Polymarket API 数据源 + 账户式成交/后台对冲”的方向，选取 Polymarket / MetaMask / Kalshi / Crypto.com / ForecastEx 做对比，输出差异化机会与对 PRD 的补充建议。 |
| v1.1 | 2026-03-11 | 【更新】补全“差异化机会/PRD建议/来源清单”；强化“费用模型、地域合规开关、交易保护（滑点/IOC/只平不开）”的竞品对标口径与可落地建议。 |

## 分析概要
竞品格局分成两类：①“链上预测市场原生”（Polymarket）与“钱包内直接接入链上交易”（MetaMask x Polymarket）强调热点覆盖、链上可验证与低切换成本，但链上/桥接/失败重试会外溢到体验与客诉，且常用较高 convenience fee 覆盖摩擦成本；②“强合规事件合约交易所”（Kalshi、Crypto.com CDNA、ForecastEx）强调账户式确定性体验、清晰的规则/数据源/费用披露与监管框架。  
我们的机会在于把“Polymarket 的热点与流动性信号”（API 数据源）与“账户式成交确定性”（双层账本、状态机、熔断与只平不开）结合，做成 C2C 钱包的高频资金使用入口，并保留可降级/可关停的合规模块化能力（只读 → 模拟/积分 → 实盘对冲）。

## 竞品对比总览

| 维度 | 我们（规划：方案B 双层账本 + 后台净额对冲） | Polymarket（原生） | MetaMask Prediction Markets（接入 Polymarket） | Kalshi（CFTC 交易所） | Crypto.com Prediction Trading / OG（CFTC 体系） | ForecastEx（IBKR 体系，CFTC） |
|------|---|---|---|---|---|---|
| 功能完整度 | 钱包内发现/下单/持仓/结算/风控；账户式即时成交；后台批量对冲；可灰度地区/KYC | 市场发现、订单簿、成交、链上结算；开发者 API 完整 | 钱包内浏览/下单/提现闭环；仍是链上成交 | 事件合约交易所能力成熟；费用表/规则体系完备 | App 内预测交易：订单类型/滑点/限额；OG 叠加社交与奖励，规划保证金 | 宏观/政治/气候类预测合约；低费表达清晰 |
| 用户体验 | “像钱包余额交易”：1 秒内给出成交/拒绝；异常时只平不开；链上不确定性后台吸收 | 体验与链上/订单簿状态强耦合 | 入口在钱包内、步骤少；但存在桥接/链上不确定性与较高费用 | 金融交易所式流程；规则清晰但偏美国市场 | 交易产品化强（IOC、滑点）；偏衍生品心智 | 更偏长期/机构渠道心智 |
| 技术亮点 | 双层账本（用户侧仓位 + 后台净额对冲）；spread/限额/熔断；可降级只读 | Gamma/CLOB/Data 分层 API；盘口/价差/历史/持仓数据齐全 | 任意 EVM 资产入金→桥接余额；与 Polymarket 账户/签名联动 | 完整 API 生态（REST/Websocket/FIX 等），费用/风控规则公开 | MO with protection + IOC + 可调滑点；事件级仓位上限 | 费用“内嵌定价”（$0.01/合约或成对）降低认知成本 |
| 定价策略 | 关键在“综合成本透明”：内部 spread +（对冲成本/外部费用）+（可选服务费） | 部分市场启用 taker fee 并做 maker rebate；并非全市场一致 | 4% 交易费（存取不收费）+ 积分激励 | 以“每 100 contracts 费用区间”等形式公开，系列差异化 | 费用与执行规则金融化；可用“滑点设置”降低争议 | 强调简单低费（$0.01）与无其他费用 |
| 差异化 | 在不确定监管与链上波动下仍提供确定性体验与可控风险敞口；更贴合 C2C 存量资金场景 | 热点覆盖与流动性标杆 | “钱包即入口”标杆，但成本高、链上不确定性仍在 | “合规/规则/数据源披露”标杆 | “交易保护与风控表达”标杆 | “低费表达 + 机构合规渠道”差异化 |

## 各竞品详细分析

### 竞品A：Polymarket（数据源与原生交易场所）
- 功能描述
  - 市场数据 API 分层：Gamma API（events/markets/tags/series/sports 等）、CLOB API（price/prices/book/spread/midpoint/历史等）、Data API（positions/trades/oi/holders/value 等）。可用于行情展示、热度/流动性评估与风控定价基准。
  - 市场结构：单事件/多市场事件；市场对象包含 outcomes、outcomePrices 等字段，且可通过 enableOrderBook 判断是否启用订单簿交易。
- 优点
  - 数据覆盖面广，足以支撑钱包内“行情-盘口-历史-热榜”信息架构；可直接取 midpoint/spread/order book 做报价保护与风控参考。
  - “部分市场无需鉴权拉取数据”，利于先做只读验证（M1）。
  - 费用与流动性激励机制可参考：对特定品类启用 taker fee，资金用于 maker rebate，提升深度与稳定性（但会导致不同市场综合成本不同）。
- 缺点/风险
  - 若我们做“账户式成交 + 后台对冲”，必须自行承担：API 延迟/断流时的报价保护；市场规则变更/下架时的用户处置；以及“结算/裁定争议”的解释成本。
  - 费用口径不统一：部分市场 feesEnabled=true（需在我们 UI 与结算单中透明呈现外部费用 + 内部价差/服务费，避免“暗费”争议）。
- 信息来源
  - Polymarket Market Data 概览（Gamma/CLOB/Data 端点）：https://docs.polymarket.com/market-data/overview
  - Markets & Events（enableOrderBook、市场标识等概念）：https://docs.polymarket.com/concepts/markets-events
  - Maker Rebates/费用启用范围与说明（crypto、NCAAB、Serie A 等）：https://docs.polymarket.com/market-makers/maker-rebates
  - API 结构与用例综述（非官方整理，便于快速理解端点分层）：https://medium.com/@gwrx2005/the-polymarket-api-architecture-endpoints-and-use-cases-f1d88fa6c1bf

### 竞品B：MetaMask Prediction Markets（钱包内接入 Polymarket，直接对标“钱包里做 Polymarket”）
- 功能描述
  - MetaMask Mobile 内嵌预测市场浏览与交易，明确“Powered by Polymarket”，主打“两步交易”“不离开钱包”。
  - 资金侧：支持“任意 EVM token 入金”，系统桥接后形成可交易余额；提现回钱包（示例为 Polygon 上 USDC.e）。
  - 收费：交易收取 4% transaction fee（存取不收费）；并用 Rewards 积分激励（每 $1 获取积分）。
  - 合规表达：明确列举不可用地区与风险提示，并引导参考 Polymarket TOS。
  - 账户同步：若既有 Polymarket 账户使用同一签名钱包，可自动同步；若为 email 登录账户则不自动出现，可能创建新账户。
- 优点
  - “钱包即入口”的产品闭环成熟：发现→入金→交易→持仓→提现。
  - 通过“地区黑名单 + 强提示文案”把合规风险产品化（入口可隐藏/禁用）。
  - 通过“便利费 + 积分”做商业化与增长闭环。
- 缺点/机会点
  - 4% 平台费对高频/大额不友好；对我们是反向机会：若用方案B净额对冲降低链上摩擦，理论上可用更低综合成本（更窄 spread/更低费）换更高频次与留存。
  - 链上/桥接不确定性仍在：拥堵、失败、资金跨链延迟会引发客诉；我们若改为账户式成交可显著改善确定性。
- 信息来源
  - MetaMask 产品页（4% 费用、范围、说明）：https://metamask.io/prediction-markets
  - MetaMask 帮助中心（入金、账户同步、提现、地区限制等）：https://support.metamask.io/manage-crypto/trade/predict/how-to-trade-predictions/
  - 媒体报道（4% fee 分成与产品动机补充）：https://thedefiant.io/news/nfts-and-web3/metamask-launches-prediction-markets-with-polymarket

### 竞品C：Kalshi（合规事件合约交易所标杆）
- 功能描述
  - CFTC 监管框架下的事件合约交易所；API 文档体系完整，覆盖市场/事件/订单/组合/账户等（从公开文档结构可见其交易所化能力成熟）。
  - 费用公开透明：Fee schedule 公示标准费用区间，并对不同 series 给出差异化费用/是否有 maker fee 等信息。
- 优点（对我们关键启发）
  - “规则/结算/费用披露”高度金融化、可审计，显著降低争议：每个市场应有清晰规则文本、结算来源与时点、异常处理口径。
  - 产品表达接近“账户式交易”（与我们方案B用户体验目标一致）：用户端不暴露底层执行复杂度。
- 缺点/不适配点
  - 强监管/地域限制显著；若我们面向多地区 C2C 钱包用户，必须做严格分层（地区开关、KYC 阈值、额度与风险测评）。
- 信息来源
  - Kalshi 费用表：https://kalshi.com/fee-schedule
  - Kalshi API 文档（Get Events 等接口结构）：https://docs.kalshi.com/api-reference/events/get-events

### 竞品D：Crypto.com Prediction Trading / OG（交易产品化 + 社交化新增量）
- 功能描述
  - Crypto.com App 内 Prediction Trading：CFTC 监管衍生品交易功能；合约到期后按固定金额支付（示例 $1 / $10）。
  - 交易执行规则清晰：支持 Market/Limit；MO with protection（带保护的市价单）+ IOC（立即成交否则取消）+ 可调滑点容忍（文档示例默认 $0.05/合约）；并给出事件级仓位上限（$1 合约 2,500,000；$10 合约 250,000）。
  - OG 独立 App：强调“社交互动、排行榜、奖励”，并公开规划“parlays、margin trading”等更高风险形态。
- 优点（可直接复用的机制）
  - 把“成交不确定性”显式化为产品规则：滑点容忍、IOC、部分成交/拒绝、流动性不足提示——这套语言体系可直接迁移到我们“报价保护/只平不开/熔断”交互里，降低客诉。
  - 明确的仓位限额与维护窗口/合规披露，减少“系统性风险/操作风险”争议。
- 缺点/代价
  - 心智偏衍生品交易，新手门槛更高；我们需要用“热榜话题 + 小额 + 明确最大损失”降低学习成本，同时保留专业参数入口给高频用户。
- 信息来源
  - Crypto.com Help Center（监管、订单类型、滑点、限额等）：https://help.crypto.com/en/articles/11373970-prediction-trading
  - OG 发布（社交、奖励、保证金规划、合规定位）：https://crypto.com/us/company-news/cryptocom-launches-og-a-new-prediction-market-experience

### 竞品E：ForecastEx（IBKR 体系的“低费 + 机构渠道 + 长周期”）
- 功能描述
  - ForecastEx 为 CFTC 注册的 DCM/DCO，提供 yes/no Forecast Contracts（宏观、政治、气候等），更偏“投资工具/对冲工具”叙事。
  - 费用表达极简：仅收 $0.01/合约或成对，并强调“费用包含在定价中”，无其他交易所/清算/数据/经纪费用（口径来自其 About 页面）。
- 优点（对我们定价表达的启发）
  - “一口价/内嵌费用”能显著降低用户对费用复杂度的认知负担；与钱包场景“像余额交易”一致。
- 缺点/不适配点
  - 偏机构渠道与长期持有，与 Polymarket 的热点高频场景差异大；对我们更多是“费用表达与合规叙事”参考。
- 信息来源
  - ForecastEx About（监管身份、$0.01 费用内嵌说明）：https://forecastex.com/about

## 差异化机会
- 机会1：把“链上不确定性”彻底后台化，形成钱包级确定性体验（对标 MetaMask 的链上外溢问题）
  - 竞品现状：MetaMask 虽内嵌，但仍需要桥接/链上成交；链上拥堵与失败会进入用户链路与工单。
  - 我们打法：方案B坚持“账户式即时成交”，链上只在后台净额对冲；对冲失败进入“风险模式：只平不开/扩大价差/降低限额”，前台状态机与支付一致（已受理/已成交/已拒绝/结算中/异常挂起）。
  - 影响：体验与规模化显著优于链上直连，尤其适合钱包存量用户“快、小额、高频”。

- 机会2：费用与价差“全量透明化”，反向利用 MetaMask 4% 费率争议做口碑切入
  - 竞品现状：MetaMask 直接 4% 便利费可理解但昂贵；Polymarket 又存在“部分市场启用 taker fee”的差异。
  - 我们打法：在下单页/结算单拆分展示：外部市场费用（如 Polymarket feesEnabled 市场的 taker fee）+ 我方服务费（如有）+ 内部价差成本（spread）；并提供“综合费率估算/对比说明”。
  - 影响：降低“暗费”争议，提高大额与高频用户的可接受度。

- 机会3：将“合规开关”做到产品与系统的第一公民（对标 MetaMask 地区黑名单、Kalshi/CDC 的强合规披露）
  - 竞品现状：MetaMask 明确列举不可用地区；CFTC 体系产品把监管、规则、数据源写进产品结构。
  - 我们打法：入口级开关（隐藏/禁用）、下单级拦截（地区/KYC/风险测评/额度）、资产级隔离（预测余额子账户/冻结），并提供“灰度策略：只读→模拟→实盘”。
  - 影响：在监管不确定情况下提升业务连续性，减少“一刀切下线”造成的资金与舆情风险。

- 机会4：交易保护参数产品化（对标 Crypto.com 的滑点/IOC/限额表达）
  - 竞品现状：Crypto.com 明确“MO with protection + IOC + 滑点容忍”，把成交失败/部分成交变成可预期规则。
  - 我们打法：把“报价保护”产品化：最大可成交额、滑点上限（或等价的“最差成交价”）、成交超时自动拒绝、极端波动自动熔断，并在风控触发时给可解释原因（波动、对冲通道故障、流动性不足、达到限额）。
  - 影响：降低客诉与争议，提升交易可信度。

## 对 PRD 的补充建议
- 【更新】原口径：仅描述“账户式成交 + 后台净额对冲” → 新口径：补齐“报价与费用透明、交易保护参数、合规分层与降级策略”（生效版本 v1.1；原因：竞品已把合规与费用、交易保护做成核心卖点；影响范围：下单页/结算单/风控与状态机/合规策略）
  1. 增加“费用披露规范”
     - 下单页展示：参考价来源（Polymarket midpoint/盘口）、我方价差、预估外部费用（若对冲至 feesEnabled 市场）、合计成本与盈亏平衡点提示。
     - 结算单展示：外部费用/内部费用/价差成本拆分。
     - 参考：MetaMask 直接披露 4% fee；Polymarket 对部分品类启用 taker fee 并做 maker rebate。来源：https://metamask.io/prediction-markets ，https://docs.polymarket.com/market-makers/maker-rebates

  2. 增加“交易保护”配置（新手默认、高手可展开）
     - 默认：自动保护（最大滑点/最大成交额/超时拒绝）。
     - 高级：允许设置“最差成交价/滑点上限”“仅限平仓”等。
     - 参考：Crypto.com 的 MO with protection + IOC + 可调滑点。来源：https://help.crypto.com/en/articles/11373970-prediction-trading

  3. 明确“地区/KYC/风险测评”的分层策略与灰度路径
     - 入口策略：地区不支持直接隐藏或只读；KYC 未达标只读或仅模拟；风险测评决定额度与是否允许开仓。
     - 参考：MetaMask 明确不可用地区；CFTC 产品强调监管与开户流程。来源：https://support.metamask.io/manage-crypto/trade/predict/how-to-trade-predictions/ ，https://help.crypto.com/en/articles/11373970-prediction-trading

  4. 结果与争议处理：把“规则/数据源/异常流程”产品化（向 Kalshi 学习）
     - 每个市场详情必须固定展示：结算条件、主要信息源、争议与复核时限、极端情况下的退款/延迟结算策略。
     - 参考：Kalshi 强规则与费用公开。来源：https://kalshi.com/fee-schedule ，https://docs.kalshi.com/api-reference/events/get-events

  5. 技术依赖建议：Polymarket 数据接口的“降级与缓存策略”写进 PRD 验收
     - 必备：价格缓存、断流时禁下单、盘口快照时间戳、数据一致性校验；并在 UI 明示“报价时间/已暂停交易”。
     - 参考：Polymarket API 端点覆盖。来源：https://docs.polymarket.com/market-data/overview

## 参考来源
- Polymarket Market Data API Overview：https://docs.polymarket.com/market-data/overview
- Polymarket Markets & Events：https://docs.polymarket.com/concepts/markets-events
- Polymarket Maker Rebates Program：https://docs.polymarket.com/market-makers/maker-rebates
- Polymarket API（非官方整理）：https://medium.com/@gwrx2005/the-polymarket-api-architecture-endpoints-and-use-cases-f1d88fa6c1bf
- MetaMask Prediction Markets 产品页：https://metamask.io/prediction-markets
- MetaMask 帮助中心（交易指引/地区限制/入金/提现）：https://support.metamask.io/manage-crypto/trade/predict/how-to-trade-predictions/
- The Defiant（MetaMask x Polymarket、4% fee 报道）：https://thedefiant.io/news/nfts-and-web3/metamask-launches-prediction-markets-with-polymarket
- Kalshi Fee Schedule：https://kalshi.com/fee-schedule
- Kalshi API（Get Events）：https://docs.kalshi.com/api-reference/events/get-events
- Crypto.com Prediction Trading（订单类型/滑点/限额/监管）：https://help.crypto.com/en/articles/11373970-prediction-trading
- Crypto.com OG 发布（社交/奖励/保证金规划）：https://crypto.com/us/company-news/cryptocom-launches-og-a-new-prediction-market-experience
- ForecastEx About（监管身份、$0.01 费用内嵌）：https://forecastex.com/about