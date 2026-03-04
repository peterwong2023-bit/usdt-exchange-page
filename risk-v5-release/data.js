// 模拟数据 - AI风险监控系统

// 风险用户数据
const riskUsersData = [
    {
        user_id: "U102393",
        risk_score: 87,
        risk_level: "high",
        triggered_events: ["multi_device", "shared_payment", "high_cancel"],
        last_login_city: "Jakarta",
        device_count_24h: 4,
        high_risk_relations: 3,
        updated_at: "2025-11-28T04:22:10"
    },
    {
        user_id: "U334455",
        risk_score: 76,
        risk_level: "high",
        triggered_events: ["multi_device", "frequent_cancel"],
        last_login_city: "Singapore",
        device_count_24h: 3,
        high_risk_relations: 2,
        updated_at: "2025-11-28T03:45:22"
    },
    {
        user_id: "U567890",
        risk_score: 65,
        risk_level: "medium",
        triggered_events: ["shared_payment", "unusual_trade"],
        last_login_city: "Bangkok",
        device_count_24h: 2,
        high_risk_relations: 1,
        updated_at: "2025-11-28T02:18:33"
    },
    {
        user_id: "U112233",
        risk_score: 58,
        risk_level: "medium",
        triggered_events: ["ip_frequent_change"],
        last_login_city: "Manila",
        device_count_24h: 1,
        high_risk_relations: 0,
        updated_at: "2025-11-28T01:52:44"
    },
    {
        user_id: "U445566",
        risk_score: 45,
        risk_level: "low",
        triggered_events: ["first_time_trade"],
        last_login_city: "Ho Chi Minh",
        device_count_24h: 1,
        high_risk_relations: 0,
        updated_at: "2025-11-28T00:33:15"
    },
    {
        user_id: "U778899",
        risk_score: 32,
        risk_level: "low",
        triggered_events: [],
        last_login_city: "Kuala Lumpur",
        device_count_24h: 1,
        high_risk_relations: 0,
        updated_at: "2025-11-27T23:47:28"
    },
    {
        user_id: "U990011",
        risk_score: 91,
        risk_level: "high",
        triggered_events: ["multi_device", "shared_payment", "high_cancel", "syndicate_link"],
        last_login_city: "Jakarta",
        device_count_24h: 5,
        high_risk_relations: 4,
        updated_at: "2025-11-28T05:12:03"
    },
    {
        user_id: "U223344",
        risk_score: 72,
        risk_level: "high",
        triggered_events: ["multi_device", "ip_shared"],
        last_login_city: "Singapore",
        device_count_24h: 3,
        high_risk_relations: 2,
        updated_at: "2025-11-28T04:58:17"
    }
];

// 审计日志数据
const auditLogsData = [
    {
        log_id: "LOG_001",
        user_id: "U102393",
        risk_event: "multi_device",
        action: "标记高风险",
        operator: "admin_system",
        created_at: "2025-11-28T04:22:10"
    },
    {
        log_id: "LOG_002",
        user_id: "U334455",
        risk_event: "shared_payment",
        action: "发送告警通知",
        operator: "risk_analyzer",
        created_at: "2025-11-28T03:45:22"
    },
    {
        log_id: "LOG_003",
        user_id: "U567890",
        risk_event: "unusual_trade",
        action: "人工审核",
        operator: "moderator_john",
        created_at: "2025-11-28T02:18:33"
    },
    {
        log_id: "LOG_004",
        user_id: "U112233",
        risk_event: "ip_frequent_change",
        action: "临时限制",
        operator: "auto_system",
        created_at: "2025-11-28T01:52:44"
    },
    {
        log_id: "LOG_005",
        user_id: "U445566",
        risk_event: "first_time_trade",
        action: "正常监控",
        operator: "risk_monitor",
        created_at: "2025-11-28T00:33:15"
    }
];

// 风险事件详情数据
const riskEventsData = {
    "U102393": {
        basic_info: {
            user_id: "U102393",
            registration_date: "2025-08-15",
            total_trades: 156,
            account_balance: 25000.00
        },
        risk_summary: {
            risk_score: 87,
            risk_level: "high",
            last_assessment: "2025-11-28T04:22:10"
        },
        risk_events: [
            {
                event_key: "multi_device",
                risk_score: 30,
                severity: "high",
                description: "Same device used by 4 accounts"
            },
            {
                event_key: "shared_payment",
                risk_score: 25,
                severity: "high",
                description: "Payment QR shared by 3 accounts"
            },
            {
                event_key: "high_cancel",
                risk_score: 20,
                severity: "medium",
                description: "High cancellation rate (45%)"
            },
            {
                event_key: "syndicate_link",
                risk_score: 12,
                severity: "high",
                description: "Connected to known syndicate"
            }
        ],
        device_info: {
            current_device: "iPhone_14_Pro_Max",
            device_fingerprint: "FP_889977",
            device_count_24h: 4,
            device_count_7d: 12
        },
        ip_info: {
            current_ip: "192.168.1.100",
            ip_location: "Jakarta, Indonesia",
            ip_change_count_24h: 3,
            ip_shared_accounts: 2
        },
        payment_info: {
            primary_payment: "QR_889922",
            payment_shared_count: 3,
            payment_amount_24h: 15000.00,
            payment_frequency: "high"
        },
        trade_info: {
            trades_24h: 8,
            trades_7d: 45,
            cancel_rate: 45,
            avg_trade_amount: 1800.00
        }
    },
    "U334455": {
        basic_info: {
            user_id: "U334455",
            registration_date: "2025-09-20",
            total_trades: 89,
            account_balance: 15200.00
        },
        risk_summary: {
            risk_score: 76,
            risk_level: "high",
            last_assessment: "2025-11-28T03:45:22"
        },
        risk_events: [
            {
                event_key: "multi_device",
                risk_score: 28,
                severity: "high",
                description: "Device shared with 3 accounts"
            },
            {
                event_key: "frequent_cancel",
                risk_score: 22,
                severity: "medium",
                description: "Cancel rate above threshold"
            },
            {
                event_key: "rapid_trading",
                risk_score: 18,
                severity: "medium",
                description: "Unusual trading pattern"
            }
        ],
        device_info: {
            current_device: "Samsung_Galaxy_S23",
            device_fingerprint: "FP_445566",
            device_count_24h: 3,
            device_count_7d: 8
        },
        ip_info: {
            current_ip: "10.0.0.50",
            ip_location: "Singapore",
            ip_change_count_24h: 2,
            ip_shared_accounts: 1
        },
        payment_info: {
            primary_payment: "BANK_334455",
            payment_shared_count: 1,
            payment_amount_24h: 8500.00,
            payment_frequency: "medium"
        },
        trade_info: {
            trades_24h: 6,
            trades_7d: 32,
            cancel_rate: 38,
            avg_trade_amount: 1200.00
        }
    }
};

// 用户资料数据
const userProfilesData = {
    "U102393": {
        account_age_days: 104,
        trade_count_30d: 52,
        active_level: "high",
        flow_type: "net_out",
        behavior_tags: ["high_cancel", "multi_device"],
        security_tags: ["device_flag", "ip_flag", "payment_flag"]
    },
    "U334455": {
        account_age_days: 68,
        trade_count_30d: 34,
        active_level: "high",
        flow_type: "balanced",
        behavior_tags: ["frequent_cancel"],
        security_tags: ["device_flag"]
    }
};

// AI评分数据
const aiScoringData = {
    "U102393": {
        ai_score: 87,
        major_factors: [
            "multi_device",
            "shared_payment",
            "frequent_cancel",
            "syndicate_connection"
        ]
    },
    "U334455": {
        ai_score: 76,
        major_factors: [
            "multi_device",
            "cancel_pattern",
            "trading_anomaly"
        ]
    }
};

// 关系图数据
const relationshipGraphsData = {
    device_graph: {
        "U102393": {
            type: "device_graph",
            nodes: ["device_A", "device_B", "U102393", "U334455", "U990011"],
            edges: [
                ["device_A", "U102393"],
                ["device_A", "U334455"],
                ["device_B", "U990011"],
                ["device_B", "U102393"]
            ]
        }
    },
    ip_graph: {
        "U102393": {
            type: "ip_graph",
            nodes: ["192.168.1.100", "U102393", "U334455"],
            edges: [
                ["192.168.1.100", "U102393"],
                ["192.168.1.100", "U334455"]
            ]
        }
    },
    payment_graph: {
        "U102393": {
            type: "payment_graph",
            nodes: ["QR_889922", "U102393", "U567890", "U990011"],
            edges: [
                ["QR_889922", "U102393"],
                ["QR_889922", "U567890"],
                ["QR_889922", "U990011"]
            ]
        }
    }
};

// 工具函数
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getRiskLevelClass(level) {
    switch(level) {
        case 'high': return 'high';
        case 'medium': return 'medium';
        case 'low': return 'low';
        default: return 'low';
    }
}

function getSeverityClass(severity) {
    switch(severity) {
        case 'high': return 'high';
        case 'medium': return 'medium';
        case 'low': return 'low';
        default: return 'low';
    }
}

function getEventDescription(eventKey) {
    const descriptions = {
        'multi_device': '多设备使用',
        'shared_payment': '共享支付方式',
        'high_cancel': '高取消率',
        'frequent_cancel': '频繁取消',
        'ip_frequent_change': 'IP频繁变更',
        'first_time_trade': '首次交易',
        'unusual_trade': '异常交易',
        'syndicate_link': '团伙关联',
        'ip_shared': 'IP共享',
        'rapid_trading': '快速交易',
        'syndicate_connection': '团伙连接',
        'cancel_pattern': '取消模式',
        'trading_anomaly': '交易异常'
    };
    return descriptions[eventKey] || eventKey;
}



