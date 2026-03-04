// 团伙关系图谱 JavaScript - 深度美化增强版

class GroupGraphViewer {
    constructor() {
        this.network = null;
        this.currentGraph = null;
        this.selectedNode = null;
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        // 从URL获取团伙ID
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('group_id') || 'G1203';
        const anchor = urlParams.get('anchor');
        const depth = parseInt(urlParams.get('depth')) || 1;
        const relationType = urlParams.get('relationType') || 'all';
        
        // 嵌入模式检测
        if (window.self !== window.top) {
            document.body.classList.add('embedded');
        }
        
        // 加载图谱数据
        this.loadGraph(groupId, anchor, depth, relationType);
        
        // 绑定事件
        this.bindEvents();
    }
    
    loadGraph(groupId, anchor, depth, relationType) {
        let fullGraph = groupGraphs[groupId] || groupGraphs['G1203'];
        
        if (anchor) {
            this.currentGraph = this.filterGraphByDepth(fullGraph, anchor, depth, relationType);
            
            // 💡 动态计算统计指标
            const visibleNodes = this.currentGraph.nodes;
            const visibleUsers = visibleNodes.filter(n => n.type === 'user');
            
            // 1. 成员数：当前可见的用户节点数
            this.displayMemberCount = visibleUsers.length;
            
            // 2. 风险分：如果是单锚点，显示锚点得分；否则显示可见节点中的最高分
            const anchorNode = fullGraph.nodes.find(n => n.id === anchor || n.label.includes(anchor));
            if (anchorNode && anchorNode.type === 'user') {
                const detail = nodeDetails[anchorNode.id] || {};
                this.displayRiskScore = detail.risk_score || anchorNode.risk_score || 89;
            } else {
                // 取可见用户中的最高风险分
                const scores = visibleUsers.map(u => {
                    const d = nodeDetails[u.id];
                    return d ? d.risk_score : 0;
                });
                this.displayRiskScore = scores.length > 0 ? Math.max(...scores) : this.currentGraph.risk_score;
            }
            
            // 3. 涉案金额：累加可见图谱中所有支付节点的金额
            let totalVisibleAmount = 0;
            visibleNodes.forEach(n => {
                if (n.type === 'payment') {
                    const pDetail = nodeDetails[n.id];
                    if (pDetail && pDetail.total_amount) {
                        totalVisibleAmount += pDetail.total_amount;
                    }
                }
            });
            // 如果没找到支付节点金额，则按比例估算或显示 0
            this.displayAmount = totalVisibleAmount || Math.round(fullGraph.total_amount * (visibleUsers.length / fullGraph.member_count));
            
        } else {
            this.currentGraph = fullGraph;
            this.displayMemberCount = this.currentGraph.member_count;
            this.displayRiskScore = this.currentGraph.risk_score;
            this.displayAmount = this.currentGraph.total_amount;
        }
        
        // 更新顶部信息
        const badge = document.getElementById('groupIdBadge');
        if (badge) badge.textContent = anchor ? "溯源模式" : (this.currentGraph.group_id || groupId);
        
        const memberCount = document.getElementById('memberCount');
        if (memberCount) memberCount.textContent = this.displayMemberCount;
        
        const riskScore = document.getElementById('riskScore');
        if (riskScore) riskScore.textContent = this.displayRiskScore;
        
        const totalAmount = document.getElementById('totalAmount');
        if (totalAmount) totalAmount.textContent = '¥' + (this.displayAmount || 0).toLocaleString();
        
        // 渲染图谱
        this.renderGraph();
    }

    // BFS 过滤图谱数据
    filterGraphByDepth(fullGraph, anchorId, maxDepth, relationType) {
        const nodes = fullGraph.nodes;
        const edges = fullGraph.edges;
        
        // 查找锚点节点
        const anchorNode = nodes.find(n => n.id === anchorId || n.label.includes(anchorId));
        if (!anchorNode) return fullGraph;

        const visitedNodes = new Set();
        const keptEdges = [];
        const queue = [{ id: anchorNode.id, depth: 0 }];
        visitedNodes.add(anchorNode.id);

        let head = 0;
        while (head < queue.length) {
            const { id, depth } = queue[head++];
            
            if (depth < maxDepth) {
                edges.forEach(edge => {
                    // 关联类型过滤逻辑
                    if (relationType === 'physical') {
                        if (edge.relation === 'payment_receive' || edge.relation === 'trade_link') return;
                    } else if (relationType === 'business') {
                        if (edge.relation === 'login_device' || edge.relation === 'login_ip') return;
                    }

                    let neighborId = null;
                    if (edge.from === id) neighborId = edge.to;
                    else if (edge.to === id) neighborId = edge.from;

                    if (neighborId && !visitedNodes.has(neighborId)) {
                        visitedNodes.add(neighborId);
                        queue.push({ id: neighborId, depth: depth + 1 });
                    }
                    
                    if ((edge.from === id || edge.to === id) && !keptEdges.includes(edge)) {
                        keptEdges.push(edge);
                    }
                });
            }
        }

        return {
            group_id: fullGraph.group_id,
            risk_score: fullGraph.risk_score,
            total_amount: fullGraph.total_amount,
            nodes: nodes.filter(n => visitedNodes.has(n.id)).map(n => ({
                ...n,
                is_core: n.id === anchorNode.id // 动态将锚点设为核心节点
            })),
            edges: keptEdges
        };
    }
    
    renderGraph() {
        const container = document.getElementById('graphCanvas');
        
        // 准备节点数据
        const nodes = this.currentGraph.nodes.map(node => {
            const nodeConfig = {
                id: node.id,
                label: node.label,
                size: node.is_core ? 55 : 25, // 锚点显著变大
                font: {
                    size: node.is_core ? 14 : 12,
                    color: '#0f172a',
                    face: 'JetBrains Mono, monospace',
                    bold: node.is_core
                },
                borderWidth: node.is_core ? 6 : 2, // 边框加厚
                borderWidthSelected: 6,
                title: node.is_core ? '溯源锚点: ' + node.label : node.label,
                nodeData: node,
                shadow: {
                    enabled: true,
                    color: node.is_core ? '#dc2626' : 'rgba(0,0,0,0.1)',
                    size: node.is_core ? 30 : 10,
                    x: 0, y: 0
                }
            };
            
            // 节点样式细化
            if (node.type === 'user') {
                const userDetail = nodeDetails[node.id];
                const avatarUrl = userDetail && userDetail.avatar ? userDetail.avatar : 'https://i.pravatar.cc/150?img=1';
                
                nodeConfig.shape = 'circularImage';
                nodeConfig.image = avatarUrl;
                nodeConfig.size = node.is_core ? 65 : 35; // 锚点用户头像特大
                nodeConfig.color = {
                    border: node.is_core ? '#dc2626' : '#3b82f6',
                    background: '#ffffff',
                    highlight: { border: '#dc2626', background: '#ffffff' }
                };
                                    } else if (node.type === 'device') {
                const iconColor = node.is_core ? '#d97706' : '#f59e0b';
                nodeConfig.shape = 'image';
                nodeConfig.image = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='%s'><path d='M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM224 416a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z'/></svg>".replace('%s', encodeURIComponent(iconColor));
                nodeConfig.size = node.is_core ? 25 : 20;
                                    } else if (node.type === 'ip') {
                const iconColor = '#10b981';
                nodeConfig.shape = 'image';
                nodeConfig.image = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='%s'><path d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/></svg>".replace('%s', encodeURIComponent(iconColor));
                nodeConfig.size = 18;
                const ipAddress = node.id.replace('IP_', '');
                const cityName = this.getCityFromIP(node.id);
                nodeConfig.label = cityName ? `${ipAddress}\n(${cityName})` : ipAddress;
                                    } else if (node.type === 'payment') {
                const iconColor = node.is_core ? '#991b1b' : '#dc2626';
                nodeConfig.shape = 'image';
                nodeConfig.image = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='%s'><path d='M0 48V208H160V48H0zM128 80V176H32V80H128zM0 304V464H160V304H0zM128 336V432H32V336H128zM288 48V208H448V48H288zM416 80V176H320V80H416zM288 304V352H336V304H288zM352 352V400H400V352H352zM400 400V464H448V400H400zM352 416V464H400V416H352zM288 416V464H336V416H288zM400 304V352H448V304H400z'/></svg>".replace('%s', encodeURIComponent(iconColor));
                nodeConfig.size = node.is_core ? 25 : 20;
            }
            
            return nodeConfig;
        });
        
        // 准备边数据
        const edges = this.currentGraph.edges.map((edge, index) => {
            const isTrade = edge.relation === 'trade_link';
            return {
                id: `edge_${index}`,
                from: edge.from,
                to: edge.to,
                dashes: isTrade,
                arrows: isTrade ? 'to' : '',
                color: {
                    color: isTrade ? '#94a3b8' : '#3b82f6',
                    highlight: '#dc2626',
                    hover: '#2563eb',
                    opacity: 0.6
                },
                width: isTrade ? 2 : 3,
                smooth: { type: 'cubicBezier', roundness: 0.4 }
            };
        });
        
        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };
        
        const options = {
            nodes: {
                shadow: { enabled: true, color: 'rgba(0,0,0,0.1)', size: 10, x: 0, y: 2 }
            },
            edges: {
                shadow: { enabled: true, color: 'rgba(0,0,0,0.05)', size: 5, x: 0, y: 1 }
            },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -10000,
                    centralGravity: 0.3,
                    springLength: 180,
                    springConstant: 0.04,
                    damping: 0.09,
                    avoidOverlap: 1
                },
                stabilization: { iterations: 500 }
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
                zoomView: true,
                dragView: true
            }
        };
        
        this.network = new vis.Network(container, data, options);
        
        this.network.on('click', (params) => {
            if (params.nodes.length > 0) {
                this.showNodeDetail(params.nodes[0]);
            } else {
                this.hideNodeDetail();
            }
        });
        
        this.network.once('stabilizationIterationsDone', () => {
            this.network.setOptions({ physics: { enabled: false } });
            this.network.fit({ animation: { duration: 500 } });
        });
    }
    
    getCityFromIP(ipNodeId) {
        const detail = nodeDetails[ipNodeId];
        return (detail && detail.location) ? detail.location.split(',')[0].trim() : null;
    }
    
    showNodeDetail(nodeId) {
        this.selectedNode = nodeId;
        const node = this.currentGraph.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        const panel = document.getElementById('detailPanel');
        const detail = nodeDetails[nodeId] || {};
        
        let typeText = '节点';
        let typeClass = 'user';
        let icon = 'fa-user';
        let riskValue = detail.risk_score || 0;
        let riskClass = riskValue >= 80 ? 'high' : riskValue >= 50 ? 'medium' : 'low';

        switch(node.type) {
            case 'user': typeText = '风险用户'; icon = 'fa-user'; typeClass = 'user'; break;
            case 'device': typeText = '关联设备'; icon = 'fa-mobile-alt'; typeClass = 'device'; break;
            case 'ip': typeText = '登录IP'; icon = 'fa-network-wired'; typeClass = 'ip'; break;
            case 'payment': typeText = '支付资源'; icon = 'fa-qrcode'; typeClass = 'payment'; break;
        }

        let detailHTML = `
            <div class="detail-content">
                <div class="detail-card">
                    <div class="detail-header-v2">
                        <div class="detail-type-badge ${typeClass}">
                            <i class="fas ${icon}"></i> ${typeText}
                        </div>
                        <div class="detail-title">${node.label}</div>
                        
                        <div class="detail-risk-score-box">
                            <div class="risk-value-circle ${riskClass}">${riskValue}</div>
                            <div style="font-size: 13px; font-weight: 700; color: #64748b;">综合风险评分</div>
                        </div>
                    </div>
                    
                    <div style="padding: 20px;">
                        ${detail.risk_tags ? `
                        <div class="detail-section">
                            <div class="detail-section-title">风险特征标签</div>
                            <div class="tag-list">
                                ${detail.risk_tags.map(tag => `<span class="tag-item">${tag}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <div class="detail-section-title">核心关联指标</div>
                            <div class="info-grid">
                                ${this.renderInfoItems(node.type, detail)}
                            </div>
                        </div>

                        ${node.type === 'user' ? `
                        <div style="margin-bottom: 24px;">
                            <button onclick="window.parent.app.openAuditDrawer('${node.id}', 'user')" style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);" onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'">
                                <i class="fas fa-id-card"></i> 穿透查看用户详情
                            </button>
                        </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <div class="detail-section-title">团伙贡献摘要</div>
                            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 13px; color: #475569; line-height: 1.6;">
                                <i class="fas fa-info-circle" style="color: #3b82f6; margin-right: 6px;"></i>
                                该${typeText}通过${this.getRelationText(node.type)}深度链接至团伙核心，是资源共享链路的关键环节。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        panel.innerHTML = detailHTML;
    }

    renderInfoItems(type, detail) {
        const items = [];
        if (type === 'user') {
            items.push({ label: '归属城市', value: detail.city || '未知' });
            items.push({ label: '关联设备', value: `${detail.device_count || 0} 台` });
            items.push({ label: '收款方式', value: `${detail.payment_count || 0} 个` });
            items.push({ label: '关联账号', value: `${detail.linked_accounts || 0} 人` });
        } else if (type === 'device') {
            items.push({ label: '设备指纹', value: detail.device_fp || 'N/A' });
            items.push({ label: '共用账号', value: `${detail.linked_accounts || 0} 人` });
        } else if (type === 'ip') {
            items.push({ label: '地理位置', value: detail.location || 'N/A' });
            items.push({ label: '关联用户', value: `${detail.linked_accounts || 0} 人` });
        } else if (type === 'payment') {
            items.push({ label: '资源类型', value: detail.payment_type || '扫码支付' });
            items.push({ label: '涉及金额', value: `¥${(detail.total_amount || 0).toLocaleString()}` });
            items.push({ label: '近期流水', value: `${detail.recent_transactions || 0} 笔` });
            items.push({ label: '共享用户', value: `${detail.linked_accounts || 0} 人` });
        }
        
        return items.map(item => `
            <div class="info-item">
                <div class="info-label">${item.label}</div>
                <div class="info-value">${item.value}</div>
            </div>
        `).join('');
    }

    getRelationText(type) {
        switch(type) {
            case 'user': return '交易链路';
            case 'device': return '物理指纹';
            case 'ip': return '网络环境';
            case 'payment': return '资金结算';
            default: return '多维属性';
        }
    }
    
    hideNodeDetail() {
        this.selectedNode = null;
        document.getElementById('detailPanel').innerHTML = `
            <div class="detail-panel-empty">
                <i class="fas fa-project-diagram"></i>
                <p>请点击图谱中的节点<br>查看深层关联信息</p>
            </div>
        `;
    }
    
    bindEvents() {
        document.getElementById('btnFitView').addEventListener('click', () => {
            this.network.fit({ animation: { duration: 500 } });
        });
        
        document.getElementById('btnZoomIn').addEventListener('click', () => {
            this.network.moveTo({ scale: this.network.getScale() * 1.2 });
        });
        
        document.getElementById('btnZoomOut').addEventListener('click', () => {
            this.network.moveTo({ scale: this.network.getScale() * 0.8 });
        });
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.applyFilter(btn.dataset.filter);
            });
        });
        
        document.getElementById('btnExportImage').addEventListener('click', () => {
            const canvas = document.querySelector('#graphCanvas canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `团伙_${this.currentGraph.group_id}_关系图谱.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        });
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        const nodes = this.network.body.data.nodes;
        nodes.forEach(node => {
            const nodeData = this.currentGraph.nodes.find(n => n.id === node.id);
            if (!nodeData) return;
            let hidden = (filter === 'user' && nodeData.type !== 'user') || 
                         (filter === 'user-device' && nodeData.type !== 'user' && nodeData.type !== 'device');
            nodes.update({ id: node.id, hidden });
        });
    }
}

// 初始化
const graphViewer = new GroupGraphViewer();
