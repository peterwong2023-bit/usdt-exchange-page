// AI风险监控系统 - 主应用逻辑

class RiskMonitoringApp {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 50;
        this.totalRecords = riskUsersData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.selectedUserId = null;
        this.currentFilters = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTableData();
        this.loadAuditLogs();
        this.updatePagination();
        this.updateHeaderStats();
    }

    bindEvents() {
        // 过滤器事件
        document.getElementById('applyFilters').addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());

        // 分页事件
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(this.currentPage - 1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(this.currentPage + 1));

        // 表格操作事件
        document.getElementById('refreshTable').addEventListener('click', () => this.refreshTable());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());

        // 侧边栏事件
        document.getElementById('closeSidebar').addEventListener('click', () => this.closeSidebar());

        // 图表类型切换
        document.getElementById('graphType').addEventListener('change', (e) => this.updateGraph(e.target.value));

        // 审计日志事件
        document.getElementById('clearLogs').addEventListener('click', () => this.clearAuditLogs());

        // 头部刷新按钮
        document.getElementById('refreshData').addEventListener('click', () => this.refreshAllData());
    }

    // 加载表格数据
    loadTableData() {
        const tableBody = document.getElementById('tableBody');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

        // 应用过滤器
        let filteredData = this.applyDataFilters(riskUsersData);
        const pageData = filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach(user => {
            const row = this.createTableRow(user);
            tableBody.appendChild(row);
        });

        this.updatePaginationInfo(filteredData.length);
    }

    // 创建表格行
    createTableRow(user) {
        const row = document.createElement('tr');
        row.dataset.userId = user.user_id;

        row.innerHTML = `
            <td>${user.user_id}</td>
            <td>
                <div class="risk-score">
                    <span class="score-number">${user.risk_score}</span>
                </div>
            </td>
            <td>
                <span class="risk-level ${getRiskLevelClass(user.risk_level)}">
                    <i class="fas fa-circle"></i>
                    ${this.getRiskLevelText(user.risk_level)}
                </span>
            </td>
            <td>
                <div class="event-tags">
                    ${user.triggered_events.map(event =>
                        `<span class="event-tag">${getEventDescription(event)}</span>`
                    ).join('')}
                </div>
            </td>
            <td>${user.last_login_city}</td>
            <td>${user.device_count_24h}</td>
            <td>${user.high_risk_relations}</td>
            <td>${formatDateTime(user.updated_at)}</td>
            <td>
                <button class="action-btn" onclick="app.viewUserDetail('${user.user_id}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
            </td>
        `;

        // 添加行点击事件
        row.addEventListener('click', () => {
            this.selectUser(user.user_id);
        });

        return row;
    }

    // 获取风险等级文本
    getRiskLevelText(level) {
        const levels = {
            'high': '高风险',
            'medium': '中风险',
            'low': '低风险'
        };
        return levels[level] || level;
    }

    // 选择用户
    selectUser(userId) {
        // 清除之前的选择
        document.querySelectorAll('#tableBody tr').forEach(row => {
            row.classList.remove('selected');
        });

        // 选择当前行
        const selectedRow = document.querySelector(`[data-user-id="${userId}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected');
        }

        this.selectedUserId = userId;
        this.showUserDetail(userId);
    }

    // 显示用户详情
    showUserDetail(userId) {
        const detailData = riskEventsData[userId];
        if (!detailData) {
            this.showSidebarPlaceholder();
            return;
        }

        const sidebarContent = document.getElementById('sidebarContent');

        sidebarContent.innerHTML = `
            <!-- 基本信息 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-user"></i>
                    基本信息
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">用户ID</span>
                        <span class="detail-value">${detailData.basic_info.user_id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">注册日期</span>
                        <span class="detail-value">${detailData.basic_info.registration_date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">总交易数</span>
                        <span class="detail-value">${detailData.basic_info.total_trades}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">账户余额</span>
                        <span class="detail-value">$${detailData.basic_info.account_balance.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <!-- 风险摘要 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    风险摘要
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">风险评分</span>
                        <span class="detail-value risk-level ${getRiskLevelClass(detailData.risk_summary.risk_level)}">
                            ${detailData.risk_summary.risk_score}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">风险等级</span>
                        <span class="detail-value">${this.getRiskLevelText(detailData.risk_summary.risk_level)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">最后评估</span>
                        <span class="detail-value">${formatDateTime(detailData.risk_summary.last_assessment)}</span>
                    </div>
                </div>
            </div>

            <!-- 风险事件 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-list-ul"></i>
                    风险事件 (${detailData.risk_events.length})
                </div>
                <div class="detail-card-body">
                    <ul class="events-list">
                        ${detailData.risk_events.map(event => `
                            <li class="event-item">
                                <div class="event-info">
                                    <div class="event-name">${getEventDescription(event.event_key)}</div>
                                    <div class="event-desc">${event.description}</div>
                                </div>
                                <div>
                                    <div class="event-score">${event.risk_score}分</div>
                                    <span class="event-severity ${getSeverityClass(event.severity)}">
                                        ${this.getSeverityText(event.severity)}
                                    </span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <!-- 设备信息 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-mobile-alt"></i>
                    设备信息
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">当前设备</span>
                        <span class="detail-value">${detailData.device_info.current_device}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">设备指纹</span>
                        <span class="detail-value">${detailData.device_info.device_fingerprint}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">24h设备数</span>
                        <span class="detail-value">${detailData.device_info.device_count_24h}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">7天设备数</span>
                        <span class="detail-value">${detailData.device_info.device_count_7d}</span>
                    </div>
                </div>
            </div>

            <!-- IP信息 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-globe"></i>
                    IP信息
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">当前IP</span>
                        <span class="detail-value">${detailData.ip_info.current_ip}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">IP位置</span>
                        <span class="detail-value">${detailData.ip_info.ip_location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">24h变更次数</span>
                        <span class="detail-value">${detailData.ip_info.ip_change_count_24h}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">共享账户数</span>
                        <span class="detail-value">${detailData.ip_info.ip_shared_accounts}</span>
                    </div>
                </div>
            </div>

            <!-- 支付信息 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-credit-card"></i>
                    支付信息
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">主要支付方式</span>
                        <span class="detail-value">${detailData.payment_info.primary_payment}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">支付共享数</span>
                        <span class="detail-value">${detailData.payment_info.payment_shared_count}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">24h支付金额</span>
                        <span class="detail-value">$${detailData.payment_info.payment_amount_24h.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">支付频率</span>
                        <span class="detail-value">${this.getFrequencyText(detailData.payment_info.payment_frequency)}</span>
                    </div>
                </div>
            </div>

            <!-- 交易信息 -->
            <div class="detail-card">
                <div class="detail-card-header">
                    <i class="fas fa-exchange-alt"></i>
                    交易信息
                </div>
                <div class="detail-card-body">
                    <div class="detail-item">
                        <span class="detail-label">24h交易数</span>
                        <span class="detail-value">${detailData.trade_info.trades_24h}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">7天交易数</span>
                        <span class="detail-value">${detailData.trade_info.trades_7d}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">取消率</span>
                        <span class="detail-value">${detailData.trade_info.cancel_rate}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">平均交易金额</span>
                        <span class="detail-value">$${detailData.trade_info.avg_trade_amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        // 更新其他面板
        this.updateUserProfile(userId);
        this.updateAIScoring(userId);
        this.updateGraph('device');
    }

    // 显示侧边栏占位符
    showSidebarPlaceholder() {
        const sidebarContent = document.getElementById('sidebarContent');
        sidebarContent.innerHTML = `
            <div class="sidebar-placeholder">
                <i class="fas fa-arrow-left"></i>
                <p>从左侧表格选择用户查看详情</p>
            </div>
        `;
    }

    // 获取严重程度文本
    getSeverityText(severity) {
        const severities = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return severities[severity] || severity;
    }

    // 获取频率文本
    getFrequencyText(frequency) {
        const frequencies = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return frequencies[frequency] || frequency;
    }

    // 更新用户资料面板
    updateUserProfile(userId) {
        const profileData = userProfilesData[userId];
        const profileContainer = document.getElementById('userProfile');

        if (!profileData) {
            profileContainer.innerHTML = `
                <div class="profile-placeholder">
                    <i class="fas fa-user"></i>
                    <p>选择用户查看详细信息</p>
                </div>
            `;
            return;
        }

        profileContainer.innerHTML = `
            <div class="profile-item">
                <span class="profile-label">账户年龄</span>
                <span class="profile-value">${profileData.account_age_days} 天</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">30天交易数</span>
                <span class="profile-value">${profileData.trade_count_30d}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">活跃等级</span>
                <span class="profile-value">${this.getActiveLevelText(profileData.active_level)}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">资金流向</span>
                <span class="profile-value">${this.getFlowTypeText(profileData.flow_type)}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">行为标签</span>
                <span class="profile-value">${profileData.behavior_tags.join(', ')}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">安全标签</span>
                <span class="profile-value">${profileData.security_tags.join(', ')}</span>
            </div>
        `;
    }

    // 获取活跃等级文本
    getActiveLevelText(level) {
        const levels = {
            'high': '高活跃',
            'medium': '中活跃',
            'low': '低活跃'
        };
        return levels[level] || level;
    }

    // 获取资金流向文本
    getFlowTypeText(flowType) {
        const flows = {
            'net_in': '净流入',
            'net_out': '净流出',
            'balanced': '平衡'
        };
        return flows[flowType] || flowType;
    }

    // 更新AI评分面板
    updateAIScoring(userId) {
        const aiData = aiScoringData[userId];
        const aiContainer = document.getElementById('aiScoring');

        if (!aiData) {
            aiContainer.innerHTML = `
                <div class="score-placeholder">
                    <i class="fas fa-robot"></i>
                    <p>选择用户查看AI分析</p>
                </div>
            `;
            return;
        }

        const riskLevel = aiData.ai_score >= 70 ? 'high' : aiData.ai_score >= 40 ? 'medium' : 'low';

        aiContainer.innerHTML = `
            <div class="score-display">
                <div class="score-circle ${riskLevel}">
                    <div class="score-number">${aiData.ai_score}</div>
                    <div class="score-label">风险评分</div>
                </div>
            </div>

            <div class="factors-section">
                <h4>主要风险因素</h4>
                <ul class="factors-list">
                    ${aiData.major_factors.map(factor => `
                        <li>${getEventDescription(factor)}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // 更新关系图
    updateGraph(graphType) {
        if (!this.selectedUserId) return;

        const graphData = relationshipGraphsData[`${graphType}_graph`]?.[this.selectedUserId];
        const graphContainer = document.getElementById('relationshipGraph');

        if (!graphData) {
            graphContainer.innerHTML = `
                <div class="graph-placeholder">
                    <i class="fas fa-chart-network"></i>
                    <p>暂无${this.getGraphTypeText(graphType)}数据</p>
                </div>
            `;
            return;
        }

        // 使用简单的文本展示，实际项目中可以使用D3.js或Cytoscape.js
        graphContainer.innerHTML = `
            <div class="graph-text-display">
                <h4>${this.getGraphTypeText(graphType)}关系图</h4>
                <div class="graph-nodes">
                    <strong>节点：</strong> ${graphData.nodes.join(', ')}
                </div>
                <div class="graph-edges">
                    <strong>连接：</strong>
                    <ul>
                        ${graphData.edges.map(edge => `<li>${edge[0]} ↔ ${edge[1]}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // 获取图表类型文本
    getGraphTypeText(type) {
        const types = {
            'device': '设备',
            'ip': 'IP',
            'payment': '支付'
        };
        return types[type] || type;
    }

    // 加载审计日志
    loadAuditLogs() {
        const auditBody = document.getElementById('auditBody');
        auditBody.innerHTML = '';

        auditLogsData.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.log_id}</td>
                <td>${log.user_id}</td>
                <td>${getEventDescription(log.risk_event)}</td>
                <td>${log.action}</td>
                <td>${log.operator}</td>
                <td>${formatDateTime(log.created_at)}</td>
            `;
            auditBody.appendChild(row);
        });
    }

    // 应用过滤器
    applyFilters() {
        this.currentFilters = {
            riskLevel: document.getElementById('riskLevel').value,
            riskType: document.getElementById('riskType').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            userId: document.getElementById('userId').value.trim(),
            deviceId: document.getElementById('deviceId').value.trim()
        };

        this.currentPage = 1;
        this.loadTableData();
        this.updatePagination();
    }

    // 重置过滤器
    resetFilters() {
        document.getElementById('riskLevel').value = '';
        document.getElementById('riskType').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('userId').value = '';
        document.getElementById('deviceId').value = '';

        this.currentFilters = {};
        this.currentPage = 1;
        this.loadTableData();
        this.updatePagination();
    }

    // 应用数据过滤器
    applyDataFilters(data) {
        return data.filter(user => {
            // 风险等级过滤
            if (this.currentFilters.riskLevel && user.risk_level !== this.currentFilters.riskLevel) {
                return false;
            }

            // 风险类型过滤
            if (this.currentFilters.riskType) {
                const hasMatchingEvent = user.triggered_events.some(event => {
                    switch(this.currentFilters.riskType) {
                        case 'device': return event.includes('device');
                        case 'ip': return event.includes('ip');
                        case 'trade': return event.includes('trade') || event.includes('cancel');
                        case 'payment': return event.includes('payment');
                        case 'syndicate': return event.includes('syndicate');
                        default: return false;
                    }
                });
                if (!hasMatchingEvent) return false;
            }

            // 日期范围过滤
            if (this.currentFilters.startDate || this.currentFilters.endDate) {
                const userDate = new Date(user.updated_at);
                if (this.currentFilters.startDate) {
                    const startDate = new Date(this.currentFilters.startDate);
                    if (userDate < startDate) return false;
                }
                if (this.currentFilters.endDate) {
                    const endDate = new Date(this.currentFilters.endDate);
                    if (userDate > endDate) return false;
                }
            }

            // 用户ID过滤
            if (this.currentFilters.userId && !user.user_id.toLowerCase().includes(this.currentFilters.userId.toLowerCase())) {
                return false;
            }

            // 设备ID过滤 (模拟)
            if (this.currentFilters.deviceId) {
                // 实际项目中需要从设备数据匹配
                return false;
            }

            return true;
        });
    }

    // 更新分页信息
    updatePaginationInfo(filteredCount) {
        const startRecord = (this.currentPage - 1) * this.pageSize + 1;
        const endRecord = Math.min(startRecord + this.pageSize - 1, filteredCount);

        document.getElementById('startRecord').textContent = startRecord;
        document.getElementById('endRecord').textContent = endRecord;
        document.getElementById('totalRecords').textContent = filteredCount;
        document.getElementById('totalPages').textContent = Math.ceil(filteredCount / this.pageSize);
        document.getElementById('currentPage').textContent = this.currentPage;
    }

    // 更新分页按钮状态
    updatePagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    // 切换页面
    changePage(page) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.loadTableData();
        this.updatePagination();
    }

    // 更新头部统计信息
    updateHeaderStats() {
        const highRiskUsers = riskUsersData.filter(user => user.risk_level === 'high').length;
        const activeAlerts = auditLogsData.filter(log =>
            log.created_at.includes(new Date().toISOString().split('T')[0])
        ).length;

        document.getElementById('totalUsers').textContent = riskUsersData.length.toLocaleString();
        document.getElementById('highRiskUsers').textContent = highRiskUsers;
        document.getElementById('activeAlerts').textContent = activeAlerts;
    }

    // 刷新表格
    refreshTable() {
        this.showLoading();
        setTimeout(() => {
            this.loadTableData();
            this.hideLoading();
        }, 500);
    }

    // 导出数据
    exportData() {
        const filteredData = this.applyDataFilters(riskUsersData);
        const csvContent = this.convertToCSV(filteredData);
        this.downloadCSV(csvContent, 'risk_users_export.csv');
    }

    // 转换为CSV
    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = ['用户ID', '风险评分', '风险等级', '触发事件', '最后登录城市', '24h设备数', '高风险关联', '更新时间'];
        const csvRows = [headers.join(',')];

        data.forEach(user => {
            const row = [
                user.user_id,
                user.risk_score,
                this.getRiskLevelText(user.risk_level),
                user.triggered_events.join(';'),
                user.last_login_city,
                user.device_count_24h,
                user.high_risk_relations,
                user.updated_at
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    // 下载CSV文件
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 关闭侧边栏
    closeSidebar() {
        // 在移动端隐藏侧边栏，桌面端保持显示
        if (window.innerWidth <= 1024) {
            // 可以添加侧边栏隐藏逻辑
        }
    }

    // 清空调试日志
    clearAuditLogs() {
        if (confirm('确定要清空调试日志吗？此操作不可撤销。')) {
            document.getElementById('auditBody').innerHTML = '';
            // 实际项目中需要调用API清空日志
        }
    }

    // 刷新所有数据
    refreshAllData() {
        this.showLoading();
        setTimeout(() => {
            this.loadTableData();
            this.loadAuditLogs();
            this.updateHeaderStats();
            this.hideLoading();
        }, 1000);
    }

    // 显示加载动画
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    // 隐藏加载动画
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    // 公共方法供HTML调用
    viewUserDetail(userId) {
        this.selectUser(userId);
    }
}

// 初始化应用
const app = new RiskMonitoringApp();

// 添加一些样式修正
document.addEventListener('DOMContentLoaded', function() {
    // 添加风险评分数字样式
    const style = document.createElement('style');
    style.textContent = `
        .risk-score .score-number {
            font-weight: 700;
            font-size: 16px;
        }

        .graph-text-display {
            padding: 20px;
            background-color: var(--bg-tertiary);
            border-radius: var(--border-radius);
        }

        .graph-text-display h4 {
            margin: 0 0 16px 0;
            color: var(--text-primary);
            font-size: 16px;
        }

        .graph-nodes, .graph-edges {
            margin-bottom: 12px;
            color: var(--text-secondary);
        }

        .graph-edges ul {
            margin: 8px 0 0 0;
            padding-left: 20px;
        }

        .graph-edges li {
            margin-bottom: 4px;
            color: var(--text-primary);
        }

        .factors-section {
            margin-top: 20px;
        }

        .factors-section h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: var(--text-primary);
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
});



