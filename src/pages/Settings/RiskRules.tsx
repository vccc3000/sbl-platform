import React, { useState } from 'react';
import { Card, Table, Switch, Typography, Space, message } from 'antd';
import { mockRiskRules } from '../../mocks/data';
import type { RiskRule } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const RiskRules: React.FC = () => {
  const [rules, setRules] = useState<RiskRule[]>(mockRiskRules);

  const handleToggle = (id: string, checked: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: checked } : r));
    const rule = rules.find(r => r.id === id);
    message.success(`${rule?.name} 已${checked ? '启用' : '停用'}`);
  };

  const columns: ColumnsType<RiskRule> = [
    { title: '规则名称', dataIndex: 'name', key: 'name', width: 160 },
    { title: '风控维度', dataIndex: 'dimension', key: 'dimension', width: 140 },
    { title: '说明', dataIndex: 'description', key: 'desc', ellipsis: true },
    { title: '阈值/值', key: 'value', width: 160, render: (_: any, r: RiskRule) => (
      <Space>
        <Text strong>{r.value}</Text>
        {r.unit && <Text type="secondary">{r.unit}</Text>}
      </Space>
    )},
    { title: '状态', dataIndex: 'enabled', key: 'status', width: 80, render: (v: boolean, r: RiskRule) => (
      <Switch checked={v} onChange={(checked) => handleToggle(r.id, checked)} size="small" />
    )},
    { title: '最后修改', dataIndex: 'lastModified', key: 'modified', width: 110 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>⚙️ 风控规则配置</Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary">
          风控引擎是SBL平台的核心计算模块。以下规则决定每只股票的可借出数量，修改规则将触发全量重新计算。
        </Text>
      </Card>

      <Card size="small">
        <Table
          dataSource={rules}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default RiskRules;
