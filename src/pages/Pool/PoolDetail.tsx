import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Typography, Tag, Descriptions, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockPoolItems } from '../../mocks/data';
import { formatNumber, formatRate } from '../../utils';

const { Title, Text } = Typography;

const PoolDetail: React.FC = () => {
  const { stockCode } = useParams<{ stockCode: string }>();
  const navigate = useNavigate();

  const poolItem = mockPoolItems.find(p => p.stockCode === stockCode);

  if (!poolItem) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Title level={4}>券源不存在</Title>
        <Button onClick={() => navigate('/pool')}>返回券池广场</Button>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pool')}>
          返回券池广场
        </Button>
      </Space>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions title={`${poolItem.stockCode} ${poolItem.stockName}`} column={{ xs: 1, sm: 2, md: 3 }} size="small">
          <Descriptions.Item label="总可借数量">
            <Text strong>{formatNumber(poolItem.totalAvailable)} 股</Text>
          </Descriptions.Item>
          <Descriptions.Item label="借出方数量">{poolItem.lenderCount} 家</Descriptions.Item>
          <Descriptions.Item label="费率区间">
            {poolItem.rateRange[0].toFixed(1)}% ~ {poolItem.rateRange[1].toFixed(1)}% p.a.
          </Descriptions.Item>
          <Descriptions.Item label="股票类型">
            <Tag color="blue">蓝筹股</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="热度">
            {poolItem.hot ? <Tag color="red">热门</Tag> : <Tag>普通</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">{poolItem.lastUpdated}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="📋 各借出方供给明细" size="small">
        <Table
          dataSource={poolItem.lenders}
          rowKey="brokerCode"
          size="middle"
          pagination={false}
          columns={[
            { title: '借出方编码', dataIndex: 'brokerCode', key: 'code', width: 120 },
            { title: '可借数量', dataIndex: 'availableQuantity', key: 'qty', render: (v: number) => formatNumber(v), align: 'right', width: 120 },
            { title: '建议费率', dataIndex: 'suggestedRate', key: 'rate', render: (v: number) => formatRate(v), width: 100 },
            { title: '最短期限', dataIndex: 'minTerm', key: 'term', render: (v: number) => `${v}天`, width: 90 },
            { title: '备注', dataIndex: 'remark', key: 'remark', render: (v: string) => v || '-' },
          ]}
        />
      </Card>
    </div>
  );
};

export default PoolDetail;
