
// 波币风控系统核心引擎 V6 - 最终稳定版
console.log('ENGINE: V6 Initializing...');

// 辅助函数
const formatTime = (iso) => iso ? new Date(iso).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') : '刚刚';
const formatCurrency = (amt) => amount >= 10000 ? '¥' + (amt / 10000).toFixed(1) + '万' : '¥' + amt.toLocaleString();

class RiskMonitoringSystem {
    constructor() {
        this.currentView = 'overview';
        this.alertsRead = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        // 确保 DOM 加载后运行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('ENGINE: Starting modules...');
        this.loadOverviewData();
        this.loadUsersView();
        this.loadEventsView();
        console.log('ENGINE: All modules started.');
    }

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        console.log('ENGINE: Switching view to', viewName);
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.toggle('active', sec.id === `${viewName}View`));
        this.currentView = viewName;
        
        // 按需加载
        if (viewName === 'overview') this.loadOverviewData();
        if (viewName === 'users') this.loadUsersView();
        if (viewName === 'events') this.loadEventsView();
    }

    // --- 详情抽屉 ---
    openAuditDrawer(id, type = 'user') {
        const overlay = document.getElementById('auditDrawerOverlay');
        const drawer = document.getElementById('auditDrawer');
        const iframe = document.getElementById('auditIframe');
        const titleEl = document.querySelector('.drawer-title');
        
        if (!overlay || !drawer || !iframe) return;

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
        document.body.style.overflow = 'hidden';
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
            document.body.style.overflow = '';
        }
    }

    // --- 数据加载 ---
    loadOverviewData() {
        this.loadKPIData();
        this.loadRiskMonitorPanel();
        this.loadGeoHeatmap();
    }

    loadKPIData() {
        const kpis = { 'totalRiskUsers': '1,247', 'highRiskUsers': '10', 'riskSyndicates': '23', 'pendingReview': '156', 'newRiskToday': '47' };
        for (let id in kpis) {
            const el = document.getElementById(id);
            if (el) el.textContent = kpis[id];
        }
    }

    loadRiskMonitorPanel() {
        const container = document.getElementById('riskMonitorList');
        if (!container || typeof pendingReviewUsers === 'undefined') return;
        
        const html = pendingReviewUsers.slice(0, 10).map(user => `
            <div class="risk-item-user">
                <img src="${user.avatar}" class="risk-user-avatar">
                <div class="risk-user-info">
                    <span class="risk-user-id">${user.user_id}</span>
                    <span class="risk-user-badge primary">${user.reason || '待审核'}</span>
                </div>
                <div class="risk-user-score ${user.risk_score >= 90 ? 'critical' : 'high'}">${user.risk_score}</div>
                <div class="risk-user-actions">
                    <button class="risk-action-btn review" onclick="app.openAuditDrawer('${user.user_id}', 'user')">审核</button>
                </div>
            </div>
        `).join('');
        container.innerHTML = html;
    }

    loadUsersView() {
        const container = document.getElementById('userCardsList');
        if (!container || typeof riskUsersList === 'undefined') return;
        
        container.innerHTML = riskUsersList.map(user => `
            <div class="risk-item-user">
                <img src="${user.avatar}" class="risk-user-avatar">
                <div class="risk-user-info">
                    <span class="risk-user-id">${user.user_id}</span>
                    ${user.main_risks.map(r => `<span class="risk-user-badge secondary">${r}</span>`).join('')}
                    <div class="risk-user-meta">
                        <span><i class="fas fa-map-marker-alt"></i>${user.city}</span>
                        <span><i class="fas fa-clock"></i>${user.last_login_at}</span>
                    </div>
                </div>
                <div class="risk-user-score ${user.risk_score >= 90 ? 'critical' : 'high'}">${user.risk_score}</div>
                <div class="risk-user-actions">
                    <button class="risk-action-btn review" onclick="app.openAuditDrawer('${user.user_id}', 'user')">审核</button>
                </div>
            </div>
        `).join('');
    }

    loadEventsView() {
        const container = document.getElementById('eventsTimeline');
        if (!container || typeof realtimeAlertFeed === 'undefined') return;
        
        container.innerHTML = realtimeAlertFeed.map(e => `
            <div class="event-card ${e.level}">
                <div class="event-card-left">
                    <div class="event-content">
                        <div class="event-header">
                            <span class="event-type-badge">${e.event_type}</span>
                            <span class="event-time">${e.created_at}</span>
                        </div>
                        <div class="event-description">${e.description}</div>
                    </div>
                </div>
                <div class="event-card-right">
                    <button class="btn-event-detail" onclick="app.openAuditDrawer('${e.user_ids[0]}', 'user')">详情</button>
                </div>
            </div>
        `).join('');
    }

    loadGeoHeatmap() {
        const container = document.getElementById('geoHeatmapList');
        if (!container || typeof geoRiskHeatmapData === 'undefined') return;
        container.innerHTML = geoRiskHeatmapData.map(r => `
            <div class="geo-item-enhanced">
                <div class="geo-rank-badge">${r.rank}</div>
                <div class="geo-content"><div class="geo-city-name">${r.city}</div></div>
            </div>
        `).join('');
    }

    // 辅助工具
    showToast(msg, type) { console.log('TOAST:', msg); }
    recognizeSearchType(val) { console.log('RECOGNIZE:', val); }
    handleFilterChange() { this.loadUsersView(); }
    resetAllFilters() { this.loadUsersView(); }
}

window.app = new RiskMonitoringSystem();
