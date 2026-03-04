// 高可用AI风险监控系统 V2 - 主应用逻辑

class RiskMonitoringSystemV2 {
    constructor() {
        this.currentView = 'overview';
        this.selectedUsers = new Set();
        this.autoRefresh = false;
        this.refreshInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadOverviewData();
        this.initCharts();
        this.startRealtimeUpdates();
    }

    bindEvents() {
        // 视图切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.currentTarget.dataset.view);
            });
        });

        // 全局刷新
        document.getElementById('refreshAll')?.addEventListener('click', () => this.refreshAllData());

        // 用户列表过滤
        document.getElementById('applyUserFilters')?.addEventListener('click', () => this.applyUserFilters());
        document.getElementById('resetUserFilters')?.addEventListener('click', () => this.resetUserFilters());
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportUsers());

        // 批量操作
        document.getElementById('selectAll')?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        document.getElementById('batchLimit')?.addEventListener('click', () => this.batchLimitUsers());
        document.getElementById('batchBlock')?.addEventListener('click', () => this.batchBlockUsers());
        document.getElementById('cancelSelection')?.addEventListener('click', () => this.cancelSelection());

        // 快速操作
        document.getElementById('quickBan')?.addEventListener('click', () => this.showQuickAction('ban'));
        document.getElementById('quickLimit')?.addEventListener('click', () => this.showQuickAction('limit'));
        document.getElementById('quickUnlock')?.addEventListener('click', () => this.showQuickAction('unlock'));
        
        // 关系图谱
        document.getElementById('generateGraph')?.addEventListener('click', () => this.generateRelationshipGraph());
        
        // 告警标记已读
        document.getElementById('markAllRead')?.addEventListener('click', () => this.markAllAlertsRead());
        
        // 自动刷新事件
        document.getElementById('autoRefreshEvents')?.addEventListener('click', (e) => this.toggleAutoRefresh(e.target));

        // 导出报表
        document.getElementById('exportReport')?.addEventListener('click', () => this.exportReport());

        // 弹窗关闭
        document.getElementById('closeUserDetail')?.addEventListener('click', () => this.closeModal('userDetailModal'));
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal('userDetailModal'));
        document.getElementById('closeConfirm')?.addEventListener('click', () => this.closeModal('confirmModal'));
        document.getElementById('cancelConfirm')?.addEventListener('click', () => this.closeModal('confirmModal'));
    }

    // ==================== 视图管理 ====================
    switchView(viewName) {
        // 更新标签页状态
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
        switch(viewName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'events':
                this.loadEventsData();
                break;
            case 'relationships':
                this.loadRelationshipsData();
                break;
            case 'operations':
                this.loadOperationsData();
                break;
        }
    }

    // ==================== 概览仪表板 ====================
    loadOverviewData() {
        this.loadUrgentAlerts();
        this.loadTopRisks();
        this.loadSyndicateMonitor();
        this.updateHeaderStats();
    }

    loadUrgentAlerts() {
        const container = document.getElementById('urgentAlertsList');
        if (!container) return;

        container.innerHTML = urgentAlerts.map(alert => `
            <div class="alert-item ${alert.level}" data-alert-id="${alert.id}">
                <div class="alert-icon">
                    <i class="fas ${alert.level === 'critical' ? 'fa-fire' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-desc">${alert.description}</div>
                    <div class="alert-meta">
                        <span><i class="fas fa-user"></i> ${alert.user_id}</span>
                        <span><i class="fas fa-clock"></i> ${alert.time}</span>
                        <span class="status-badge ${alert.status}">${getStatusText(alert.status)}</span>
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="btn-sm btn-primary" onclick="app.handleAlert('${alert.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
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
        document.getElementById('criticalAlerts').textContent = urgentAlerts.filter(a => a.level === 'critical').length;
        document.getElementById('highRiskUsers').textContent = topRiskUsers.length;
        document.getElementById('syndicateGroups').textContent = syndicateGroups.length;
        document.getElementById('processedToday').textContent = recentOperations.filter(op => 
            op.timestamp.includes(new Date().toISOString().split('T')[0])
        ).length;
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

        // 绑定复选框事件
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

        this.updatePagination();
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

    // ==================== 事件监控 ====================
    loadEventsData() {
        const timeline = document.getElementById('eventsTimeline');
        if (!timeline) return;

        timeline.innerHTML = eventsTimeline.map(event => `
            <div class="timeline-item">
                <div class="timeline-dot ${event.level}">
                    <i class="fas ${event.level === 'critical' ? 'fa-fire' : 'fa-exclamation'}"></i>
                </div>
                <div class="timeline-content ${event.level}">
                    <div class="timeline-time">${formatDateTime(event.time)}</div>
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-desc">${event.description}</div>
                    <div class="timeline-meta">
                        <span><i class="fas fa-users"></i> ${event.users.join(', ')}</span>
                        <span><i class="fas fa-robot"></i> ${event.auto_action}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleAutoRefresh(button) {
        this.autoRefresh = !this.autoRefresh;
        if (this.autoRefresh) {
            button.innerHTML = '<i class="fas fa-pause"></i> 停止刷新';
            this.refreshInterval = setInterval(() => this.loadEventsData(), 5000);
        } else {
            button.innerHTML = '<i class="fas fa-play"></i> 自动刷新';
            if (this.refreshInterval) clearInterval(this.refreshInterval);
        }
    }

    // ==================== 关系图谱 ====================
    loadRelationshipsData() {
        // 初始化空白画布
        const canvas = document.getElementById('relationshipGraphCanvas');
        if (!canvas) return;
        
        canvas.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;"><div><i class="fas fa-project-diagram" style="font-size: 48px; margin-bottom: 16px;"></i><p>请输入用户ID并点击"生成图谱"</p></div></div>';
    }

    generateRelationshipGraph() {
        const centerNode = document.getElementById('centerNodeInput').value.trim();
        if (!centerNode) {
            this.showToast('请输入中心节点用户ID', 'warning');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            const chartDom = document.getElementById('relationshipGraphCanvas');
            const myChart = echarts.init(chartDom);

            // 模拟关系图数据
            const option = {
                tooltip: {},
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 50,
                        roam: true,
                        label: {
                            show: true
                        },
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [4, 10],
                        data: [
                            { name: centerNode, value: 95, symbolSize: 70, itemStyle: { color: '#dc2626' } },
                            { name: 'U334455', value: 87, itemStyle: { color: '#f59e0b' } },
                            { name: 'U778899', value: 82, itemStyle: { color: '#f59e0b' } },
                            { name: 'Device_A', value: 50, symbol: 'rect', itemStyle: { color: '#3b82f6' } },
                            { name: 'Device_B', value: 50, symbol: 'rect', itemStyle: { color: '#3b82f6' } },
                            { name: 'IP_192.168.1.1', value: 40, symbol: 'diamond', itemStyle: { color: '#10b981' } },
                            { name: 'QR_889922', value: 45, symbol: 'triangle', itemStyle: { color: '#8b5cf6' } }
                        ],
                        links: [
                            { source: centerNode, target: 'Device_A' },
                            { source: centerNode, target: 'Device_B' },
                            { source: centerNode, target: 'IP_192.168.1.1' },
                            { source: centerNode, target: 'QR_889922' },
                            { source: 'U334455', target: 'Device_A' },
                            { source: 'U778899', target: 'Device_B' },
                            { source: 'U334455', target: 'IP_192.168.1.1' },
                            { source: 'U334455', target: 'QR_889922' },
                            { source: 'U778899', target: 'QR_889922' }
                        ],
                        lineStyle: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        },
                        force: {
                            repulsion: 200,
                            edgeLength: 100
                        }
                    }
                ]
            };

            myChart.setOption(option);
            this.hideLoading();
            this.showToast('关系图谱生成成功', 'success');
        }, 1000);
    }

    // ==================== 运营操作台 ====================
    loadOperationsData() {
        this.loadPendingTasks();
        this.loadRecentOperations();
    }

    loadPendingTasks() {
        const container = document.getElementById('pendingTasksList');
        if (!container) return;

        container.innerHTML = pendingTasks.map(task => `
            <div class="task-item" onclick="app.handleTask('${task.id}')">
                <div class="task-title">${task.task_type} - ${task.user_id}</div>
                <div class="task-desc">${task.description}</div>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                    <span><i class="fas fa-user"></i> ${task.assigned_to}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(task.created_at)}</span>
                </div>
            </div>
        `).join('');
    }

    loadRecentOperations() {
        const container = document.getElementById('recentOperations');
        if (!container) return;

        container.innerHTML = recentOperations.map(op => `
            <div class="log-item">
                <div class="log-action">
                    <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                    ${op.action} - ${op.target}
                </div>
                <div class="log-meta">
                    <span><i class="fas fa-user"></i> ${op.operator}</span>
                    <span><i class="fas fa-comment"></i> ${op.reason}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(op.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    // ==================== 用户详情 ====================
    viewUserDetail(userId) {
        const user = enhancedRiskUsers.find(u => u.user_id === userId);
        if (!user) return;

        // 显示弹窗逻辑
        this.showToast(`正在加载 ${userId} 的详细信息...`, 'info');
    }

    viewSyndicate(syndicateId) {
        const syndicate = syndicateGroups.find(s => s.id === syndicateId);
        if (!syndicate) return;

        this.showToast(`正在加载团伙 ${syndicate.name} 的详细信息...`, 'info');
    }

    handleAlert(alertId) {
        this.showToast(`正在处理告警 ${alertId}...`, 'info');
    }

    handleTask(taskId) {
        this.showToast(`正在处理任务 ${taskId}...`, 'info');
    }

    // ==================== 批量操作 ====================
    batchLimitUsers() {
        if (this.selectedUsers.size === 0) return;
        this.showToast(`正在限制 ${this.selectedUsers.size} 个用户...`, 'warning');
    }

    batchBlockUsers() {
        if (this.selectedUsers.size === 0) return;
        this.showToast(`正在封禁 ${this.selectedUsers.size} 个用户...`, 'danger');
    }

    showQuickAction(action) {
        this.showToast(`正在执行快速操作: ${action}`, 'info');
    }

    // ==================== UI辅助方法 ====================
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <strong>${message}</strong>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    updatePagination() {
        document.getElementById('userStartRecord').textContent = 1;
        document.getElementById('userEndRecord').textContent = enhancedRiskUsers.length;
        document.getElementById('userTotalRecords').textContent = enhancedRiskUsers.length;
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
        document.getElementById('filterDateStart').value = '';
        document.getElementById('filterDateEnd').value = '';
        this.loadUsersData();
    }

    exportUsers() {
        this.showToast('正在导出用户数据...', 'info');
    }

    exportReport() {
        this.showToast('正在生成报表...', 'info');
    }

    markAllAlertsRead() {
        this.showToast('所有告警已标记为已读', 'success');
    }

    refreshAllData() {
        this.showLoading();
        setTimeout(() => {
            this.loadOverviewData();
            this.hideLoading();
            this.showToast('数据已刷新', 'success');
        }, 1000);
    }

    startRealtimeUpdates() {
        // 模拟实时数据更新
        setInterval(() => {
            if (this.currentView === 'overview') {
                this.updateHeaderStats();
            }
        }, 30000); // 每30秒更新一次
    }
}

// 初始化应用
const app = new RiskMonitoringSystemV2();



