// 高可用AI风险监控系统 V3 - 右下角告警弹窗版

class RiskMonitoringSystemV3 {
    constructor() {
        this.currentView = 'overview';
        this.selectedUsers = new Set();
        this.alertPopupVisible = false;
        this.alertsRead = new Set();
        this.newAlertsCount = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadOverviewData();
        this.initCharts();
        this.initAlertSystem();
        this.startRealtimeUpdates();
    }

    bindEvents() {
        // 视图切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.currentTarget.dataset.view);
            });
        });

        // 告警铃铛按钮
        document.getElementById('alertBellBtn')?.addEventListener('click', () => {
            this.toggleAlertPopup();
        });

        // 关闭告警弹窗
        document.getElementById('closeAlertPopup')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideAlertPopup();
        });

        // 告警弹窗头部点击展开/收起
        document.querySelector('.alert-popup-header')?.addEventListener('click', (e) => {
            if (!e.target.closest('.alert-popup-actions')) {
                this.toggleAlertPopupMinimize();
            }
        });

        // 全部已读
        document.getElementById('markAllReadBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAllAlertsRead();
        });

        // 查看全部告警
        document.getElementById('viewAllAlerts')?.addEventListener('click', () => {
            this.hideAlertPopup();
            this.switchView('events');
        });

        // 点击弹窗外部关闭
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('alertPopup');
            const bellBtn = document.getElementById('alertBellBtn');
            if (this.alertPopupVisible && 
                !popup.contains(e.target) && 
                !bellBtn.contains(e.target)) {
                this.hideAlertPopup();
            }
        });

        // 全局刷新
        document.getElementById('refreshAll')?.addEventListener('click', () => this.refreshAllData());

        // 用户列表相关事件
        document.getElementById('applyUserFilters')?.addEventListener('click', () => this.applyUserFilters());
        document.getElementById('resetUserFilters')?.addEventListener('click', () => this.resetUserFilters());
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportUsers());
        document.getElementById('selectAll')?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        document.getElementById('cancelSelection')?.addEventListener('click', () => this.cancelSelection());
    }

    // ==================== 告警系统 ====================
    initAlertSystem() {
        this.loadAlertPopup();
        
        // 模拟新告警到达
        setInterval(() => {
            if (Math.random() < 0.3) { // 30%概率产生新告警
                this.addNewAlert();
            }
        }, 30000); // 每30秒检查一次
    }

    toggleAlertPopup() {
        this.alertPopupVisible = !this.alertPopupVisible;
        const popup = document.getElementById('alertPopup');
        
        if (this.alertPopupVisible) {
            popup.classList.add('show');
            popup.classList.remove('minimized');
            this.loadAlertPopup();
        } else {
            popup.classList.remove('show');
        }
    }

    hideAlertPopup() {
        this.alertPopupVisible = false;
        document.getElementById('alertPopup').classList.remove('show');
    }

    toggleAlertPopupMinimize() {
        const popup = document.getElementById('alertPopup');
        popup.classList.toggle('minimized');
    }

    loadAlertPopup() {
        const container = document.getElementById('alertPopupBody');
        if (!container) return;

        const unreadAlerts = urgentAlerts.filter(alert => !this.alertsRead.has(alert.id));
        const readAlerts = urgentAlerts.filter(alert => this.alertsRead.has(alert.id));
        
        // 更新告警计数
        this.updateAlertCount(unreadAlerts.length);

        if (urgentAlerts.length === 0) {
            container.innerHTML = `
                <div class="alert-empty">
                    <i class="fas fa-check-circle"></i>
                    <p>暂无告警信息</p>
                    <p style="font-size: 12px; margin-top: 4px;">系统运行正常</p>
                </div>
            `;
            return;
        }

        container.innerHTML = [...unreadAlerts, ...readAlerts].map(alert => `
            <div class="popup-alert-item ${alert.level} ${this.alertsRead.has(alert.id) ? 'read' : ''}" 
                 data-alert-id="${alert.id}"
                 onclick="app.handleAlertClick('${alert.id}')">
                <div class="popup-alert-icon">
                    <i class="fas ${this.getAlertIcon(alert.level)}"></i>
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
                        ${!this.alertsRead.has(alert.id) ? '<span style="color: var(--danger-color); font-weight: 600;">未读</span>' : ''}
                    </div>
                </div>
                <div class="popup-alert-actions">
                    <button class="btn-alert-action success" 
                            onclick="event.stopPropagation(); app.handleAlert('${alert.id}')" 
                            title="处理">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-alert-action" 
                            onclick="event.stopPropagation(); app.viewAlertDetail('${alert.id}')" 
                            title="详情">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getAlertIcon(level) {
        const icons = {
            'critical': 'fa-fire',
            'high': 'fa-exclamation-triangle',
            'medium': 'fa-exclamation-circle',
            'low': 'fa-info-circle'
        };
        return icons[level] || 'fa-bell';
    }

    updateAlertCount(count) {
        const badge = document.getElementById('alertBadge');
        const popupCount = document.getElementById('popupAlertCount');
        const criticalAlerts = document.getElementById('criticalAlerts');
        
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
            if (count > this.newAlertsCount) {
                badge.classList.add('updated');
                setTimeout(() => badge.classList.remove('updated'), 400);
            }
        }
        
        if (popupCount) {
            popupCount.textContent = count;
        }
        
        if (criticalAlerts) {
            criticalAlerts.textContent = count;
        }
        
        this.newAlertsCount = count;
    }

    handleAlertClick(alertId) {
        // 标记为已读
        this.alertsRead.add(alertId);
        this.loadAlertPopup();
        
        // 显示详情
        this.viewAlertDetail(alertId);
    }

    handleAlert(alertId) {
        this.alertsRead.add(alertId);
        this.loadAlertPopup();
        this.showToast(`正在处理告警 ${alertId}...`, 'info');
        
        // 模拟处理
        setTimeout(() => {
            this.showToast('告警处理成功', 'success');
        }, 1000);
    }

    viewAlertDetail(alertId) {
        const alert = urgentAlerts.find(a => a.id === alertId);
        if (!alert) return;
        
        this.showToast(`查看告警详情: ${alert.title}`, 'info');
        // 这里可以打开详情弹窗或跳转到用户详情页
    }

    markAllAlertsRead() {
        urgentAlerts.forEach(alert => {
            this.alertsRead.add(alert.id);
        });
        this.loadAlertPopup();
        this.showToast('所有告警已标记为已读', 'success');
    }

    addNewAlert() {
        const newAlert = {
            id: `ALERT_${Date.now()}`,
            level: Math.random() < 0.3 ? 'critical' : 'high',
            title: '检测到新的风险行为',
            description: `用户 U${Math.floor(Math.random() * 900000 + 100000)} 触发风险规则`,
            user_id: `U${Math.floor(Math.random() * 900000 + 100000)}`,
            time: '刚刚',
            status: 'pending'
        };
        
        urgentAlerts.unshift(newAlert);
        
        // 更新显示
        this.loadAlertPopup();
        
        // 如果弹窗未打开，显示新告警提示
        if (!this.alertPopupVisible) {
            this.showNewAlertNotification(newAlert);
        }
        
        // 播放提示音（可选）
        this.playAlertSound();
    }

    showNewAlertNotification(alert) {
        const notification = this.showToast(
            `🚨 ${alert.title}: ${alert.description}`,
            alert.level === 'critical' ? 'error' : 'warning',
            5000
        );
        
        // 点击通知打开告警弹窗
        if (notification) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', () => {
                this.toggleAlertPopup();
            });
        }
    }

    playAlertSound() {
        // 这里可以添加音效播放逻辑
        // const audio = new Audio('/sounds/alert.mp3');
        // audio.play();
        
        // 显示音效指示器
        const indicator = document.createElement('div');
        indicator.className = 'sound-indicator active';
        indicator.innerHTML = '<i class="fas fa-volume-up"></i>';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 600);
    }

    // ==================== 视图管理 ====================
    switchView(viewName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewName;

        switch(viewName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'users':
                this.loadUsersData();
                break;
        }
    }

    // ==================== 概览仪表板 ====================
    loadOverviewData() {
        this.loadTopRisks();
        this.loadSyndicateMonitor();
        this.updateHeaderStats();
    }

    loadTopRisks() {
        const container = document.getElementById('topRisksList');
        if (!container) return;

        container.innerHTML = topRiskUsers.map(user => {
            const rankClass = user.rank <= 3 ? (user.rank === 1 ? 'gold' : 'silver') : '';
            return `
                <div class="risk-user-item" onclick="app.viewUserDetail('${user.user_id}')">
                    <div class="risk-rank ${rankClass}">${user.rank}</div>
                    <div class="risk-user-info">
                        <div class="risk-user-id">${user.user_id}</div>
                        <div class="risk-user-events">${user.main_events.join(' · ')}</div>
                    </div>
                    <div class="risk-score-badge">${user.risk_score}</div>
                </div>
            `;
        }).join('');
    }

    loadSyndicateMonitor() {
        const container = document.getElementById('syndicateList');
        if (!container) return;

        container.innerHTML = syndicateGroups.map(group => `
            <div class="syndicate-item" onclick="app.viewSyndicate('${group.id}')">
                <div class="syndicate-header">
                    <div class="syndicate-name">
                        <i class="fas fa-users"></i> ${group.name}
                    </div>
                    <div class="syndicate-risk">${getRiskLevelText(group.risk_level)}</div>
                </div>
                <div class="syndicate-members">
                    <i class="fas fa-user"></i> ${group.member_count}个成员
                    · 交易金额: ${formatCurrency(group.total_amount)}
                </div>
                <div class="syndicate-tags">
                    ${group.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    updateHeaderStats() {
        const unreadCount = urgentAlerts.filter(a => !this.alertsRead.has(a.id)).length;
        this.updateAlertCount(unreadCount);
        
        document.getElementById('highRiskUsers').textContent = topRiskUsers.length;
        document.getElementById('syndicateGroups').textContent = syndicateGroups.length;
        document.getElementById('processedToday').textContent = recentOperations.length;
    }

    // ==================== 图表初始化 ====================
    initCharts() {
        this.initRiskTrendChart();
        this.initRiskDistributionChart();
    }

    initRiskTrendChart() {
        const chartDom = document.getElementById('riskTrendChart');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['紧急', '高风险', '中风险', '低风险']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: riskTrendData.labels
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '紧急',
                    type: 'line',
                    stack: 'Total',
                    data: riskTrendData.critical,
                    itemStyle: { color: '#dc2626' },
                    areaStyle: { color: 'rgba(220, 38, 38, 0.3)' }
                },
                {
                    name: '高风险',
                    type: 'line',
                    stack: 'Total',
                    data: riskTrendData.high,
                    itemStyle: { color: '#f59e0b' },
                    areaStyle: { color: 'rgba(245, 158, 11, 0.3)' }
                },
                {
                    name: '中风险',
                    type: 'line',
                    stack: 'Total',
                    data: riskTrendData.medium,
                    itemStyle: { color: '#0ea5e9' },
                    areaStyle: { color: 'rgba(14, 165, 233, 0.3)' }
                },
                {
                    name: '低风险',
                    type: 'line',
                    stack: 'Total',
                    data: riskTrendData.low,
                    itemStyle: { color: '#10b981' },
                    areaStyle: { color: 'rgba(16, 185, 129, 0.3)' }
                }
            ]
        };

        myChart.setOption(option);
    }

    initRiskDistributionChart() {
        const chartDom = document.getElementById('riskDistributionChart');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '风险类型',
                    type: 'pie',
                    radius: '70%',
                    data: riskDistributionData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {c} ({d}%)'
                    }
                }
            ]
        };

        myChart.setOption(option);
    }

    // ==================== 用户列表管理 ====================
    loadUsersData() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = enhancedRiskUsers.map(user => `
            <tr>
                <td><input type="checkbox" class="user-checkbox" value="${user.user_id}"></td>
                <td><strong>${user.user_id}</strong></td>
                <td><span style="font-size: 18px; font-weight: 700; color: ${getRiskLevelColor(user.risk_level)}">${user.risk_score}</span></td>
                <td><span class="risk-badge ${user.risk_level}">${getRiskLevelText(user.risk_level)}</span></td>
                <td>${user.main_risk}</td>
                <td>${formatDateTime(user.triggered_at)}</td>
                <td><span class="badge">${user.related_accounts}</span></td>
                <td><span class="status-badge ${user.status}">${getStatusText(user.status)}</span></td>
                <td>
                    <button class="btn-sm btn-outline" onclick="app.viewUserDetail('${user.user_id}')">
                        <i class="fas fa-eye"></i> 详情
                    </button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedUsers.add(e.target.value);
                } else {
                    this.selectedUsers.delete(e.target.value);
                }
                this.updateBatchActions();
            });
        });
    }

    toggleSelectAll(checked) {
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedUsers.add(checkbox.value);
            } else {
                this.selectedUsers.delete(checkbox.value);
            }
        });
        this.updateBatchActions();
    }

    updateBatchActions() {
        const batchBar = document.getElementById('batchActionsBar');
        const count = document.getElementById('selectedCount');
        
        if (this.selectedUsers.size > 0) {
            batchBar.style.display = 'flex';
            count.textContent = this.selectedUsers.size;
        } else {
            batchBar.style.display = 'none';
        }
    }

    cancelSelection() {
        this.selectedUsers.clear();
        document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('selectAll').checked = false;
        this.updateBatchActions();
    }

    // ==================== UI辅助方法 ====================
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<strong>${message}</strong>`;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, duration);
        
        return toast;
    }

    viewUserDetail(userId) {
        this.showToast(`正在加载 ${userId} 的详细信息...`, 'info');
    }

    viewSyndicate(syndicateId) {
        this.showToast(`正在加载团伙详细信息...`, 'info');
    }

    applyUserFilters() {
        this.showToast('正在应用过滤条件...', 'info');
        this.loadUsersData();
    }

    resetUserFilters() {
        document.getElementById('filterRiskLevel').value = '';
        document.getElementById('filterRiskType').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterUserSearch').value = '';
        this.loadUsersData();
    }

    exportUsers() {
        this.showToast('正在导出用户数据...', 'info');
    }

    refreshAllData() {
        this.showLoading();
        setTimeout(() => {
            this.loadOverviewData();
            this.loadAlertPopup();
            this.hideLoading();
            this.showToast('数据已刷新', 'success');
        }, 1000);
    }

    startRealtimeUpdates() {
        setInterval(() => {
            if (this.currentView === 'overview') {
                this.updateHeaderStats();
            }
        }, 30000);
    }
}

// 初始化应用（如果没有被V4覆盖）
if (typeof app === 'undefined') {
    window.app = new RiskMonitoringSystemV3();
}
