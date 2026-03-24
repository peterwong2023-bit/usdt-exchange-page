// 高可用AI风险监控系统 V4 - 完整增强版应用逻辑

// 基础类（从V3复制核心功能）
class RiskMonitoringSystemBase {
    constructor() {
        this.alertPopupVisible = false;
        this.alertsRead = new Set();
        this.newAlertsCount = 0;
    }

    // 基础方法
    showLoading() {
        document.getElementById('loadingOverlay')?.classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay')?.classList.remove('active');
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<strong>${message}</strong>`;
        
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            setTimeout(() => toast.remove(), duration);
        }
        return toast;
    }

    updateAlertCount(count) {
        const badge = document.getElementById('alertBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    toggleAlertPopup() {
        this.alertPopupVisible = !this.alertPopupVisible;
        const popup = document.getElementById('alertPopup');
        if (popup) {
            if (this.alertPopupVisible) {
                popup.classList.add('show');
            } else {
                popup.classList.remove('show');
            }
        }
    }

    hideAlertPopup() {
        this.alertPopupVisible = false;
        const popup = document.getElementById('alertPopup');
        if (popup) popup.classList.remove('show');
    }

    viewUserDetail(userId) {
        this.openAuditDrawer(userId, 'user');
    }

    openAuditDrawer(id, type = 'user') {
        const overlay = document.getElementById('auditDrawerOverlay');
        const drawer = document.getElementById('auditDrawer');
        const iframe = document.getElementById('auditIframe');
        const titleEl = document.querySelector('.drawer-title');
        
        if (overlay && drawer && iframe) {
            if (type === 'user') {
                iframe.src = `user-detail-v6.html?user_id=${id}`;
                if (titleEl) titleEl.innerHTML = '<i class="fas fa-user-shield"></i> 风险用户审核详情';
            } else if (type === 'syndicate') {
                iframe.src = `group-graph.html?group_id=${id}`;
                if (titleEl) titleEl.innerHTML = '<i class="fas fa-project-diagram"></i> 团伙关系穿透分析';
            } else if (type === 'event') {
                iframe.src = `event-detail-readonly.html?event_id=${id}`;
                if (titleEl) titleEl.innerHTML = '<i class="fas fa-list-alt"></i> 风险事件详细日志';
            }
            
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('active');
                drawer.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; // 禁止背景滚动
        }
    }

    closeAuditDrawer() {
        const overlay = document.getElementById('auditDrawerOverlay');
        const drawer = document.getElementById('auditDrawer');
        const iframe = document.getElementById('auditIframe');
        
        if (overlay && drawer) {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
                if (iframe) iframe.src = '';
            }, 300);
            document.body.style.overflow = ''; // 恢复滚动
        }
    }

    viewSyndicate(id) {
        this.openAuditDrawer(id, 'syndicate');
    }

    switchView(viewName) {
        // 实际的视图切换逻辑
        this.switchViewInternal(viewName);
    }
}

// V4类继承基础类
class RiskMonitoringSystemV4 extends RiskMonitoringSystemBase {
    constructor() {
        super();
        this.currentView = 'overview';
        this.selectedUsers = new Set();
        this.realtimeFeedPaused = false;
        this.itemsPerPage = 50;
        this.currentPage = 1;
        this.currentGraphDepth = 1;
        this.currentRelationType = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.bindV4Events();
        this.initV4Features();
        // 预加载用户列表数据
        setTimeout(() => {
            this.initTimeRange();
            this.loadUsersView();
        }, 500);
    }

    bindEvents() {
        // 视图切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewName = e.currentTarget.dataset.view;
                this.switchViewInternal(viewName);
            });
        });
    }

    switchViewInternal(viewName) {
        // 更新横向标签状态 (旧版兼容)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });
        
        // 更新侧边栏菜单状态 (新版)
        document.querySelectorAll('.side-menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // 切换视图内容
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewName;

        // 加载对应视图数据
        if (viewName === 'users') {
            this.loadUsersView();
        } else if (viewName === 'events') {
            this.loadEventsView();
        } else if (viewName === 'relationships') {
            // 检查是否有外部跳转参数
            const urlParams = new URLSearchParams(window.location.search);
            const anchor = urlParams.get('anchor');
            if (anchor) {
                const input = document.getElementById('relationshipSearchInput');
                if (input) input.value = anchor;
                this.executeRelationshipSearch();
            }
        }
    }

    // 加载用户风险列表视图 - 工单模式
    loadUsersView() {
        const container = document.getElementById('userCardsList');
        if (!container) return;

        if (!this.currentQueueTab) this.currentQueueTab = 'unclaimed';

        const priorityFilter = document.getElementById('filterPriority')?.value;
        const levelFilter = document.getElementById('filterRiskLevel')?.value;
        const typeFilter = document.getElementById('filterRiskType')?.value;
        const searchFilter = document.getElementById('filterUserSearch')?.value.toLowerCase();

        let baseFiltered = riskUsersList.filter(user => {
            if (priorityFilter === 'urgent' && user.risk_score < 85) return false;
            if (priorityFilter === 'normal' && user.risk_score >= 85) return false;
            if (levelFilter === 'high' && user.risk_score < 80) return false;
            if (levelFilter === 'medium' && (user.risk_score < 60 || user.risk_score >= 80)) return false;
            if (levelFilter === 'low' && user.risk_score >= 60) return false;
            if (typeFilter) {
                const typeMap = { 'security': ['安全','设备','IP','登录'], 'trade': ['交易','买单','卖单','取消'], 'syndicate': ['团伙','关联','共享'], 'payment': ['支付','收款','QR','卡'], 'dispute': ['投诉','举报','纠纷'] };
                const keywords = typeMap[typeFilter] || [];
                if (!user.main_risks.some(risk => keywords.some(k => risk.includes(k)))) return false;
            }
            if (searchFilter) {
                const searchFields = [user.user_id.toLowerCase(), (user.last_ip||'').toLowerCase()];
                if (!searchFields.some(f => f.includes(searchFilter))) return false;
            }
            const dateStart = document.getElementById('filterDateStart')?.value;
            const dateEnd = document.getElementById('filterDateEnd')?.value;
            if (dateStart && user.last_login_at && user.last_login_at.split(' ')[0] < dateStart) return false;
            if (dateEnd && user.last_login_at && user.last_login_at.split(' ')[0] > dateEnd) return false;
            return true;
        });

        // Tab 分组
        const unclaimedList = baseFiltered.filter(u => u.claim_status === 'unclaimed');
        const mineList = baseFiltered.filter(u => u.claim_status === 'processing' && u.claimed_by === CURRENT_USER);
        const pendingAuditList = baseFiltered.filter(u => u.claim_status === 'pending_audit');
        const doneList = baseFiltered.filter(u => u.claim_status === 'audited');

        const setCount = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setCount('tabUnclaimedCount', unclaimedList.length);
        setCount('tabMineCount', mineList.length);
        setCount('tabJudgedCount', pendingAuditList.length);
        setCount('tabDoneCount', doneList.length);

        let filteredList = baseFiltered;
        if (this.currentQueueTab === 'unclaimed') filteredList = unclaimedList;
        else if (this.currentQueueTab === 'mine') filteredList = mineList;
        else if (this.currentQueueTab === 'judged') filteredList = pendingAuditList;
        else if (this.currentQueueTab === 'done') filteredList = doneList;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const displayList = filteredList.slice(start, end);

        const judgmentLabels = {
            fraud: '⛔ 诈骗', normal: '✅ 正常', observe: '👁 观察', freeze: '🔒 冻结', block: '🚫 拉黑'
        };

        container.innerHTML = displayList.map(user => {
            const scoreClass = user.risk_score >= 80 ? 'critical' : user.risk_score >= 60 ? 'high' : 'medium';
            const cs = user.claim_status || 'unclaimed';
            const isMine = cs === 'processing' && user.claimed_by === CURRENT_USER;
            const isOthers = cs === 'processing' && user.claimed_by !== CURRENT_USER;
            const isDone = cs === 'audited';
            const dimClass = (isDone || isOthers) ? 'user-card-handled' : '';

            let riskBadges = (user.main_risks || []).map((tag, i) => {
                return `<span class="risk-user-badge ${i === 0 ? 'primary' : 'secondary'}">${tag}</span>`;
            }).join('');

            // 工单状态标签
            let statusTag = '';
            if (cs === 'processing') {
                statusTag = `<span class="handled-status-tag" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-user-cog"></i> ${user.claimed_by} 处理中</span>`;
            } else if (cs === 'pending_audit') {
                const jl = judgmentLabels[user.judgment] || '已判定';
                statusTag = `<span class="handled-status-tag" style="background:#fff7ed;color:#ea580c;">${jl} · 待稽查</span>`;
            } else if (cs === 'audited') {
                const jl = judgmentLabels[user.judgment] || '已判定';
                const ar = user.audit_result === 'approved' ? '✅ 稽查通过' : '❌ 已驳回';
                statusTag = `<span class="handled-status-tag normal" style="background:#d1fae5;color:#065f46;">${jl} · ${ar}</span>`;
            }

            // 操作人信息
            let metaInfo = '';
            if (cs === 'processing' && user.claimed_at) {
                metaInfo = `<span class="handled-meta"><i class="fas fa-clock"></i> 接单 ${formatTime(user.claimed_at)}</span>`;
            } else if (cs === 'pending_audit' && user.judged_by) {
                metaInfo = `<span class="handled-meta"><i class="fas fa-gavel"></i> ${user.judged_by} · ${formatTime(user.judged_at)}</span>`;
            } else if (cs === 'audited' && user.audited_by) {
                metaInfo = `<span class="handled-meta"><i class="fas fa-clipboard-check"></i> ${user.audited_by} · ${formatTime(user.audited_at)}</span>`;
            }

            // 操作按钮 — 流程：接单 → 审核+解单 → 判定后自动进待稽查 → 稽查
            let actionBtns = '';
            if (cs === 'unclaimed') {
                actionBtns = `<button class="risk-action-btn review" style="background:#3b82f6;color:white;border-color:#3b82f6;" onclick="event.stopPropagation();app.claimUser('${user.user_id}')"><i class="fas fa-hand-paper"></i> 接单</button>`;
            } else if (isMine) {
                actionBtns = `
                    <button class="risk-action-btn review" onclick="event.stopPropagation();app.viewUserDetail('${user.user_id}')"><i class="fas fa-search"></i> 审核</button>
                    <button class="risk-action-btn" style="color:#94a3b8;border-color:#cbd5e1;" onclick="event.stopPropagation();app.releaseUser('${user.user_id}')"><i class="fas fa-undo"></i> 解单</button>`;
            } else if (isOthers) {
                actionBtns = `<button class="risk-action-btn" disabled style="opacity:0.5;cursor:not-allowed;"><i class="fas fa-lock"></i> 处理中</button>`;
            } else if (cs === 'pending_audit') {
                actionBtns = `<button class="risk-action-btn review" style="background:#f59e0b;color:white;border-color:#f59e0b;" onclick="event.stopPropagation();app.showAuditModal('${user.user_id}')"><i class="fas fa-clipboard-check"></i> 稽查</button>`;
            } else if (cs === 'audited') {
                actionBtns = `<button class="risk-action-btn" onclick="event.stopPropagation();app.viewUserDetail('${user.user_id}')"><i class="fas fa-eye"></i> 查看</button>`;
            }

            const region = user.city || '未知';
            const ip = user.last_ip || '未知';
            const time = user.last_login_at || '';

            return `
                <div class="risk-item-user ${scoreClass} ${dimClass}" data-type="user" data-id="${user.user_id}">
                    <img src="${user.avatar || '../bob.png'}" alt="${user.user_id}" class="risk-user-avatar">
                    <div class="risk-user-info">
                        <span class="risk-user-id">${user.user_id}</span>
                        ${riskBadges}
                        ${statusTag}
                        ${metaInfo}
                        <div class="risk-user-meta">
                            <span><i class="fas fa-map-marker-alt"></i>${region}</span>
                            <span><i class="fas fa-network-wired"></i>${ip}</span>
                            <span><i class="fas fa-clock"></i>${formatTime(time)}</span>
                        </div>
                    </div>
                    <div class="risk-user-score ${scoreClass}">${user.risk_score}</div>
                    <div class="risk-user-actions">${actionBtns}</div>
                </div>`;
        }).join('');

        // KPI
        const criticalCount = unclaimedList.filter(u => u.risk_score >= 80).length;
        const highCount = unclaimedList.filter(u => u.risk_score >= 60 && u.risk_score < 80).length;
        const observeCount = unclaimedList.filter(u => u.risk_score < 60).length;
        setCount('queueTotalCount', riskUsersList.length);
        setCount('criticalCount', criticalCount);
        setCount('highCount', highCount);
        setCount('observeCount', observeCount);
        setCount('userTotalCount', filteredList.length);
        setCount('userStartRecord', filteredList.length > 0 ? start + 1 : 0);
        setCount('userEndRecord', Math.min(end, filteredList.length));
        setCount('userTotalRecords', filteredList.length);
        const userCurrentPageEl = document.getElementById('userCurrentPage');
        if (userCurrentPageEl) userCurrentPageEl.textContent = this.currentPage;
    }

    // ===== 工单操作 =====
    claimUser(userId) {
        if (confirm(`确认接单用户 ${userId}？\n接单后该工单将锁定给您处理。`)) {
            const user = riskUsersList.find(u => u.user_id === userId);
            if (user) {
                user.claim_status = 'processing';
                user.claimed_by = CURRENT_USER;
                user.claimed_at = new Date().toISOString().replace('T',' ').slice(0,19);
                this.showToast(`已成功接单 ${userId}`, 'success');
                this.loadRiskMonitorPanel();
                this.loadUsersView();
            }
        }
    }

    releaseUser(userId) {
        if (confirm(`确认解单用户 ${userId}？\n释放后其他运营可接单处理。`)) {
            const user = riskUsersList.find(u => u.user_id === userId);
            if (user) {
                user.claim_status = 'unclaimed';
                user.claimed_by = null;
                user.claimed_at = null;
                this.showToast(`已解单 ${userId}，工单已释放回待接单`, 'info');
                this.loadRiskMonitorPanel();
                this.loadUsersView();
            }
        }
    }

    showAuditModal(userId) {
        const user = riskUsersList.find(u => u.user_id === userId);
        if (!user) return;

        const judgmentLabels = { fraud:'⛔ 已标记诈骗', normal:'✅ 已标记正常', observe:'👁 观察中', freeze:'🔒 已冻结', block:'🚫 已拉黑' };
        const jl = judgmentLabels[user.judgment] || '未知';

        let existing = document.getElementById('auditModalOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'auditModalOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(4px);';
        overlay.innerHTML = `
            <div style="background:white;border-radius:16px;width:460px;max-width:90%;box-shadow:0 25px 50px rgba(0,0,0,0.25);overflow:hidden;animation:modalSlideIn 0.25s ease-out;">
                <div style="padding:20px 24px 16px;border-bottom:1px solid #f1f5f9;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:42px;height:42px;border-radius:12px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="fas fa-clipboard-check" style="color:#f59e0b;"></i></div>
                        <div>
                            <div style="font-size:17px;font-weight:800;color:#0f172a;">稽查审核</div>
                            <div style="font-size:12px;color:#94a3b8;margin-top:2px;">用户 ${user.user_id}</div>
                        </div>
                    </div>
                </div>
                <div style="padding:16px 24px;">
                    <div style="padding:14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:16px;">
                        <div style="font-size:12px;color:#64748b;font-weight:700;margin-bottom:8px;">判定结果</div>
                        <div style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:6px;">${jl}</div>
                        <div style="font-size:13px;color:#64748b;">判定人：<strong>${user.judged_by}</strong> · ${formatTime(user.judged_at)}</div>
                        <div style="font-size:13px;color:#475569;margin-top:6px;padding:8px;background:white;border-radius:6px;border:1px solid #e2e8f0;">"${user.judgment_reason || '无'}"</div>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="font-size:12px;font-weight:700;color:#64748b;display:block;margin-bottom:6px;">稽查意见</label>
                        <textarea id="auditComment" placeholder="请输入稽查意见..." style="width:100%;height:68px;border:1.5px solid #e2e8f0;border-radius:8px;padding:10px 12px;font-size:13px;color:#334155;resize:none;outline:none;font-family:inherit;box-sizing:border-box;"></textarea>
                    </div>
                </div>
                <div style="padding:12px 24px 20px;display:flex;justify-content:flex-end;gap:10px;">
                    <button onclick="document.getElementById('auditModalOverlay').remove()" style="padding:9px 20px;background:#f1f5f9;border:1.5px solid #e2e8f0;border-radius:8px;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;">取消</button>
                    <button onclick="app.submitAudit('${user.user_id}','rejected')" style="padding:9px 20px;background:white;border:2px solid #dc2626;border-radius:8px;color:#dc2626;font-size:13px;font-weight:700;cursor:pointer;"><i class="fas fa-times"></i> 驳回</button>
                    <button onclick="app.submitAudit('${user.user_id}','approved')" style="padding:9px 20px;background:#10b981;border:none;border-radius:8px;color:white;font-size:13px;font-weight:700;cursor:pointer;"><i class="fas fa-check"></i> 通过</button>
                </div>
            </div>`;
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    }

    submitAudit(userId, result) {
        const comment = document.getElementById('auditComment')?.value.trim();
        if (!comment) {
            document.getElementById('auditComment').style.borderColor = '#dc2626';
            document.getElementById('auditComment').placeholder = '⚠️ 必须填写稽查意见';
            document.getElementById('auditComment').focus();
            return;
        }
        const user = riskUsersList.find(u => u.user_id === userId);
        if (user) {
            if (result === 'approved') {
                user.claim_status = 'audited';
                user.audited_by = CURRENT_USER;
                user.audited_at = new Date().toISOString().replace('T',' ').slice(0,19);
                user.audit_result = 'approved';
                user.audit_comment = comment;
                this.showToast(`稽查通过 ${userId}`, 'success');
            } else {
                user.claim_status = 'unclaimed';
                user.claimed_by = null;
                user.claimed_at = null;
                user.judgment = null;
                user.judged_by = null;
                user.judged_at = null;
                user.judgment_reason = null;
                user.audit_result = 'rejected';
                user.audit_comment = comment;
                this.showToast(`稽查驳回 ${userId}，已退回待接单`, 'warning');
            }
        }
        document.getElementById('auditModalOverlay')?.remove();
        this.loadUsersView();
        this.loadRiskMonitorPanel();
    }

    // 切换队列 Tab
    switchQueueTab(tab) {
        this.currentQueueTab = tab;
        this.currentPage = 1;

        document.querySelectorAll('.queue-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        this.loadUsersView();
    }

    handleItemsPerPageChange(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.loadUsersView();
    }

    changePage(delta) {
        const totalPages = Math.ceil(riskUsersList.length / this.itemsPerPage);
        const newPage = this.currentPage + delta;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.loadUsersView();
            // 平滑滚动到顶部
            document.getElementById('usersView')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 批量选择管理
    updateBatchSelection() {
        const checkboxes = document.querySelectorAll('.user-checkbox:checked');
        const count = checkboxes.length;
        const bar = document.getElementById('batchActionBar');
        const countEl = document.getElementById('selectedCount');
        
        if (bar && countEl) {
            bar.style.display = count > 0 ? 'flex' : 'none';
            countEl.textContent = count;
        }
    }

    // 快捷操作方法
    markUserNormal(userId) {
        this.showToast(`用户 ${userId} 已标记为正常`, 'success');
        // TODO: 调用后端 API
    }

    freezeUser(userId) {
        this.showToast(`用户 ${userId} 账户已冻结`, 'warning');
        // TODO: 调用后端 API
    }

    markUserFraud(userId) {
        this.showToast(`用户 ${userId} 已标记为诈骗`, 'danger');
        // TODO: 调用后端 API
    }

    initV4Features() {
        this.loadKPIData();
        this.loadAIModelHealth();
        this.loadSystemHealth();
        this.loadGeoHeatmap();
        this.loadRiskMonitorPanel(); // 使用合并的风险监控面板
        this.loadRealtimeFeed();
        this.loadAlertPopup();
        
        // 延迟加载图表，确保echarts已加载且容器已渲染
        setTimeout(() => {
            if (typeof echarts !== 'undefined') {
                this.initRiskTypeTrendChart();
                this.initRiskDistributionChart();
            } else {
                console.error('ECharts未加载');
            }
        }, 500);
    }

    loadAlertPopup() {
        const container = document.getElementById('alertPopupBody');
        if (!container) return;

        if (!urgentAlerts || urgentAlerts.length === 0) {
            container.innerHTML = `
                <div class="alert-empty">
                    <i class="fas fa-check-circle"></i>
                    <p>暂无告警信息</p>
                </div>
            `;
            return;
        }

        const unreadAlerts = urgentAlerts.filter(alert => !this.alertsRead.has(alert.id));
        this.updateAlertCount(unreadAlerts.length);

        container.innerHTML = urgentAlerts.map(alert => `
            <div class="popup-alert-item ${alert.level}" data-alert-id="${alert.id}">
                <div class="popup-alert-icon">
                    <i class="fas ${alert.level === 'critical' ? 'fa-fire' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div class="popup-alert-content">
                    <div class="popup-alert-title">
                        <span class="popup-alert-level ${alert.level}">${getRiskLevelText(alert.level)}</span>
                        ${alert.title}
                    </div>
                    <div class="popup-alert-desc">${alert.description}</div>
                    <div class="popup-alert-meta">
                        <span><i class="fas fa-user"></i> ${alert.user_id}</span>
                        <span><i class="fas fa-clock"></i> ${alert.time}</span>
                    </div>
                </div>
                <div class="popup-alert-actions">
                    <button class="btn-alert-action success" title="处理">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    markAllAlertsRead() {
        if (urgentAlerts) {
            urgentAlerts.forEach(alert => this.alertsRead.add(alert.id));
        }
        this.loadAlertPopup();
        this.showToast('所有告警已标记为已读', 'success');
    }

    bindV4Events() {
        // 快速搜索
        document.getElementById('executeSearch')?.addEventListener('click', () => this.executeQuickSearch());
        document.getElementById('quickSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.executeQuickSearch();
        });

        // 实时告警流暂停/继续
        document.getElementById('pauseRealtimeFeed')?.addEventListener('click', (e) => {
            this.toggleRealtimeFeed(e.target);
        });

        // 告警铃铛
        document.getElementById('alertBellBtn')?.addEventListener('click', () => this.toggleAlertPopup());
        document.getElementById('closeAlertPopup')?.addEventListener('click', () => this.hideAlertPopup());
        document.getElementById('markAllReadBtn')?.addEventListener('click', () => this.markAllAlertsRead());
        
        // 刷新按钮
        document.getElementById('refreshAll')?.addEventListener('click', () => this.refreshAllData());

        // 用户列表过滤
        document.getElementById('applyUserFilters')?.addEventListener('click', () => this.applyUserFilters());
        document.getElementById('resetUserFilters')?.addEventListener('click', () => this.resetUserFilters());
        document.getElementById('refreshUserList')?.addEventListener('click', () => this.loadUsersView());
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportUsers());
    }

    applyUserFilters() {
        this.currentPage = 1; // 筛选时重置页码
        this.showToast('正在应用过滤条件...', 'info');
        this.loadUsersView();
    }

    resetUserFilters() {
        this.initTimeRange();
        const prioritySelect = document.getElementById('filterPriority');
        const levelSelect = document.getElementById('filterRiskLevel');
        const typeSelect = document.getElementById('filterRiskType');
        const searchInput = document.getElementById('filterUserSearch');
        
        if (prioritySelect) prioritySelect.value = '';
        if (levelSelect) levelSelect.value = '';
        if (typeSelect) typeSelect.value = '';
        if (searchInput) searchInput.value = '';
        
        this.currentPage = 1;
        this.loadUsersView();
    }

    exportUsers() {
        this.showToast('正在导出用户数据...', 'info');
    }

    refreshAllData() {
        this.showLoading();
        setTimeout(() => {
            this.loadOverviewData();
            this.hideLoading();
            this.showToast('数据已刷新', 'success');
        }, 1000);
    }

    // ==================== KPI数据加载 ====================
    loadKPIData() {
        // 今日风险事件
        const totalEventsEl = document.getElementById('totalRiskEventsToday');
        if (totalEventsEl) {
            this.animateNumber(totalEventsEl, kpiSummary.total_risk_events_today);
        }

        // 高危事件
        const highRiskEl = document.getElementById('highRiskEvents');
        if (highRiskEl) {
            this.animateNumber(highRiskEl, kpiSummary.high_risk_events);
        }

        // 新增黑名单用户
        const blacklistEl = document.getElementById('newBlacklistedUsers');
        if (blacklistEl) {
            this.animateNumber(blacklistEl, kpiSummary.new_blacklisted_users);
        }

        // 待处理事件
        const pendingEl = document.getElementById('pendingQueue');
        if (pendingEl) {
            this.animateNumber(pendingEl, pendingQueue.pending_risk_events);
        }

        // 今日已处理
        const resolvedEl = document.getElementById('resolvedToday');
        if (resolvedEl) {
            this.animateNumber(resolvedEl, kpiSummary.resolved_today);
        }
    }

    // 数字动画效果
    animateNumber(element, targetValue, duration = 1000) {
        const startValue = 0;
        const startTime = Date.now();
        
        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = targetValue;
            }
        };
        
        updateNumber();
    }

    // ==================== AI模型健康监控 ====================
    loadAIModelHealth() {
        const container = document.querySelector('.ai-metrics');
        if (!container) return;

        // 更新准确率进度条
        const hitRateBar = container.querySelector('.metric-item:nth-child(1) .progress-fill');
        if (hitRateBar) {
            setTimeout(() => {
                hitRateBar.style.width = `${aiModelHealth.ai_hit_rate}%`;
            }, 300);
        }

        // 更新误报率进度条
        const falsePositiveBar = container.querySelector('.metric-item:nth-child(2) .progress-fill');
        if (falsePositiveBar) {
            setTimeout(() => {
                falsePositiveBar.style.width = `${aiModelHealth.false_positive_rate}%`;
            }, 400);
        }

        // 更新人工干预次数
        const manualOverrideEl = container.querySelector('.metric-item:nth-child(3) .metric-number');
        if (manualOverrideEl) {
            this.animateNumber(manualOverrideEl, aiModelHealth.manual_override_count);
        }
    }

    // ==================== 系统健康监控 ====================
    loadSystemHealth() {
        // 系统健康数据已在HTML中静态展示
        // 这里可以添加实时更新逻辑
        console.log('System Health:', systemHealth);
    }

    // ==================== 地区风险热力图（增强版） ====================
    loadGeoHeatmap() {
        const container = document.getElementById('geoHeatmapList');
        if (!container) return;

        container.innerHTML = geoRiskHeatmap.regions.map((region) => {
            const riskColor = region.risk_score >= 200 ? '#dc2626' : region.risk_score >= 100 ? '#f59e0b' : '#10b981';
            const trendIcon = region.change_direction === 'up' ? 'fa-arrow-up' : region.change_direction === 'down' ? 'fa-arrow-down' : 'fa-minus';
            const trendColor = region.change_direction === 'up' ? '#dc2626' : region.change_direction === 'down' ? '#10b981' : '#64748b';
            
            return `
                <div class="geo-item-enhanced" onclick="app.viewRegionDetail('${region.city}')">
                    <div class="geo-rank-badge" style="background: ${region.rank <= 3 ? riskColor : '#e2e8f0'}; color: ${region.rank <= 3 ? 'white' : '#64748b'}">${region.rank}</div>
                    <div class="geo-content">
                        <div class="geo-header">
                            <span class="geo-city-name">${region.city}, ${region.country}</span>
                            <span class="geo-stats">
                                <span class="stat-item danger">风险 ${region.risk_users}</span>
                                <span class="stat-divider">|</span>
                                <span class="stat-item critical">高危 ${region.high_risk_users}</span>
                            </span>
                        </div>
                        <div class="geo-risk-tags">
                            ${region.tags.map(tag => `<span class="region-risk-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="geo-score-row">
                            <div class="score-bar-horizontal">
                                <div class="score-fill-horizontal" style="width: ${(region.risk_score / 250) * 100}%; background: ${riskColor}"></div>
                            </div>
                            <span class="score-value" style="color: ${riskColor}">${region.risk_score}</span>
                            <span class="geo-trend" style="color: ${trendColor}">
                                <i class="fas ${trendIcon}"></i> ${Math.abs(region.change_rate)}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    viewRegionDetail(city) {
        this.showToast(`查看 ${city} 的详细风险数据`, 'info');
    }

    // ==================== 风险监控面板（合并版）====================
    loadRiskMonitorPanel() {
        const container = document.getElementById('riskMonitorList');
        if (!container) return;

        const allItems = [];
        let userCount = 0;

        // 首页显示：待接单 + 我正在处理的
        if (typeof riskUsersList !== 'undefined') {
            riskUsersList.filter(u => u.claim_status === 'unclaimed' || (u.claim_status === 'processing' && u.claimed_by === CURRENT_USER))
                .sort((a, b) => {
                    if (a.claim_status === 'processing' && b.claim_status !== 'processing') return -1;
                    if (b.claim_status === 'processing' && a.claim_status !== 'processing') return 1;
                    return b.risk_score - a.risk_score;
                })
                .forEach(user => {
                    allItems.push({ type: 'user', data: user, score: user.risk_score, timestamp: user.last_login_at });
                });
            userCount = allItems.filter(i => i.type === 'user').length;
        }

        let syndicateCount = 0;
        if (typeof syndicateHotspotRanking !== 'undefined') {
            syndicateHotspotRanking.forEach(group => {
                allItems.push({ type: 'syndicate', data: group, score: group.risk_score, timestamp: group.updated_at });
            });
            syndicateCount = allItems.filter(i => i.type === 'syndicate').length;
        }

        allItems.sort((a, b) => b.score - a.score);
        this.allRiskItems = allItems;
        this.currentDisplayLimit = 15;

        this.renderRiskItems();

        document.getElementById('totalCount').textContent = allItems.length;
        document.getElementById('usersCount').textContent = userCount;
        document.getElementById('syndicatesCount').textContent = syndicateCount;

        this.filterRiskPanel('users');

        // 更新首页工单概览计数
        if (typeof riskUsersList !== 'undefined') {
            const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setEl('overviewUnclaimed', riskUsersList.filter(u => u.claim_status === 'unclaimed').length);
            setEl('overviewMine', riskUsersList.filter(u => u.claim_status === 'processing' && u.claimed_by === CURRENT_USER).length);
            setEl('overviewJudged', riskUsersList.filter(u => u.claim_status === 'pending_audit').length);
            setEl('overviewDone', riskUsersList.filter(u => u.claim_status === 'audited').length);
        }
    }
    
    // 渲染风险项目（支持分页）
    renderRiskItems(showAll = false) {
        const container = document.getElementById('riskMonitorList');
        if (!container || !this.allRiskItems) return;
        
        const items = showAll ? this.allRiskItems : this.allRiskItems.slice(0, this.currentDisplayLimit);
        
        const html = items.map(item => {
            if (item.type === 'user') {
                return this.renderUserCard(item.data);
            } else {
                return this.renderSyndicateCard(item.data);
            }
        }).join('');
        
        // 添加"查看全部"按钮 -> 跳转到风险处理队列
        const showMoreBtn = !showAll && this.allRiskItems.length > this.currentDisplayLimit ? `
            <div class="risk-panel-footer">
                <button class="btn-view-all" onclick="app.switchView('users')">
                    <i class="fas fa-external-link-alt"></i>
                    查看全部 (跳转到风险处理队列)
                </button>
            </div>
        ` : '';
        
        container.innerHTML = html + showMoreBtn;
    }
    
    // 显示所有风险项目
    showAllRiskItems() {
        this.renderRiskItems(true);
        // 重新应用过滤
        const activeTab = document.querySelector('.panel-tab-btn.active');
        if (activeTab) {
            this.filterRiskPanel(activeTab.dataset.tab);
        }
    }
    
    // 渲染用户卡片 - 首页概览版
    renderUserCard(user) {
        const scoreClass = user.risk_score >= 80 ? 'critical' : user.risk_score >= 60 ? 'high' : 'medium';
        const cs = user.claim_status || 'unclaimed';
        const isMine = cs === 'processing' && user.claimed_by === CURRENT_USER;

        let riskBadges = '';
        if (user.main_risks && user.main_risks.length > 0) {
            riskBadges = user.main_risks.map((tag, i) => `<span class="risk-user-badge ${i === 0 ? 'primary' : 'secondary'}">${tag}</span>`).join('');
        } else if (user.tags && user.tags.length > 0) {
            riskBadges = user.tags.map((tag, i) => `<span class="risk-user-badge ${i === 0 ? 'primary' : 'secondary'}">${tag}</span>`).join('');
        } else if (user.reason) {
            riskBadges = `<span class="risk-user-badge primary">${user.reason}</span>`;
        }

        let statusTag = '';
        if (isMine) {
            statusTag = `<span class="handled-status-tag" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-user-cog"></i> 我的工单</span>`;
        }

        let actionBtns = '';
        if (cs === 'unclaimed') {
            actionBtns = `<button class="risk-action-btn review" style="background:#3b82f6;color:white;border-color:#3b82f6;" onclick="event.stopPropagation();app.claimUser('${user.user_id}')"><i class="fas fa-hand-paper"></i> 接单</button>`;
        } else if (isMine) {
            actionBtns = `
                <button class="risk-action-btn review" onclick="event.stopPropagation();app.viewUserDetail('${user.user_id}')"><i class="fas fa-search"></i> 审核</button>
                <button class="risk-action-btn" style="color:#94a3b8;border-color:#cbd5e1;" onclick="event.stopPropagation();app.releaseUser('${user.user_id}')"><i class="fas fa-undo"></i> 解单</button>`;
        }

        const region = user.region || user.city || user.location || '未知';
        const ip = user.ip || user.last_ip || user.login_ip || '未知';
        const time = user.created_at || user.last_login_at || '';

        return `
            <div class="risk-item-user ${scoreClass}" data-type="user" data-id="${user.user_id}">
                <img src="${user.avatar || '../bob.png'}" alt="${user.user_id}" class="risk-user-avatar">
                <div class="risk-user-info">
                    <span class="risk-user-id">${user.user_id}</span>
                    ${riskBadges}
                    ${statusTag}
                    <div class="risk-user-meta">
                        <span><i class="fas fa-map-marker-alt"></i>${region}</span>
                        <span><i class="fas fa-network-wired"></i>${ip}</span>
                        <span><i class="fas fa-clock"></i>${formatTime(time)}</span>
                    </div>
                </div>
                <div class="risk-user-score ${scoreClass}">${user.risk_score}</div>
                <div class="risk-user-actions">${actionBtns}</div>
            </div>`;
    }
    
    // 渲染团伙卡片 - 紧凑版
    renderSyndicateCard(group) {
        const scoreClass = group.risk_score >= 80 ? 'critical' : group.risk_score >= 60 ? 'high' : 'medium';
        const rankClass = group.rank <= 3 ? 'top' : '';
        const statusClass = group.status === 'active' ? 'active' : 'monitoring';
        
        return `
            <div class="risk-item-syndicate" data-type="syndicate" data-id="${group.group_id}" onclick="app.viewSyndicate('${group.group_id}')">
                <!-- 团伙图标头像 -->
                <div class="risk-syndicate-avatar ${rankClass}">
                    #${group.rank}
                </div>
                
                <!-- 单行紧凑信息 -->
                <div class="risk-syndicate-info">
                    <span class="risk-syndicate-id">${group.group_id}</span>
                    <span class="risk-syndicate-status ${statusClass}">
                        ${getSyndicateStatusText(group.status)}
                    </span>
                    <span class="risk-syndicate-reason">${group.main_reason || '异常行为'}</span>
                    
                    <div class="risk-syndicate-stats">
                        <div class="risk-syndicate-stat">
                            <i class="fas fa-users"></i>
                            <span>${group.member_count}人</span>
                        </div>
                        <div class="risk-syndicate-stat">
                            <i class="fas fa-dollar-sign"></i>
                            <span>${formatCurrency(group.total_amount)}</span>
                        </div>
                        <div class="risk-syndicate-stat">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${group.active_days}天</span>
                        </div>
                    </div>
                    
                    <div class="risk-syndicate-resources">
                        ${group.core_device_fp ? `
                            <span class="risk-syndicate-chip">
                                <i class="fas fa-mobile"></i>
                                ${group.core_device_fp}
                            </span>
                        ` : ''}
                        ${group.core_ip ? `
                            <span class="risk-syndicate-chip">
                                <i class="fas fa-globe"></i>
                                ${group.core_ip}
                            </span>
                        ` : ''}
                        ${group.core_payment_id ? `
                            <span class="risk-syndicate-chip">
                                <i class="fas fa-qrcode"></i>
                                ${group.core_payment_id}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="risk-syndicate-score ${scoreClass}">
                    ${group.risk_score}
                </div>
            </div>
        `;
    }
    
    // 过滤风险面板
    filterRiskPanel(type) {
        const items = document.querySelectorAll('.risk-item-user, .risk-item-syndicate');
        const tabs = document.querySelectorAll('.panel-tab-btn');
        
        // 更新标签状态
        tabs.forEach(tab => {
            if (tab.dataset.tab === type) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 过滤显示
        items.forEach(item => {
            if (type === 'all') {
                item.classList.remove('hidden');
            } else if (type === 'users') {
                if (item.classList.contains('risk-item-user')) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            } else if (type === 'syndicates') {
                if (item.classList.contains('risk-item-syndicate')) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    }
    
    // ==================== 团伙热点榜 - 重新设计版本（保留兼容）====================
    loadSyndicateHotspot() {
        const container = document.getElementById('syndicateHotspotList');
        if (!container) {
            console.log('团伙容器未找到');
            return;
        }

        console.log('团伙数量:', syndicateHotspotRanking.length);
        
        const html = syndicateHotspotRanking.map(group => {
            // 确定风险等级
            const scoreClass = group.risk_score >= 90 ? 'score-critical' : 
                             group.risk_score >= 80 ? 'score-high' : 'score-medium';
            
            // 确定排名样式
            const rankClass = group.rank <= 3 ? 'top-rank' : '';
            
            // 确定状态样式
            const statusClass = group.status === 'active' ? 'active' : 'monitoring';
            
            return `
                <div class="syndicate-item-card" onclick="app.viewSyndicate('${group.group_id}')">
                    <!-- 左侧：排名徽章 -->
                    <div class="syndicate-rank-badge ${rankClass}">
                    ${group.rank}
                </div>
                    
                    <!-- 中间：信息区域 -->
                    <div class="syndicate-info-section">
                        <!-- 第一行：ID + 状态 + 原因 -->
                        <div class="syndicate-header-row">
                            <span class="syndicate-group-id">${group.group_id}</span>
                            <span class="syndicate-status-badge ${statusClass}">
                            ${getSyndicateStatusText(group.status)}
                        </span>
                            <span class="syndicate-reason-tag">${group.main_reason || '异常行为'}</span>
                    </div>
                        
                        <!-- 第二行：统计数据 -->
                        <div class="syndicate-stats-row">
                            <div class="syndicate-stat-item">
                                <i class="fas fa-users"></i>
                                <span>${group.member_count}人</span>
                        </div>
                            <div class="syndicate-stat-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${formatCurrency(group.total_amount)}</span>
                        </div>
                            <div class="syndicate-stat-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${group.active_days}天</span>
                        </div>
                    </div>
                        
                        <!-- 第三行：资源标签 -->
                        <div class="syndicate-resources-row">
                            ${group.core_device_fp ? `
                                <span class="syndicate-resource-chip">
                                    <i class="fas fa-mobile"></i>
                                    ${group.core_device_fp}
                                </span>
                            ` : ''}
                            ${group.core_ip ? `
                                <span class="syndicate-resource-chip">
                                    <i class="fas fa-globe"></i>
                                    ${group.core_ip}
                                </span>
                            ` : ''}
                            ${group.core_payment_id ? `
                                <span class="syndicate-resource-chip">
                                    <i class="fas fa-qrcode"></i>
                                    ${group.core_payment_id}
                                </span>
                            ` : ''}
                    </div>
                </div>
                    
                    <!-- 右侧：风险分数 -->
                    <div class="syndicate-score-badge ${scoreClass}">
                        ${group.risk_score}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('团伙热点榜已重新渲染，元素数:', container.children.length);
    }

    // ==================== 实时告警流 ====================
    loadRealtimeFeed() {
        const container = document.getElementById('realtimeFeedList');
        if (!container) return;

        container.innerHTML = realtimeAlertFeed.map(alert => `
            <div class="feed-item ${alert.level}">
                <div class="feed-icon">
                    <i class="fas ${getAlertTypeIcon(alert.event_type)}"></i>
                </div>
                <div class="feed-content">
                    <div class="feed-header">
                        <span class="feed-type">${getAlertTypeText(alert.event_type)}</span>
                        <span class="feed-level ${alert.level}">${getRiskLevelText(alert.level)}</span>
                    </div>
                    <div class="feed-desc">${alert.description}</div>
                    <div class="feed-meta">
                        <span><i class="fas fa-users"></i> ${alert.user_ids.join(', ')}</span>
                        <span><i class="fas fa-clock"></i> ${formatTime(alert.created_at)}</span>
                    </div>
                    <div class="feed-action">
                        <i class="fas fa-check-circle"></i> ${alert.auto_action}
                    </div>
                </div>
            </div>
        `).join('');

        // 自动滚动到最新
        container.scrollTop = 0;
    }

    toggleRealtimeFeed(button) {
        this.realtimeFeedPaused = !this.realtimeFeedPaused;
        
        if (this.realtimeFeedPaused) {
            button.innerHTML = '<i class="fas fa-play"></i> 继续';
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
        } else {
            button.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
            this.loadRealtimeFeed();
        }
    }

    // ==================== 风险类别分布图表 ====================
    initRiskDistributionChart() {
        const chartDom = document.getElementById('riskDistributionChart');
        if (!chartDom) {
            console.log('风险分布图表容器未找到');
            return;
        }

        // 清除可能存在的旧实例
        echarts.dispose(chartDom);
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '风险类别',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {c}'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: 134, name: '设备风险', itemStyle: { color: '#dc2626' } },
                        { value: 90, name: '交易风险', itemStyle: { color: '#f59e0b' } },
                        { value: 78, name: 'IP风险', itemStyle: { color: '#3b82f6' } },
                        { value: 56, name: '行为风险', itemStyle: { color: '#8b5cf6' } },
                        { value: 42, name: '支付风险', itemStyle: { color: '#10b981' } },
                        { value: 34, name: '账户风险', itemStyle: { color: '#06b6d4' } },
                        { value: 19, name: '团伙风险', itemStyle: { color: '#ef4444' } }
                    ]
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    // ==================== 风险类型趋势图表 ====================
    initRiskTypeTrendChart() {
        const chartDom = document.getElementById('riskTypeTrendChart');
        if (!chartDom) {
            console.log('风险趋势图表容器未找到');
            return;
        }

        // 清除可能存在的旧实例
        echarts.dispose(chartDom);
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['多设备', '代理登录', '高取消率', '支付共享', 'IP风险'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: riskTypeTrend.time_range
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '多设备',
                    type: 'line',
                    data: riskTypeTrend.trends.multi_device,
                    smooth: true,
                    itemStyle: { color: '#dc2626' }
                },
                {
                    name: '代理登录',
                    type: 'line',
                    data: riskTypeTrend.trends.proxy_login,
                    smooth: true,
                    itemStyle: { color: '#f59e0b' }
                },
                {
                    name: '高取消率',
                    type: 'line',
                    data: riskTypeTrend.trends.high_cancel,
                    smooth: true,
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: '支付共享',
                    type: 'line',
                    data: riskTypeTrend.trends.shared_payment,
                    smooth: true,
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: 'IP风险',
                    type: 'line',
                    data: riskTypeTrend.trends.ip_risk,
                    smooth: true,
                    itemStyle: { color: '#8b5cf6' }
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    // ==================== 快速搜索 ====================
    executeQuickSearch() {
        const searchInput = document.getElementById('quickSearch');
        const query = searchInput.value.trim();
        
        if (!query) {
            this.showToast('请输入搜索内容', 'warning');
            return;
        }

        this.showLoading();
        
        // 模拟搜索
        setTimeout(() => {
            this.hideLoading();
            
            // 判断搜索类型
            if (query.startsWith('U')) {
                this.showToast(`正在搜索用户: ${query}`, 'info');
                this.switchView('users');
        this.currentPage = 1; // 关键：跳转时重置页码
            } else if (query.startsWith('DFP_') || query.startsWith('FP_')) {
                this.showToast(`正在搜索设备: ${query}`, 'info');
                this.switchView('relationships');
            } else if (query.startsWith('QR_') || query.startsWith('BANK_')) {
                this.showToast(`正在搜索支付方式: ${query}`, 'info');
                this.switchView('relationships');
            } else if (/^\d+\.\d+\.\d+\.\d+$/.test(query)) {
                this.showToast(`正在搜索IP: ${query}`, 'info');
                this.switchView('relationships');
            } else {
                this.showToast(`搜索: ${query}`, 'info');
            }
            
            // 清空搜索框
            searchInput.value = '';
        }, 800);
    }

    // ==================== 覆盖父类方法 ====================
    loadOverviewData() {
        // 加载V4新增数据
        this.loadKPIData();
        this.loadAIModelHealth();
        this.loadSystemHealth();
        this.loadGeoHeatmap();
        this.loadSyndicateHotspot();
        this.loadRealtimeFeed();
        
        // 调用父类方法（加载Top用户等）
        this.loadTopRisks();
        this.loadSyndicateMonitor();
        
        // 初始化图表
        this.initRiskTypeTrendChart();
        this.initRiskDistributionChart();
    }

    updateHeaderStats() {
        // 只更新告警相关统计，KPI数据单独更新
        const unreadCount = urgentAlerts.filter(a => !this.alertsRead.has(a.id)).length;
        this.updateAlertCount(unreadCount);
    }

    // 加载待审核队列
    loadPendingReview() {
        const container = document.getElementById('pendingReviewList');
        if (!container) return;

        container.innerHTML = pendingReviewUsers.map((user, index) => {
            const urgentClass = user.status === 'urgent' ? 'urgent' : '';
            const enteredTime = user.entered_at || user.last_login_at || '未知时间';
            const tags = user.tags || [user.main_tag || user.reason];
            
            return `
                <div class="pending-review-item ${urgentClass}" onclick="app.reviewUser('${user.user_id}')">
                    <img src="${user.avatar}" alt="avatar" class="review-avatar">
                    <div class="review-info">
                        <div class="review-row-1">
                            <span class="review-user-id">${user.user_id}</span>
                            <div class="review-tags">
                                ${tags.map(tag => `<span class="review-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="review-row-2">
                            <span><i class="fas fa-map-marker-alt"></i> ${user.city || user.location}</span>
                            <span><i class="fas fa-globe"></i> ${user.last_ip || user.login_ip}</span>
                            <span><i class="fas fa-clock"></i> ${enteredTime}</span>
                        </div>
                    </div>
                    <div class="review-right">
                        <div class="review-score ${user.risk_score >= 85 ? 'critical' : user.risk_score >= 75 ? 'high' : 'medium'}">${user.risk_score}</div>
                        <div class="review-actions">
                            <button class="btn-sm btn-primary" onclick="event.stopPropagation(); app.quickReview('${user.user_id}')">
                                <i class="fas fa-check"></i> 审核
                            </button>
                            
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    reviewUser(userId) {
        // 打开审核详情抽屉
        this.openAuditDrawer(userId);
    }

    quickReview(userId) {
        this.showToast(`开始审核 ${userId}`, 'success');
    }

    closeCase(userId) {
        this.showToast(`解单用户 ${userId}`, 'warning');
    }

    // 加载团伙监控（备用，使用热点榜代替）
    loadSyndicateMonitor() {
        // V4版本主要使用团伙热点榜，这里留空
    }

    // 识别关系图谱搜索类型
    recognizeRelationshipSearchType(value) {
        const hint = document.getElementById('relSearchTypeHint');
        if (!hint) return;
        
        const val = value.trim();
        if (!val) {
            hint.classList.remove('active');
            return;
        }

        let type = '';
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val)) type = 'IP地址';
        else if (/^DFP_|FP_|^[a-f0-9]{16,}/i.test(val)) type = '设备指纹';
        else if (/QR|qr|收款|码/i.test(val)) type = '支付资源';
        else if (/^[a-f0-9]{4,}_/i.test(val)) type = '用户ID';
        else if (val.length >= 4) type = '标识搜索';

        if (type) {
            hint.textContent = `识别为: ${type}`;
            hint.classList.add('active');
        } else {
            hint.classList.remove('active');
        }
    }

    // 填入搜索示例
    fillRelSearch(text) {
        const input = document.getElementById('relationshipSearchInput');
        if (input) {
            input.value = text;
            this.recognizeRelationshipSearchType(text);
            this.showToast(`已填入示例：${text}`, 'info');
        }
    }

    // 设置图谱深度
    setGraphDepth(depth, btn) {
        // 更新 UI 状态
        document.querySelectorAll('.depth-btn-v2').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.color = '#64748b';
        });
        btn.classList.add('active');
        btn.style.background = '#3b82f6';
        btn.style.color = 'white';

        this.currentGraphDepth = depth;
        this.executeRelationshipSearch();
    }

    // 处理关联类型变更
    handleRelationTypeChange(value) {
        this.currentRelationType = value;
        this.showToast(`关联类型已切换：${value === 'all' ? '全部' : value === 'physical' ? '物理' : '业务'}`, 'info');
        this.executeRelationshipSearch();
    }

    // 清空关系图谱搜索
    clearRelationshipSearch() {
        const input = document.getElementById('relationshipSearchInput');
        if (input) {
            input.value = '';
            this.recognizeRelationshipSearchType('');
        }
        
        const emptyState = document.getElementById('graphEmptyState');
        const loadingState = document.getElementById('graphLoadingState');
        const errorState = document.getElementById('graphErrorState');
        const iframe = document.getElementById('relationshipIframe');
        const hint = document.getElementById('graphHint');

        // 回到初始状态
        if (emptyState) emptyState.style.display = 'flex';
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
        if (iframe) {
            iframe.style.display = 'none';
            iframe.src = '';
        }
        if (hint) hint.style.display = 'none';
        
        this.showToast('搜索已重置', 'info');
    }

    // 执行关系图谱搜索 - 增强版状态机
    executeRelationshipSearch() {
        const input = document.getElementById('relationshipSearchInput');
        const query = input?.value.trim();
        
        if (!query) {
            this.showToast('请输入溯源锚点(ID/IP等)', 'warning');
            return;
        }

        // 获取所有状态容器
        const emptyState = document.getElementById('graphEmptyState');
        const loadingState = document.getElementById('graphLoadingState');
        const errorState = document.getElementById('graphErrorState');
        const iframe = document.getElementById('relationshipIframe');
        const hint = document.getElementById('graphHint');
        const loadingDesc = document.getElementById('loadingAnchorDesc');

        // 1. 进入加载态
        if (emptyState) emptyState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
        if (iframe) iframe.style.display = 'none';
        if (hint) hint.style.display = 'none';
        if (loadingState) loadingState.style.display = 'flex';
        if (loadingDesc) loadingDesc.textContent = `目标锚点：${query}`;

        // 2. 模拟异步请求与渲染
        setTimeout(() => {
            // 模拟错误：如果输入'error'则报错
            if (query.toLowerCase() === 'error') {
                if (loadingState) loadingState.style.display = 'none';
                if (errorState) errorState.style.display = 'flex';
                document.getElementById('graphErrorMessage').textContent = '后端溯源引擎响应超时，请重试';
                return;
            }

            // 🟢 进入正常显示态
            if (loadingState) loadingState.style.display = 'none';
            if (iframe) {
                iframe.style.display = 'block';
                // 加载图谱，传递锚点、深度和关联类型参数
                const depth = this.currentGraphDepth || 1;
                const relationType = this.currentRelationType || 'all';
                iframe.src = `group-graph.html?group_id=G1203&anchor=${encodeURIComponent(query)}&depth=${depth}&relationType=${relationType}`;
            }
            if (hint) hint.style.display = 'block';
            
            this.showToast(`关联图谱已生成`, 'success');
        }, 1200);
    }

    // 时间筛选：快捷按钮设置日期范围
    setTimeRange(range, btnEl) {
        const startInput = document.getElementById('filterDateStart');
        const endInput = document.getElementById('filterDateEnd');
        if (!startInput || !endInput) return;

        const now = new Date();
        const end = now.toISOString().split('T')[0];
        let start;

        switch (range) {
            case 'today':
                start = end;
                break;
            case 'week': {
                const d = new Date(now);
                d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
                start = d.toISOString().split('T')[0];
                break;
            }
            case 'month':
                start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
                break;
            case 'quarter': {
                const qMonth = Math.floor(now.getMonth() / 3) * 3;
                start = `${now.getFullYear()}-${String(qMonth + 1).padStart(2, '0')}-01`;
                break;
            }
            case 'year':
                start = `${now.getFullYear()}-01-01`;
                break;
            default:
                start = end;
        }

        startInput.value = start;
        endInput.value = end;

        document.querySelectorAll('.btn-time-shortcut').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');

        const labels = { today: '今天', week: '本周', month: '本月', quarter: '本季', year: '本年' };
        this.showToast(`已筛选：${labels[range] || range}（${start} 至 ${end}）`, 'info');
    }

    // 初始化默认时间范围（不默认筛选，显示全部数据）
    initTimeRange() {
        document.querySelectorAll('.btn-time-shortcut').forEach(b => b.classList.remove('active'));
        const startInput = document.getElementById('filterDateStart');
        const endInput = document.getElementById('filterDateEnd');
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';
    }

    // 一键快速筛选方法
    applyQuickFilter(type, value) {
        this.showToast(`已应用快速筛选：${type === 'status' ? '处理状态' : '风险等级'}`, 'info');
        
        const levelSelect = document.getElementById('filterRiskLevel');
        
        if (type === 'risk_level') {
            if (levelSelect) levelSelect.value = value;
        } else if (type === 'status') {
            if (value === 'urgent' && levelSelect) levelSelect.value = 'critical';
            else if (value === 'all' && levelSelect) levelSelect.value = '';
        }
        
        // 触发查询
        this.loadUsersView();
    }

    // ==================== 风险事件中心 (只读日志页) 逻辑 ====================
    
    toggleAutoRefresh() {
        const isChecked = document.getElementById('autoRefreshToggle').checked;
        const statusEl = document.getElementById('refreshStatus');
        const indicatorEl = document.getElementById('refreshIndicator');
        
        if (isChecked) {
            statusEl.innerHTML = "● 自动刷新中";
            statusEl.style.color = "#10b981";
            if (indicatorEl) indicatorEl.textContent = "(自动刷新中...)";
            this.startEventAutoRefresh();
        } else {
            statusEl.innerHTML = "○ 已暂停更新";
            statusEl.style.color = "#94a3b8";
            if (indicatorEl) indicatorEl.textContent = "(已暂停)";
            this.stopEventAutoRefresh();
        }
    }

    startEventAutoRefresh() {
        if (this.eventRefreshTimer) clearInterval(this.eventRefreshTimer);
        this.eventRefreshTimer = setInterval(() => {
            if (this.currentView === 'events') {
                this.loadEventsView(true); // 静默刷新
            }
        }, 30000); // 30秒刷新一次
    }

    stopEventAutoRefresh() {
        if (this.eventRefreshTimer) clearInterval(this.eventRefreshTimer);
    }

    resetEventFilters() {
        document.getElementById('filterEventDomain').value = '';
        document.getElementById('filterEventSeverity').value = '';
        document.getElementById('filterEventTime').value = '24h';
        document.getElementById('filterEventSearch').value = '';
        this.loadEventsView();
    }

    filterEventsByKpi(type) {
        const severitySelect = document.getElementById('filterEventSeverity');
        const domainSelect = document.getElementById('filterEventDomain');
        
        if (type === 'critical') {
            severitySelect.value = 'critical';
        } else if (type === 'ai') {
            // 假设AI提示对应某种域或特定的关键词逻辑
            document.getElementById('filterEventSearch').value = 'AI';
        } else if (type === 'manual') {
            // 需人工关注对应严重程度中以上
            severitySelect.value = 'high';
        } else {
            severitySelect.value = '';
            document.getElementById('filterEventSearch').value = '';
        }
        
        this.loadEventsView();
    }

    loadEventsView(isSilent = false) {
        if (!isSilent) this.showLoading();
        
        const container = document.getElementById('eventsTimeline');
        if (!container) return;

        // 获取过滤条件
        const domainFilter = document.getElementById('filterEventDomain')?.value;
        const severityFilter = document.getElementById('filterEventSeverity')?.value;
        const searchFilter = document.getElementById('filterEventSearch')?.value.toLowerCase();

        // 模拟数据过滤
        const filteredEvents = realtimeAlertFeed.filter(event => {
            if (severityFilter && event.level !== severityFilter) return false;
            if (searchFilter && !event.description.toLowerCase().includes(searchFilter) && !event.user_ids.some(u => u.toLowerCase().includes(searchFilter))) return false;
            return true;
        });

        container.innerHTML = filteredEvents.map(event => {
            const severityMap = {
                'critical': { label: '严重', class: 'critical', color: '#dc2626' },
                'high': { label: '高危', class: 'high', color: '#f59e0b' },
                'medium': { label: '中等', class: 'medium', color: '#3b82f6' },
                'low': { label: '低级', class: 'low', color: '#10b981' }
            };
            const s = severityMap[event.level] || severityMap.medium;
            const typeText = this.getEventTypeText(event.event_type);
            const typeIcon = this.getEventTypeIcon(event.event_type);
            
            return `
                <div class="event-card-v2" style="border-left: 4px solid ${s.color};">
                    <!-- 1. 左侧：等级与类型 -->
                    <div style="min-width: 100px;">
                        <span class="event-severity-badge ${s.class}">${s.label}</span>
                        <div style="font-size: 11px; color: #64748b; font-weight: 700; margin-top: 8px; text-transform: uppercase;">
                            <i class="fas ${typeIcon}" style="margin-right: 4px;"></i> ${typeText}
                        </div>
                            </div>

                    <!-- 2. 主内容区 -->
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${event.description}</div>
                        <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #94a3b8;">
                            <span><i class="far fa-clock"></i> ${event.created_at} (10分钟前)</span>
                            <span style="font-family: 'JetBrains Mono', monospace;">ID: ${event.alert_id}</span>
                            </div>
                        </div>

                    <!-- 3. 关联对象 -->
                    <div style="flex: 0 0 280px; display: flex; flex-direction: column; gap: 6px; border-left: 1px solid #f1f5f9; padding-left: 20px;">
                        <div style="font-size: 12px; color: #64748b;">
                            <i class="fas fa-users" style="width: 16px;"></i> 关联用户: 
                            ${event.user_ids.map(uid => `<span class="event-link-text" onclick="app.viewUserDetail('${uid}')">${uid}</span>`).join(', ')}
                    </div>
                        <div style="font-size: 12px; color: #64748b;">
                            <i class="fas fa-fingerprint" style="width: 16px;"></i> 关联实体: 
                            <span class="event-entity-tag">FP_889977</span> <span class="event-entity-tag">112.25.67.89</span>
                        </div>
                    </div>

                    <!-- 4. 操作按钮 (只读) -->
                    <div style="display: flex; gap: 8px; min-width: 200px; justify-content: flex-end;">
                        <button class="btn-event-action" onclick="app.viewEventDetail('${event.alert_id}')">
                            <i class="fas fa-info-circle"></i> 事件详情
                        </button>
                        <button class="btn-event-action primary" onclick="app.viewLinkedUsers('${event.user_ids.join(',')}')">
                            <i class="fas fa-external-link-alt"></i> 查看关联用户
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (filteredEvents.length === 0) {
            container.innerHTML = `<div style="padding: 60px; text-align: center; color: #94a3b8;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                <p>暂无匹配的风险事件日志</p>
            </div>`;
        }

        // 更新统计 (模拟动态)
        document.getElementById('eventTotalCount').textContent = filteredEvents.length;
        document.getElementById('todayEventCount').textContent = realtimeAlertFeed.length;
        document.getElementById('criticalEventCount').textContent = realtimeAlertFeed.filter(e => e.level === 'critical').length;
        
        if (!isSilent) this.hideLoading();
    }

    viewEventDetail(alertId) {
        this.openAuditDrawer(alertId, 'event'); // 复用抽屉，但内容为只读事件详情
    }

    viewLinkedUsers(userIdsStr) {
        const userIds = userIdsStr.split(',');
        this.showToast(`正在跳转并筛选 ${userIds.length} 个关联用户...`, 'success');
        
        // 1. 切换到风险处理队列 Tab
        this.switchView('users');
        this.currentPage = 1; // 关键：跳转时重置页码
        
        // 2. 自动填入搜索框并查询
        const searchInput = document.getElementById('filterUserSearch');
        if (searchInput) {
            searchInput.value = userIds[0]; 
            this.loadUsersView();
            
            // 3. 高亮效果 (等列表渲染完)
            setTimeout(() => {
                userIds.forEach(id => {
                    const card = document.querySelector(`.risk-item-user[data-id="${id}"]`);
                    if (card) {
                        card.style.borderColor = '#3b82f6';
                        card.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.2)';
                        card.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            card.style.borderColor = '';
                            card.style.boxShadow = '';
                            card.style.transform = '';
                        }, 3000);
                    }
                });
            }, 300);
        }
    }

    getEventTypeIcon(type) {
        const icons = {
            'shared_payment': 'fa-qrcode',
            'syndicate_detected': 'fa-users',
            'device_risk': 'fa-mobile-alt',
            'ip_risk': 'fa-network-wired',
            'trade_anomaly': 'fa-exchange-alt',
            'high_cancel': 'fa-times-circle',
            'fast_sell': 'fa-bolt'
        };
        return icons[type] || 'fa-exclamation-triangle';
    }

    getEventTypeText(type) {
        const texts = {
            'shared_payment': '支付资源共享',
            'syndicate_detected': '团伙识别',
            'device_risk': '设备异常',
            'ip_risk': 'IP风险',
            'trade_anomaly': '交易异常',
            'high_cancel': '高频取消',
            'fast_sell': '快速出售'
        };
        return texts[type] || '风险事件';
    }
}

// 初始化应用
window.app = new RiskMonitoringSystemV4();

// 添加自定义样式
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* KPI概览卡片 */
        .kpi-overview {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
            margin-bottom: 20px;
        }

        .kpi-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-left: 4px solid;
            transition: all 0.3s ease;
        }

        .kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .kpi-card.danger { border-left-color: #dc2626; }
        .kpi-card.critical { border-left-color: #b91c1c; }
        .kpi-card.warning { border-left-color: #f59e0b; }
        .kpi-card.info { border-left-color: #3b82f6; }
        .kpi-card.success { border-left-color: #10b981; }

        .kpi-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .kpi-card.danger .kpi-icon { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
        .kpi-card.critical .kpi-icon { background: rgba(185, 28, 28, 0.1); color: #b91c1c; }
        .kpi-card.warning .kpi-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .kpi-card.info .kpi-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .kpi-card.success .kpi-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .kpi-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1;
            margin-bottom: 4px;
        }

        .kpi-label {
            font-size: 13px;
            color: #64748b;
        }

        .kpi-trend {
            font-size: 12px;
            font-weight: 600;
            margin-top: 4px;
        }

        .kpi-trend.up { color: #dc2626; }
        .kpi-trend.down { color: #10b981; }
        .kpi-trend.stable { color: #64748b; }

        /* 增强网格布局 */
        .dashboard-grid-enhanced {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
        }

        .ai-health { grid-column: span 6; }
        .system-health { grid-column: span 6; }
        .risk-type-trend { grid-column: span 8; }
        .geo-heatmap { grid-column: span 4; }
        .top-risks { grid-column: span 4; }
        .risk-distribution { grid-column: span 4; }
        .syndicate-hotspot { grid-column: span 4; }
        .realtime-feed { grid-column: span 12; }

        /* AI指标 */
        .ai-metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .metric-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .metric-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
        }

        .metric-value {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .progress-bar {
            flex: 1;
            height: 8px;
            background: #f1f5f9;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            transition: width 0.6s ease;
        }

        .progress-fill.success { background: #10b981; }
        .progress-fill.warning { background: #f59e0b; }
        .progress-fill.danger { background: #dc2626; }

        .metric-number {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
        }

        .metric-number.large {
            font-size: 24px;
        }

        .metric-unit {
            font-size: 12px;
            color: #64748b;
        }

        .metric-badge {
            padding: 4px 12px;
            background: #3b82f6;
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        /* 系统健康 */
        .health-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .health-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .health-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .health-icon.success {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .health-label {
            font-size: 12px;
            color: #64748b;
        }

        .health-status {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
        }

        /* 地区热力图 */
        .geo-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 280px;
            overflow-y: auto;
        }

        .geo-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .geo-item:hover {
            background: #f1f5f9;
            transform: translateX(4px);
        }

        .geo-rank {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #3b82f6;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
        }

        .geo-info {
            flex: 1;
        }

        .geo-city {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .geo-meta {
            font-size: 12px;
            color: #64748b;
        }

        .geo-score {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .score-bar {
            width: 80px;
            height: 6px;
            background: #f1f5f9;
            border-radius: 3px;
            overflow: hidden;
        }

        .score-fill {
            height: 100%;
            transition: width 0.6s ease;
        }

        .score-number {
            font-weight: 700;
            font-size: 16px;
        }

        /* 团伙热点 */
        .syndicate-hotspot-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 400px;
            overflow-y: auto;
        }

        .syndicate-hotspot-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 4px solid #3b82f6;
        }

        .syndicate-hotspot-item:hover {
            background: #f1f5f9;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .hotspot-rank {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e0e7ff;
            color: #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
        }

        .hotspot-rank.top {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }

        .hotspot-info {
            flex: 1;
        }

        .hotspot-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .hotspot-id {
            font-weight: 700;
            color: #1e293b;
        }

        .hotspot-details {
            display: flex;
            gap: 16px;
            margin-bottom: 8px;
            font-size: 12px;
            color: #64748b;
        }

        .hotspot-resources {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .resource-tag {
            padding: 2px 8px;
            background: white;
            border-radius: 10px;
            font-size: 10px;
            color: #64748b;
        }

        .hotspot-score .score-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            color: white;
        }

        .hotspot-score .score-circle.critical {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .hotspot-score .score-circle.high {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        /* 实时告警流 */
        .realtime-feed-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 400px;
            overflow-y: auto;
        }

        .feed-item {
            display: flex;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid;
            transition: all 0.2s ease;
        }

        .feed-item.critical { border-left-color: #dc2626; }
        .feed-item.high { border-left-color: #f59e0b; }
        .feed-item.medium { border-left-color: #3b82f6; }

        .feed-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        .feed-item.critical .feed-icon {
            background: rgba(220, 38, 38, 0.1);
            color: #dc2626;
        }

        .feed-item.high .feed-icon {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .feed-content {
            flex: 1;
        }

        .feed-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .feed-type {
            font-weight: 600;
            color: #1e293b;
        }

        .feed-level {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .feed-level.critical {
            background: rgba(220, 38, 38, 0.1);
            color: #dc2626;
        }

        .feed-level.high {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .feed-desc {
            font-size: 13px;
            color: #475569;
            margin-bottom: 6px;
        }

        .feed-meta {
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            gap: 12px;
            margin-bottom: 6px;
        }

        .feed-action {
            font-size: 12px;
            color: #10b981;
            font-weight: 500;
        }

        /* 快速搜索 */
        .quick-search {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .quick-search:focus-within {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .quick-search i {
            color: rgba(255, 255, 255, 0.8);
        }

        .search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: white;
            font-size: 14px;
            min-width: 400px;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .search-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .search-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        /* 状态指示器 */
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-indicator.success {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .status-indicator i {
            font-size: 8px;
        }

        @media (max-width: 1400px) {
            .kpi-overview {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 1024px) {
            .kpi-overview {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .dashboard-grid-enhanced > div {
                grid-column: span 12 !important;
            }
        }
    `;
    document.head.appendChild(style);
});


// ==================== RCM (Risk Control Management) Module ====================
// Scoped logic for the Management Console
(function(app) {
    const RCM_RULES = [
        { id: "R-ATO-1", name: "多设备异地登录检测", type: "security", enabled: true, summary: "Score >= 85", desc: "检测账号在短时间内跨越巨大地理位置且设备特征不匹配的情况。" },
        { id: "R-ATO-2", name: "新设备低置信度登录", type: "security", enabled: true, summary: "Confidence < 0.7", desc: "检测新设备指纹采集不完整或置信度较低的异常登录。" },
        { id: "R-ATO-3", name: "新设备登录后敏感操作", type: "security", enabled: false, summary: "Time < 10m", desc: "新设备登录 10 分钟内执行改密、换绑等敏感操作。" },
        { id: "R-GROUP-1", name: "同设备多账号（7天）", type: "security", enabled: true, summary: "Count >= 3", desc: "过去 7 天内，单台设备登录过的独立账号数超过阈值。" },
        { id: "R-GROUP-2", name: "同设备多账号（30天）", type: "security", enabled: true, summary: "Count >= 5", desc: "过去 30 天内，单台设备登录过的独立账号数超过阈值。" },
        { id: "R-GROUP-3", name: "单账号多设备快速切换", type: "security", enabled: false, summary: "Switch < 5m", desc: "单个账号在极短时间内在多台物理设备间频繁切换登录。" },
        
        { id: "TRD-LOGIN-FAST-SELL", name: "登录后快速卖单", type: "trade", enabled: true, summary: "Time < 5m", desc: "账号登录后 5 分钟内立即发起卖单操作。" },
        { id: "TRD-LOGIN-CLEAR-BALANCE", name: "登录后清空余额", type: "trade", enabled: true, summary: "Ratio > 95%", desc: "登录后单笔或连续多笔交易清空账户绝大部分余额。" },
        { id: "TRD-PAY-TOO-FAST", name: "秒级付款", type: "trade", enabled: false, summary: "Time < 2s", desc: "订单创建后秒级完成付款确认，疑似脚本操作。" },
        { id: "TRD-CANCEL-BURST-5M", name: "5分钟高频取消", type: "trade", enabled: true, summary: "Count >= 3", desc: "5 分钟内连续取消订单达到预警次数。" },
        { id: "TRD-CANCEL-BURST-30M", name: "30分钟高频取消", type: "trade", enabled: true, summary: "Count >= 5", desc: "30 分钟内累计取消订单达到预警次数。" },
        { id: "TRD-CANCEL-AFTER-ACCEPT", name: "卖家同意后取消", type: "trade", enabled: true, summary: "Ratio > 30%", desc: "在卖家已确认接单后，买家发起取消的比例异常。" },
        { id: "TRD-CANCEL-LOOP", name: "循环取消订单", type: "trade", enabled: false, summary: "Repeat >= 3", desc: "针对同一笔或同一类商品执行重复的下单-取消循环。" },
        { id: "TRD-PAY-NEAR-TIMEOUT", name: "接近超时才付款", type: "trade", enabled: true, summary: "Time > 90%", desc: "频繁在支付倒计时结束前最后时刻完成支付。" },
        { id: "TRD-WITH-HIGH-RISK", name: "与高风险账号交易", type: "trade", enabled: true, summary: "Score > 80", desc: "交易对手方命中高风险黑名单或评分极高。" },
        { id: "TRD-SELF-TRADE", name: "自成交", type: "trade", enabled: true, summary: "Match: ID/IP/Device", desc: "买卖双方通过 IP、设备或关联关系识别为同一人。" },
        { id: "TRD-MUTUAL-TRADE", name: "互成交", type: "trade", enabled: true, summary: "Chain >= 2", desc: "两个或多个账号之间通过对敲方式虚增交易量。" },
        { id: "TRD-HIGH-CONCENTRATION", name: "交易高度集中", type: "trade", enabled: true, summary: "Herfindahl > 0.6", desc: "交易对手过于单一，大部分流水流向极少数固定账户。" },
        { id: "TRD-SHARED-RECEIVE", name: "共用收款方式", type: "trade", enabled: true, summary: "QR Shared", desc: "多个独立账户共用同一个银行卡、支付宝或微信收款。" },
        { id: "TRD-SMALL-HF", name: "小额高频交易", type: "trade", enabled: false, summary: "Amt < 100 & Cnt > 50", desc: "大量极小面额交易，疑似洗钱或脚本刷量。" },
        { id: "TRD-INTERVAL-REGULAR", name: "固定交易间隔", type: "trade", enabled: false, summary: "Variance < 1s", desc: "每笔交易的时间间隔高度一致，符合机器人特征。" },
        { id: "TRD-FIXED-TIME", name: "固定时段活跃", type: "trade", enabled: true, summary: "Time: 02:00-05:00", desc: "长期仅在深夜或特定的极短时段内有爆发性交易。" },
        
        { id: "GRP-SAME-DEVICE", name: "同设备多账号", type: "syndicate", enabled: true, summary: "Anchor: Device", desc: "基于物理设备指纹聚合而成的风险团伙。" },
        { id: "GRP-MULTI-DEVICE", name: "单账号多设备", type: "syndicate", enabled: true, summary: "Count > 5", desc: "单个账号关联的物理设备数量超过正常用户上限。" },
        { id: "GRP-SAME-IP", name: "同IP多账号", type: "syndicate", enabled: true, summary: "Anchor: IP", desc: "基于网络出口 IP 聚合而成的疑似聚集点风险。" },
        { id: "GRP-IP-SWITCH", name: "IP频繁切换", type: "syndicate", enabled: true, summary: "Geo Switch", desc: "账户登录 IP 频繁跨越城际、省际或使用代理 VPN。" },
        { id: "GRP-SHARED-PAYMENT", name: "共用支付方式", type: "syndicate", enabled: true, summary: "Anchor: Payment", desc: "核心资源关联识别，由同一支付源控制的团伙。" },
        { id: "GRP-TRADE-CONCENTRATION", name: "团伙交易集中", type: "syndicate", enabled: true, summary: "Internal > 70%", desc: "团伙内部循环交易占总流水的比例过高。" },
        { id: "GRP-TRADE-CHAIN", name: "链式交易", type: "syndicate", enabled: false, summary: "A->B->C->D", desc: "资金流向呈现单向长链分布，典型的资金分散转移特征。" },
        { id: "GRP-FIXED-TIME-GROUP", name: "固定时段协同交易", type: "syndicate", enabled: false, summary: "Co-Time < 10s", desc: "团伙内多名成员在秒级误差内执行相同的业务动作。" },
        { id: "GRP-MULTI-DIM", name: "多维关系聚合", type: "syndicate", enabled: true, summary: "Full Graph", desc: "综合设备、IP、支付、关系等多维属性交叉后的团伙判定。" }
    ];

    app.rcm = {
        
        selectedModel: 'A',
        currentModelVersion: 'v2.4.1',

        selectModel(target) {
            this.selectedModel = target;
            const cardA = document.getElementById('modelCardA');
            const cardB = document.getElementById('modelCardB');
            const btn = document.getElementById('deployModelBtn');
            
            [cardA, cardB].forEach(c => {
                c.style.opacity = '0.7';
                c.style.borderColor = '#e2e8f0';
                c.querySelector('.status-icon i').className = 'far fa-circle';
                c.querySelector('.status-icon').style.color = '#cbd5e1';
            });

            const activeCard = target === 'A' ? cardA : cardB;
            activeCard.style.opacity = '1';
            activeCard.style.borderColor = '#3b82f6';
            activeCard.querySelector('.status-icon i').className = 'fas fa-dot-circle';
            activeCard.querySelector('.status-icon').style.color = '#3b82f6';

            // 如果选择的不是当前运行模型，则激活部署按钮
            const isDifferent = (target === 'A' && this.currentModelVersion !== 'v2.4.1') || 
                                (target === 'B' && this.currentModelVersion !== 'v3.0.0-Beta');
            
            if (isDifferent) {
                btn.disabled = false;
                btn.style.background = '#3b82f6';
                btn.style.cursor = 'pointer';
                btn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            } else {
                btn.disabled = true;
                btn.style.background = '#cbd5e1';
                btn.style.cursor = 'not-allowed';
                btn.style.boxShadow = 'none';
            }
        },

        deploySelectedModel() {
            const version = this.selectedModel === 'A' ? 'v2.4.1' : 'v3.0.0-Beta';
            if (confirm(`⚠️ 安全警告：确认将系统核心 AI 模型切换至 ${version}？\n这可能影响所有实时风险判定结果。`)) {
                this.currentModelVersion = version;
                
                // 更新 UI 状态
                const cardA = document.getElementById('modelCardA');
                const cardB = document.getElementById('modelCardB');
                const btn = document.getElementById('deployModelBtn');
                
                [cardA, cardB].forEach(c => {
                    c.style.borderWidth = '2px';
                    c.style.background = 'white';
                });

                const activeCard = this.selectedModel === 'A' ? cardA : cardB;
                activeCard.style.borderColor = '#10b981';
                activeCard.style.background = '#f0fdf4';
                activeCard.querySelector('.status-icon i').className = 'fas fa-check-circle';
                activeCard.querySelector('.status-icon').style.color = '#10b981';
                
                // 更新顶部 KPI
                const kpiVal = document.querySelector('#operationsView .kpi-card.success .kpi-value');
                if (kpiVal) kpiVal.textContent = version;

                // 写入审计
                const auditContainer = document.getElementById('rcmAuditContainer');
                if (auditContainer) {
                    const row = document.createElement('div');
                    row.className = 'rcm-audit-row';
                    row.innerHTML = `<span style="color: #0f172a; font-weight: 600;">切换系统 AI 模型至 [${version}]</span><span style="color: #94a3b8;">Admin · 刚刚</span>`;
                    auditContainer.insertBefore(row, auditContainer.firstChild);
                }

                btn.disabled = true;
                btn.style.background = '#cbd5e1';
                
                app.showToast(`模型 ${version} 已成功部署生效`, 'success');
            }
        },

        currentRules: [...RCM_RULES],
        editingRule: null,

        init() {
            console.log("RCM Module Initialized");
            this.loadRulesList();
            this.updateKPIs();
        },

        loadRulesList() {
            const container = document.getElementById('rcmRulesContainer');
            if (!container) return;

            const searchQuery = document.getElementById('rcmRuleSearch')?.value.toLowerCase() || "";
            const typeFilter = document.getElementById('rcmTypeFilter')?.value || "";
            const statusFilter = document.getElementById('rcmStatusFilter')?.value || "";

            const filtered = this.currentRules.filter(rule => {
                const matchesSearch = rule.name.toLowerCase().includes(searchQuery) || rule.id.toLowerCase().includes(searchQuery);
                const matchesType = !typeFilter || rule.type === typeFilter;
                const matchesStatus = !statusFilter || String(rule.enabled) === statusFilter;
                return matchesSearch && matchesType && matchesStatus;
            });

            container.innerHTML = filtered.map(rule => `
                <div class="rcm-rule-row">
                    <div class="rcm-rule-info">
                        <div style="width: 36px; height: 36px; border-radius: 8px; background: ${this.getCategoryColor(rule.type).bg}; color: ${this.getCategoryColor(rule.type).fg}; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                            <i class="fas ${this.getCategoryIcon(rule.type)}"></i>
                        </div>
                        <div>
                            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${rule.name}</div>
                            <div style="font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono';">ID: ${rule.id}</div>
                        </div>
                        <div class="rcm-category-badge ${rule.type}" style="margin-left: 12px;">${this.getCategoryLabel(rule.type)}</div>
                        <div class="rcm-threshold-summary" style="margin-left: 12px;">${rule.summary}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <div style="display: flex; align-items: center;">
                            <label class="rcm-switch">
                                <input type="checkbox" ${rule.enabled ? 'checked' : ''} onchange="app.rcm.toggleRule('${rule.id}', this.checked, event)">
                                <span class="rcm-slider"></span>
                            </label>
                            <span class="rcm-switch-label ${rule.enabled ? 'on' : 'off'}">${rule.enabled ? '开启' : '关闭'}</span>
                        </div>
                        <button class="btn btn-outline" style="padding: 8px 16px; font-size: 12px; border-radius: 10px; font-weight: 700;" onclick="app.rcm.openDrawer('${rule.id}')">
                            <i class="fas fa-sliders-h"></i> 配置阈值
                        </button>
                    </div>
                </div>
            `).join('');
        },

        getCategoryIcon(type) {
            if (type === 'security') return 'fa-shield-alt';
            if (type === 'trade') return 'fa-exchange-alt';
            return 'fa-users-slash';
        },

        getCategoryColor(type) {
            if (type === 'security') return { bg: '#fee2e2', fg: '#dc2626' };
            if (type === 'trade') return { bg: '#ffedd5', fg: '#ea580c' };
            return { bg: '#dbeafe', fg: '#3b82f6' };
        },

        getCategoryLabel(type) {
            if (type === 'security') return '安全策略';
            if (type === 'trade') return '交易策略';
            return '团伙识别';
        },

        filterRules() {
            this.loadRulesList();
        },

        toggleRule(id, enabled, event) {
            const rule = this.currentRules.find(r => r.id === id);
            if (!rule) return;

            if (!enabled) {
                const reason = prompt(`请输入停用规则 [${rule.name}] 的原因：`);
                if (!reason) {
                    if (event) event.target.checked = true;
                    return;
                }
                app.showToast(`规则 ${id} 已停用，记录原因：${reason}`, 'warning');
            } else {
                app.showToast(`规则 ${id} 已启用`, 'success');
            }
            
            rule.enabled = enabled;
            this.updateKPIs();
            
            // 找到当前行中的 Label 元素直接更新，避免全量重绘
            const row = event ? event.target.closest('.rcm-rule-row') : null;
            if (row) {
                const label = row.querySelector('.rcm-switch-label');
                if (label) {
                    label.textContent = enabled ? '开启' : '关闭';
                    label.className = `rcm-switch-label ${enabled ? 'on' : 'off'}`;
                }
            } else {
                this.loadRulesList();
            }
        },

        openDrawer(id) {
            const rule = this.currentRules.find(r => r.id === id);
            if (!rule) return;
            this.editingRule = {...rule};

            const overlay = document.getElementById('rcmDrawerOverlay');
            const drawer = document.getElementById('rcmDrawer');
            const body = document.getElementById('rcmDrawerBody');
            
            document.getElementById('drawerRuleName').textContent = rule.name;
            document.getElementById('drawerRuleCategory').textContent = this.getCategoryLabel(rule.type);
            document.getElementById('drawerRuleCategory').className = `rcm-category-badge ${rule.type}`;

            body.innerHTML = `
                <div class="rcm-config-section">
                    <div class="rcm-section-title">A. 规则定义</div>
                    <div style="font-size: 14px; color: #334155; line-height: 1.6;">${rule.desc}</div>
                </div>

                <div class="rcm-config-section">
                    <div class="rcm-section-title">B. 触发阈值配置</div>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="config-group">
                            <label style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; display: block;">时间检测窗口 (Time Window)</label>
                            <select class="rcm-input" id="editRuleWindow">
                                <option value="5m">过去 5 分钟内</option>
                                <option value="30m">过去 30 分钟内</option>
                                <option value="1h">过去 1 小时内</option>
                                <option value="24h" selected>过去 24 小时内</option>
                                <option value="7d">过去 7 天内</option>
                            </select>
                        </div>
                        <div class="config-group">
                            <label style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; display: block;">触发阈值 (Target Threshold)</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="number" class="rcm-input" id="editRuleValue" value="${parseInt(rule.summary.replace(/[^0-9]/g, '')) || 3}" style="width: 100px;">
                                <span style="font-size: 13px; color: #94a3b8; font-weight: 600;">次数 / 比例</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rcm-config-section">
                    <div class="rcm-section-title">C. 风险输出分级</div>
                    <select class="rcm-input" id="editRuleSeverity">
                        <option value="critical">🔴 严重事件 (Critical)</option>
                        <option value="high" selected>🟠 高危事件 (High)</option>
                        <option value="medium">🟡 中等事件 (Medium)</option>
                        <option value="low">🟢 低级记录 (Low)</option>
                    </select>
                </div>

                <div class="rcm-config-section">
                    <div class="rcm-section-title">D. 去重规则</div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="width: 16px; height: 16px;">
                            <span style="font-size: 13px; font-weight: 600; color: #0f172a;">按单用户 (user_id) 去重</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" style="width: 16px; height: 16px;">
                            <span style="font-size: 13px; font-weight: 600; color: #0f172a;">按设备 + IP 联合去重</span>
                        </label>
                    </div>
                </div>
            `;

            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('active');
                drawer.classList.add('active');
            }, 10);
        },

        closeDrawer() {
            const overlay = document.getElementById('rcmDrawerOverlay');
            const drawer = document.getElementById('rcmDrawer');
            if (overlay && drawer) {
                overlay.classList.remove('active');
                drawer.classList.remove('active');
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        },

        confirmSave() {
            const newValue = document.getElementById('editRuleValue').value;
            const newWindow = document.getElementById('editRuleWindow').value;
            
            if (!newValue) {
                app.showToast("阈值不能为空，无法保存并启用", "danger");
                return;
            }

            const confirmMsg = `
                确认发布此策略配置？
                规则：${this.editingRule.name}
                变更：${this.editingRule.summary} -> ${newWindow} 且值 >= ${newValue}
                
                该变更将立即同步至生产环境规则引擎。
            `;

            if (confirm(confirmMsg)) {
                app.showToast("策略配置已同步至规则引擎，新事件将按此规则生成", "success");
                // 同步数据并重绘列表
                const rule = this.currentRules.find(r => r.id === this.editingRule.id);
                rule.summary = `${newWindow} / >= ${newValue}`;
                this.loadRulesList();
                this.closeDrawer();
            }
        },

        
        updateGlobalRiskDisplay(val) {
            document.getElementById('globalRiskScoreVal').textContent = '>= ' + val;
            document.getElementById('dynamicThresholdText').textContent = val;
            document.getElementById('dynamicHighRiskEnd').textContent = val - 1;
        },

        saveGlobalConfig() {
            const score = document.getElementById('globalRiskScoreVal').textContent;
            if (confirm(`确认调整全局风控基准？
严重风险判定阈值将更新为：${score}`)) {
                app.showToast("全局参数已更新", "success");
            }
        },

        updateKPIs() {
            const enabled = this.currentRules.filter(r => r.enabled).length;
            const total = this.currentRules.length;
            document.getElementById('rcmEnabledCount').textContent = `${enabled} / ${total}`;
            // 模拟 3 条未配置阈值（实际上是 enabled 为 false 的示例）
            document.getElementById('rcmIncompleteCount').textContent = this.currentRules.filter(r => !r.enabled).length;
        }
    };

    // 监听视图切换，如果是 rcm 则初始化
    const originalSwitchViewInternal = app.switchViewInternal;
    app.switchViewInternal = function(viewName) {
        if (viewName === 'rcm') {
            app.rcm.init();
        }
        originalSwitchViewInternal.apply(this, arguments);
    };

})(window.app);

    // ==================== 账号权限管理模块 ====================
    app.accounts = {
        data: [
            { id: 1, name: "Admin", email: "admin@bob.com", role: "管理员", permissions: ["全量数据", "策略配置", "权限管理"], status: "active" },
            { id: 2, name: "ZhangWei", email: "zw@bob.com", role: "风险分析师", permissions: ["只读事件", "关系穿透", "导出报表"], status: "active" },
            { id: 3, name: "LiNa", email: "lina@bob.com", role: "风控运营员", permissions: ["风险处理", "用户审核"], status: "active" }
        ],

        init() {
            this.renderList();
        },

        renderList() {
            const container = document.getElementById('accountsTableBody');
            if (!container) return;

            container.innerHTML = this.data.map(acc => `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: all 0.2s;">
                    <td style="padding: 16px 24px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-weight: 800;">${acc.name[0]}</div>
                            <div>
                                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${acc.name}</div>
                                <div style="font-size: 11px; color: #94a3b8;">${acc.email}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <span style="font-size: 13px; font-weight: 700; color: ${acc.role === '管理员' ? '#3b82f6' : '#475569'}">${acc.role}</span>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${acc.permissions.map(p => `<span class="perm-badge">${p}</span>`).join('')}
                        </div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <span class="event-severity-badge success" style="font-size: 10px;">在线</span>
                    </td>
                    <td style="padding: 16px 24px; text-align: right;">
                        <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px; margin-right: 8px;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-outline" onclick="app.accounts.deleteAccount(${acc.id})" style="padding: 4px 8px; font-size: 11px; color: #dc2626;"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `).join('');
        },

        deleteAccount(id) {
            if (confirm("确定要注销该账号吗？该操作不可撤销。")) {
                this.data = this.data.filter(a => a.id !== id);
                this.renderList();
                app.showToast("账号已注销", "success");
            }
        }
    };

    // 扩展原有方法
    app.toggleUserMenu = function() {
        const menu = document.getElementById('userDropdownMenu');
        if (menu) {
            const isHidden = menu.style.display === 'none';
            menu.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                // 点击外部关闭
                const closeMenu = (e) => {
                    if (!e.target.closest('.user-profile-wrapper')) {
                        menu.style.display = 'none';
                        document.removeEventListener('click', closeMenu);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeMenu), 10);
            }
        }
    };

    app.showAddAccountModal = function() {
        const name = prompt("请输入新账号姓名：");
        if (name) {
            const role = prompt("分配角色 (管理员/分析师/运营)：", "运营");
            this.accounts.data.push({
                id: Date.now(),
                name: name,
                email: name.toLowerCase() + "@bob.com",
                role: role,
                permissions: ["用户审核"],
                status: "active"
            });
            this.accounts.renderList();
            this.showToast("新账号添加成功", "success");
        }
    };

    // 劫持 switchView 处理账号页初始化
    const oldSwitch = app.switchViewInternal;
    app.switchViewInternal = function(viewName) {
        if (viewName === 'accounts') {
            app.accounts.init();
        }
        oldSwitch.apply(this, arguments);
    };
