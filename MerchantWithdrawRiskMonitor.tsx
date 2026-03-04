import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Tag,
  Badge,
  Button,
  Input,
  Select,
  Space,
  Card,
  Row,
  Col,
  Switch,
  Dropdown,
  Drawer,
  Modal,
  Form,
  Checkbox,
  Radio,
  Tooltip,
  message,
  Typography,
  Collapse,
  Statistic,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  UnlockOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import {
  MOCK_MERCHANTS,
  getMockDetail,
  RiskLevel,
  MerchantRisk,
  MerchantDetail,
  RuleReason,
} from './MerchantRiskMock';

const { Option } = Select;
const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

// --- Components ---

/**
 * Risk Level Badge Component
 */
const RiskLevelBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config = {
    Normal: { color: 'blue', text: 'Normal' },
    Warn: { color: 'warning', text: 'Warn' },
    Limit: { color: 'orange', text: 'Limit' },
    Fuse: { color: 'error', text: 'Fuse' },
  };
  const { color, text } = config[level];
  return <Badge status={color as any} text={text} />;
};

/**
 * Rule Reason Tag Component
 */
const RuleReasonTag: React.FC<{ reason: RuleReason }> = ({ reason }) => {
  return (
    <Tooltip title={`分值: +${reason.add_score} | 强度: ${reason.strength_text}`}>
      <Tag color="volcano" style={{ marginBottom: 4 }}>
        {reason.rule_name} +{reason.add_score}
      </Tag>
    </Tooltip>
  );
};

// --- Main Page Implementation ---

const MerchantWithdrawRiskMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MerchantRisk[]>(MOCK_MERCHANTS);
  const [filterOnlyAction, setFilterOnlyAction] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState('Off');
  
  // Drawer & Modal States
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);
  const [fuseModalVisible, setFuseModalVisible] = useState(false);
  const [unfreezeModalVisible, setUnfreezeModalVisible] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [fuseForm] = Form.useForm();
  const [unfreezeForm] = Form.useForm();

  // Handle Search
  const handleSearch = () => {
    setLoading(true);
    // Mocking API delay
    setTimeout(() => {
      let filtered = [...MOCK_MERCHANTS];
      if (filterOnlyAction) {
        filtered = filtered.filter(m => m.risk_level === 'Limit' || m.risk_level === 'Fuse');
      }
      setData(filtered);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    handleSearch();
  };

  // Drawer Actions
  const showDetail = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedMerchant(getMockDetail(id));
      setDetailVisible(true);
      setLoading(false);
    }, 300);
  };

  // Fuse Action
  const handleFuseClick = (id: string) => {
    setTargetId(id);
    fuseForm.resetFields();
    setFuseModalVisible(true);
  };

  const submitFuse = async () => {
    const values = await fuseForm.validateFields();
    setLoading(true);
    console.log('Submitting Fuse:', targetId, values);
    // Mock API
    setTimeout(() => {
      message.success(`商户 ${targetId} 已成功熔断`);
      setFuseModalVisible(false);
      handleSearch();
      setLoading(false);
    }, 800);
  };

  // Unfreeze Action
  const handleUnfreezeClick = (id: string) => {
    setTargetId(id);
    unfreezeForm.resetFields();
    setUnfreezeModalVisible(true);
  };

  const submitUnfreeze = async () => {
    const values = await unfreezeForm.validateFields();
    setLoading(true);
    console.log('Submitting Unfreeze:', targetId, values);
    // Mock API
    setTimeout(() => {
      message.success(`解封申请已提交 (${targetId})`);
      setUnfreezeModalVisible(false);
      handleSearch();
      setLoading(false);
    }, 800);
  };

  // Table Columns
  const columns = [
    {
      title: '商户',
      key: 'merchant',
      render: (_: any, record: MerchantRisk) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.merchant_name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.merchant_id} <CopyOutlined style={{ cursor: 'pointer' }} onClick={() => message.info('ID已复制')} />
          </Text>
        </Space>
      ),
    },
    {
      title: '当前风险分',
      key: 'risk_score',
      sorter: (a: MerchantRisk, b: MerchantRisk) => a.risk_score - b.risk_score,
      render: (_: any, record: MerchantRisk) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '16px', color: record.risk_score >= 100 ? '#ff4d4f' : record.risk_score >= 80 ? '#faad14' : 'inherit' }}>
            {record.risk_score}
          </Text>
          <RiskLevelBadge level={record.risk_level} />
        </Space>
      ),
    },
    {
      title: '触发原因Top2',
      key: 'reasons',
      width: 200,
      render: (_: any, record: MerchantRisk) => (
        <div style={{ maxWidth: '200px' }}>
          {record.top_reasons.map(r => <RuleReasonTag key={r.rule_key} reason={r} />)}
        </div>
      ),
    },
    {
      title: '关键指标快照',
      key: 'snapshot',
      render: (_: any, record: MerchantRisk) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '12px' }}>10m金额: <Text strong>{record.snapshot.sum10m_ratio}</Text></Text>
          <Text style={{ fontSize: '12px' }}>10m笔数: <Text strong>{record.snapshot.count10m_ratio}</Text></Text>
        </Space>
      ),
    },
    {
      title: '地址集中度',
      dataIndex: ['snapshot', 'top1_ratio'],
      key: 'top1_ratio',
      render: (val: string) => val || '-',
    },
    {
      title: '最后触发时间',
      dataIndex: 'last_trigger_at',
      key: 'last_trigger_at',
      render: (val: string) => <Text type="secondary">{val}</Text>,
    },
    {
      title: '动作状态',
      key: 'actions',
      render: (_: any, record: MerchantRisk) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.actions.stop_withdraw ? 'error' : 'success'}>
            停出款: {record.actions.stop_withdraw ? 'ON' : 'OFF'}
          </Tag>
          {record.actions.freeze_key && <Tag color="error">Key冻结: ON</Tag>}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right' as const,
      render: (_: any, record: MerchantRisk) => (
        <Space split={<Divider type="vertical" />}>
          <Button type="link" size="small" onClick={() => showDetail(record.merchant_id)}>详情</Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            disabled={record.risk_level === 'Fuse' || !record.permissions.can_fuse}
            onClick={() => handleFuseClick(record.merchant_id)}
          >
            熔断
          </Button>
          <Button 
            type="link" 
            size="small" 
            disabled={record.risk_level !== 'Fuse' || !record.permissions.can_unfreeze}
            onClick={() => handleUnfreezeClick(record.merchant_id)}
          >
            解封
          </Button>
        </Space>
      ),
    },
  ];

  // Sorting logic for table data
  const sortedData = useMemo(() => {
    const levelOrder = { Fuse: 4, Limit: 3, Warn: 2, Normal: 1 };
    return [...data].sort((a, b) => {
      if (levelOrder[b.risk_level] !== levelOrder[a.risk_level]) {
        return levelOrder[b.risk_level] - levelOrder[a.risk_level];
      }
      return b.risk_score - a.risk_score;
    });
  }, [data]);

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* A. Filter Bar */}
      <Card bordered={false} style={{ marginBottom: '16px' }} bodyStyle={{ padding: '16px' }}>
        <Form form={form} layout="inline">
          <Form.Item name="merchant" label="商户选择">
            <Select showSearch placeholder="ID / 商户名" style={{ width: 160 }} allowClear>
              <Option value="M001">波币商户 (M001)</Option>
              <Option value="M002">河南归集 (M002)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="risk_level" label="风险等级">
            <Select placeholder="All" style={{ width: 100 }} allowClear>
              <Option value="All">All</Option>
              <Option value="Warn">Warn</Option>
              <Option value="Limit">Limit</Option>
              <Option value="Fuse">Fuse</Option>
            </Select>
          </Form.Item>
          <Form.Item label="风险分范围">
            <Space>
              <Form.Item name="min_score" noStyle><Input style={{ width: 60 }} placeholder="min" /></Form.Item>
              <span>-</span>
              <Form.Item name="max_score" noStyle><Input style={{ width: 60 }} placeholder="max" /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="time_range" label="时间">
            <Select defaultValue="24h" style={{ width: 80 }}>
              <Option value="1h">1h</Option>
              <Option value="24h">24h</Option>
              <Option value="7d">7d</Option>
            </Select>
          </Form.Item>
          <Form.Item name="rules" label="命中规则">
            <Select mode="multiple" placeholder="选择规则" style={{ minWidth: 150 }} maxTagCount="responsive">
              <Option value="r1">单笔金额异常</Option>
              <Option value="r2">累计金额异常</Option>
              <Option value="r3">出款频率异常</Option>
              <Option value="r4">地址集中度</Option>
            </Select>
          </Form.Item>
          
          <div style={{ flex: 1 }} />
          
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '12px 0' }} />
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Space>
                <Text style={{ fontSize: '14px' }}>只看需要处理 (Limit/Fuse)</Text>
                <Switch checked={filterOnlyAction} onChange={setFilterOnlyAction} size="small" />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">自动刷新:</Text>
              <Select value={autoRefresh} onChange={setAutoRefresh} size="small" style={{ width: 80 }}>
                <Option value="Off">Off</Option>
                <Option value="5s">5s</Option>
                <Option value="10s">10s</Option>
                <Option value="30s">30s</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* B. Middle Table */}
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={sortedData}
          rowKey="merchant_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          rowClassName={(record) => {
            if (record.risk_level === 'Fuse') return 'row-fuse';
            if (record.risk_level === 'Limit') return 'row-limit';
            if (record.risk_level === 'Warn') return 'row-warn';
            return '';
          }}
        />
      </Card>

      {/* C. Right Drawer (Detail) */}
      <Drawer
        title="风险商户详情"
        placement="right"
        width="45%"
        onClose={() => setDetailVisible(false)}
        visible={detailVisible}
        extra={
          <Space>
            {selectedMerchant?.risk_level !== 'Fuse' ? (
              <Button type="primary" danger icon={<ThunderboltOutlined />} onClick={() => handleFuseClick(selectedMerchant!.merchant_id)}>立即熔断</Button>
            ) : (
              <Button icon={<UnlockOutlined />} onClick={() => handleUnfreezeClick(selectedMerchant!.merchant_id)}>申请解封</Button>
            )}
          </Space>
        }
      >
        {selectedMerchant && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* C1. Status Card */}
            <Card size="small" style={{ background: '#fafafa' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="商户名/ID" value={selectedMerchant.merchant_name} suffix={<Text type="secondary" style={{ fontSize: '14px' }}>({selectedMerchant.merchant_id})</Text>} valueStyle={{ fontSize: '18px' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="当前风险分" value={selectedMerchant.risk_score} valueStyle={{ color: '#cf1322' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="风险等级" value={selectedMerchant.risk_level} formatter={(val) => <RiskLevelBadge level={val as RiskLevel} />} />
                </Col>
                <Col span={8}>
                  <Text type="secondary">停出款状态: </Text>
                  <Tag color={selectedMerchant.actions.stop_withdraw ? 'error' : 'success'}>{selectedMerchant.actions.stop_withdraw ? '已停止' : '正常'}</Tag>
                </Col>
                <Col span={16}>
                  <Text type="secondary">最近触发: </Text>
                  <Text>{selectedMerchant.last_trigger_at}</Text>
                </Col>
              </Row>
            </Card>

            {/* C2. "Human-speak" Explain */}
            <div>
              <Title level={5}><InfoCircleOutlined /> 风险解释</Title>
              <div style={{ padding: '12px', background: '#fff7e6', border: '1px solid #ffe7ba', borderRadius: '4px' }}>
                <Paragraph style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedMerchant.explain_text}
                </Paragraph>
              </div>
            </div>

            {/* C3. Rules Breakdown */}
            <div>
              <Title level={5}><HistoryOutlined /> 规则命中明细</Title>
              <Collapse ghost accordion expandIconPosition="right">
                {selectedMerchant.rules_breakdown.map((rule) => (
                  <Panel 
                    key={rule.rule_key}
                    header={
                      <Row style={{ width: '100%' }}>
                        <Col span={8}>
                          <Badge status={rule.hit ? 'error' : 'default'} text={rule.rule_name} />
                        </Col>
                        <Col span={6}>
                          <Text type="secondary">强度: </Text>
                          <Text strong={rule.hit}>{rule.strength_value > 0 ? `${rule.strength_value}x` : '-'}</Text>
                        </Col>
                        <Col span={5}>
                          <Text type="secondary">子分: </Text>
                          <Text strong={rule.hit} type={rule.hit ? 'danger' : 'secondary'}>{rule.score}</Text>
                        </Col>
                        <Col span={5}>
                          <Text type="secondary">贡献: </Text>
                          <Text strong={rule.hit} type={rule.hit ? 'danger' : 'secondary'}>+{rule.contribution}</Text>
                        </Col>
                      </Row>
                    }
                  >
                    <div style={{ padding: '8px 24px' }}>
                      <Paragraph type="secondary">{rule.details || '未命中规则，强度未达阈值。'}</Paragraph>
                      {rule.hit && (
                        <>
                          <Text strong>最近 10 笔样本:</Text>
                          <Table 
                            size="small" 
                            pagination={false} 
                            dataSource={selectedMerchant.samples_last10} 
                            columns={[
                              { title: '时间', dataIndex: 'time', key: 'time' },
                              { title: '金额', dataIndex: 'amount', key: 'amount' },
                              { title: '地址', dataIndex: 'to_address', key: 'addr' },
                              { title: '来源', dataIndex: 'source', key: 'src' },
                            ]}
                          />
                        </>
                      )}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>

            {/* C4. Address Analysis */}
            {selectedMerchant.address_analysis && (
              <div>
                <Title level={5}><ThunderboltOutlined /> 地址集中度分析</Title>
                <Row gutter={16} style={{ marginBottom: '12px' }}>
                  <Col span={8}><Statistic title="Top 1 占比" value={selectedMerchant.address_analysis.top1_ratio} valueStyle={{ fontSize: '16px' }} /></Col>
                  <Col span={8}><Statistic title="Top 2 占比" value={selectedMerchant.address_analysis.top2_ratio} valueStyle={{ fontSize: '16px' }} /></Col>
                  <Col span={8}><Statistic title="Top 1 金额占比" value={selectedMerchant.address_analysis.top1_amount_ratio} valueStyle={{ fontSize: '16px' }} /></Col>
                </Row>
                <Table 
                  size="small" 
                  pagination={false} 
                  dataSource={selectedMerchant.address_analysis.top_addresses}
                  columns={[
                    { title: '地址', dataIndex: 'address', key: 'address', render: (val, r) => <Space>{val} {r.new_address && <Tag color="blue" size="small">New</Tag>}</Space> },
                    { title: '笔数', dataIndex: 'count', key: 'count' },
                    { title: '金额', dataIndex: 'amount', key: 'amount' },
                    { title: '占比', dataIndex: 'ratio', key: 'ratio' },
                  ]}
                />
              </div>
            )}
          </Space>
        )}
      </Drawer>

      {/* 1. Fuse Modal */}
      <Modal
        title="确认熔断该商户出款？"
        visible={fuseModalVisible}
        onOk={submitFuse}
        onCancel={() => setFuseModalVisible(false)}
        confirmLoading={loading}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>正在对商户 <Text strong>{targetId}</Text> 执行熔断操作。</Text>
        </div>
        <Form form={fuseForm} layout="vertical">
          <Form.Item name="freeze_key" valuePropName="checked">
            <Checkbox>同时冻结 API Key</Checkbox>
          </Form.Item>
          <Form.Item name="remark" label="熔断备注" rules={[{ required: true, message: '请填写熔断原因' }]}>
            <Input.TextArea rows={3} placeholder="请说明触发熔断的具体人工核实原因..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 2. Unfreeze Modal */}
      <Modal
        title="商户解封申请"
        visible={unfreezeModalVisible}
        onOk={submitUnfreeze}
        onCancel={() => setUnfreezeModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={unfreezeForm} layout="vertical" initialValues={{ strategy: 'limit' }}>
          <Form.Item name="remark" label="解封原因/核实结果" rules={[{ required: true, message: '请填写核实结果' }]}>
            <Input.TextArea rows={3} placeholder="已核实业务真实性，用户误操作..." />
          </Form.Item>
          <Form.Item name="rotated_key" valuePropName="checked">
            <Checkbox>商户已完成 API Key 轮换 (推荐)</Checkbox>
          </Form.Item>
          <Form.Item name="strategy" label="解封策略" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="normal">直接恢复 Normal</Radio>
              <Radio value="limit">恢复为 Limit (30分钟后自动 Normal)</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .row-fuse { background-color: #fff1f0 !important; }
        .row-limit { background-color: #fff7e6 !important; }
        .row-warn { background-color: #feffe6 !important; }
        .ant-table-row:hover > td { background: rgba(0, 0, 0, 0.02) !important; }
      `}</style>
    </div>
  );
};

export default MerchantWithdrawRiskMonitor;
