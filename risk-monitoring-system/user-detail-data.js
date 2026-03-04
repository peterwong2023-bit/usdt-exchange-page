// 用户风险详情页面数据

// 示例：用户 tui1_12981989 的完整风险数据
const userRiskDetails = {
    "tui1_12981989": {
        summary: {
            user_id: "tui1_12981989",
            avatar_url: "https://i.pravatar.cc/150?img=11",
            nickname: "张三",
            risk_score: 89,
            risk_level: "high",
            main_tags: ["团伙嫌疑", "收款码共享"],
            sub_tags: ["多账号同设备", "高频取消", "异地登录"],
            account_status: "frozen",
            case_id: "CASE_20251126_001",
            case_status: "in_review",
            assignee_name: "运营_A"
        },
        account_info: {
            register_days: 120,
            kyc_status: "verified",
            balance: 4500,
            total_deposit_30d: 12000,
            total_sell_30d: 9800,
            trade_count_30d: 35,
            account_status: "frozen"
        },
        login_device_risk: {
            last_city: "深圳",
            last_country: "中国",
            last_ip: "112.25.67.89",
            last_login_at: "2025-11-26 14:23:15",
            ip_count_7d: 5,
            city_jump_count_7d: 2,
            proxy_login_7d: 1,
            device_count_7d: 3,
            core_device_fp: "DFP_889977",
            device_risk_tags: ["多账号同设备", "模拟器设备"],
            summary: "最近一周多设备 + 异地登录，疑似被控号 / 工作室账号。"
        },
        payment_risk: {
            qr_count: 3,
            bank_count: 2,
            shared_payment: true,
            shared_payment_accounts: 4,
            payment_change_7d: 5,
            core_payment_ids: ["QR_889922", "QR_334455", "BANK_6217***1234"],
            receive_amount_7d: 8500,
            summary: "与多账号共用同一收款码，疑似团伙资金中转账号。"
        },
        trade_risk: {
            high_cancel_24h: 6,
            cancel_after_accept_7d: 3,
            repeat_cancel_7d: 2,
            small_high_freq_30m: 12,
            small_trade_ratio_30d: 45,
            active_time_window: "02:00-04:00",
            summary: "频繁取消 + 小额高频 + 固定凌晨活跃，疑似跑分/脚本行为。"
        },
        relation_risk: {
            group_id: "G1203",
            group_risk_score: 95,
            role_in_group: "core",
            shared_device_accounts: 2,
            shared_payment_accounts: 3,
            high_risk_partner_count: 2,
            summary: "与多个高危账号共享设备与收款方式，团伙嫌疑明显。"
        },
        risk_events: [
            {
                event_time: "2025-11-26 14:23",
                event_type: "multi_account_device",
                event_label: "同设备多账号登录（DFP_889977）",
                level: "high"
            },
            {
                event_time: "2025-11-26 13:05",
                event_type: "shared_payment",
                event_label: "使用高风险收款码 QR_889922 收款",
                level: "high"
            },
            {
                event_time: "2025-11-25 21:12",
                event_type: "high_cancel",
                event_label: "5 分钟内取消订单 3 次",
                level: "medium"
            },
            {
                event_time: "2025-11-24 03:41",
                event_type: "small_high_freq",
                event_label: "凌晨小额高频交易 15 笔",
                level: "medium"
            },
            {
                event_time: "2025-11-23 18:30",
                event_type: "proxy_login",
                event_label: "检测到 VPN/代理登录",
                level: "medium"
            },
            {
                event_time: "2025-11-22 09:15",
                event_type: "location_jump",
                event_label: "异地登录：深圳 → 北京（2小时内）",
                level: "high"
            }
        ],
        audit_logs: [
            {
                time: "2025-11-26 14:30",
                operator: "运营_C",
                action: "assigned",
                remark: "分配给运营_C审核"
            },
            {
                time: "2025-11-23 16:33",
                operator: "运营_B",
                action: "mark_fraud",
                remark: "标记为疑似诈骗，未结案"
            },
            {
                time: "2025-11-20 10:02",
                operator: "运营_A",
                action: "watch",
                remark: "标记为观察中"
            }
        ]
    }
};

// 其他用户的简化数据
userRiskDetails["tui1_23876543"] = {
    summary: {
        user_id: "tui1_23876543",
        avatar_url: "https://i.pravatar.cc/150?img=12",
        nickname: "李四",
        risk_score: 85,
        risk_level: "high",
        main_tags: ["大额异常交易", "高频取消"],
        sub_tags: ["快速提现", "异常时间段"],
        account_status: "watch",
        case_id: "CASE_20251127_002",
        case_status: "pending",
        assignee_name: null
    },
    account_info: {
        register_days: 45,
        kyc_status: "verified",
        balance: 12500,
        total_deposit_30d: 85000,
        total_sell_30d: 78000,
        trade_count_30d: 128,
        account_status: "watch"
    },
    login_device_risk: {
        last_city: "广州",
        last_country: "中国",
        last_ip: "58.33.142.90",
        last_login_at: "2025-11-27 09:15:42",
        ip_count_7d: 3,
        city_jump_count_7d: 1,
        proxy_login_7d: 0,
        device_count_7d: 2,
        core_device_fp: "DFP_445566",
        device_risk_tags: ["高频切换"],
        summary: "短时间内大量交易，设备正常但行为异常。"
    },
    payment_risk: {
        qr_count: 2,
        bank_count: 1,
        shared_payment: false,
        shared_payment_accounts: 0,
        payment_change_7d: 2,
        core_payment_ids: ["QR_334455", "BANK_6228***5678"],
        receive_amount_7d: 65000,
        summary: "大额频繁收款，疑似资金过账。"
    },
    trade_risk: {
        high_cancel_24h: 12,
        cancel_after_accept_7d: 8,
        repeat_cancel_7d: 5,
        small_high_freq_30m: 8,
        small_trade_ratio_30d: 35,
        active_time_window: "全天",
        summary: "高频取消订单，疑似恶意占单行为。"
    },
    relation_risk: {
        group_id: "G1204",
        group_risk_score: 91,
        role_in_group: "member",
        shared_device_accounts: 1,
        shared_payment_accounts: 0,
        high_risk_partner_count: 3,
        summary: "与高危团伙成员有交易往来。"
    },
    risk_events: [
        {
            event_time: "2025-11-27 09:15",
            event_type: "high_cancel",
            event_label: "1小时内取消订单 8 次",
            level: "high"
        },
        {
            event_time: "2025-11-26 18:30",
            event_type: "large_amount",
            event_label: "单笔大额交易 $15,000",
            level: "medium"
        },
        {
            event_time: "2025-11-25 22:45",
            event_type: "fast_withdraw",
            event_label: "充值后立即提现",
            level: "high"
        }
    ],
    audit_logs: [
        {
            time: "2025-11-27 10:00",
            operator: "系统",
            action: "auto_watch",
            remark: "AI自动标记为观察"
        }
    ]
};





