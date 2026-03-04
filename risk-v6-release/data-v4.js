// 高可用AI风险监控系统 V4 - 完整增强版数据

// 注意：需要先加载 data-v2.js 中的基础数据
// 这里添加V4新增的数据结构

// KPI概览数据
const kpiSummary = {
    total_risk_events_today: 523,
    high_risk_events: 12,
    medium_risk_events: 233,
    new_blacklisted_users: 4,
    resolved_today: 156,
    trend: {
        total_events: 12, // 百分比
        high_risk: -3,
        new_blacklist: 0,
        resolved: 15
    }
};

// 待处理队列数据
const pendingQueue = {
    pending_risk_users: 8,
    pending_risk_events: 47,
    unresolved_alerts: 6
};

// 待审核案件列表（按照pending_review_cases.md规范）
const pendingReviewUsers = [
    {
        user_id: 'tui1_12981989',
        avatar: 'https://i.pravatar.cc/150?img=11',
        risk_score: 89,
        tags: ['团伙嫌疑', '收款码共享', '多账号同设备'],
        city: '深圳',
        last_ip: '112.25.67.89',
        last_login_at: '2025-11-26 14:23:15',
        status: 'urgent'
    },
    {
        user_id: 'tui1_23876543',
        avatar: 'https://i.pravatar.cc/150?img=12',
        risk_score: 85,
        tags: ['大额异常交易', '高频取消'],
        city: '广州',
        last_ip: '58.33.142.90',
        last_login_at: '2025-11-27 09:15:42',
        status: 'urgent'
    },
    {
        user_id: 'tui1_34765432',
        avatar: 'https://i.pravatar.cc/150?img=13',
        risk_score: 81,
        tags: ['多设备共享', 'IP异常'],
        city: '上海',
        last_ip: '121.77.88.156',
        last_login_at: '2025-11-27 11:32:18',
        status: 'high'
    },
    {
        user_id: 'tui1_45654321',
        risk_score: 78,
        reason: '支付方式异常',
        avatar: 'https://i.pravatar.cc/150?img=14',
        login_ip: '183.45.199.123',
        location: '北京',
        pending_days: 3,
        status: 'high'
    },
    {
        user_id: 'tui1_56543210',
        risk_score: 75,
        reason: 'IP频繁变更',
        avatar: 'https://i.pravatar.cc/150?img=15',
        login_ip: '220.167.88.45',
        location: '杭州',
        pending_days: 2,
        status: 'medium'
    },
    {
        user_id: 'tui1_67432109',
        risk_score: 72,
        reason: '高取消率',
        avatar: 'https://i.pravatar.cc/150?img=16',
        login_ip: '114.88.156.78',
        location: '成都',
        pending_days: 4,
        status: 'medium'
    },
    {
        user_id: 'tui1_78321098',
        risk_score: 69,
        reason: '新户大额',
        avatar: 'https://i.pravatar.cc/150?img=17',
        login_ip: '61.55.234.90',
        location: '重庆',
        pending_days: 1,
        status: 'medium'
    },
    {
        user_id: 'tui1_89210987',
        risk_score: 66,
        reason: '实名认证疑点',
        avatar: 'https://i.pravatar.cc/150?img=18',
        login_ip: '202.178.45.123',
        location: '武汉',
        pending_days: 5,
        status: 'low'
    },
    // 添加更多测试用户（共30个）
    { user_id: 'tui1_90109876', avatar: 'https://i.pravatar.cc/150?img=19', risk_score: 88, tags: ['异地登录', '设备异常', 'VPN检测'], city: '南京', last_ip: '120.45.78.90', last_login_at: '2025-11-27 15:20:00', status: 'urgent' },
    { user_id: 'tui1_01098765', avatar: 'https://i.pravatar.cc/150?img=20', risk_score: 86, tags: ['高频交易', '小额多笔'], city: '天津', last_ip: '60.12.34.56', last_login_at: '2025-11-27 14:15:00', status: 'urgent' },
    { user_id: 'tui1_11987654', avatar: 'https://i.pravatar.cc/150?img=21', risk_score: 84, tags: ['账户共享', 'IP跳变'], city: '西安', last_ip: '111.22.33.44', last_login_at: '2025-11-27 13:45:00', status: 'high' },
    { user_id: 'tui1_22876543', avatar: 'https://i.pravatar.cc/150?img=22', risk_score: 82, tags: ['支付异常', '频繁更换收款'], city: '苏州', last_ip: '222.33.44.55', last_login_at: '2025-11-27 12:30:00', status: 'high' },
    { user_id: 'tui1_33765432', avatar: 'https://i.pravatar.cc/150?img=23', risk_score: 80, tags: ['新户大额', '快速提现'], city: '郑州', last_ip: '180.67.89.12', last_login_at: '2025-11-27 11:20:00', status: 'high' },
    { user_id: 'tui1_44654321', avatar: 'https://i.pravatar.cc/150?img=24', risk_score: 77, tags: ['设备指纹异常', '多账号关联'], city: '长沙', last_ip: '117.89.45.67', last_login_at: '2025-11-27 10:15:00', status: 'medium' },
    { user_id: 'tui1_55543210', avatar: 'https://i.pravatar.cc/150?img=25', risk_score: 75, tags: ['高取消率', '交易超时'], city: '福州', last_ip: '119.12.34.56', last_login_at: '2025-11-27 09:40:00', status: 'medium' },
    { user_id: 'tui1_66432109', avatar: 'https://i.pravatar.cc/150?img=26', risk_score: 73, tags: ['代理IP', '匿名访问'], city: '厦门', last_ip: '202.45.67.89', last_login_at: '2025-11-27 08:30:00', status: 'medium' },
    { user_id: 'tui1_77321098', avatar: 'https://i.pravatar.cc/150?img=27', risk_score: 71, tags: ['可疑注册', '虚假信息'], city: '青岛', last_ip: '221.78.90.12', last_login_at: '2025-11-27 07:25:00', status: 'medium' },
    { user_id: 'tui1_88210987', avatar: 'https://i.pravatar.cc/150?img=28', risk_score: 69, tags: ['频繁申诉', '恶意投诉'], city: '大连', last_ip: '125.34.56.78', last_login_at: '2025-11-27 06:20:00', status: 'low' },
    { user_id: 'tui1_99109876', avatar: 'https://i.pravatar.cc/150?img=29', risk_score: 67, tags: ['账户异常', '长时间未登录后突然活跃'], city: '沈阳', last_ip: '210.12.34.56', last_login_at: '2025-11-27 05:15:00', status: 'low' },
    { user_id: 'tui1_00098765', avatar: 'https://i.pravatar.cc/150?img=30', risk_score: 65, tags: ['实名不符', '身份证疑似伪造'], city: '哈尔滨', last_ip: '123.45.67.89', last_login_at: '2025-11-27 04:10:00', status: 'low' },
    { user_id: 'tui1_10987654', avatar: 'https://i.pravatar.cc/150?img=31', risk_score: 63, tags: ['异常登录时间', '深夜频繁交易'], city: '石家庄', last_ip: '61.89.12.34', last_login_at: '2025-11-27 03:05:00', status: 'low' },
    { user_id: 'tui1_21876543', avatar: 'https://i.pravatar.cc/150?img=32', risk_score: 92, tags: ['黑名单设备', '团伙作案', '洗钱嫌疑'], city: '合肥', last_ip: '182.56.78.90', last_login_at: '2025-11-27 16:30:00', status: 'critical' },
    { user_id: 'tui1_32765432', avatar: 'https://i.pravatar.cc/150?img=33', risk_score: 90, tags: ['虚假交易', '刷单嫌疑'], city: '南昌', last_ip: '114.67.89.01', last_login_at: '2025-11-27 15:45:00', status: 'critical' },
    { user_id: 'tui1_43654321', avatar: 'https://i.pravatar.cc/150?img=34', risk_score: 87, tags: ['账户盗用', '异常提现'], city: '济南', last_ip: '220.12.34.56', last_login_at: '2025-11-27 14:50:00', status: 'urgent' },
    { user_id: 'tui1_54543210', avatar: 'https://i.pravatar.cc/150?img=35', risk_score: 85, tags: ['支付卡盗刷', '异常消费'], city: '太原', last_ip: '121.45.67.89', last_login_at: '2025-11-27 13:55:00', status: 'urgent' },
    { user_id: 'tui1_65432109', avatar: 'https://i.pravatar.cc/150?img=36', risk_score: 83, tags: ['多次退款', '恶意欺诈'], city: '兰州', last_ip: '124.78.90.12', last_login_at: '2025-11-27 12:40:00', status: 'high' },
    { user_id: 'tui1_76321098', avatar: 'https://i.pravatar.cc/150?img=37', risk_score: 81, tags: ['虚拟货币交易', '可疑资金流'], city: '银川', last_ip: '111.23.45.67', last_login_at: '2025-11-27 11:35:00', status: 'high' },
    { user_id: 'tui1_87210987', avatar: 'https://i.pravatar.cc/150?img=38', risk_score: 79, tags: ['跨境交易异常', '外汇违规'], city: '乌鲁木齐', last_ip: '218.34.56.78', last_login_at: '2025-11-27 10:30:00', status: 'high' },
    { user_id: 'tui1_98109876', avatar: 'https://i.pravatar.cc/150?img=39', risk_score: 76, tags: ['快速注册注销', '马甲账号'], city: '呼和浩特', last_ip: '222.67.89.01', last_login_at: '2025-11-27 09:25:00', status: 'medium' },
    { user_id: 'tui1_09098765', avatar: 'https://i.pravatar.cc/150?img=40', risk_score: 74, tags: ['设备ROOT', '模拟器登录'], city: '昆明', last_ip: '116.12.34.56', last_login_at: '2025-11-27 08:20:00', status: 'medium' }
];

// AI模型健康数据
const aiModelHealth = {
    ai_hit_rate: 92, // 百分比
    false_positive_rate: 3,
    manual_override_count: 47,
    model_version: "v2.4.1",
    last_updated: "2025-11-27",
    status: "normal"  // normal, warning, critical
};

// 系统健康数据
const systemHealth = {
    api_status: "normal",
    queue_length: 2,
    log_ingestion_rate: 99.2,
    model_service_status: "normal",
    last_check: "2025-11-28 14:30:00"
};

// 风险类型趋势数据
const riskTypeTrend = {
    time_range: ["11-22", "11-23", "11-24", "11-25", "11-26", "11-27", "11-28"],
    trends: {
        multi_device: [10, 14, 22, 28, 25, 30, 35],
        proxy_login: [5, 8, 12, 13, 15, 18, 20],
        high_cancel: [23, 25, 30, 31, 28, 33, 38],
        shared_payment: [12, 15, 18, 20, 22, 25, 28],
        ip_risk: [8, 10, 12, 15, 14, 16, 18]
    }
};

// 地区风险热力图数据（增强版，包含风险标签）
const geoRiskHeatmap = {
    regions: [
        { 
            rank: 1,
            city: "深圳", 
            country: "中国", 
            risk_users: 245,
            high_risk_users: 89,
            risk_score: 245, 
            device_risk_users: 98,
            ip_risk_users: 67,
            trade_risk_users: 52,
            syndicate_risk_users: 18,
            identity_risk_users: 10,
            tags: ["团伙活跃区", "多账号同设备高发区", "高频取消高发区"],
            change_rate: 12,
            change_direction: "up"
        },
        { 
            rank: 2,
            city: "广州", 
            country: "中国", 
            risk_users: 198,
            high_risk_users: 72,
            risk_score: 198, 
            device_risk_users: 70,
            ip_risk_users: 55,
            trade_risk_users: 40,
            syndicate_risk_users: 20,
            identity_risk_users: 13,
            tags: ["代理登录高发区", "收款码共享集中区", "链式倒单高发区"],
            change_rate: -5,
            change_direction: "down"
        },
        { 
            rank: 3,
            city: "上海", 
            country: "中国", 
            risk_users: 176,
            high_risk_users: 65,
            risk_score: 176, 
            device_risk_users: 65,
            ip_risk_users: 48,
            trade_risk_users: 38,
            syndicate_risk_users: 15,
            identity_risk_users: 10,
            tags: ["模拟器高风险地区", "异地登录集中区", "小额跑分集中区"],
            change_rate: 8,
            change_direction: "up"
        },
        { 
            rank: 4,
            city: "北京", 
            country: "中国", 
            risk_users: 145,
            high_risk_users: 48,
            risk_score: 145, 
            device_risk_users: 52,
            ip_risk_users: 40,
            trade_risk_users: 30,
            syndicate_risk_users: 15,
            identity_risk_users: 8,
            tags: ["IP变化热点", "多次更换收款码地区"],
            change_rate: 0,
            change_direction: "flat"
        },
        { 
            rank: 5,
            city: "杭州", 
            country: "中国", 
            risk_users: 128,
            high_risk_users: 42,
            risk_score: 128, 
            device_risk_users: 45,
            ip_risk_users: 35,
            trade_risk_users: 28,
            syndicate_risk_users: 12,
            identity_risk_users: 8,
            tags: ["循环取消高发区", "固定时段交易区"],
            change_rate: 3,
            change_direction: "up"
        },
        { 
            rank: 6,
            city: "成都", 
            country: "中国", 
            risk_users: 112,
            high_risk_users: 35,
            risk_score: 112, 
            device_risk_users: 38,
            ip_risk_users: 32,
            trade_risk_users: 25,
            syndicate_risk_users: 10,
            identity_risk_users: 7,
            tags: ["互刷自成交集中区", "同IP多账号地区"],
            change_rate: -3,
            change_direction: "down"
        }
    ]
};

// 团伙热点榜数据（按照 GroupItem 规范）
const syndicateHotspotRanking = [
    {
        group_id: "G1203",
        rank: 1,
        status: "active",
        member_count: 8,
        total_amount: 125000,
        active_days: 15,
        core_device_fp: "DFP_889977",
        core_ip: "192.168.1.100",
        core_payment_id: "QR_889922",
        risk_score: 95,
        risk_level: "high",
        main_reason: "支付二维码共享",
        updated_at: "2025-11-27T10:00:00"
    },
    {
        group_id: "G1204",
        rank: 2,
        status: "active",
        member_count: 6,
        total_amount: 89000,
        active_days: 12,
        core_device_fp: "DFP_445566",
        core_ip: "10.0.0.50",
        core_payment_id: "QR_334455",
        risk_score: 91,
        risk_level: "high",
        main_reason: "多账号同设备",
        updated_at: "2025-11-27T09:30:00"
    },
    {
        group_id: "G1205",
        rank: 3,
        status: "monitoring",
        member_count: 5,
        total_amount: 68000,
        active_days: 9,
        core_device_fp: "DFP_778899",
        core_ip: "172.16.0.20",
        core_payment_id: "BANK_667788",
        risk_score: 87,
        risk_level: "high",
        main_reason: "IP聚集",
        updated_at: "2025-11-27T08:45:00"
    },
    {
        group_id: "G1206",
        rank: 4,
        status: "active",
        member_count: 4,
        total_amount: 52000,
        active_days: 7,
        core_device_fp: "DFP_223344",
        core_ip: "192.168.2.50",
        core_payment_id: "QR_990011",
        risk_score: 82,
        risk_level: "high",
        main_reason: "链式倒单",
        updated_at: "2025-11-27T11:15:00"
    },
    {
        group_id: "G1207",
        rank: 5,
        status: "active",
        member_count: 3,
        total_amount: 35000,
        active_days: 5,
        core_device_fp: "DFP_556677",
        core_ip: "10.1.1.100",
        core_payment_id: "BANK_112233",
        risk_score: 76,
        risk_level: "medium",
        main_reason: "小额高频",
        updated_at: "2025-11-27T12:20:00"
    },
    {
        group_id: "G1208",
        rank: 6,
        status: "monitoring",
        member_count: 7,
        total_amount: 98000,
        active_days: 11,
        core_device_fp: "DFP_998877",
        core_ip: "58.220.45.78",
        core_payment_id: "QR_776655",
        risk_score: 88,
        risk_level: "high",
        main_reason: "模拟器群控",
        updated_at: "2025-11-27T10:10:00"
    },
    {
        group_id: "G1209",
        rank: 7,
        status: "monitoring",
        member_count: 5,
        total_amount: 67000,
        active_days: 8,
        core_device_fp: "DFP_334422",
        core_ip: "121.56.89.123",
        core_payment_id: "BANK_998877",
        risk_score: 79,
        risk_level: "medium",
        main_reason: "资金归集",
        updated_at: "2025-11-27T09:05:00"
    },
    {
        group_id: "G1210",
        rank: 8,
        status: "active",
        member_count: 4,
        total_amount: 45000,
        active_days: 6,
        core_device_fp: "DFP_112299",
        core_ip: "183.62.154.90",
        core_payment_id: "QR_445566",
        risk_score: 74,
        risk_level: "medium",
        main_reason: "频繁换绑",
        updated_at: "2025-11-27T13:40:00"
    }
];

// 实时告警流数据（最新5条）
const realtimeAlertFeed = [
    {
        alert_id: "A83923",
        level: "high",
        event_type: "shared_payment",
        description: "支付二维码被 4 个账号共享",
        user_ids: ["tui1_12981989", "tui1_23876543"],
        created_at: "2025-11-28 14:35:22",
        auto_action: "已限制交易"
    },
    {
        alert_id: "A83924",
        level: "critical",
        event_type: "syndicate_detected",
        description: "发现 6 个账号存在团伙关联行为",
        user_ids: ["tui1_34765432", "tui1_45654321"],
        created_at: "2025-11-28 14:32:15",
        auto_action: "已发送审核通知"
    },
    {
        alert_id: "A83925",
        level: "high",
        event_type: "multi_device",
        description: "1 小时内从 5 台不同设备登录",
        user_ids: ["9f3e_7A12345h78"],
        created_at: "2025-11-28 14:28:08",
        auto_action: "已触发身份验证"
    },
    {
        alert_id: "A83926",
        level: "medium",
        event_type: "ip_anomaly",
        description: "IP 地址在短时间内发生 3 次跨国变更",
        user_ids: ["2c7b_4E67890j23"],
        created_at: "2025-11-28 14:22:33",
        auto_action: "已降低交易限额"
    },
    {
        alert_id: "A83927",
        level: "high",
        event_type: "high_cancel_rate",
        description: "订单取消率超过 50% 阈值",
        user_ids: ["tui1_56543210"],
        created_at: "2025-11-28 14:15:17",
        auto_action: "已限制发布新订单"
    }
];

// 风险类别分布数据（增强版）
const riskCategoryDistribution = {
    categories: {
        device_risk: 134,
        ip_risk: 78,
        trade_risk: 90,
        payment_risk: 42,
        syndicate_risk: 19,
        behavior_risk: 56,
        account_risk: 34
    },
    total: 453
};

// 工具函数 - 获取风险等级颜色
function getGeoRiskColor(level) {
    const colors = {
        'high': '#dc2626',
        'medium': '#f59e0b',
        'low': '#10b981'
    };
    return colors[level] || '#64748b';
}

// 工具函数 - 获取团伙状态文本
function getSyndicateStatusText(status) {
    const statuses = {
        'active': '活跃中',
        'monitoring': '监控中',
        'new': '新检测',
        'resolved': '已处理'
    };
    return statuses[status] || status;
}

// 工具函数 - 获取团伙状态颜色
function getSyndicateStatusColor(status) {
    const colors = {
        'active': '#dc2626',
        'monitoring': '#f59e0b',
        'new': '#3b82f6',
        'resolved': '#10b981'
    };
    return colors[status] || '#64748b';
}

// 工具函数 - 获取告警类型图标
function getAlertTypeIcon(eventType) {
    const icons = {
        'shared_payment': 'fa-credit-card',
        'syndicate_detected': 'fa-users',
        'multi_device': 'fa-mobile-alt',
        'ip_anomaly': 'fa-globe',
        'high_cancel_rate': 'fa-times-circle',
        'unusual_trade': 'fa-exchange-alt'
    };
    return icons[eventType] || 'fa-exclamation-circle';
}

// 工具函数 - 获取告警类型文本
function getAlertTypeText(eventType) {
    const texts = {
        'shared_payment': '支付共享',
        'syndicate_detected': '团伙检测',
        'multi_device': '多设备登录',
        'ip_anomaly': 'IP异常',
        'high_cancel_rate': '高取消率',
        'unusual_trade': '异常交易'
    };
    return texts[eventType] || eventType;
}

// 工具函数 - 格式化大数字
function formatLargeNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 工具函数 - 获取趋势图标
function getTrendIcon(trend) {
    if (trend > 0) return 'fa-arrow-up';
    if (trend < 0) return 'fa-arrow-down';
    return 'fa-minus';
}

// 工具函数 - 获取趋势类名
function getTrendClass(trend) {
    if (trend > 0) return 'up';
    if (trend < 0) return 'down';
    return 'stable';
}

// 工具函数 - 获取健康状态图标
function getHealthIcon(status) {
    const icons = {
        'normal': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'critical': 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
}

// 工具函数 - 获取健康状态文本
function getHealthStatusText(status) {
    const texts = {
        'normal': '正常',
        'warning': '警告',
        'critical': '异常'
    };
    return texts[status] || '未知';
}

// 用户风险列表数据
const riskUsersList = [
    {
        user_id: '9f3e_7A12345h78',
        avatar: 'https://i.pravatar.cc/150?img=1',
        risk_score: 95,
        risk_level: 'critical',
        main_risks: ['团伙嫌疑', '收款码共享', '多账号同设备'],
        city: '深圳',
        last_ip: '112.25.67.89',
        last_login_at: '2025-11-28 14:23:15',
        status: 'pending'
    },
    {
        user_id: '2c7b_4E67890j23',
        avatar: 'https://i.pravatar.cc/150?img=2',
        risk_score: 91,
        risk_level: 'critical',
        main_risks: ['大额异常交易', '高频取消'],
        city: '广州',
        last_ip: '58.33.142.90',
        last_login_at: '2025-11-28 13:15:42',
        status: 'in_review'
    },
    {
        user_id: '5d8a_9B45678k01',
        avatar: 'https://i.pravatar.cc/150?img=3',
        risk_score: 87,
        risk_level: 'high',
        main_risks: ['多设备共享', 'IP异常'],
        city: '上海',
        last_ip: '121.77.88.156',
        last_login_at: '2025-11-28 12:32:18',
        status: 'pending'
    },
    {
        user_id: '8e4f_3C23456m89',
        avatar: 'https://i.pravatar.cc/150?img=4',
        risk_score: 82,
        risk_level: 'high',
        main_risks: ['支付方式异常'],
        city: '北京',
        last_ip: '183.45.199.123',
        last_login_at: '2025-11-28 11:47:33',
        status: 'pending'
    },
    {
        user_id: '1a9d_6F78901n45',
        avatar: 'https://i.pravatar.cc/150?img=5',
        risk_score: 78,
        risk_level: 'high',
        main_risks: ['IP频繁变更'],
        city: '杭州',
        last_ip: '220.167.88.45',
        last_login_at: '2025-11-28 10:28:50',
        status: 'resolved'
    },
    {
        user_id: '7b2c_8D34567p12',
        avatar: 'https://i.pravatar.cc/150?img=6',
        risk_score: 75,
        risk_level: 'medium',
        main_risks: ['高取消率'],
        city: '成都',
        last_ip: '114.88.156.78',
        last_login_at: '2025-11-28 09:15:27',
        status: 'pending'
    },
    {
        user_id: '4f6e_2A90123q67',
        avatar: 'https://i.pravatar.cc/150?img=7',
        risk_score: 71,
        risk_level: 'medium',
        main_risks: ['新户大额'],
        city: '重庆',
        last_ip: '61.55.234.90',
        last_login_at: '2025-11-28 08:42:11',
        status: 'pending'
    },
    {
        user_id: '3d5b_5G56789r34',
        avatar: 'https://i.pravatar.cc/150?img=8',
        risk_score: 68,
        risk_level: 'medium',
        main_risks: ['实名认证疑点'],
        city: '武汉',
        last_ip: '202.178.45.123',
        last_login_at: '2025-11-28 07:20:08',
        status: 'resolved'
    },
    {
        user_id: '9h2k_8L34567s90',
        avatar: 'https://i.pravatar.cc/150?img=9',
        risk_score: 65,
        risk_level: 'low',
        main_risks: ['关联账户异常'],
        city: '长沙',
        last_ip: '119.123.45.67',
        last_login_at: '2025-11-28 06:10:33',
        status: 'pending'
    },
    {
        user_id: '2m4n_6P90123t12',
        avatar: 'https://i.pravatar.cc/150?img=10',
        risk_score: 62,
        risk_level: 'low',
        main_risks: ['频繁修改密码'],
        city: '郑州',
        last_ip: '61.187.56.78',
        last_login_at: '2025-11-28 05:45:12',
        status: 'pending'
    }
    ,
    {
        user_id: '1b2c_3D45678e90',
        avatar: 'https://i.pravatar.cc/150?img=11',
        risk_score: 89,
        risk_level: 'high',
        main_risks: ['高频充提', 'IP频繁变更'],
        city: '深圳',
        last_ip: '113.116.45.88',
        last_login_at: '2025-11-28 15:45:12',
        status: 'pending'
    },
    {
        user_id: '4f5g_6H78901i23',
        avatar: 'https://i.pravatar.cc/150?img=12',
        risk_score: 84,
        risk_level: 'high',
        main_risks: ['多设备登录', '关联异常'],
        city: '广州',
        last_ip: '58.62.144.10',
        last_login_at: '2025-11-28 15:30:45',
        status: 'in_review'
    },
    {
        user_id: '7k8l_9M01234n56',
        avatar: 'https://i.pravatar.cc/150?img=13',
        risk_score: 76,
        risk_level: 'medium',
        main_risks: ['大额买单待核'],
        city: '上海',
        last_ip: '101.226.103.12',
        last_login_at: '2025-11-28 15:15:22',
        status: 'pending'
    },
    {
        user_id: '2p3q_4R56789s01',
        avatar: 'https://i.pravatar.cc/150?img=14',
        risk_score: 93,
        risk_level: 'critical',
        main_risks: ['黑产关联', '批量注册'],
        city: '北京',
        last_ip: '123.125.114.144',
        last_login_at: '2025-11-28 15:05:33',
        status: 'pending'
    },
    {
        user_id: '5t6u_7V89012w34',
        avatar: 'https://i.pravatar.cc/150?img=15',
        risk_score: 81,
        risk_level: 'high',
        main_risks: ['短时异地登录'],
        city: '成都',
        last_ip: '118.112.58.10',
        last_login_at: '2025-11-28 14:55:10',
        status: 'pending'
    },
    {
        user_id: '8x9y_0Z12345a67',
        avatar: 'https://i.pravatar.cc/150?img=16',
        risk_score: 67,
        risk_level: 'medium',
        main_risks: ['交易对手风险'],
        city: '杭州',
        last_ip: '115.236.118.130',
        last_login_at: '2025-11-28 14:45:55',
        status: 'resolved'
    },
    {
        user_id: '1b2c_3D45678e91',
        avatar: 'https://i.pravatar.cc/150?img=17',
        risk_score: 88,
        risk_level: 'high',
        main_risks: ['跨城大额'],
        city: '深圳',
        last_ip: '113.116.45.89',
        last_login_at: '2025-11-28 14:35:12',
        status: 'pending'
    },
    {
        user_id: '4f5g_6H78901i24',
        avatar: 'https://i.pravatar.cc/150?img=18',
        risk_score: 92,
        risk_level: 'critical',
        main_risks: ['支付链路异常'],
        city: '广州',
        last_ip: '58.62.144.11',
        last_login_at: '2025-11-28 14:25:45',
        status: 'pending'
    },
    {
        user_id: '7k8l_9M01234n57',
        avatar: 'https://i.pravatar.cc/150?img=19',
        risk_score: 74,
        risk_level: 'medium',
        main_risks: ['高频取消'],
        city: '上海',
        last_ip: '101.226.103.13',
        last_login_at: '2025-11-28 14:15:22',
        status: 'pending'
    },
    {
        user_id: '2p3q_4R56789s02',
        avatar: 'https://i.pravatar.cc/150?img=20',
        risk_score: 86,
        risk_level: 'high',
        main_risks: ['同设备换号'],
        city: '北京',
        last_ip: '123.125.114.145',
        last_login_at: '2025-11-28 14:05:33',
        status: 'pending'
    }
    ,
    {
        user_id: '3m4n_5P67890q12',
        avatar: 'https://i.pravatar.cc/150?img=21',
        risk_score: 55,
        risk_level: 'low',
        main_risks: ['小额高频交易'],
        city: '武汉',
        last_ip: '202.103.24.68',
        last_login_at: '2025-11-28 16:10:00',
        status: 'pending'
    },
    {
        user_id: '6r7s_8T90123u45',
        avatar: 'https://i.pravatar.cc/150?img=22',
        risk_score: 42,
        risk_level: 'low',
        main_risks: ['非常规时间活跃'],
        city: '长沙',
        last_ip: '119.29.156.44',
        last_login_at: '2025-11-28 16:30:00',
        status: 'pending'
    }
];

// 确保基础数据存在（参考后台格式，添加头像和IP信息）
if (typeof topRiskUsers === 'undefined') {
    window.topRiskUsers = [
        {
            rank: 1,
            user_id: "1u2t_3B24123b44",
            risk_score: 95,
            main_events: ["团伙欺诈", "设备共享", "支付共享"],
            member_count: 5,
            avatar: "https://i.pravatar.cc/150?img=1",
            login_ip: "103.9.188.7",
            location: "深圳"
        },
        {
            rank: 2,
            user_id: "5a8f_9D56789e12",
            risk_score: 91,
            main_events: ["高频交易", "异常金额", "取消率高"],
            member_count: 3,
            avatar: "https://i.pravatar.cc/150?img=2",
            login_ip: "58.220.45.78",
            location: "广州"
        },
        {
            rank: 3,
            user_id: "7c4e_1F34567a89",
            risk_score: 87,
            main_events: ["支付频繁变更", "多设备", "IP异常"],
            member_count: 2,
            avatar: "https://i.pravatar.cc/150?img=3",
            login_ip: "121.56.89.123",
            location: "上海"
        },
        {
            rank: 4,
            user_id: "2d9a_6E78901b23",
            risk_score: 82,
            main_events: ["新账户高额交易", "设备风险"],
            member_count: 1,
            avatar: "https://i.pravatar.cc/150?img=4",
            login_ip: "183.62.154.90",
            location: "北京"
        },
        {
            rank: 5,
            user_id: "8b3f_2A45678c90",
            risk_score: 78,
            main_events: ["IP共享", "异常登录时间"],
            member_count: 2,
            avatar: "https://i.pravatar.cc/150?img=5",
            login_ip: "112.80.248.75",
            location: "杭州"
        },
        {
            rank: 6,
            user_id: "4e7c_5C12345d67",
            risk_score: 75,
            main_events: ["频繁取消订单", "投诉率高"],
            member_count: 0,
            avatar: "https://i.pravatar.cc/150?img=6",
            login_ip: "220.181.38.148",
            location: "成都"
        },
        {
            rank: 7,
            user_id: "9a2d_8F90123e45",
            risk_score: 71,
            main_events: ["支付失败率高", "交易异常"],
            member_count: 1,
            avatar: "https://i.pravatar.cc/150?img=7",
            login_ip: "61.145.123.67",
            location: "重庆"
        },
        {
            rank: 8,
            user_id: "3f6b_4D67890a12",
            risk_score: 68,
            main_events: ["设备指纹异常", "APP伪造"],
            member_count: 0,
            avatar: "https://i.pravatar.cc/150?img=8",
            login_ip: "202.103.24.68",
            location: "武汉"
        },
        {
            rank: 9,
            user_id: "6c8a_7B34567f89",
            risk_score: 65,
            main_events: ["地理位置跳跃", "VPN使用"],
            member_count: 1,
            avatar: "https://i.pravatar.cc/150?img=9",
            login_ip: "114.242.249.190",
            location: "南京"
        },
        {
            rank: 10,
            user_id: "1e5d_9C01234g56",
            risk_score: 62,
            main_events: ["账户信息不一致", "实名认证疑点"],
            member_count: 0,
            avatar: "https://i.pravatar.cc/150?img=10",
            login_ip: "218.76.45.123",
            location: "西安"
        }
    ];
}

if (typeof urgentAlerts === 'undefined') {
    window.urgentAlerts = [
        {
            id: 'ALERT_001',
            level: 'critical',
            title: '检测到疑似团伙欺诈行为',
            description: '用户 U990011 与其他4个账户使用相同设备和支付方式',
            user_id: 'U990011',
            time: '2分钟前',
            status: 'pending'
        },
        {
            id: 'ALERT_002',
            level: 'critical',
            title: '异常高频交易检测',
            description: '用户 U102393 在1小时内完成32笔交易',
            user_id: 'U102393',
            time: '5分钟前',
            status: 'pending'
        }
    ];
}
