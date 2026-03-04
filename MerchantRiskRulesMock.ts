/**
 * Merchant Risk Scoring & Circuit Breaker System - Mock Data
 * Based on: 商户级风控打分与熔断系统_整理版.md
 */

export type RiskStatus = 'NORMAL' | 'WARN' | 'FUSE';

export interface RuleDetail {
  rule_id: string;
  name: string;
  weight: number;
  hit: boolean;
  raw_score: number; // score before weight
  contribution: number; // raw_score * weight
  description: string;
  threshold_info: string;
}

export interface MerchantRiskData {
  id: string;
  name: string;
  status: RiskStatus;
  score: number;
  last_update: string;
  rules: RuleDetail[];
  withdraw_status: 'ON' | 'OFF';
  snapshot: {
    p99_30d: number;
    p50_30d: number;
    baseline_amount: number;
    baseline_count: number;
    current_10m_amount: number;
    current_1h_amount: number;
    current_1m_count: number;
    current_10m_count: number;
    current_1h_count: number;
    small_amount_days: number; // out of 7
    small_amount_ratio: string;
    rhythm_stddev: string;
    top1_ratio: string;
    top2_ratio: string;
  };
}

export const RULE_CONFIGS = [
  { id: 'R1', name: '单笔金额异常', weight: 1.0 },
  { id: 'R2', name: '累计金额异常', weight: 0.9 },
  { id: 'R3', name: '出款频率异常', weight: 0.8 },
  { id: 'R4', name: '小额高频', weight: 0.8 },
  { id: 'R5', name: '机械节奏', weight: 0.6 },
  { id: 'R6', name: '地址集中度', weight: 0.7 },
];

export const MOCK_MERCHANTS: MerchantRiskData[] = [
  {
    id: 'M8801',
    name: '全球付支付 (GlobalPay)',
    status: 'FUSE',
    score: 112,
    last_update: '2026-01-15 14:20:00',
    withdraw_status: 'OFF',
    snapshot: {
      p99_30d: 5000,
      p50_30d: 200,
      baseline_amount: 10000,
      baseline_count: 50,
      current_10m_amount: 25000,
      current_1h_amount: 45000,
      current_1m_count: 8,
      current_10m_count: 22,
      current_1h_count: 55,
      small_amount_days: 5,
      small_amount_ratio: '82%',
      rhythm_stddev: '1.2s',
      top1_ratio: '75%',
      top2_ratio: '88%',
    },
    rules: [
      { rule_id: 'R1', name: '单笔金额异常', weight: 1.0, hit: true, raw_score: 60, contribution: 60, threshold_info: 'amount > P99(5000)', description: '触发单笔大额出款 8500 USDT' },
      { rule_id: 'R2', name: '累计金额异常', weight: 0.9, hit: true, raw_score: 40, contribution: 36, threshold_info: '10m sum ≥ 2000', description: '10分钟累计出款 25000' },
      { rule_id: 'R3', name: '出款频率异常', weight: 0.8, hit: true, raw_score: 20, contribution: 16, threshold_info: '1m ≥ 5', description: '1分钟内出款 8 笔' },
      { rule_id: 'R4', name: '小额高频', weight: 0.8, hit: false, raw_score: 0, contribution: 0, threshold_info: 'ratio ≥ 70%', description: '未达到连续性触发条件' },
      { rule_id: 'R5', name: '机械节奏', weight: 0.6, hit: false, raw_score: 0, contribution: 0, threshold_info: 'stddev ≤ 3s', description: '节奏尚属正常范围' },
      { rule_id: 'R6', name: '地址集中度', weight: 0.7, hit: false, raw_score: 0, contribution: 0, threshold_info: 'top1 ≥ 60%', description: '地址分布正常' },
    ]
  },
  {
    id: 'M8802',
    name: '亚洲汇通 (AsiaExchange)',
    status: 'WARN',
    score: 65,
    last_update: '2026-01-15 14:15:00',
    withdraw_status: 'ON',
    snapshot: {
      p99_30d: 3000,
      p50_30d: 150,
      baseline_amount: 5000,
      baseline_count: 30,
      current_10m_amount: 1200,
      current_1h_amount: 3500,
      current_1m_count: 2,
      current_10m_count: 12,
      current_1h_count: 25,
      small_amount_days: 4,
      small_amount_ratio: '85%',
      rhythm_stddev: '1.8s',
      top1_ratio: '68%',
      top2_ratio: '75%',
    },
    rules: [
      { rule_id: 'R1', name: '单笔金额异常', weight: 1.0, hit: false, raw_score: 0, contribution: 0, threshold_info: 'amount > P99', description: '单笔金额正常' },
      { rule_id: 'R2', name: '累计金额异常', weight: 0.9, hit: false, raw_score: 0, contribution: 0, threshold_info: '10m sum ≥ 2000', description: '累计金额正常' },
      { rule_id: 'R3', name: '出款频率异常', weight: 0.8, hit: false, raw_score: 0, contribution: 0, threshold_info: '1m ≥ 5', description: '频率正常' },
      { rule_id: 'R4', name: '小额高频', weight: 0.8, hit: true, raw_score: 50, contribution: 40, threshold_info: 'ratio ≥ 70%', description: '小额占比 85%，且 7 天内有 4 天异常' },
      { rule_id: 'R5', name: '机械节奏', weight: 0.6, hit: false, raw_score: 0, contribution: 0, threshold_info: 'stddev ≤ 3s', description: '节奏正常' },
      { rule_id: 'R6', name: '地址集中度', weight: 0.7, hit: true, raw_score: 35, contribution: 24.5, threshold_info: 'top1 ≥ 60%', description: 'Top1 地址占比 68%' },
    ]
  },
  {
    id: 'M8803',
    name: '鼎盛科技 (PeakTech)',
    status: 'NORMAL',
    score: 15,
    last_update: '2026-01-15 14:10:00',
    withdraw_status: 'ON',
    snapshot: {
      p99_30d: 8000,
      p50_30d: 500,
      baseline_amount: 15000,
      baseline_count: 100,
      current_10m_amount: 500,
      current_1h_amount: 1500,
      current_1m_count: 1,
      current_10m_count: 3,
      current_1h_count: 8,
      small_amount_days: 0,
      small_amount_ratio: '15%',
      rhythm_stddev: '15.5s',
      top1_ratio: '12%',
      top2_ratio: '20%',
    },
    rules: [
      { rule_id: 'R1', name: '单笔金额异常', weight: 1.0, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
      { rule_id: 'R2', name: '累计金额异常', weight: 0.9, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
      { rule_id: 'R3', name: '出款频率异常', weight: 0.8, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
      { rule_id: 'R4', name: '小额高频', weight: 0.8, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
      { rule_id: 'R5', name: '机械节奏', weight: 0.6, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
      { rule_id: 'R6', name: '地址集中度', weight: 0.7, hit: false, raw_score: 0, contribution: 0, threshold_info: '-', description: '正常' },
    ]
  }
];
