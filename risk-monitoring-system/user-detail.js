// 用户风险详情页面 JavaScript

class UserDetailViewer {
    constructor() {
        this.currentUserId = null;
        this.currentData = null;
        this.init();
    }
    
    init() {
        // 从URL获取用户ID
        const urlParams = new URLSearchParams(window.location.search);
        this.currentUserId = urlParams.get('user_id') || 'tui1_12981989';
        
        // 加载数据
        this.loadUserDetail();
    }
    
    loadUserDetail() {
        this.currentData = userRiskDetails[this.currentUserId];
        
        // 如果没有数据，生成默认数据
        if (!this.currentData) {
            console.log('用户数据不存在，生成默认数据');
            this.currentData = this.generateDefaultData(this.currentUserId);
        }
        
        this.renderSummary();
        this.renderUserProfileLayer();
        this.renderSecurityLayer();
        this.renderTradeLayer();
        this.renderSyndicateLayer();
        this.renderTimeline();
        this.renderAuditLogs();
    }
    
    generateDefaultData(userId) {
        // 生成默认数据
        const riskScore = Math.floor(Math.random() * 30) + 65; // 65-95
        const riskLevel = riskScore >= 85 ? 'high' : riskScore >= 70 ? 'medium' : 'low';
        
        return {
            summary: {
                user_id: userId,
                avatar_url: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 50 + 1),
                nickname: "用户_" + userId.slice(-4),
                risk_score: riskScore,
                risk_level: riskLevel,
                main_tags: ["异常交易", "设备风险"],
                sub_tags: ["多设备登录", "高频操作"],
                account_status: "normal",
                case_id: "CASE_" + Date.now(),
                case_status: "pending",
                assignee_name: "运营_A"
            },
            account_info: {
                register_days: Math.floor(Math.random() * 200) + 30,
                kyc_status: "verified",
                balance: Math.floor(Math.random() * 10000) + 1000,
                total_deposit_30d: Math.floor(Math.random() * 50000) + 5000,
                total_sell_30d: Math.floor(Math.random() * 40000) + 3000,
                trade_count_30d: Math.floor(Math.random() * 80) + 20,
                account_status: "normal"
            },
            login_device_risk: {
                last_city: "深圳",
                last_country: "中国",
                last_ip: "112.25.67.89",
                last_login_at: "2025-11-27 " + Math.floor(Math.random() * 24) + ":00:00",
                ip_count_7d: Math.floor(Math.random() * 8) + 1,
                city_jump_count_7d: Math.floor(Math.random() * 4),
                proxy_login_7d: Math.floor(Math.random() * 3),
                device_count_7d: Math.floor(Math.random() * 5) + 1,
                core_device_fp: "DFP_" + Math.floor(Math.random() * 900000 + 100000),
                device_risk_tags: ["多设备登录"],
                summary: "设备使用正常，暂无明显异常。"
            },
            payment_risk: {
                qr_count: Math.floor(Math.random() * 4) + 1,
                bank_count: Math.floor(Math.random() * 3) + 1,
                shared_payment: false,
                shared_payment_accounts: 0,
                payment_change_7d: Math.floor(Math.random() * 3),
                core_payment_ids: ["QR_" + Math.floor(Math.random() * 900000 + 100000)],
                receive_amount_7d: Math.floor(Math.random() * 20000) + 2000,
                summary: "收款方式使用正常。"
            },
            trade_risk: {
                high_cancel_24h: Math.floor(Math.random() * 5),
                cancel_after_accept_7d: Math.floor(Math.random() * 3),
                repeat_cancel_7d: Math.floor(Math.random() * 2),
                small_high_freq_30m: Math.floor(Math.random() * 10),
                small_trade_ratio_30d: Math.floor(Math.random() * 40) + 10,
                active_time_window: "全天",
                summary: "交易行为正常。"
            },
            relation_risk: {
                group_id: null,
                group_risk_score: 0,
                role_in_group: "unknown",
                shared_device_accounts: 0,
                shared_payment_accounts: 0,
                high_risk_partner_count: 0,
                summary: "暂未发现团伙关联。"
            },
            risk_events: [
                {
                    event_time: "2025-11-27 10:00",
                    event_type: "login",
                    event_label: "正常登录",
                    level: "low"
                }
            ],
            audit_logs: [
                {
                    time: "2025-11-27 " + Math.floor(Math.random() * 24) + ":00:00",
                    operator: "系统",
                    action: "assigned",
                    remark: "自动分配审核"
                }
            ]
        };
    }
    
    renderSummary() {
        const s = this.currentData.summary;
        
        // 头像和用户信息
        document.getElementById('userAvatar').src = s.avatar_url || 'bob.png';
        document.getElementById('userId').textContent = '#' + s.user_id;
        document.getElementById('userNickname').textContent = s.nickname || '';
        
        // 风险分和等级
        document.getElementById('scoreNumber').textContent = s.risk_score;
        const levelText = s.risk_level === 'high' ? '高危' : s.risk_level === 'medium' ? '中危' : '低危';
        document.getElementById('scoreLabel').textContent = levelText;
        
        // 风险分圆圈颜色
        const circle = document.getElementById('riskScoreCircle');
        if (s.risk_level === 'high') {
            circle.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
        } else if (s.risk_level === 'medium') {
            circle.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
        } else {
            circle.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }
        
        // 主要标签
        const mainTagsHTML = s.main_tags.map(tag => `<span class="main-tag">${tag}</span>`).join('');
        document.getElementById('mainTags').innerHTML = mainTagsHTML;
        
        // 次要标签
        if (s.sub_tags && s.sub_tags.length > 0) {
            const subTagsHTML = s.sub_tags.map(tag => `<span class="sub-tag">${tag}</span>`).join('');
            document.getElementById('subTags').innerHTML = subTagsHTML;
        }
        
        // 操作按钮
        const actionsHTML = `
            <button class="action-btn fraud" onclick="viewer.markAsFraud()">
                <i class="fas fa-ban"></i>
                标记诈骗
            </button>
            <button class="action-btn clean" onclick="viewer.markAsClean()">
                <i class="fas fa-check-circle"></i>
                标记正常
            </button>
            <button class="action-btn watch" onclick="viewer.markAsWatch()">
                <i class="fas fa-eye"></i>
                继续观察
            </button>
            <button class="action-btn freeze" onclick="viewer.freezeAccount()">
                <i class="fas fa-snowflake"></i>
                冻结账户
            </button>
            <button class="action-btn blacklist" onclick="viewer.blacklistAccount()">
                <i class="fas fa-user-slash"></i>
                拉黑账户
            </button>
        `;
        document.getElementById('summaryActions').innerHTML = actionsHTML;
    }
    
    // 第一层：画像层（5个子模块）
    renderUserProfileLayer() {
        const info = this.currentData.account_info;
        
        // 子模块1：账户属性
        this.renderAccountAttr(info);
        
        // 子模块2：活跃度
        this.renderActiveLevel(info);
        
        // 子模块3：资金流向
        this.renderMoneyFlow(info);
        
        // 子模块4：交易习惯
        this.renderTradingHabit(info);
        
        // 子模块5：安全画像
        this.renderSecurityProfile(info);
    }
    
    // 子模块1：账户属性
    renderAccountAttr(info) {
        const kycText = info.kyc_status === 'verified' ? '✓ 已实名' : 
                       info.kyc_status === 'pending' ? '⏳ 实名中' : '✗ 未实名';
        
        // 计算注册日期
        const registerDate = new Date();
        registerDate.setDate(registerDate.getDate() - info.register_days);
        const registerDateStr = registerDate.toISOString().split('T')[0];
        
        // 用户类型（成熟用户）
        const userType = info.register_days > 90 ? '成熟用户' : 
                        info.register_days > 30 ? '普通用户' : '新手用户';
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">类型</div>
                <div class="info-row-value"><span class="type-tag primary">${userType}</span></div>
            </div>
            <div class="info-row">
                <div class="info-row-label">注册</div>
                <div class="info-row-value">${registerDateStr} (${info.register_days}天)</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">实名</div>
                <div class="info-row-value ${info.kyc_status === 'verified' ? 'success' : ''}">${kycText}</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">余额</div>
                <div class="info-row-value">$${info.balance.toLocaleString()}</div>
            </div>
        `;
        document.getElementById('accountAttr').innerHTML = html;
    }
    
    // 子模块2：活跃度
    renderActiveLevel(info) {
        const total30d = info.total_deposit_30d + info.total_sell_30d;
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">等级</div>
                <div class="info-row-value"><span class="type-tag success">短期高活跃</span></div>
            </div>
            <div class="info-row">
                <div class="info-row-label">交易</div>
                <div class="info-row-value">${info.trade_count_30d}笔 / 30日</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">数量</div>
                <div class="info-row-value">$${total30d.toLocaleString()}</div>
            </div>
        `;
        document.getElementById('activeLevel').innerHTML = html;
    }
    
    // 子模块3：资金流向
    renderMoneyFlow(info) {
        const flowType = this.calculateFlowType(info.total_deposit_30d, info.total_sell_30d);
        const flowText = flowType === 'net_in' ? '净买入' : 
                        flowType === 'net_out' ? '净卖出' : '平衡';
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">类型</div>
                <div class="info-row-value">
                    <span class="flow-indicator ${flowType}">${flowText}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">充值</div>
                <div class="info-row-value">$${info.total_deposit_30d.toLocaleString()}</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">提现</div>
                <div class="info-row-value">$${info.total_sell_30d.toLocaleString()}</div>
            </div>
        `;
        document.getElementById('moneyFlow').innerHTML = html;
    }
    
    // 子模块4：交易习惯
    renderTradingHabit(info) {
        const avgAmount = info.trade_count_30d > 0 ? 
            (info.total_deposit_30d + info.total_sell_30d) / 2 / info.trade_count_30d : 0;
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">类型</div>
                <div class="info-row-value"><span class="type-tag purple">平衡</span></div>
            </div>
            <div class="info-row">
                <div class="info-row-label">单笔均额</div>
                <div class="info-row-value">$${Math.floor(avgAmount).toLocaleString()}</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">总买入</div>
                <div class="info-row-value">$${info.total_deposit_30d.toLocaleString()}</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">总卖出</div>
                <div class="info-row-value">$${info.total_sell_30d.toLocaleString()}</div>
            </div>
        `;
        document.getElementById('tradingHabit').innerHTML = html;
    }
    
    // 子模块5：安全画像（3个子部分）
    renderSecurityProfile(info) {
        // A. 黑名单类
        this.renderBlacklistType(info);
        
        // B. 账户状态类（含被举报）
        this.renderAccountStatus(info);
        
        // C. 订单行为
        this.renderOrderBehavior(info);
    }
    
    // A. 黑名单类（6个项目）
    renderBlacklistType(info) {
        const ipBlacklistCount = Math.floor(Math.random() * 3);
        const ipBlacklistRisk = ipBlacklistCount >= 3;
        const ipBlacklistScore = ipBlacklistRisk ? ipBlacklistCount * 5 : 0;
        
        const html = `
            <div class="info-row ${ipBlacklistRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">IP拉黑</div>
                <div class="info-row-value ${ipBlacklistRisk ? 'risk-trigger' : ''}" style="font-size: 14px;">
                    ${ipBlacklistCount}次
                    ${ipBlacklistRisk ? `<span class="risk-score-badge">${ipBlacklistScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">手机号拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">身份证拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">二维码拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">支付方式拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">登录设备拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
        `;
        document.getElementById('blacklistType').innerHTML = html;
    }
    
    // B. 账户状态类（5个项目，含被举报）
    renderAccountStatus(info) {
        const frozenCount = info.account_status === 'frozen' ? 1 : 0;
        const frozenRisk = frozenCount > 0;
        const frozenScore = frozenRisk ? 20 : 0;
        
        const reportCount = Math.floor(Math.random() * 6);
        const reportRisk = reportCount >= 3;
        const reportScore = reportRisk ? reportCount * 8 : 0;
        
        const html = `
            <div class="info-row ${frozenRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">账户冻结</div>
                <div class="info-row-value ${frozenRisk ? 'risk-trigger' : ''}" style="font-size: 14px;">
                    ${frozenCount}次
                    ${frozenRisk ? `<span class="risk-score-badge">${frozenScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">账户拉黑</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row ${reportRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">被举报次数</div>
                <div class="info-row-value ${reportRisk ? 'risk-trigger' : ''}" style="font-size: 14px;">
                    ${reportCount}次
                    ${reportRisk ? `<span class="risk-score-badge">${reportScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">人脸认证失败</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">身份证注册</div>
                <div class="info-row-value" style="font-size: 14px;">1个账号</div>
            </div>
        `;
        document.getElementById('accountStatus').innerHTML = html;
    }
    
    // C. 举报类画像
    renderReportType(info) {
        const reportCount = Math.floor(Math.random() * 6);
        const reportRisk = reportCount >= 3;
        const reportScore = reportRisk ? reportCount * 8 : 0;
        
        const html = `
            <div class="info-row ${reportRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">被举报</div>
                <div class="info-row-value ${reportRisk ? 'risk-trigger' : ''}" style="font-size: 13px;">
                    ${reportCount}次
                    ${reportRisk ? `<span class="risk-score-badge">${reportScore}</span>` : ''}
            </div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">重复举报</div>
                <div class="info-row-value" style="font-size: 13px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">严重举报</div>
                <div class="info-row-value" style="font-size: 13px;">无</div>
            </div>
        `;
        document.getElementById('reportType').innerHTML = html;
    }
    
    // C. 订单行为（8个项目）
    renderOrderBehavior(info) {
        const tradeRisk = this.currentData.trade_risk;
        
        // 卖家同意后买家取消
        const cancelAfterAcceptRisk = tradeRisk.cancel_after_accept_7d > 2;
        const cancelAfterAcceptScore = cancelAfterAcceptRisk ? tradeRisk.cancel_after_accept_7d * 8 : 0;
        
        // 连续取消
        const repeatCancelRisk = tradeRisk.repeat_cancel_7d >= 3;
        const repeatCancelScore = repeatCancelRisk ? tradeRisk.repeat_cancel_7d * 5 : 0;
        
        const html = `
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">买家取消</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">卖家拒绝</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">卖家超时</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">买家超时</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row ${cancelAfterAcceptRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">同意后取消</div>
                <div class="info-row-value ${cancelAfterAcceptRisk ? 'risk-trigger' : ''}" style="font-size: 14px;">
                    ${tradeRisk.cancel_after_accept_7d}次
                    ${cancelAfterAcceptRisk ? `<span class="risk-score-badge">${cancelAfterAcceptScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${repeatCancelRisk ? 'has-risk' : ''}" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">连续取消</div>
                <div class="info-row-value ${repeatCancelRisk ? 'risk-trigger' : ''}" style="font-size: 14px;">
                    ${tradeRisk.repeat_cancel_7d}次
                    ${repeatCancelRisk ? `<span class="risk-score-badge">${repeatCancelScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">工单成功</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
            <div class="info-row" style="padding: 6px 8px; margin-bottom: 3px;">
                <div class="info-row-label" style="font-size: 13px;">工单失败</div>
                <div class="info-row-value" style="font-size: 14px;">0次</div>
            </div>
        `;
        document.getElementById('orderBehavior').innerHTML = html;
    }
    
    // 获取用户类型分类（按图中分类体系）
    getUserCategory(info) {
        // 1. 新手成长级别
        if (info.register_days <= 30) {
            if (info.trade_count_30d === 0) {
                return { type: '1.1 新注册用户', desc: '注册≤30天，无交易记录' };
            } else if (info.total_sell_30d === 0 && info.total_deposit_30d > 0) {
                return { type: '1.2 新买家用户', desc: '注册≤30天，买单≥1' };
            } else if (info.total_deposit_30d === 0 && info.total_sell_30d > 0) {
                return { type: '1.3 新卖家用户', desc: '注册≤30天，卖单≥1' };
            } else if (info.trade_count_30d >= 10) {
                return { type: '1.4 双边用户', desc: '买/卖交易≥10笔' };
            }
        }
        
        // 1.5 休眠用户
        if (info.trade_count_30d === 0) {
            if (info.register_days >= 180) {
                return { type: '1.5 休眠用户', desc: '首次180天无交易' };
            } else if (info.register_days >= 90) {
                return { type: '1.5 休眠用户', desc: '首次90天无交易' };
            } else if (info.register_days >= 30) {
                return { type: '1.5 休眠用户', desc: '首次30天无交易' };
            }
        }
        
        // 1.6 高净值老用户
        if (info.register_days >= 180 && info.balance >= 50000) {
            return { type: '1.6 高净值老用户', desc: '天数≥180天，资产≥50000' };
        }
        
        // 2. 流转度级别（高活跃用户）
        const total30d = info.total_deposit_30d + info.total_sell_30d;
        if (info.trade_count_30d >= 30 && info.balance >= 10000) {
            return { type: '2.1 初期流转', desc: '30天交易≥30笔，余额≥10000' };
        }
        if (info.trade_count_30d >= 60 && info.balance >= 30000) {
            return { type: '2.2 中期流转', desc: '90天交易≥60笔，余额≥30000' };
        }
        if (info.trade_count_30d >= 100 && info.balance >= 60000) {
            return { type: '2.3 长期流转', desc: '180天交易≥300笔，余额≥60000' };
        }
        
        // 2.4-2.6 低流转
        if (info.trade_count_30d >= 10 && info.balance < 1000) {
            return { type: '2.4 短期流转', desc: '30天交易≥10笔，余额<1000' };
        }
        
        // 2.7-2.9 休眠
        if (info.trade_count_30d === 0) {
            return { type: '2.7 短期休眠用户', desc: '30天无交易' };
        }
        
        // 默认分类
        return { type: '普通用户', desc: '正常交易用户' };
    }
    
    // 获取流转度等级
    getFlowLevel(info) {
        const total30d = info.total_deposit_30d + info.total_sell_30d;
        
        if (total30d >= 120000) return 'L6 超高活跃';
        if (total30d >= 100000) return 'L5 高活跃';
        if (total30d >= 60000) return 'L4 中高活跃';
        if (total30d >= 20000) return 'L3 中等活跃';
        if (total30d >= 2000) return 'L2 低活跃';
        if (total30d > 0) return 'L1 初级活跃';
        return 'L0 无交易';
    }
    
    // 生成用户画像标签（完整分类）
    generateProfileTags(info, userCategory, flowLevel) {
        const tags = [];
        
        // 3. 资金流向画像
        const flowRatio = info.total_deposit_30d > 0 ? 
            info.total_sell_30d / info.total_deposit_30d : 0;
        
        if (info.total_deposit_30d >= info.total_sell_30d * 1.5) {
            tags.push('3.1 净买入用户');
        } else if (info.total_sell_30d >= info.total_deposit_30d * 1.5) {
            tags.push('3.2 净卖出用户');
        } else if (flowRatio >= 0.67 && flowRatio <= 1.5) {
            tags.push('3.3 平衡用户');
        }
        
        // 4. 交易习惯画像
        const avgAmount = info.trade_count_30d > 0 ? 
            (info.total_deposit_30d + info.total_sell_30d) / 2 / info.trade_count_30d : 0;
        
        // 4.1 大额交易用户
        if (avgAmount >= 50000) {
            tags.push('4.1 大额交易用户');
        }
        
        // 4.2 持有大额用户
        if (info.balance >= 50000) {
            tags.push('4.2 持有大额用户');
        }
        
        // 4.3 碎片化用户
        if (avgAmount < 200 && info.trade_count_30d >= 30) {
            tags.push('4.3 碎片化用户');
        }
        
        // 4.4 高频平滑用户
        if (info.trade_count_30d >= 30) {
            tags.push('4.4 高频平滑用户');
        }
        
        // 4.5 固存用户
        if (info.balance > 0 && info.trade_count_30d === 0) {
            tags.push('4.5 固存用户');
        }
        
        // 4.6 量化代打用户（交易时间固定性中）
        // 这个需要更多数据，暂时省略
        
        return tags;
    }
    
    calculateFlowType(deposit, sell) {
        const diff = Math.abs(deposit - sell);
        const total = deposit + sell;
        const ratio = total > 0 ? diff / total : 0;
        
        if (ratio < 0.2) return 'balanced';
        return sell > deposit ? 'net_out' : 'net_in';
    }
    
    generateHabitTags(info) {
        const tags = [];
        
        // 小额高频
        if (info.trade_count_30d > 50) {
            const avgAmount = (info.total_deposit_30d + info.total_sell_30d) / 2 / info.trade_count_30d;
            if (avgAmount < 500) {
                tags.push('小额高频');
            }
        }
        
        // 大额交易
        const avgAmount = (info.total_deposit_30d + info.total_sell_30d) / 2 / info.trade_count_30d;
        if (avgAmount > 5000) {
            tags.push('大额交易');
        }
        
        // 活跃交易者
        if (info.trade_count_30d > 80) {
            tags.push('活跃交易者');
        }
        
        return tags;
    }
    
    // 第二层：安全行为风险层（4个子模块）
    renderSecurityLayer() {
        const risk = this.currentData.login_device_risk;
        const relation = this.currentData.relation_risk;
        
        // 子模块1：登录/地域
        this.renderLoginGeo(risk);
        
        // 子模块2：设备风险
        this.renderDeviceRisk(risk, relation);
        
        // 子模块3：自动&批量攻击
        this.renderAutoAttack(risk);
        
        // 子模块4：攻击&异常行为
        this.renderAbnormalBehavior(risk);
        
        // 计算总分
        const totalScore = this.calculateSecurityScore(risk, relation);
        
        // AI判断摘要
        const aiJudgment = this.generateSecurityJudgment(risk);
        document.getElementById('securitySummary').innerHTML = `
            ${aiJudgment}
            ${totalScore > 0 ? `<div class="layer-risk-summary">
                <div class="layer-risk-label">安全行为风险</div>
                <div class="layer-risk-score">${totalScore}</div>
            </div>` : ''}
        `;
    }
    
    // 子模块1：登录/地域（5个项目）
    renderLoginGeo(risk) {
        // 模拟上次登录城市和IP
        const lastLoginCity = "北京";
        const lastLoginIP = "118.24.53.12";
        
        // 计算城市间距离（模拟）
        const cityDistance = Math.floor(Math.random() * 1200) + 100;
        const distanceRisk = cityDistance > 500;
        const distanceScore = distanceRisk ? 10 : 0;
        
        // 24小时切换城市次数
        const city24hSwitch = Math.floor(Math.random() * 4) + 1;
        const citySwitchRisk = city24hSwitch >= 3;
        const citySwitchScore = citySwitchRisk ? city24hSwitch * 6 : 0;
        
        // 同IP账号数
        const sameIPAccounts = Math.floor(Math.random() * 5);
        const sameIPRisk = sameIPAccounts >= 3;
        const sameIPScore = sameIPRisk ? sameIPAccounts * 8 : 0;
        
        // 代理/VPN检测
        const proxyRisk = risk.proxy_login_7d > 0;
        const proxyScore = proxyRisk ? 15 : 0;
        
        // 注册城市（模拟）
        const registerCity = "上海";
        const registerIP = "101.88.23.45";
        
        // 注册城市与当前城市的距离（模拟）
        const registerCityDistance = Math.floor(Math.random() * 1500) + 200;
        const registerDistanceRisk = registerCityDistance > 800;
        const registerDistanceScore = registerDistanceRisk ? 8 : 0;
        
        // 存储登录地域数据供弹窗使用
        window.loginGeoData = {
            currentIP: risk.last_ip,
            currentCity: risk.last_city,
            registerCity,
            registerIP,
            timeline: this.generateLoginTimeline(city24hSwitch)
        };
        
        // 存储同IP账号数据
        window.sameIPAccountsData = {
            ip: risk.last_ip,
            accounts: this.generateSameIPAccounts(sameIPAccounts)
        };
        
        const html = `
            <div style="padding: 10px 12px; background: ${distanceRisk ? '#fef2f2' : '#f8fafc'}; border-radius: 6px; margin-bottom: 6px; ${distanceRisk ? 'border-left: 4px solid #dc2626;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div class="info-row-label">跨城市登录</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="userDetailViewer.showLoginTimeline()" style="font-size: 12px; padding: 3px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">查看事件轴</button>
                        ${distanceRisk ? `<span class="risk-score-badge">${distanceScore}</span>` : ''}
                    </div>
                </div>
                <div style="font-size: 13px; line-height: 1.7; color: #475569;">
                    <div style="margin-bottom: 2px;">• 当前: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${risk.last_ip}</span> · ${risk.last_city}</div>
                    <div style="margin-bottom: 2px;">• 上次: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${lastLoginIP}</span> · ${lastLoginCity}</div>
                    <div ${distanceRisk ? 'style="color: #dc2626; font-weight: 800;"' : ''}>• 距离: ${cityDistance} km</div>
                </div>
            </div>
            <div style="padding: 10px 12px; background: ${registerDistanceRisk ? '#fef2f2' : '#f8fafc'}; border-radius: 6px; margin-bottom: 6px; ${registerDistanceRisk ? 'border-left: 4px solid #dc2626;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div class="info-row-label">注册与当前城市</div>
                    ${registerDistanceRisk ? `<span class="risk-score-badge">${registerDistanceScore}</span>` : ''}
                </div>
                <div style="font-size: 13px; line-height: 1.7; color: #475569;">
                    <div style="margin-bottom: 2px;">• 注册: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${registerIP}</span> · ${registerCity}</div>
                    <div style="margin-bottom: 2px;">• 当前: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${risk.last_ip}</span> · ${risk.last_city}</div>
                    <div ${registerDistanceRisk ? 'style="color: #dc2626; font-weight: 800;"' : ''}>• 距离: ${registerCityDistance} km</div>
                </div>
            </div>
            <div class="info-row ${citySwitchRisk ? 'has-risk' : ''}">
                <div class="info-row-label">24h切换城市</div>
                <div class="info-row-value ${citySwitchRisk ? 'risk-trigger' : ''}">
                    ${city24hSwitch}次
                    ${citySwitchRisk ? `<span class="risk-score-badge">${citySwitchScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${sameIPRisk ? 'has-risk' : ''}">
                <div class="info-row-label">同IP账号数</div>
                <div class="info-row-value ${sameIPRisk ? 'risk-trigger' : ''}" style="display: flex; align-items: center; gap: 8px;">
                    ${sameIPAccounts}个 / 24h
                    ${sameIPAccounts > 0 ? `<button onclick="userDetailViewer.showSameIPAccounts()" style="font-size: 11px; padding: 2px 8px; background: #64748b; color: white; border: none; border-radius: 3px; cursor: pointer;">查看</button>` : ''}
                    ${sameIPRisk ? `<span class="risk-score-badge">${sameIPScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${proxyRisk ? 'has-risk' : ''}">
                <div class="info-row-label">代理/VPN</div>
                <div class="info-row-value ${proxyRisk ? 'risk-trigger' : ''}">
                    ${proxyRisk ? '检测到' : '未检测到'}
                    ${proxyRisk ? `<span class="risk-score-badge">${proxyScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('loginGeo').innerHTML = html;
    }
    
    // 子模块2：设备风险
    renderDeviceRisk(risk, relation) {
        const deviceShareRisk = relation && relation.shared_device_accounts > 0;
        const deviceShareScore = deviceShareRisk ? relation.shared_device_accounts * 8 : 0;
        
        // 当前设备指纹（模拟）
        const currentFingerprint = 'DFP_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // 指纹短期频繁变化（模拟24小时内变化次数，至少1次用于演示）
        const fingerprintChange24h = Math.floor(Math.random() * 4) + 1;
        const fingerprintRisk = fingerprintChange24h > 2;
        const fingerprintScore = fingerprintRisk ? fingerprintChange24h * 10 : 0;
        
        // 模拟变化的字段
        const changedFields = [];
        const possibleFields = [
            { name: '系统版本', from: 'iOS 16.5', to: 'iOS 17.1' },
            { name: '存储容量', from: '128GB', to: '256GB' },
            { name: '屏幕分辨率', from: '1170x2532', to: '1179x2556' },
            { name: '设备型号', from: 'iPhone 14', to: 'iPhone 15' },
            { name: '时区设置', from: 'UTC+8', to: 'UTC+9' },
            { name: '语言设置', from: '简体中文', to: '繁体中文' }
        ];
        // 随机选择变化字段
        if (fingerprintChange24h > 0) {
            const shuffled = possibleFields.sort(() => 0.5 - Math.random());
            for (let i = 0; i < Math.min(fingerprintChange24h, possibleFields.length); i++) {
                changedFields.push(shuffled[i]);
            }
        }
        
        // 模拟器检测（从风险标签判断）
        const emulatorRisk = risk.device_risk_tags && 
            risk.device_risk_tags.some(tag => tag.includes('模拟器'));
        const emulatorScore = emulatorRisk ? 10 : 0;
        
        // 生成变化字段HTML
        const changedFieldsHtml = changedFields.length > 0 ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">最近变化字段:</div>
                ${changedFields.slice(0, 2).map(field => `
                    <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 3px;">
                        <span style="color: #64748b; min-width: 70px;">${field.name}:</span>
                        <span style="color: #94a3b8; text-decoration: line-through;">${field.from}</span>
                        <span style="margin: 0 6px; color: #f59e0b;">→</span>
                        <span style="color: #dc2626; font-weight: 600;">${field.to}</span>
                    </div>
                `).join('')}
            </div>
        ` : '';
        
        // 存储指纹变化数据供弹窗使用
        window.fingerprintChangeData = {
            currentFingerprint,
            changeCount: fingerprintChange24h,
            changedFields,
            // 生成模拟的时间线数据
            timeline: this.generateFingerprintTimeline(fingerprintChange24h, changedFields)
        };
        
        const html = `
            <div style="padding: 10px 12px; background: ${fingerprintRisk ? '#fef2f2' : '#f8fafc'}; border-radius: 6px; margin-bottom: 6px; ${fingerprintRisk ? 'border-left: 4px solid #dc2626;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div class="info-row-label">指纹短期频繁变化</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${fingerprintChange24h > 0 ? `<button onclick="userDetailViewer.showFingerprintTimeline()" style="font-size: 12px; padding: 3px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">查看事件轴</button>` : ''}
                        ${fingerprintRisk ? `<span class="risk-score-badge">${fingerprintScore}</span>` : ''}
                    </div>
                </div>
                <div style="font-size: 13px; line-height: 1.7; color: #475569;">
                    <div style="margin-bottom: 2px;">• 当前指纹: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e40af;">${currentFingerprint}</span></div>
                    <div ${fingerprintRisk ? 'style="color: #dc2626; font-weight: 800;"' : ''}>• 24h内变化: ${fingerprintChange24h} 次 ${fingerprintRisk ? '（>2次异常）' : ''}</div>
                </div>
                ${changedFieldsHtml}
            </div>
            <div class="info-row ${deviceShareRisk ? 'has-risk' : ''}">
                <div class="info-row-label">同设备多账号</div>
                <div class="info-row-value ${deviceShareRisk ? 'risk-trigger' : ''}">
                    ${deviceShareRisk ? `${relation.shared_device_accounts} 个账号` : '未检测到'}
                    ${deviceShareRisk ? `<span class="risk-score-badge">${deviceShareScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">多设备登录</div>
                <div class="info-row-value">${risk.device_count_7d} 台 / 7日</div>
            </div>
            <div class="info-row ${emulatorRisk ? 'has-risk' : ''}">
                <div class="info-row-label">群控/模拟器</div>
                <div class="info-row-value ${emulatorRisk ? 'risk-trigger' : ''}">
                    ${emulatorRisk ? '检测到模拟器' : '未检测到'}
                    ${emulatorRisk ? `<span class="risk-score-badge">${emulatorScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('deviceRisk').innerHTML = html;
    }
    
    // 子模块3：自动&批量攻击定位
    renderAutoAttack(risk) {
        // 模拟数据
        const frozenCount = Math.floor(Math.random() * 12);
        const blacklistCount = Math.floor(Math.random() * 12);
        const phoneBlacklist = Math.floor(Math.random() * 5);
        const idBlacklist = Math.floor(Math.random() * 5);
        const qrBlacklist = Math.floor(Math.random() * 5);
        const bankBlacklist = Math.floor(Math.random() * 5);
        const ipBlacklist = Math.floor(Math.random() * 5);
        const smsOverLimit = Math.floor(Math.random() * 5);
        const faceFailCount = Math.floor(Math.random() * 5);
        
        // 风险判断
        const frozenRisk = frozenCount >= 5;
        const frozenHighRisk = frozenCount >= 10;
        const blacklistRisk = blacklistCount >= 5;
        const blacklistHighRisk = blacklistCount >= 10;
        const phoneRisk = phoneBlacklist >= 3;
        const idRisk = idBlacklist >= 3;
        const qrRisk = qrBlacklist >= 3;
        const bankRisk = bankBlacklist >= 3;
        const ipRisk = ipBlacklist >= 3;
        const smsRisk = smsOverLimit >= 3;
        const faceRisk = faceFailCount >= 3;
        
        // 风险分数
        const frozenScore = frozenHighRisk ? 20 : (frozenRisk ? 10 : 0);
        const blacklistScore = blacklistHighRisk ? 20 : (blacklistRisk ? 10 : 0);
        const phoneScore = phoneRisk ? 8 : 0;
        const idScore = idRisk ? 8 : 0;
        const qrScore = qrRisk ? 15 : 0;
        const bankScore = bankRisk ? 15 : 0;
        const ipScore = ipRisk ? 12 : 0;
        const smsScore = smsRisk ? 8 : 0;
        const faceScore = faceRisk ? 10 : 0;
        
        const html = `
            <div class="info-row ${frozenRisk ? 'has-risk' : ''}">
                <div class="info-row-label">账号被冻结次数</div>
                <div class="info-row-value ${frozenRisk ? 'risk-trigger' : ''}">
                    ${frozenCount} 次 ${frozenHighRisk ? '（高风险）' : frozenRisk ? '（中风险）' : ''}
                    ${frozenRisk ? `<span class="risk-score-badge">${frozenScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${blacklistRisk ? 'has-risk' : ''}">
                <div class="info-row-label">账号被拉黑次数</div>
                <div class="info-row-value ${blacklistRisk ? 'risk-trigger' : ''}">
                    ${blacklistCount} 次 ${blacklistHighRisk ? '（高风险）' : blacklistRisk ? '（中风险）' : ''}
                    ${blacklistRisk ? `<span class="risk-score-badge">${blacklistScore}</span>` : ''}
                </div>
            </div>
            <div style="padding: 10px 12px; background: ${(phoneRisk || idRisk || qrRisk || bankRisk) ? '#fef2f2' : '#f8fafc'}; border-radius: 6px; margin-bottom: 6px; ${(phoneRisk || idRisk || qrRisk || bankRisk) ? 'border-left: 4px solid #dc2626;' : ''}">
                <div style="font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">被拉黑次数</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; ${phoneRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>手机号</span>
                        <span>${phoneBlacklist} 次 ${phoneRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${phoneScore}</span>` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; ${idRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>身份证</span>
                        <span>${idBlacklist} 次 ${idRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${idScore}</span>` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; ${qrRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>二维码</span>
                        <span>${qrBlacklist} 次 ${qrRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${qrScore}</span>` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; ${bankRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>银行卡</span>
                        <span>${bankBlacklist} 次 ${bankRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${bankScore}</span>` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="info-row ${ipRisk ? 'has-risk' : ''}">
                <div class="info-row-label">IP被拉黑次数</div>
                <div class="info-row-value ${ipRisk ? 'risk-trigger' : ''}">
                    ${ipBlacklist} 次/1h ${ipRisk ? '（≥3次）' : ''}
                    ${ipRisk ? `<span class="risk-score-badge">${ipScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${smsRisk ? 'has-risk' : ''}">
                <div class="info-row-label">验证码请求超限</div>
                <div class="info-row-value ${smsRisk ? 'risk-trigger' : ''}">
                    ${smsOverLimit} 次/10min ${smsRisk ? '（≥3次）' : ''}
                    ${smsRisk ? `<span class="risk-score-badge">${smsScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${faceRisk ? 'has-risk' : ''}">
                <div class="info-row-label">人脸认证失败</div>
                <div class="info-row-value ${faceRisk ? 'risk-trigger' : ''}">
                    ${faceFailCount} 次/天 ${faceRisk ? '（≥3次）' : ''}
                    ${faceRisk ? `<span class="risk-score-badge">${faceScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('autoAttack').innerHTML = html;
    }
    
    // 子模块4：争议&举报行为风险
    renderAbnormalBehavior(risk) {
        // 模拟数据
        const reportedCount = Math.floor(Math.random() * 8);
        const sameReasonReport = Math.floor(Math.random() * 3);
        const workOrderCount = Math.floor(Math.random() * 8);
        
        // 风险判断
        const reportedRisk = reportedCount >= 3;
        const reportedHighRisk = reportedCount >= 5;
        const sameReasonRisk = sameReasonReport > 0;
        const workOrderRisk = workOrderCount >= 5;
        
        // 风险分数
        const reportedScore = reportedHighRisk ? 20 : (reportedRisk ? 12 : 0);
        const sameReasonScore = sameReasonRisk ? 15 : 0;
        const workOrderScore = workOrderRisk ? 10 : 0;
        
        const html = `
            <div class="info-row ${reportedRisk ? 'has-risk' : ''}">
                <div class="info-row-label">被举报次数</div>
                <div class="info-row-value ${reportedRisk ? 'risk-trigger' : ''}">
                    ${reportedCount} 次 ${reportedHighRisk ? '（高风险）' : reportedRisk ? '（中风险）' : ''}
                    ${reportedRisk ? `<span class="risk-score-badge">${reportedScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${sameReasonRisk ? 'has-risk' : ''}">
                <div class="info-row-label">同一原因重复举报</div>
                <div class="info-row-value ${sameReasonRisk ? 'risk-trigger' : ''}">
                    ${sameReasonReport > 0 ? `${sameReasonReport} 条同一目录` : '无'}
                    ${sameReasonRisk ? `<span class="risk-score-badge">${sameReasonScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${workOrderRisk ? 'has-risk' : ''}">
                <div class="info-row-label">工单次数</div>
                <div class="info-row-value ${workOrderRisk ? 'risk-trigger' : ''}">
                    ${workOrderCount} 次/30天 ${workOrderRisk ? '（≥5次）' : ''}
                    ${workOrderRisk ? `<span class="risk-score-badge">${workOrderScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('abnormalBehavior').innerHTML = html;
    }
    
    // 计算安全行为层总分
    calculateSecurityScore(risk, relation) {
        let totalScore = 0;
        
        // 登录/地域风险
        const cityDistance = Math.floor(Math.random() * 1200) + 100;
        if (cityDistance > 500) totalScore += 10;
        
        const city24hSwitch = Math.floor(Math.random() * 4);
        if (city24hSwitch >= 3) totalScore += city24hSwitch * 6;
        
        const sameIPAccounts = Math.floor(Math.random() * 5);
        if (sameIPAccounts >= 3) totalScore += sameIPAccounts * 8;
        
        if (risk.proxy_login_7d > 0) totalScore += 15;
        
        // 设备风险
        if (relation && relation.shared_device_accounts > 0) {
            totalScore += relation.shared_device_accounts * 8;
        }
        const emulatorRisk = risk.device_risk_tags && 
            risk.device_risk_tags.some(tag => tag.includes('模拟器'));
        if (emulatorRisk) totalScore += 10;
        
        // 争议举报
        const disputeCount = Math.floor(Math.random() * 3);
        if (disputeCount > 0) totalScore += disputeCount * 12;
        
        return totalScore;
    }
    
    generateSecurityJudgment(risk) {
        const risks = [];
        
        if (risk.device_count_7d > 3) risks.push('多设备登录');
        if (risk.city_jump_count_7d > 2) risks.push('频繁异地');
        if (risk.proxy_login_7d > 0) risks.push('使用代理');
        
        if (risks.length === 0) {
            return '设备使用正常，暂无明显异常。';
        } else if (risks.length >= 2) {
            return `${risks.join(' + ')} → 疑似被控号 / 团伙马甲账号`;
        } else {
            return `存在${risks[0]}风险，建议持续观察。`;
        }
    }
    
    
    // 第三层：交易行为风险层（4个子模块）
    renderTradeLayer() {
        const risk = this.currentData.trade_risk;
        
        // 子模块1：下单与完成速度
        this.renderOrderSpeed(risk);
        
        // 子模块2：取消与超时行为
        this.renderCancelBehavior(risk);
        
        // 子模块3：对手方关系
        this.renderCounterpartyRisk(risk);
        
        // 子模块4：金额与频率模式
        this.renderAmountPattern(risk);
        
        // 计算总分
        const totalScore = this.calculateTradeScore(risk);
        
        // AI判断摘要
        const aiJudgment = this.generateTradeJudgment(risk);
        document.getElementById('tradeSummary').innerHTML = `
            ${aiJudgment}
            ${totalScore > 0 ? `<div class="layer-risk-summary">
                <div class="layer-risk-label">交易行为风险</div>
                <div class="layer-risk-score">${totalScore}</div>
            </div>` : ''}
        `;
    }
    
    // 子模块1：下单与完成速度
    renderOrderSpeed(risk) {
        // 模拟数据
        const quickSellRisk = false;
        const quickMarkRisk = false;
        const slowMarkPercent = Math.floor(Math.random() * 100);
        const slowMarkRisk = slowMarkPercent > 70;
        const slowMarkScore = slowMarkRisk ? 8 : 0;
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">1.1 登录后快速卖单</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row ${slowMarkRisk ? 'has-risk' : ''}">
                <div class="info-row-label">1.2 拖延付款占比</div>
                <div class="info-row-value ${slowMarkRisk ? 'risk-trigger' : ''}">
                    ${slowMarkPercent}%
                    ${slowMarkRisk ? `<span class="risk-score-badge">${slowMarkScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('orderSpeed').innerHTML = html;
    }
    
    // 子模块2：取消与超时行为
    renderCancelBehavior(risk) {
        // 频繁取消订单数据
        const cancel5min = Math.floor(Math.random() * 5);
        const cancel1hour = Math.floor(Math.random() * 8);
        const cancelAfterApprove = Math.floor(Math.random() * 4);
        
        // 风险判断
        const cancel5minRisk = cancel5min >= 3;
        const cancel1hourRisk = cancel1hour >= 5;
        const cancelAfterApproveRisk = cancelAfterApprove >= 2;
        const cancelRisk = cancel5minRisk || cancel1hourRisk || cancelAfterApproveRisk;
        
        // 风险分数
        const cancel5minScore = cancel5minRisk ? 15 : 0;
        const cancel1hourScore = cancel1hourRisk ? 12 : 0;
        const cancelAfterApproveScore = cancelAfterApproveRisk ? 20 : 0;
        
        const repeatCancelRisk = risk.repeat_cancel_7d >= 3;
        const repeatCancelScore = repeatCancelRisk ? risk.repeat_cancel_7d * 5 : 0;
        
        const html = `
            <div style="padding: 10px 12px; background: ${cancelRisk ? '#fef2f2' : '#f8fafc'}; border-radius: 6px; margin-bottom: 6px; ${cancelRisk ? 'border-left: 4px solid #dc2626;' : ''}">
                <div style="font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">频繁取消订单</div>
                <div style="font-size: 13px; line-height: 1.8;">
                    <div style="display: flex; justify-content: space-between; ${cancel5minRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>5分钟内取消</span>
                        <span>${cancel5min} 次 ${cancel5minRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${cancel5minScore}</span>` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; ${cancel1hourRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>1小时内取消</span>
                        <span>${cancel1hour} 次 ${cancel1hourRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${cancel1hourScore}</span>` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; ${cancelAfterApproveRisk ? 'color: #dc2626; font-weight: 700;' : 'color: #475569;'}">
                        <span>卖家同意后取消</span>
                        <span>${cancelAfterApprove} 次 ${cancelAfterApproveRisk ? `<span class="risk-score-badge" style="font-size: 10px; padding: 1px 4px;">${cancelAfterApproveScore}</span>` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="info-row ${repeatCancelRisk ? 'has-risk' : ''}">
                <div class="info-row-label">循环取消</div>
                <div class="info-row-value ${repeatCancelRisk ? 'risk-trigger' : ''}">
                    ${risk.repeat_cancel_7d} 轮
                    ${repeatCancelRisk ? `<span class="risk-score-badge">${repeatCancelScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('cancelBehavior').innerHTML = html;
    }
    
    // 子模块3：对手方关系
    renderCounterpartyRisk(risk) {
        // 模拟数据
        const highRiskTradeCount = Math.floor(Math.random() * 5);
        const highRiskTradeRisk = highRiskTradeCount >= 3;
        const highRiskTradeScore = highRiskTradeRisk ? highRiskTradeCount * 6 : 0;
        
        const concentrationPercent = Math.floor(Math.random() * 100);
        const concentrationRisk = concentrationPercent >= 70;
        const concentrationScore = concentrationRisk ? 12 : 0;
        
        const html = `
            <div class="info-row ${highRiskTradeRisk ? 'has-risk' : ''}">
                <div class="info-row-label">3.1 高危账号成交</div>
                <div class="info-row-value ${highRiskTradeRisk ? 'risk-trigger' : ''}">
                    ${highRiskTradeCount} 次 / 30日
                    ${highRiskTradeRisk ? `<span class="risk-score-badge">${highRiskTradeScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">3.2 自成交/互成交</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row ${concentrationRisk ? 'has-risk' : ''}">
                <div class="info-row-label">3.3 高集中度交易</div>
                <div class="info-row-value ${concentrationRisk ? 'risk-trigger' : ''}">
                    ${concentrationPercent}%
                    ${concentrationRisk ? `<span class="risk-score-badge">${concentrationScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">3.4 共用收款异常</div>
                <div class="info-row-value">未检测到</div>
            </div>
        `;
        document.getElementById('counterpartyRisk').innerHTML = html;
    }
    
    // 子模块4：金额与频率模式
    renderAmountPattern(risk) {
        const smallHighFreqRisk = risk.small_high_freq_30m >= 20;
        const smallHighFreqScore = smallHighFreqRisk ? (risk.small_high_freq_30m - 20) * 2 : 0;
        
        const nightActiveRisk = risk.active_time_window && risk.active_time_window.includes('凌晨');
        const nightActiveScore = nightActiveRisk ? 15 : 0;
        
        const html = `
            <div class="info-row ${smallHighFreqRisk ? 'has-risk' : ''}">
                <div class="info-row-label">4.1 小额高频下单</div>
                <div class="info-row-value ${smallHighFreqRisk ? 'risk-trigger' : ''}">
                    ${risk.small_high_freq_30m} 笔 / 30分钟
                    ${smallHighFreqRisk ? `<span class="risk-score-badge">${smallHighFreqScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">4.2 时间间隔规律</div>
                <div class="info-row-value">正常</div>
            </div>
            <div class="info-row ${nightActiveRisk ? 'has-risk' : ''}">
                <div class="info-row-label">4.3 固定时段活跃</div>
                <div class="info-row-value ${nightActiveRisk ? 'risk-trigger' : ''}">
                    ${risk.active_time_window}
                    ${nightActiveRisk ? `<span class="risk-score-badge">${nightActiveScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('amountPattern').innerHTML = html;
    }
    
    // 计算交易行为层总分
    calculateTradeScore(risk) {
        let totalScore = 0;
        
        // 下单速度
        const slowMarkPercent = Math.floor(Math.random() * 100);
        if (slowMarkPercent > 70) totalScore += 8;
        
        // 取消行为
        if (risk.high_cancel_24h >= 3) totalScore += 6;
        if (risk.high_cancel_24h >= 5) totalScore += 10;
        if (risk.cancel_after_accept_7d > 2) totalScore += risk.cancel_after_accept_7d * 8;
        if (risk.repeat_cancel_7d >= 3) totalScore += risk.repeat_cancel_7d * 5;
        
        // 对手方关系
        const highRiskTradeCount = Math.floor(Math.random() * 5);
        if (highRiskTradeCount >= 3) totalScore += highRiskTradeCount * 6;
        const concentrationPercent = Math.floor(Math.random() * 100);
        if (concentrationPercent >= 70) totalScore += 12;
        
        // 金额频率
        if (risk.small_high_freq_30m >= 20) totalScore += (risk.small_high_freq_30m - 20) * 2;
        if (risk.active_time_window && risk.active_time_window.includes('凌晨')) totalScore += 15;
        
        return totalScore;
    }
    
    generateTradeJudgment(risk) {
        const risks = [];
        
        if (risk.high_cancel_24h > 5 || risk.cancel_after_accept_7d > 3) {
            risks.push('高频取消');
        }
        if (risk.small_high_freq_30m > 10) {
            risks.push('小额高频');
        }
        if (risk.active_time_window && risk.active_time_window.includes('凌晨')) {
            risks.push('凌晨活跃');
        }
        
        if (risks.length === 0) {
            return '交易行为正常。';
        } else if (risks.length >= 2) {
            return `${risks.join(' + ')} → 疑似跑分 / 脚本行为`;
        } else {
            return `存在${risks[0]}特征，建议关注。`;
        }
    }
    
    // 第四层：团伙检测层（4个子模块）
    renderSyndicateLayer() {
        const syndicate = this.currentData.relation_risk;
        const payment = this.currentData.payment_risk;
        
        // 子模块1：设备网络
        this.renderDeviceGraph(syndicate);
        
        // 子模块2：IP网络
        this.renderIPGraph(syndicate);
        
        // 子模块3：支付方式网络
        this.renderPaymentGraph(syndicate, payment);
        
        // 子模块4：交易关系网络
        this.renderTradeGraph(syndicate);
        
        // 计算总分
        const totalScore = this.calculateSyndicateScore(syndicate, payment);
        
        // AI判断摘要
        const aiJudgment = this.generateSyndicateJudgment(syndicate);
        document.getElementById('syndicateSummary').innerHTML = `
            ${aiJudgment}
            ${totalScore > 0 ? `<div class="layer-risk-summary">
                <div class="layer-risk-label">团伙检测风险</div>
                <div class="layer-risk-score">${totalScore}</div>
            </div>` : ''}
        `;
        
        // 查看团伙图谱按钮
        const btnGraph = document.getElementById('btnViewGraph');
        if (syndicate.group_id) {
            btnGraph.onclick = () => {
                window.open(`group-graph.html?group_id=${syndicate.group_id}`, '_blank');
            };
        } else {
            btnGraph.disabled = true;
            btnGraph.style.opacity = '0.5';
            btnGraph.style.cursor = 'not-allowed';
        }
    }
    
    // 子模块1：设备网络 (Device Graph)
    renderDeviceGraph(syndicate) {
        const deviceShareRisk = syndicate.shared_device_accounts >= 3;
        const deviceShareScore = deviceShareRisk ? syndicate.shared_device_accounts * 10 : 0;
        
        const multiDeviceRisk = false; // 模拟数据
        
        const html = `
            <div class="info-row ${deviceShareRisk ? 'has-risk' : ''}">
                <div class="info-row-label">1.1 同设备多账号</div>
                <div class="info-row-value ${deviceShareRisk ? 'risk-trigger' : ''}">
                    ${syndicate.shared_device_accounts} 个账号
                    ${deviceShareRisk ? `<span class="risk-score-badge">${deviceShareScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">1.2 多设备登录</div>
                <div class="info-row-value">正常</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">1.3 设备指纹相似群</div>
                <div class="info-row-value">未检测到</div>
            </div>
        `;
        document.getElementById('deviceGraph').innerHTML = html;
    }
    
    // 子模块2：IP网络 (IP Graph)
    renderIPGraph(syndicate) {
        const html = `
            <div class="info-row">
                <div class="info-row-label">2.1 单IP多账号</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">2.2 代理池/数据中心</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">2.3 IP频繁切换</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">2.4 城市不合理变化</div>
                <div class="info-row-value">未检测到</div>
            </div>
        `;
        document.getElementById('ipGraph').innerHTML = html;
    }
    
    // 子模块3：支付方式网络 (Payment Graph)
    renderPaymentGraph(syndicate, payment) {
        const paymentShareRisk = syndicate.shared_payment_accounts >= 2;
        const paymentShareScore = paymentShareRisk ? syndicate.shared_payment_accounts * 15 : 0;
        
        const paymentChangeRisk = payment.payment_change_7d >= 5;
        const paymentChangeScore = paymentChangeRisk ? payment.payment_change_7d * 4 : 0;
        
        const html = `
            <div class="info-row ${paymentShareRisk ? 'has-risk' : ''}">
                <div class="info-row-label">3.1 多账号共用收款</div>
                <div class="info-row-value ${paymentShareRisk ? 'risk-trigger' : ''}">
                    ${syndicate.shared_payment_accounts} 个账号
                    ${paymentShareRisk ? `<span class="risk-score-badge">${paymentShareScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row ${paymentChangeRisk ? 'has-risk' : ''}">
                <div class="info-row-label">3.2 频繁更换收款</div>
                <div class="info-row-value ${paymentChangeRisk ? 'risk-trigger' : ''}">
                    ${payment.payment_change_7d} 次 / 7日
                    ${paymentChangeRisk ? `<span class="risk-score-badge">${paymentChangeScore}</span>` : ''}
                </div>
            </div>
            <div class="info-row">
                <div class="info-row-label">3.3 黑名单收款方式</div>
                <div class="info-row-value">未检测到</div>
            </div>
        `;
        document.getElementById('paymentGraph').innerHTML = html;
    }
    
    // 子模块4：交易关系网络 (Trade Graph)
    renderTradeGraph(syndicate) {
        const highRiskRelationRisk = syndicate.high_risk_partner_count > 0;
        const highRiskRelationScore = highRiskRelationRisk ? syndicate.high_risk_partner_count * 20 : 0;
        
        const html = `
            <div class="info-row">
                <div class="info-row-label">4.1 自成交/互成交</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">4.2 高集中度交易</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row">
                <div class="info-row-label">4.3 链式关系</div>
                <div class="info-row-value">未检测到</div>
            </div>
            <div class="info-row ${highRiskRelationRisk ? 'has-risk' : ''}">
                <div class="info-row-label">4.4 固定时段交易</div>
                <div class="info-row-value ${highRiskRelationRisk ? 'risk-trigger' : ''}">
                    ${highRiskRelationRisk ? `${syndicate.high_risk_partner_count} 个关联账号` : '未检测到'}
                    ${highRiskRelationRisk ? `<span class="risk-score-badge">${highRiskRelationScore}</span>` : ''}
                </div>
            </div>
        `;
        document.getElementById('tradeGraph').innerHTML = html;
    }
    
    // 计算团伙检测层总分
    calculateSyndicateScore(syndicate, payment) {
        let totalScore = 0;
        
        // 设备网络
        if (syndicate.shared_device_accounts >= 3) {
            totalScore += syndicate.shared_device_accounts * 10;
        }
        
        // 支付方式网络
        if (syndicate.shared_payment_accounts >= 2) {
            totalScore += syndicate.shared_payment_accounts * 15;
        }
        if (payment.payment_change_7d >= 5) {
            totalScore += payment.payment_change_7d * 4;
        }
        
        // 交易关系网络
        if (syndicate.high_risk_partner_count > 0) {
            totalScore += syndicate.high_risk_partner_count * 20;
        }
        
        return totalScore;
    }
    
    generateSyndicateJudgment(syndicate) {
        if (!syndicate.group_id) {
            return '暂未发现团伙关联。';
        }
        
        const risks = [];
        if (syndicate.shared_device_accounts > 2) risks.push('多重设备共享');
        if (syndicate.shared_payment_accounts > 2) risks.push('多重收款共享');
        if (syndicate.high_risk_partner_count > 0) risks.push('高危关联');
        
        if (risks.length >= 2) {
            return `${risks.join(' + ')} → 团伙嫌疑强，建议重点关注`;
        } else if (risks.length === 1) {
            return `存在${risks[0]}，疑似团伙成员`;
        } else {
            return `已归入团伙 ${syndicate.group_id}，风险等级：${syndicate.group_risk_score}`;
        }
    }
    
    renderTimeline() {
        const events = this.currentData.risk_events;
        
        const html = events.map(event => `
            <div class="timeline-item ${event.level}">
                <div class="timeline-time">${event.event_time}</div>
                <div class="timeline-content">
                    <div class="timeline-label">${event.event_label}</div>
                    <div class="timeline-type">${event.event_type}</div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('riskTimeline').innerHTML = html;
    }
    
    renderAuditLogs() {
        const logs = this.currentData.audit_logs;
        
        const actionClasses = {
            'mark_fraud': 'fraud',
            'mark_clean': 'clean',
            'watch': 'watch',
            'assigned': '',
            'freeze': 'fraud',
            'blacklist': 'blacklist'
        };
        
        const actionTexts = {
            'mark_fraud': '标记为诈骗',
            'mark_clean': '标记为正常',
            'watch': '标记为观察',
            'assigned': '分配审核',
            'freeze': '冻结账户',
            'blacklist': '拉黑账户'
        };
        
        const html = logs.map(log => `
            <div class="audit-log-item ${actionClasses[log.action] || ''}">
                <div class="audit-log-header">
                    <div class="audit-log-time">${log.time}</div>
                    <div class="audit-log-operator">${log.operator}</div>
                </div>
                <div class="audit-log-action">${actionTexts[log.action] || log.action}</div>
                ${log.remark ? `<div class="audit-log-remark">${log.remark}</div>` : ''}
            </div>
        `).join('');
        
        document.getElementById('auditLogs').innerHTML = html;
    }
    
    // 操作方法
    markAsFraud() {
        if (confirm('确认标记该用户为诈骗？')) {
            alert('已标记为诈骗');
            // 这里调用API
        }
    }
    
    markAsClean() {
        if (confirm('确认标记该用户为正常？')) {
            alert('已标记为正常');
        }
    }
    
    markAsWatch() {
        if (confirm('确认继续观察该用户？')) {
            alert('已标记为观察');
        }
    }
    
    freezeAccount() {
        if (confirm('确认冻结该账户？')) {
            alert('账户已冻结');
        }
    }
    
    blacklistAccount() {
        if (confirm('确认拉黑该账户？此操作将永久限制该账户的所有功能。')) {
            alert('账户已拉黑');
            // 这里调用API
        }
    }
    
    // 生成同IP账号数据
    generateSameIPAccounts(count) {
        const accounts = [];
        const statuses = [
            { name: '正常', color: '#10b981' },
            { name: '正常', color: '#10b981' },
            { name: '正常', color: '#10b981' },
            { name: '冻结', color: '#f59e0b' },
            { name: '拉黑', color: '#dc2626' }
        ];
        
        for (let i = 0; i < count; i++) {
            const uid = Math.floor(Math.random() * 90000000) + 10000000;
            const lastLogin = new Date(Date.now() - Math.random() * 24 * 3600000);
            const lastLoginStr = `${String(lastLogin.getMonth() + 1).padStart(2, '0')}-${String(lastLogin.getDate()).padStart(2, '0')} ${String(lastLogin.getHours()).padStart(2, '0')}:${String(lastLogin.getMinutes()).padStart(2, '0')}:${String(lastLogin.getSeconds()).padStart(2, '0')}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // 随机注册日期（1-365天前）
            const registerDate = new Date(Date.now() - (Math.random() * 365 + 1) * 24 * 3600000);
            const registerDateStr = `${registerDate.getFullYear()}-${String(registerDate.getMonth() + 1).padStart(2, '0')}-${String(registerDate.getDate()).padStart(2, '0')} ${String(registerDate.getHours()).padStart(2, '0')}:${String(registerDate.getMinutes()).padStart(2, '0')}:${String(registerDate.getSeconds()).padStart(2, '0')}`;
            
            accounts.push({
                uid: `#tui1_${uid}`,
                status: status.name,
                statusColor: status.color,
                registerDate: registerDateStr,
                lastLogin: lastLoginStr,
                device: ['iPhone 15', 'iPhone 14', 'Xiaomi 14', 'HUAWEI P60', 'OPPO Find X6'][Math.floor(Math.random() * 5)]
            });
        }
        
        return accounts;
    }
    
    // 显示同IP账号弹窗
    showSameIPAccounts() {
        const data = window.sameIPAccountsData;
        if (!data || !data.accounts || data.accounts.length === 0) {
            alert('暂无同IP账号');
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'sameIPModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white; border-radius: 12px; width: 90%; max-width: 500px;
            max-height: 80vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                <div>
                    <h3 style="margin: 0; font-size: 15px; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-users" style="color: #3b82f6;"></i>
                        同IP账号列表
                    </h3>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">IP: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600;">${data.ip}</span> · 共 ${data.accounts.length} 个账号</p>
                </div>
                <button onclick="document.getElementById('sameIPModal').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #94a3b8; line-height: 1;">&times;</button>
            </div>
            <div style="padding: 12px 20px; overflow-y: auto; max-height: calc(80vh - 70px);">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 10px 8px; text-align: left; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">账号ID</th>
                            <th style="padding: 10px 8px; text-align: center; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">状态</th>
                            <th style="padding: 10px 8px; text-align: center; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">注册时间</th>
                            <th style="padding: 10px 8px; text-align: center; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">最后上线</th>
                            <th style="padding: 10px 8px; text-align: right; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">设备</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.accounts.map((acc, idx) => `
                            <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background: #fafafa;' : ''}">
                                <td style="padding: 10px 8px;">
                                    <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${acc.uid}</a>
                                </td>
                                <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
                                    <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: ${acc.statusColor}20; color: ${acc.statusColor}; white-space: nowrap;">${acc.status}</span>
                                </td>
                                <td style="padding: 10px 8px; text-align: center; color: #64748b; font-size: 12px;">${acc.registerDate}</td>
                                <td style="padding: 10px 8px; text-align: center; color: #64748b; font-size: 12px;">${acc.lastLogin}</td>
                                <td style="padding: 10px 8px; text-align: right; color: #94a3b8; font-size: 12px;">${acc.device}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // 生成登录地域时间线数据
    generateLoginTimeline(count) {
        const timeline = [];
        const now = new Date();
        const cities = [
            { city: '深圳', ip: '112.25.67.89' },
            { city: '北京', ip: '118.24.53.12' },
            { city: '上海', ip: '101.88.23.45' },
            { city: '广州', ip: '14.23.156.78' },
            { city: '杭州', ip: '115.236.89.12' },
            { city: '成都', ip: '182.148.56.34' },
            { city: '武汉', ip: '59.175.123.45' },
            { city: '西安', ip: '117.36.78.90' }
        ];
        
        for (let i = 0; i < Math.max(count, 3); i++) {
            const hoursAgo = i * (1 + Math.random() * 4);
            const time = new Date(now.getTime() - hoursAgo * 3600000);
            const timeStr = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
            
            const cityInfo = cities[Math.floor(Math.random() * cities.length)];
            const device = ['iPhone 15 Pro', 'iPhone 14', 'Xiaomi 14', 'HUAWEI P60'][Math.floor(Math.random() * 4)];
            
            timeline.push({
                time: timeStr,
                ip: cityInfo.ip,
                city: cityInfo.city,
                device
            });
        }
        
        return timeline;
    }
    
    // 显示登录地域事件轴弹窗
    showLoginTimeline() {
        const data = window.loginGeoData;
        if (!data || !data.timeline || data.timeline.length === 0) {
            alert('暂无登录记录');
            return;
        }
        
        // 创建弹窗
        const modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white; border-radius: 12px; width: 90%; max-width: 420px;
            max-height: 80vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                <div>
                    <h3 style="margin: 0; font-size: 15px; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-map-marker-alt" style="color: #3b82f6;"></i>
                        登录地域事件轴
                    </h3>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">当前: <span style="font-weight: 600; color: #1e40af;">${data.currentCity}</span></p>
                </div>
                <button onclick="document.getElementById('loginModal').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #94a3b8; line-height: 1;">&times;</button>
            </div>
            <div style="padding: 16px 20px; overflow-y: auto; max-height: calc(80vh - 70px);">
                ${data.timeline.map((item, idx) => `
                    <div style="display: flex; gap: 12px; padding-bottom: 16px; ${idx !== data.timeline.length - 1 ? 'border-bottom: 1px solid #f1f5f9; margin-bottom: 16px;' : ''}">
                        <div style="flex-shrink: 0;">
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${idx === 0 ? '#10b981' : '#94a3b8'}; margin-top: 4px; box-shadow: 0 0 0 3px ${idx === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)'};"></div>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;">🕒 ${item.time}</div>
                            <div style="font-size: 14px; color: #1e293b; font-weight: 600; margin-bottom: 4px;">
                                <span style="color: #3b82f6;">${item.city}</span>
                            </div>
                            <div style="font-size: 12px; color: #64748b;">
                                IP: <span style="font-family: 'JetBrains Mono', monospace;">${item.ip}</span>
                            </div>
                            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                                设备: ${item.device}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // 生成指纹变化时间线数据
    generateFingerprintTimeline(changeCount, changedFields) {
        const timeline = [];
        const now = new Date();
        const possibleFieldNames = [
            'PushToken', 'Local IP', 'OS Version', '存储容量', 'Build ID', 
            '系统 Fingerprint', 'CPUABI', '屏幕分辨率', '设备型号', 'MAC地址',
            'IMEI', 'Android ID', '时区设置', '语言设置', 'App版本',
            'GPU信息', '电池状态', 'WiFi SSID', '运营商', 'SIM卡状态'
        ];
        
        for (let i = 0; i < changeCount; i++) {
            // 生成时间，间隔2-8小时
            const hoursAgo = i * (2 + Math.random() * 6);
            const time = new Date(now.getTime() - hoursAgo * 3600000);
            const timeStr = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
            
            // 随机选择1-5个变化字段
            const fieldCount = Math.floor(Math.random() * 5) + 1;
            const shuffled = [...possibleFieldNames].sort(() => 0.5 - Math.random());
            const fields = shuffled.slice(0, fieldCount).map(name => ({ name }));
            
            timeline.push({
                time: timeStr,
                fields
            });
        }
        
        return timeline;
    }
    
    // 显示指纹变化事件轴弹窗
    showFingerprintTimeline() {
        const data = window.fingerprintChangeData;
        if (!data || !data.timeline || data.timeline.length === 0) {
            alert('暂无指纹变化记录');
            return;
        }
        
        // 创建弹窗
        const modal = document.createElement('div');
        modal.id = 'fingerprintModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white; border-radius: 12px; width: 90%; max-width: 420px;
            max-height: 80vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                <div>
                    <h3 style="margin: 0; font-size: 15px; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-fingerprint" style="color: #3b82f6;"></i>
                        指纹变化事件轴
                    </h3>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">当前: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #1e40af;">${data.currentFingerprint}</span></p>
                </div>
                <button onclick="document.getElementById('fingerprintModal').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #94a3b8; line-height: 1;">&times;</button>
            </div>
            <div style="padding: 16px 20px; overflow-y: auto; max-height: calc(80vh - 70px);">
                ${data.timeline.map((item, idx) => `
                    <div style="display: flex; gap: 12px; padding-bottom: 16px; ${idx !== data.timeline.length - 1 ? 'border-bottom: 1px solid #f1f5f9; margin-bottom: 16px;' : ''}">
                        <div style="flex-shrink: 0;">
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${idx === 0 ? '#dc2626' : '#f59e0b'}; margin-top: 4px; box-shadow: 0 0 0 3px ${idx === 0 ? 'rgba(220,38,38,0.2)' : 'rgba(245,158,11,0.2)'};"></div>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;">🕒 ${item.time}</div>
                            <div style="font-size: 14px; color: #1e293b; font-weight: 600; margin-bottom: 6px;">指纹变化（<span style="color: #dc2626;">Δ${item.fields.length}</span> 字段）</div>
                            <div style="font-size: 12px; color: #64748b; line-height: 1.5;">变化字段：<span style="color: #3b82f6;">${item.fields.map(f => f.name).join('、')}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// 全局引用供按钮调用
let userDetailViewer;

// 初始化
const viewer = new UserDetailViewer();
userDetailViewer = viewer;

