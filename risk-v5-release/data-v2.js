// 高可用AI风险监控系统 - 增强数据集

// 实时告警数据
const urgentAlerts = [
    {
        id: 'ALERT_001',
        level: 'critical',
        title: '检测到疑似团伙欺诈行为',
        description: '用户 U990011 与其他4个账户使用相同设备和支付方式，疑似团伙作案',
        user_id: 'U990011',
        time: '2分钟前',
        status: 'pending'
    },
    {
        id: 'ALERT_002',
        level: 'critical',
        title: '异常高频交易检测',
        description: '用户 U102393 在1小时内完成32笔交易，金额超过 $50,000',
        user_id: 'U102393',
        time: '5分钟前',
        status: 'pending'
    },
    {
        id: 'ALERT_003',
        level: 'high',
        title: '支付方式频繁变更',
        description: '用户 U334455 在24小时内更换了5个不同的支付账户',
        user_id: 'U334455',
        time: '15分钟前',
        status: 'processing'
    },
    {
        id: 'ALERT_004',
        level: 'high',
        title: 'IP地址异常变更',
        description: '用户 U567890 在短时间内从3个不同国家/地区登录',
        user_id: 'U567890',
        time: '28分钟前',
        status: 'pending'
    },
    {
        id: 'ALERT_005',
        level: 'critical',
        title: '黑名单设备检测',
        description: '检测到黑名单设备 FP_889977 被多个新账户使用',
        user_id: 'Multiple',
        time: '35分钟前',
        status: 'pending'
    }
];

// Top高风险用户（参考后台格式）
const topRiskUsers = [
    {
        rank: 1,
        user_id: '1u2t_3B24123b44',
        risk_score: 95,
        main_events: ['团伙欺诈', '设备共享', '支付共享'],
        member_count: 5,
        avatar: 'https://i.pravatar.cc/150?img=1',
        login_ip: '103.9.188.7',
        location: '深圳'
    },
    {
        rank: 2,
        user_id: '5a8f_9D56789e12',
        risk_score: 91,
        main_events: ['高频交易', '异常金额', '取消率高'],
        member_count: 3,
        avatar: 'https://i.pravatar.cc/150?img=2',
        login_ip: '58.220.45.78',
        location: '广州'
    },
    {
        rank: 3,
        user_id: '7c4e_1F34567a89',
        risk_score: 87,
        main_events: ['支付频繁变更', '多设备', 'IP异常'],
        member_count: 2,
        avatar: 'https://i.pravatar.cc/150?img=3',
        login_ip: '121.56.89.123',
        location: '上海'
    },
    {
        rank: 4,
        user_id: '2d9a_6E78901b23',
        risk_score: 82,
        main_events: ['新账户高额交易', '设备风险'],
        member_count: 1,
        avatar: 'https://i.pravatar.cc/150?img=4',
        login_ip: '183.62.154.90',
        location: '北京'
    },
    {
        rank: 5,
        user_id: '8b3f_2A45678c90',
        risk_score: 78,
        main_events: ['IP共享', '异常登录时间'],
        member_count: 2,
        avatar: 'https://i.pravatar.cc/150?img=5',
        login_ip: '112.80.248.75',
        location: '杭州'
    },
    {
        rank: 6,
        user_id: '4e7c_5C12345d67',
        risk_score: 75,
        main_events: ['频繁取消', '投诉率高'],
        member_count: 0,
        avatar: 'https://i.pravatar.cc/150?img=6',
        login_ip: '220.181.38.148',
        location: '成都'
    },
    {
        rank: 7,
        user_id: '9a2d_8F90123e45',
        risk_score: 71,
        main_events: ['支付失败', '交易异常'],
        member_count: 1,
        avatar: 'https://i.pravatar.cc/150?img=7',
        login_ip: '61.145.123.67',
        location: '重庆'
    },
    {
        rank: 8,
        user_id: '3f6b_4D67890a12',
        risk_score: 68,
        main_events: ['设备异常', 'APP伪造'],
        member_count: 0,
        avatar: 'https://i.pravatar.cc/150?img=8',
        login_ip: '202.103.24.68',
        location: '武汉'
    },
    {
        rank: 9,
        user_id: '6c8a_7B34567f89',
        risk_score: 65,
        main_events: ['位置跳跃', 'VPN使用'],
        member_count: 1,
        avatar: 'https://i.pravatar.cc/150?img=9',
        login_ip: '114.242.249.190',
        location: '南京'
    },
    {
        rank: 10,
        user_id: '1e5d_9C01234g56',
        risk_score: 62,
        main_events: ['信息不一致', '实名疑点'],
        member_count: 0,
        avatar: 'https://i.pravatar.cc/150?img=10',
        login_ip: '218.76.45.123',
        location: '西安'
    }
];

// 团伙网络数据
const syndicateGroups = [
    {
        id: 'SYN_001',
        name: '团伙A',
        risk_level: 'critical',
        member_count: 8,
        device_shared: 3,
        ip_shared: 2,
        payment_shared: 5,
        tags: ['设备共享', '支付共享', '协同作案'],
        total_amount: 125000,
        created_at: '2025-11-20'
    },
    {
        id: 'SYN_002',
        name: '团伙B',
        risk_level: 'high',
        member_count: 5,
        device_shared: 2,
        ip_shared: 1,
        payment_shared: 3,
        tags: ['IP共享', '交易模式相似'],
        total_amount: 68000,
        created_at: '2025-11-22'
    },
    {
        id: 'SYN_003',
        name: '团伙C',
        risk_level: 'high',
        member_count: 6,
        device_shared: 2,
        ip_shared: 3,
        payment_shared: 2,
        tags: ['地域集中', '时间规律'],
        total_amount: 89000,
        created_at: '2025-11-24'
    },
    {
        id: 'SYN_004',
        name: '团伙D',
        risk_level: 'medium',
        member_count: 4,
        device_shared: 1,
        ip_shared: 2,
        payment_shared: 1,
        tags: ['新型团伙', '观察中'],
        total_amount: 35000,
        created_at: '2025-11-26'
    }
];

// 增强的用户风险数据
const enhancedRiskUsers = [
    {
        id: 1,
        user_id: 'U990011',
        risk_score: 95,
        risk_level: 'critical',
        main_risk: '团伙欺诈',
        triggered_at: '2025-11-28 04:22:10',
        related_accounts: 4,
        status: 'pending',
        device_count: 5,
        ip_locations: ['Jakarta', 'Singapore'],
        trade_amount_24h: 28000
    },
    {
        id: 2,
        user_id: 'U102393',
        risk_score: 91,
        risk_level: 'critical',
        main_risk: '高频交易',
        triggered_at: '2025-11-28 03:45:22',
        related_accounts: 3,
        status: 'processing',
        device_count: 4,
        ip_locations: ['Jakarta'],
        trade_amount_24h: 52000
    },
    {
        id: 3,
        user_id: 'U334455',
        risk_score: 87,
        risk_level: 'high',
        main_risk: '支付异常',
        triggered_at: '2025-11-28 02:18:33',
        related_accounts: 2,
        status: 'pending',
        device_count: 3,
        ip_locations: ['Singapore', 'Bangkok'],
        trade_amount_24h: 15000
    },
    {
        id: 4,
        user_id: 'U778899',
        risk_score: 82,
        risk_level: 'high',
        main_risk: '新户高额',
        triggered_at: '2025-11-28 01:52:44',
        related_accounts: 1,
        status: 'resolved',
        device_count: 2,
        ip_locations: ['Manila'],
        trade_amount_24h: 25000
    },
    {
        id: 5,
        user_id: 'U445566',
        risk_score: 78,
        risk_level: 'high',
        main_risk: 'IP共享',
        triggered_at: '2025-11-28 00:33:15',
        related_accounts: 2,
        status: 'pending',
        device_count: 1,
        ip_locations: ['Ho Chi Minh', 'Bangkok'],
        trade_amount_24h: 8500
    },
    {
        id: 6,
        user_id: 'U223344',
        risk_score: 75,
        risk_level: 'medium',
        main_risk: '频繁取消',
        triggered_at: '2025-11-27 23:47:28',
        related_accounts: 0,
        status: 'pending',
        device_count: 1,
        ip_locations: ['Kuala Lumpur'],
        trade_amount_24h: 3200
    },
    {
        id: 7,
        user_id: 'U556677',
        risk_score: 71,
        risk_level: 'medium',
        main_risk: '支付失败',
        triggered_at: '2025-11-27 22:15:10',
        related_accounts: 1,
        status: 'resolved',
        device_count: 1,
        ip_locations: ['Jakarta'],
        trade_amount_24h: 5600
    },
    {
        id: 8,
        user_id: 'U889900',
        risk_score: 68,
        risk_level: 'medium',
        main_risk: '设备异常',
        triggered_at: '2025-11-27 21:30:45',
        related_accounts: 0,
        status: 'pending',
        device_count: 3,
        ip_locations: ['Singapore'],
        trade_amount_24h: 12000
    }
];

// 事件时间线数据
const eventsTimeline = [
    {
        id: 'EVT_001',
        time: '2025-11-28 14:35:22',
        level: 'critical',
        title: '团伙欺诈检测',
        description: '系统检测到8个账户存在关联行为，疑似团伙作案',
        users: ['U990011', 'U889900', 'U778899'],
        auto_action: '已自动限制交易'
    },
    {
        id: 'EVT_002',
        time: '2025-11-28 14:28:15',
        level: 'critical',
        title: '大额异常交易',
        description: '用户 U102393 单笔交易金额 $18,500，超过历史平均值300%',
        users: ['U102393'],
        auto_action: '已触发人工审核'
    },
    {
        id: 'EVT_003',
        time: '2025-11-28 14:22:08',
        level: 'high',
        title: 'IP地址跨国跳跃',
        description: '用户 U334455 在30分钟内从新加坡切换到泰国IP',
        users: ['U334455'],
        auto_action: '已发送验证码确认'
    },
    {
        id: 'EVT_004',
        time: '2025-11-28 14:15:33',
        level: 'high',
        title: '设备指纹黑名单匹配',
        description: '检测到设备 FP_889977 在黑名单中，当前被3个账户使用',
        users: ['U990011', 'U223344'],
        auto_action: '已冻结相关账户'
    },
    {
        id: 'EVT_005',
        time: '2025-11-28 14:08:17',
        level: 'medium',
        title: '支付方式频繁变更',
        description: '用户 U445566 在24小时内添加了4个新的支付方式',
        users: ['U445566'],
        auto_action: '已降低交易限额'
    },
    {
        id: 'EVT_006',
        time: '2025-11-28 13:55:42',
        level: 'medium',
        title: '高取消率警告',
        description: '用户 U223344 近7天取消率达到52%，远高于平台平均值',
        users: ['U223344'],
        auto_action: '已限制发布新订单'
    },
    {
        id: 'EVT_007',
        time: '2025-11-28 13:42:28',
        level: 'low',
        title: '新用户首次大额交易',
        description: '注册3天的用户 U112233 发起首笔交易 $8,200',
        users: ['U112233'],
        auto_action: '已加强审核'
    }
];

// 待处理任务
const pendingTasks = [
    {
        id: 'TASK_001',
        user_id: 'U990011',
        task_type: '团伙调查',
        priority: 'urgent',
        description: '需要深度分析该账户与其他4个账户的关联关系',
        assigned_to: '待分配',
        created_at: '2025-11-28 14:22:10'
    },
    {
        id: 'TASK_002',
        user_id: 'U102393',
        task_type: '人工审核',
        priority: 'high',
        description: '需要核实大额交易的真实性和资金来源',
        assigned_to: '运营员A',
        created_at: '2025-11-28 13:45:22'
    },
    {
        id: 'TASK_003',
        user_id: 'U334455',
        task_type: '身份验证',
        priority: 'high',
        description: 'IP地址异常，需要用户重新进行身份验证',
        assigned_to: '待分配',
        created_at: '2025-11-28 12:18:33'
    },
    {
        id: 'TASK_004',
        user_id: 'U445566',
        task_type: '支付审核',
        priority: 'medium',
        description: '核实新添加的支付方式是否属于本人',
        assigned_to: '运营员B',
        created_at: '2025-11-28 11:33:15'
    },
    {
        id: 'TASK_005',
        user_id: 'U223344',
        task_type: '行为分析',
        priority: 'medium',
        description: '分析高取消率原因，判断是否为恶意行为',
        assigned_to: '待分配',
        created_at: '2025-11-28 10:47:28'
    }
];

// 最近操作记录
const recentOperations = [
    {
        id: 'OP_001',
        operator: '运营员A',
        action: '封禁用户',
        target: 'U998877',
        reason: '确认为欺诈账户',
        timestamp: '2025-11-28 14:15:33',
        result: '成功'
    },
    {
        id: 'OP_002',
        operator: '运营员B',
        action: '限制交易',
        target: 'U556677',
        reason: '支付失败率过高',
        timestamp: '2025-11-28 13:42:18',
        result: '成功'
    },
    {
        id: 'OP_003',
        operator: '运营员A',
        action: '解除限制',
        target: 'U112233',
        reason: '完成身份验证',
        timestamp: '2025-11-28 12:28:05',
        result: '成功'
    },
    {
        id: 'OP_004',
        operator: '系统自动',
        action: '发送警告',
        target: 'U445566',
        reason: '检测到异常行为',
        timestamp: '2025-11-28 11:55:22',
        result: '成功'
    },
    {
        id: 'OP_005',
        operator: '运营员C',
        action: '人工审核',
        target: 'U223344',
        reason: '大额交易核实',
        timestamp: '2025-11-28 10:33:47',
        result: '通过'
    }
];

// 风险趋势数据（用于图表）
const riskTrendData = {
    labels: ['11-22', '11-23', '11-24', '11-25', '11-26', '11-27', '11-28'],
    critical: [5, 7, 6, 9, 12, 10, 8],
    high: [23, 28, 31, 29, 35, 32, 34],
    medium: [56, 62, 58, 71, 68, 75, 89],
    low: [120, 135, 142, 138, 148, 155, 152]
};

// 风险类型分布数据
const riskDistributionData = [
    { name: '设备风险', value: 156, color: '#ef4444' },
    { name: 'IP风险', value: 98, color: '#f59e0b' },
    { name: '支付风险', value: 134, color: '#3b82f6' },
    { name: '交易风险', value: 112, color: '#10b981' },
    { name: '团伙风险', value: 45, color: '#8b5cf6' }
];

// 工具函数
function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // 秒数差异
    
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function getRiskLevelText(level) {
    const levels = {
        'critical': '紧急',
        'high': '高',
        'medium': '中',
        'low': '低'
    };
    return levels[level] || level;
}

function getStatusText(status) {
    const statuses = {
        'pending': '待处理',
        'processing': '处理中',
        'resolved': '已处理',
        'ignored': '已忽略'
    };
    return statuses[status] || status;
}

function getRiskLevelColor(level) {
    const colors = {
        'critical': '#dc2626',
        'high': '#f59e0b',
        'medium': '#0ea5e9',
        'low': '#10b981'
    };
    return colors[level] || '#64748b';
}
