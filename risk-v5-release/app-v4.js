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
            } else {
                iframe.src = `group-graph.html?group_id=${id}`;
                if (titleEl) titleEl.innerHTML = '<i class="fas fa-project-diagram"></i> 团伙关系穿透分析';
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
        this.init();
    }

    init() {
        this.bindEvents();
        this.bindV4Events();
        this.initV4Features();
        // 预加载用户列表数据
        setTimeout(() => {
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
        // 更新标签状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
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
        }
    }

    // 加载用户风险列表视图 - 卡片式布局
    loadUsersView() {
        const container = document.getElementById('userCardsList');
        if (!container) return;

        container.innerHTML = riskUsersList.map(user => {
            const scoreClass = user.risk_score >= 90 ? 'critical' : user.risk_score >= 80 ? 'high' : 'medium';
            
            // 风险标签
            let riskBadges = '';
            if (user.main_risks && user.main_risks.length > 0) {
                riskBadges = user.main_risks.map((tag, index) => {
                    const badgeClass = index === 0 ? 'risk-user-badge primary' : 'risk-user-badge secondary';
                    return `<span class="${badgeClass}">${tag}</span>`;
                }).join('');
            }
            
            const region = user.city || '未知';
            const ip = user.last_ip || '未知';
            const time = user.last_login_at || '';
            
            return `
                <div class="risk-item-user" data-type="user" data-id="${user.user_id}">
                    <img src="${user.avatar || '../bob.png'}" alt="${user.user_id}" class="risk-user-avatar">
                    
                    <div class="risk-user-info">
                        <span class="risk-user-id">${user.user_id}</span>
                        ${riskBadges}
                        <div class="risk-user-meta">
                            <span><i class="fas fa-map-marker-alt"></i>${region}</span>
                            <span><i class="fas fa-network-wired"></i>${ip}</span>
                            <span><i class="fas fa-clock"></i>${formatTime(time)}</span>
                        </div>
                    </div>
                    
                    <div class="risk-user-score ${scoreClass}">
                        ${user.risk_score}
                    </div>
                    
                    <div class="risk-user-actions">
                        <button class="risk-action-btn review" onclick="app.viewUserDetail('${user.user_id}')">
                            <i class="fas fa-search"></i> 审核
                        </button>
                        <button class="risk-action-btn release" onclick="app.releaseOrder('${user.user_id}')">
                            <i class="fas fa-unlock"></i> 解单
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // 更新统计信息
        const criticalCount = riskUsersList.filter(u => u.risk_score >= 85).length;
        const highCount = riskUsersList.filter(u => u.risk_score >= 75 && u.risk_score < 85).length;
        const pendingCount = riskUsersList.filter(u => u.status === 'pending').length;
        
        const userTotalCountEl = document.getElementById('userTotalCount');
        if (userTotalCountEl) userTotalCountEl.textContent = riskUsersList.length;
        
        const criticalCountEl = document.getElementById('criticalCount');
        if (criticalCountEl) criticalCountEl.textContent = criticalCount;
        
        const highCountEl = document.getElementById('highCount');
        if (highCountEl) highCountEl.textContent = highCount;
        
        const pendingCountEl = document.getElementById('pendingCount');
        if (pendingCountEl) pendingCountEl.textContent = pendingCount;
        
        const queueTotalCountEl = document.getElementById('queueTotalCount');
        if (queueTotalCountEl) queueTotalCountEl.textContent = riskUsersList.length;
        
        const userStartRecordEl = document.getElementById('userStartRecord');
        if (userStartRecordEl) userStartRecordEl.textContent = '1';
        
        const userEndRecordEl = document.getElementById('userEndRecord');
        if (userEndRecordEl) userEndRecordEl.textContent = riskUsersList.length;
        
        const userTotalRecordsEl = document.getElementById('userTotalRecords');
        if (userTotalRecordsEl) userTotalRecordsEl.textContent = riskUsersList.length;
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
        this.showToast('正在应用过滤条件...', 'info');
        this.loadUsersView();
    }

    resetUserFilters() {
        document.getElementById('filterRiskLevel').value = '';
        document.getElementById('filterRiskType').value = '';
        document.getElementById('filterUserSearch').value = '';
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
        if (!container) {
            console.log('风险监控面板容器未找到');
            return;
        }

        // 合并待审核用户和团伙数据
        const allItems = [];
        
        // 添加用户数据
        let userCount = 0;
        if (typeof pendingReviewUsers !== 'undefined') {
            pendingReviewUsers.forEach(user => {
                allItems.push({
                    type: 'user',
                    data: user,
                    score: user.risk_score,
                    timestamp: user.created_at
                });
            });
            userCount = pendingReviewUsers.length;
        }
        
        // 添加团伙数据
        let syndicateCount = 0;
        if (typeof syndicateHotspotRanking !== 'undefined') {
            syndicateHotspotRanking.forEach(group => {
                allItems.push({
                    type: 'syndicate',
                    data: group,
                    score: group.risk_score,
                    timestamp: group.updated_at
                });
            });
            syndicateCount = syndicateHotspotRanking.length;
        }
        
        // 按风险分数降序排序
        allItems.sort((a, b) => b.score - a.score);
        
        // 保存所有数据到实例变量
        this.allRiskItems = allItems;
        this.currentDisplayLimit = 20;
        
        // 渲染HTML（初始显示20条）
        this.renderRiskItems();
        
        // 更新计数
        document.getElementById('totalCount').textContent = allItems.length;
        document.getElementById('usersCount').textContent = userCount;
        document.getElementById('syndicatesCount').textContent = syndicateCount;
        
        // 默认只显示用户
        this.filterRiskPanel('users');
        
        console.log('风险监控面板已加载:', {
            总数: allItems.length,
            用户: userCount,
            团伙: syndicateCount
        });
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
        
        // 添加"查看全部"按钮
        const showMoreBtn = !showAll && this.allRiskItems.length > this.currentDisplayLimit ? `
            <div class="risk-panel-footer">
                <button class="btn-view-all" onclick="app.showAllRiskItems()">
                    <i class="fas fa-chevron-down"></i>
                    查看全部 (剩余 ${this.allRiskItems.length - this.currentDisplayLimit} 项)
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
    
    // 渲染用户卡片 - 紧凑版
    renderUserCard(user) {
        const scoreClass = user.risk_score >= 90 ? 'critical' : 
                          user.risk_score >= 80 ? 'high' : 'medium';
        
        // 获取风险标签（显示多个标签）
        let riskBadges = '';
        if (user.tags && user.tags.length > 0) {
            // 显示所有标签
            riskBadges = user.tags.map((tag, index) => {
                // 第一个标签使用红色，其他使用不同颜色
                const badgeClass = index === 0 ? 'risk-user-badge primary' : 'risk-user-badge secondary';
                return `<span class="${badgeClass}">${tag}</span>`;
            }).join('');
        } else if (user.reason) {
            riskBadges = `<span class="risk-user-badge primary">${user.reason}</span>`;
        } else {
            riskBadges = `<span class="risk-user-badge primary">待审核</span>`;
        }
        
        // 获取地区和IP信息
        const region = user.region || user.city || user.location || '未知';
        const ip = user.ip || user.last_ip || user.login_ip || '未知';
        const time = user.created_at || user.last_login_at || new Date().toISOString();
        
        return `
            <div class="risk-item-user" data-type="user" data-id="${user.user_id}">
                <img src="${user.avatar || '../bob.png'}" alt="${user.user_id}" class="risk-user-avatar">
                
                <div class="risk-user-info">
                    <span class="risk-user-id">${user.user_id}</span>
                    ${riskBadges}
                    <div class="risk-user-meta">
                        <span><i class="fas fa-map-marker-alt"></i>${region}</span>
                        <span><i class="fas fa-network-wired"></i>${ip}</span>
                        <span><i class="fas fa-clock"></i>${formatTime(time)}</span>
                    </div>
                </div>
                
                <div class="risk-user-score ${scoreClass}">
                    ${user.risk_score}
                </div>
                
                <div class="risk-user-actions">
                    <button class="risk-action-btn review" onclick="app.reviewUser('${user.user_id}')">
                        <i class="fas fa-search"></i> 审核
                    </button>
                    <button class="risk-action-btn release" onclick="app.releaseOrder('${user.user_id}')">
                        <i class="fas fa-unlock"></i> 解单
                    </button>
                </div>
            </div>
        `;
    }
    
    // 渲染团伙卡片 - 紧凑版
    renderSyndicateCard(group) {
        const scoreClass = group.risk_score >= 90 ? 'critical' : 
                          group.risk_score >= 80 ? 'high' : 'medium';
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
                            <button class="btn-sm btn-danger" onclick="event.stopPropagation(); app.closeCase('${user.user_id}')">
                                <i class="fas fa-times-circle"></i> 解单
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

    // ==================== 加载风险事件中心视图 ====================
    loadEventsView() {
        console.log('loadEventsView called');
        const container = document.getElementById('eventsTimeline');
        console.log('eventsTimeline container:', container);
        console.log('realtimeAlertFeed data:', realtimeAlertFeed);
        if (!container) {
            console.error('eventsTimeline container not found!');
            return;
        }

        container.innerHTML = realtimeAlertFeed.map(event => {
            const levelClass = event.level === 'critical' ? 'critical' : event.level === 'high' ? 'high' : 'medium';
            const levelText = event.level === 'critical' ? '🔴 严重' : event.level === 'high' ? '🟠 高危' : '🟡 中等';
            const typeIcon = this.getEventTypeIcon(event.event_type);
            const typeText = this.getEventTypeText(event.event_type);
            
            return `
                <div class="event-card ${levelClass}">
                    <div class="event-card-left">
                        <div class="event-icon ${levelClass}">
                            <i class="fas ${typeIcon}"></i>
                        </div>
                        <div class="event-content">
                            <div class="event-header">
                                <span class="event-type-badge ${levelClass}">${typeText}</span>
                                <span class="event-level-badge ${levelClass}">${levelText}</span>
                                <span class="event-time"><i class="fas fa-clock"></i> ${event.created_at}</span>
                            </div>
                            <div class="event-description">${event.description}</div>
                            <div class="event-users">
                                <i class="fas fa-users"></i> 涉及用户：${event.user_ids.map(uid => `<span class="event-user-id" onclick="app.viewUserDetail('${uid}')">${uid}</span>`).join(', ')}
                            </div>
                        </div>
                    </div>
                    <div class="event-card-right">
                        <div class="event-action-status success">
                            <i class="fas fa-check-circle"></i> ${event.auto_action}
                        </div>
                        <button class="btn-event-detail" onclick="app.viewEventDetail('${event.alert_id}')">
                            <i class="fas fa-info-circle"></i> 详情
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // 更新统计
        const todayCount = realtimeAlertFeed.length;
        const criticalCount = realtimeAlertFeed.filter(e => e.level === 'critical').length;
        const autoHandled = realtimeAlertFeed.filter(e => e.auto_action && e.auto_action !== '待人工处理').length;
        const pendingReview = realtimeAlertFeed.filter(e => e.auto_action === '待人工处理').length;
        
        const todayEventCountEl = document.getElementById('todayEventCount');
        if (todayEventCountEl) todayEventCountEl.textContent = todayCount;
        
        const criticalEventCountEl = document.getElementById('criticalEventCount');
        if (criticalEventCountEl) criticalEventCountEl.textContent = criticalCount;
        
        const autoHandledCountEl = document.getElementById('autoHandledCount');
        if (autoHandledCountEl) autoHandledCountEl.textContent = autoHandled;
        
        const pendingReviewEventCountEl = document.getElementById('pendingReviewEventCount');
        if (pendingReviewEventCountEl) pendingReviewEventCountEl.textContent = pendingReview;
        
        const eventTotalCountEl = document.getElementById('eventTotalCount');
        if (eventTotalCountEl) eventTotalCountEl.textContent = todayCount;
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

    viewEventDetail(eventId) {
        this.showToast(`查看事件 ${eventId} 的详细信息`, 'info');
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
