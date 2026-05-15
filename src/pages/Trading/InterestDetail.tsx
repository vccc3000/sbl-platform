import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Typography, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockInterestData } from '../../mocks/data';
import { formatCurrency } from '../../utils';

const { Title, Text } = Typography;

const InterestDetail: React.FC = () => {
  const navigate = useNavigate();

  const totalDaily = useMemo(
    () => mockInterestData.reduce((sum, d) => sum + d.dailyInterest, 0),
    []
  );
  const totalAccumulated = useMemo(
    () => mockInterestData.reduce((sum, d) => sum + d.accumulatedInterest, 0),
    []
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/trading')}>返回</Button>
      </Space>

      <Title level={4} style={{ margin: '0 0 16px' }}>💰 券息明细</Title>

      {/* 汇总卡片 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <div>
            <Text type="secondary">今日券息合计：</Text>
            <Text strong style={{ fontSize: 24, color: '#1677ff' }}>{formatCurrency(totalDaily)}</Text>
          </div>
          <div>
            <Text type="secondary">累计券息合计：</Text>
            <Text strong style={{ fontSize: 24, color: '#52c41a' }}>{formatCurrency(totalAccumulated)}</Text>
          </div>
        </Space>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          计算公式：每日券息 = 借出股数 × 当日收盘价 × 年化费率 / 365
        </Text>
      </Card>

      <Card size="small">
        <Table
          dataSource={mockInterestData}
          rowKey="stockCode"
          size="middle"
          pagination={false}
          columns={[
            { title: '股票代码', dataIndex: 'stockCode', key: 'code', width: 110 },
            { title: '股票名称', dataIndex: 'stockName', key: 'name', width: 120 },
            { title: '每日券息', dataIndex: 'dailyInterest', key: 'daily', render: (v: number) => formatCurrency(v), align: 'right' },
            { title: '累计券息', dataIndex: 'accumulatedInterest', key: 'acc', render: (v: number) => <Text strong>{formatCurrency(v)}</Text>, align: 'right' },
            { title: '计息期间', dataIndex: 'period', key: 'period' },
          ]}
        />
      </Card>
    </div>
  );
};

export default InterestDetail;
