import React from 'react';

export type RiskLevel = 'Normal' | 'Warn' | 'Limit' | 'Fuse';

export interface RuleReason {
  rule_key: string;
  rule_name: string;
  add_score: number;
  strength_text: string;
}

export interface RuleBreakdown {
  rule_key: string;
  rule_name: string;
  hit: boolean;
  strength_value: number;
  score: number;
  weight: number;
  contribution: number;
  details?: string;
}

export interface Sample {
  time: string;
  amount: number;
  to_address: string;
  status: string;
  source: 'api' | 'admin';
}

export interface AddressItem {
  address: string;
  count: number;
  amount: number;
  ratio: string;
  new_address: boolean;
}

export interface AddressAnalysis {
  top1_ratio: string;
  top2_ratio: string;
  top1_amount_ratio: string;
  top_addresses: AddressItem[];
}

export interface MerchantRisk {
  merchant_id: string;
  merchant_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  top_reasons: RuleReason[];
  snapshot: {
    sum10m_ratio: string;
    count10m_ratio: string;
    top1_ratio?: string;
  };
  actions: {
    stop_withdraw: boolean;
    freeze_key: boolean;
  };
  last_trigger_at: string;
  permissions: {
    can_fuse: boolean;
    can_unfreeze: boolean;
  };
}

export interface MerchantDetail extends MerchantRisk {
  explain_text: string;
  rules_breakdown: RuleBreakdown[];
  samples_last10: Sample[];
  address_analysis?: AddressAnalysis;
}

export const MOCK_MERCHANTS: MerchantRisk[] = [
  {
    merchant_id: 'M001',
    merchant_name: '波币商户',
    risk_score: 120,
    risk_level: 'Fuse',
    top_reasons: [
      { rule_key: 'sum_10m', rule_name: '累计金额', add_score: 50, strength_text: '3.8x' },
      { rule_key: 'count_10m', rule_name: '出款频率', add_score: 60, strength_text: '6x' }
    ],
    snapshot: {
      sum10m_ratio: '3.8x',
      count10m_ratio: '6x',
      top1_ratio: '85%'
    },
    actions: {
      stop_withdraw: true,
      freeze_key: false
    },
    last_trigger_at: '2026-01-15 10:20:05',
    permissions: { can_fuse: false, can_unfreeze: true }
  },
  {
    merchant_id: 'M002',
    merchant_name: '河南归集',
    risk_score: 85,
    risk_level: 'Limit',
    top_reasons: [
      { rule_key: 'freq_high', rule_name: '小额高频', add_score: 40, strength_text: '12笔/min' },
      { rule_key: 'addr_concentrate', rule_name: '地址集中', add_score: 30, strength_text: '70%' }
    ],
    snapshot: {
      sum10m_ratio: '1.2x',
      count10m_ratio: '4x',
      top1_ratio: '70%'
    },
    actions: {
      stop_withdraw: false,
      freeze_key: false
    },
    last_trigger_at: '2026-01-15 09:45:12',
    permissions: { can_fuse: true, can_unfreeze: false }
  },
  {
    merchant_id: 'M003',
    merchant_name: '哥伦比亚',
    risk_score: 45,
    risk_level: 'Warn',
    top_reasons: [
      { rule_key: 'single_large', rule_name: '单笔异常', add_score: 25, strength_text: '50,000 USDT' }
    ],
    snapshot: {
      sum10m_ratio: '2.1x',
      count10m_ratio: '1.5x'
    },
    actions: {
      stop_withdraw: false,
      freeze_key: false
    },
    last_trigger_at: '2026-01-15 08:12:30',
    permissions: { can_fuse: true, can_unfreeze: false }
  },
  {
    merchant_id: 'M004',
    merchant_name: 'BITDA',
    risk_score: 10,
    risk_level: 'Normal',
    top_reasons: [],
    snapshot: {
      sum10m_ratio: '0.5x',
      count10m_ratio: '0.8x'
    },
    actions: {
      stop_withdraw: false,
      freeze_key: false
    },
    last_trigger_at: '2026-01-15 07:00:00',
    permissions: { can_fuse: true, can_unfreeze: false }
  }
];

export const getMockDetail = (id: string): MerchantDetail => {
  const base = MOCK_MERCHANTS.find(m => m.merchant_id === id) || MOCK_MERCHANTS[0];
  return {
    ...base,
    explain_text: `10分钟累计出款是历史均值的 ${base.snapshot.sum10m_ratio}（+50），10分钟出款笔数是历史的 ${base.snapshot.count10m_ratio}（+60），总分 ${base.risk_score} ≥ 100，触发熔断并停出款。`,
    rules_breakdown: [
      { rule_key: 'sum_10m', rule_name: '累计金额异常', hit: true, strength_value: 3.8, score: 50, weight: 1.0, contribution: 50, details: '窗口期内累计出款 150,000 USDT' },
      { rule_key: 'count_10m', rule_name: '出款频率异常', hit: true, strength_value: 6, score: 60, weight: 1.0, contribution: 60, details: '窗口期内出款 45 笔' },
      { rule_key: 'single_large', rule_name: '单笔金额异常', hit: false, strength_value: 0, score: 0, weight: 1.0, contribution: 0 },
      { rule_key: 'freq_high', rule_name: '小额高频', hit: false, strength_value: 0, score: 0, weight: 0.8, contribution: 0 },
      { rule_key: 'mech_rhythm', rule_name: '机械节奏', hit: false, strength_value: 0, score: 0, weight: 1.2, contribution: 0 },
      { rule_key: 'addr_concentrate', rule_name: '地址集中度', hit: true, strength_value: 0.85, score: 10, weight: 1.0, contribution: 10 }
    ],
    samples_last10: Array.from({ length: 10 }).map((_, i) => ({
      id: 4470 - i,
      order_no: `718${7628 - i}`,
      withdraw_type: ['商户', '用户', '手机'][i % 3],
      chain: '波场',
      token: 'USDT',
      amount: (Math.random() * 10 + 0.5).toFixed(2),
      from_address: `T${['YuP', 'A1w', 'Edm', 'Fce', 'TKZ'][i % 5]}...${['jcmt', 'nqt4', 'TMpJ', 'egB1', 'Kq55'][i % 5]}`,
      to_address: `T${['FQj', 'Vvp', 'Q8H', 'Mnk', 'TVV'][i % 5]}...${['xcHW', 'cSyX', 'eA41', 'H9VT', 'vuTt'][i % 5]}`,
      status: '已确认',
      created_at: `2026-01-15 02:${String(57 - i).padStart(2, '0')}:${String(10 + i * 5).padStart(2, '0')}`
    })),
    address_analysis: base.snapshot.top1_ratio ? {
      top1_ratio: base.snapshot.top1_ratio,
      top2_ratio: '10%',
      top1_amount_ratio: '90%',
      top_addresses: [
        { address: 'TTne...sj9b', count: 35, amount: 120000, ratio: '85%', new_address: false },
        { address: 'TA7z...gufq', count: 5, amount: 15000, ratio: '10%', new_address: true },
        { address: '0xba...eb13', count: 2, amount: 5000, ratio: '5%', new_address: true }
      ]
    } : undefined
  };
};

// ========== 9.1 熔断事件表数据 ==========
export const MOCK_FUSE_EVENTS = [
  {
    id: 'E1001',
    merchant_id: 'M001',
    merchant_name: '波币商户',
    trigger_time: '2026-01-15 10:20:05',
    score: 125,
    risk_level: 'Fuse',
    top_reasons: [
        { rule_key: 'sum_10m', rule_name: '累计金额', add_score: 50, strength_text: '3.8x' },
        { rule_key: 'count_10m', rule_name: '出款频率', add_score: 60, strength_text: '6x' }
    ],
    snapshot: '窗口内笔数: 45, 总额: 15万, Top1占比: 85%',
    status: 'FUSED'
  },
  {
    id: 'E1002',
    merchant_id: 'M002',
    merchant_name: '河南归集',
    trigger_time: '2026-01-15 09:45:12',
    score: 85,
    risk_level: 'Limit',
    top_reasons: [
        { rule_key: 'freq_high', rule_name: '小额高频', add_score: 40, strength_text: '12笔/min' },
        { rule_key: 'addr_concentrate', rule_name: '地址集中', add_score: 30, strength_text: '70%' }
    ],
    snapshot: '窗口内笔数: 32, 总额: 8500, Top1占比: 70%',
    status: 'LIMIT'
  }
];

// ========== 9.2 解封记录数据 ==========
export const MOCK_UNFREEZE_RECORDS = [
  {
    id: 'U5001',
    merchant_id: 'M001',
    merchant_name: '波币商户',
    who: 'Admin_Zhang',
    when: '2026-01-15 14:30:00',
    why: '商户核实为促销活动，已提供白名单地址证明',
    basis: 'Policy_A (强制灰度)',
    evidence_chain: ['proof_image_01.png', 'chat_log_v2.pdf']
  }
];

// ========== 9.3 风险看板统计数据 ==========
export const MOCK_DASHBOARD_STATS = {
  trends: [
    { date: '01-09', score: 45 }, { date: '01-10', score: 52 },
    { date: '01-11', score: 48 }, { date: '01-12', score: 85 },
    { date: '01-13', score: 60 }, { date: '01-14', score: 72 },
    { date: '01-15', score: 125 }
  ],
  ranking: [
    { name: '波币商户', count: 12, rate: '0.5%' },
    { name: '河南归集', count: 8, rate: '1.2%' },
    { name: '哥伦比亚支付', count: 3, rate: '0.1%' }
  ],
  summary: {
    total_fuses: 156,
    avg_score: 64,
    false_positive_rate: '2.4%'
  }
};
