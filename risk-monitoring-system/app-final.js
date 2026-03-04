
// 波币风控系统核心引擎 - 最终稳定版 (v5 Fixed)
console.log('ENGINE: Loading Final Version...');

class RiskSystem {
    constructor() {
        this.init();
    }

    init() {
        // 绑定导航
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => this.switchView(btn.dataset.view);
        });

        window.addEventListener('load', () => {
            console.log('ENGINE: Page Loaded.');
            this.renderAll();
        });
    }

    renderAll() {
        try {
            this.loadKPIs();
            this.loadOverview();
            this.loadUsers();
            this.loadEvents();
            console.log('ENGINE: Rendering complete.');
        } catch(e) { console.error('ENGINE ERROR:', e); }
    }

    switchView(view) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.toggle('active', sec.id === (view + 'View')));
        this.renderAll();
    }

    loadKPIs() {
        const data = { 'totalRiskUsers': '1,247', 'highRiskUsers': '10', 'riskSyndicates': '23', 'pendingReview': '156', 'newRiskToday': '47', 'todayEventCount': '47', 'criticalEventCount': '12', 'autoHandledCount': '38', 'pendingReviewEventCount': '9', 'queueTotalCount': '10', 'criticalCount': '3', 'highCount': '5', 'pendingCount': '2', 'totalCount': '10', 'usersCount': '8', 'syndicatesCount': '2' };
        for (let id in data) {
            const el = document.getElementById(id);
            if (el) el.textContent = data[id];
        }
    }

    
    initCharts() {
        if (typeof echarts === 'undefined') return;
        
        const trendDom = document.getElementById('riskTypeTrendChart');
        if (trendDom) {
            const trendChart = echarts.init(trendDom);
            trendChart.setOption({
                xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                yAxis: { type: 'value' },
                series: [{ data: [150, 230, 224, 218, 135, 147, 260], type: 'line', smooth: true, color: '#3b82f6' }]
            });
        }

        const distDom = document.getElementById('riskDistributionChart');
        if (distDom) {
            const distChart = echarts.init(distDom);
            distChart.setOption({
                series: [{
                    type: 'pie', radius: ['40%', '70%'],
                    data: [{value: 40, name: '设备'}, {value: 30, name: 'IP'}, {value: 20, name: '交易'}, {value: 10, name: '其他'}]
                }]
            });
        }
    }

    loadOverview() {
        const geoList = document.getElementById('geoHeatmapList');
        if (geoList && typeof geoRiskHeatmap !== 'undefined') {
            geoList.innerHTML = geoRiskHeatmap.regions.map(r => `
                <div class="geo-item-enhanced" style="margin-bottom:10px; padding:12px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; display:flex; align-items:center; gap:12px;">
                    <div style="width:24px; height:24px; border-radius:6px; background:${r.rank<=3?'#fee2e2':'#f1f5f9'}; color:${r.rank<=3?'#dc2626':'#64748b'}; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px;">${r.rank}</div>
                    <div style="flex:1"><div style="font-size:13px; font-weight:700; color:#0f172a;">${r.city}</div><div style="font-size:11px; color:#94a3b8;">风险用户: ${r.risk_users}</div></div>
                    <div style="font-size:12px; font-weight:800; color:#dc2626;">+${r.change_rate}%</div>
                </div>`).join('');
        }

        const monitorList = document.getElementById('riskMonitorList');
        if (monitorList && typeof pendingReviewUsers !== 'undefined') {
            monitorList.innerHTML = pendingReviewUsers.slice(0, 6).map(u => `
                <div class="risk-item-user" style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:10px; display:flex; align-items:center; gap:12px; border-left:4px solid #dc2626;">
                    <img src="${u.avatar}" style="width:44px; height:44px; border-radius:50%;">
                    <div style="flex:1"><div style="font-weight:800;">${u.user_id}</div><div style="font-size:11px; color:#666;">${u.city} | ${u.tags ? u.tags[0] : '待审核'}</div></div>
                    <div style="font-size:18px; font-weight:900; color:#dc2626;">${u.risk_score}</div>
                    <button onclick="app.openAuditDrawer('${u.user_id}', 'user')" style="padding:6px 12px; border-radius:8px; border:none; background:#eff6ff; color:#3b82f6; font-weight:700; cursor:pointer;">审核</button>
                </div>`).join('');
        }
    }

    loadUsers() {
        const userList = document.getElementById('userCardsList');
        if (userList && typeof riskUsersList !== 'undefined') {
            userList.innerHTML = riskUsersList.map(u => `
                <div class="risk-item-user" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:12px; display:flex; align-items:center; gap:16px; border-left:6px solid ${u.risk_score >= 90 ? '#dc2626' : '#f59e0b'};">
                    <img src="${u.avatar}" style="width:52px; height:52px; border-radius:50%;">
                    <div style="flex:1"><div style="font-size:16px; font-weight:800;">${u.user_id}</div><div style="font-size:12px; color:#64748b; margin-top:6px;"><i class="fas fa-map-marker-alt"></i> ${u.city} | ${u.last_login_at}</div></div>
                    <div style="font-size:28px; font-weight:900; color:${u.risk_score >= 90 ? '#dc2626' : '#ea580c'};">${u.risk_score}</div>
                    <button onclick="app.openAuditDrawer('${u.user_id}', 'user')" style="padding:10px 20px; border-radius:10px; background:#3b82f6; color:white; border:none; font-weight:800;">进入审核</button>
                </div>`).join('');
        }
    }

    loadEvents() {
        const eventsList = document.getElementById('eventsTimeline');
        if (eventsList && typeof realtimeAlertFeed !== 'undefined') {
            eventsList.innerHTML = realtimeAlertFeed.map(e => `
                <div class="event-card" style="background:#fff; border:1.5px solid #e2e8f0; border-left:5px solid ${e.level === 'critical' ? '#dc2626' : '#f59e0b'}; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex:1"><div><span style="font-weight:800;">${e.event_type.toUpperCase()}</span> | <span style="font-size:12px; color:#999;">${e.created_at}</span></div><div style="font-size:14px; margin-top:5px;">${e.description}</div></div>
                    <button onclick="app.openAuditDrawer('${e.user_ids[0]}', 'user')" style="background:none; border:1px solid #cbd5e1; color:#64748b; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer;">详情</button>
                </div>`).join('');
        }
    }

    openAuditDrawer(id, type) {
        const overlay = document.getElementById('auditDrawerOverlay');
        const drawer = document.getElementById('auditDrawer');
        const iframe = document.getElementById('auditIframe');
        if (overlay && drawer && iframe) {
            iframe.src = (type === 'user') ? `user-detail-v6.html?user_id=${id}` : `group-graph.html?group_id=${id}`;
            overlay.style.display = 'block';
            setTimeout(() => { overlay.classList.add('active'); drawer.classList.add('active'); }, 10);
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuditDrawer() {
        const overlay = document.getElementById('auditDrawerOverlay');
        const drawer = document.getElementById('auditDrawer');
        if (overlay && drawer) {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
        }
    }
}

window.app = new RiskSystem();
