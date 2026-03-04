// 团伙关系图谱数据

// G1203 团伙关系图谱
const groupGraphG1203 = {
    group_id: "G1203",
    risk_score: 95,
    member_count: 8,
    total_amount: 125000,
    nodes: [
        // 用户节点
        { id: "U_1", type: "user", label: "9f3e_7A12345h78", risk_level: "high", is_core: true },
        { id: "U_2", type: "user", label: "2c7b_4E67890j23", risk_level: "high" },
        { id: "U_3", type: "user", label: "5d8a_9B45678k01", risk_level: "high" },
        { id: "U_4", type: "user", label: "8e4f_3C23456m89", risk_level: "medium" },
        { id: "U_5", type: "user", label: "1a9d_6F78901n45", risk_level: "medium" },
        { id: "U_6", type: "user", label: "7b2c_8D34567p12", risk_level: "medium" },
        { id: "U_7", type: "user", label: "4f6e_2A90123q67", risk_level: "low" },
        { id: "U_8", type: "user", label: "3d5b_5G56789r34", risk_level: "low" },
        
        // 设备节点
        { id: "DFP_889977", type: "device", label: "DFP_889977", risk_level: "high", is_core: true },
        { id: "DFP_445566", type: "device", label: "DFP_445566", risk_level: "medium" },
        
        // IP节点
        { id: "IP_192.168.1.100", type: "ip", label: "192.168.1.100", risk_level: "high" },
        { id: "IP_10.0.0.50", type: "ip", label: "10.0.0.50", risk_level: "medium" },
        
        // 支付节点
        { id: "QR_889922", type: "payment", label: "QR_889922", risk_level: "high", is_core: true },
        { id: "QR_334455", type: "payment", label: "QR_334455", risk_level: "medium" }
    ],
    edges: [
        // 核心设备连接
        { from: "U_1", to: "DFP_889977", relation: "login_device" },
        { from: "U_2", to: "DFP_889977", relation: "login_device" },
        { from: "U_3", to: "DFP_889977", relation: "login_device" },
        { from: "U_4", to: "DFP_889977", relation: "login_device" },
        
        { from: "U_5", to: "DFP_445566", relation: "login_device" },
        { from: "U_6", to: "DFP_445566", relation: "login_device" },
        
        // IP连接
        { from: "U_1", to: "IP_192.168.1.100", relation: "login_ip" },
        { from: "U_2", to: "IP_192.168.1.100", relation: "login_ip" },
        { from: "U_3", to: "IP_192.168.1.100", relation: "login_ip" },
        
        { from: "U_4", to: "IP_10.0.0.50", relation: "login_ip" },
        { from: "U_5", to: "IP_10.0.0.50", relation: "login_ip" },
        
        // 核心收款码连接
        { from: "U_1", to: "QR_889922", relation: "payment_receive" },
        { from: "U_2", to: "QR_889922", relation: "payment_receive" },
        { from: "U_3", to: "QR_889922", relation: "payment_receive" },
        { from: "U_7", to: "QR_889922", relation: "payment_receive" },
        { from: "U_8", to: "QR_889922", relation: "payment_receive" },
        
        { from: "U_4", to: "QR_334455", relation: "payment_receive" },
        { from: "U_5", to: "QR_334455", relation: "payment_receive" },
        
        // 交易链路
        { from: "U_1", to: "U_2", relation: "trade_link" },
        { from: "U_2", to: "U_3", relation: "trade_link" },
        { from: "U_3", to: "U_4", relation: "trade_link" },
        { from: "U_4", to: "U_5", relation: "trade_link" },
        { from: "U_1", to: "U_7", relation: "trade_link" }
    ]
};

// 其他团伙的图谱数据（简化版）
const groupGraphs = {
    "G1203": groupGraphG1203,
    "G1204": {
        group_id: "G1204",
        risk_score: 91,
        member_count: 6,
        total_amount: 89000,
        nodes: [
            { id: "U_10", type: "user", label: "#8834556", risk_level: "high", is_core: true },
            { id: "U_11", type: "user", label: "#7690112", risk_level: "high" },
            { id: "U_12", type: "user", label: "#6556778", risk_level: "medium" },
            { id: "U_13", type: "user", label: "#5412334", risk_level: "medium" },
            { id: "U_14", type: "user", label: "#4378990", risk_level: "low" },
            { id: "U_15", type: "user", label: "#3234556", risk_level: "low" },
            
            { id: "DFP_445566", type: "device", label: "DFP_445566", risk_level: "high", is_core: true },
            { id: "IP_10.0.0.50", type: "ip", label: "10.0.0.50", risk_level: "medium" },
            { id: "QR_334455", type: "payment", label: "QR_334455", risk_level: "high", is_core: true }
        ],
        edges: [
            { from: "U_10", to: "DFP_445566", relation: "login_device" },
            { from: "U_11", to: "DFP_445566", relation: "login_device" },
            { from: "U_12", to: "DFP_445566", relation: "login_device" },
            { from: "U_10", to: "IP_10.0.0.50", relation: "login_ip" },
            { from: "U_11", to: "IP_10.0.0.50", relation: "login_ip" },
            { from: "U_10", to: "QR_334455", relation: "payment_receive" },
            { from: "U_11", to: "QR_334455", relation: "payment_receive" },
            { from: "U_12", to: "QR_334455", relation: "payment_receive" },
            { from: "U_10", to: "U_11", relation: "trade_link" },
            { from: "U_11", to: "U_12", relation: "trade_link" }
        ]
    }
};

// 节点详情数据
const nodeDetails = {
    "U_1": {
        user_id: "7989881",
        avatar: "https://i.pravatar.cc/150?img=11",
        risk_score: 89,
        risk_tags: ["团伙嫌疑", "收款码共享", "多账号同设备"],
        city: "深圳",
        last_ip: "192.168.1.100",
        device_count: 2,
        payment_count: 1,
        linked_accounts: 3
    },
    "U_2": {
        user_id: "8234567",
        avatar: "https://i.pravatar.cc/150?img=12",
        risk_score: 85,
        risk_tags: ["大额异常交易", "高频取消"],
        city: "广州",
        last_ip: "192.168.1.100",
        device_count: 1,
        payment_count: 1,
        linked_accounts: 2
    },
    "U_3": {
        user_id: "9456789",
        avatar: "https://i.pravatar.cc/150?img=13",
        risk_score: 81,
        risk_tags: ["多设备共享", "IP异常"],
        city: "上海",
        last_ip: "192.168.1.100",
        device_count: 2,
        payment_count: 1,
        linked_accounts: 3
    },
    "U_4": {
        user_id: "6723456",
        avatar: "https://i.pravatar.cc/150?img=14",
        risk_score: 78,
        risk_tags: ["支付方式异常"],
        city: "北京",
        last_ip: "10.0.0.50",
        device_count: 1,
        payment_count: 2,
        linked_accounts: 2
    },
    "U_5": {
        user_id: "5678901",
        avatar: "https://i.pravatar.cc/150?img=15",
        risk_score: 75,
        risk_tags: ["IP频繁变更"],
        city: "杭州",
        last_ip: "10.0.0.50",
        device_count: 2,
        payment_count: 1,
        linked_accounts: 2
    },
    "U_6": {
        user_id: "4534567",
        avatar: "https://i.pravatar.cc/150?img=16",
        risk_score: 72,
        risk_tags: ["高取消率"],
        city: "成都",
        last_ip: "10.0.0.50",
        device_count: 1,
        payment_count: 1,
        linked_accounts: 1
    },
    "U_7": {
        user_id: "3890123",
        avatar: "https://i.pravatar.cc/150?img=17",
        risk_score: 69,
        risk_tags: ["新户大额"],
        city: "重庆",
        last_ip: "192.168.1.100",
        device_count: 1,
        payment_count: 1,
        linked_accounts: 1
    },
    "U_8": {
        user_id: "2756789",
        avatar: "https://i.pravatar.cc/150?img=18",
        risk_score: 66,
        risk_tags: ["实名认证疑点"],
        city: "武汉",
        last_ip: "192.168.1.100",
        device_count: 1,
        payment_count: 1,
        linked_accounts: 1
    },
    "DFP_889977": {
        device_fp: "DFP_889977",
        linked_accounts: 4,
        risk_tags: ["多账号共用设备", "高频切换"]
    },
    "IP_192.168.1.100": {
        ip: "192.168.1.100",
        location: "深圳, 中国",
        linked_accounts: 3
    },
    "QR_889922": {
        payment_id: "QR_889922",
        payment_type: "收款二维码",
        linked_accounts: 5,
        recent_transactions: 128,
        total_amount: 85600
    }
};

