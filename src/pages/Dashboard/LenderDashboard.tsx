import React from 'react';
import { Row, Col, Card, Table, Tag, Typography, Empty } from 'antd';
import {
  InboxOutlined,
  DollarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAuthStore } from '../../stores/authStore';
import StatCard from '../../components/common/StatCard';
import StatusTag from '../../components/common/StatusTag';
import { mockLenderDashboard, mockAvailableSecurities, mockTransactions } from '../../mocks/data';
import { formatCurrency, formatNumber, formatRate } from '../../utils';

const { Title } = Typography;

const LenderDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockLenderDashboard;

  const utilizationOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['可借数量', '已借数量', '利用率'] },
    grid: { left: 60, right: 60, bottom: 40, top: 40 },
    xAxis: { type: 'category', data: data.utilizationTrend.map(d => d.date.slice(5)) },
    yAxis: [
      { type: 'value', name: '股数', axisLabel: { formatter: (v: number) => `${(v / 10000).toFixed(0)}万` } },
      { type: 'value', name: '利用率(%)', axisLabel: { formatter: '{value}%' } },
    ],
    series: [
      { name: '可借数量', type: 'bar', data: data.utilizationTrend.map(d => d.totalAvailable), color: '#91caff' },
      { name: '已借数量', type: 'bar', data: data.utilizationTrend.map(d => d.totalLent), color: '#1677ff' },
      {
        name: '利用率', type: 'line', yAxisIndex: 1,
        data: data.utilizationTrend.map(d => d.utilizationRate),
        color: '#52c41a', smooth: true,
      },
    ],
  };

  // 待处理交易
  const pendingCols = [
    { title: '交易编号', dataIndex: 'transactionNo', key: 'transactionNo', width: 180 },
    { title: '股票', key: 'stock', render: (_: any, r: any) => `${r.stockCode} ${r.stockName}` },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', render: (v: number) => formatNumber(v) },
    { title: '费率', dataIndex: 'agreedRate', key: 'rate', render: (v: number) => formatRate(v) },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: any) => <StatusTag status={s} /> },
  ];

  const pendingTransactions = mockTransactions.filter(t =>
    ['matching', 'pending', 'confirmed'].includes(t.status)
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          👋 欢迎回来，{user?.name}
        </Title>
        <Typography.Text type="secondary">
          {user?.brokerCode} · 借出方视角 · {new Date().toLocaleDateString('zh-CN')}
        </Typography.Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="可借券源数"
            value={data.totalAvailableSecurities}
            suffix="只"
            prefix={<InboxOutlined style={{ color: '#1677ff' }} />}
            trend="up" trendValue="+2"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="已发布券源"
            value={data.totalPublishedSecurities}
            suffix="只"
            prefix={<InboxOutlined style={{ color: '#52c41a' }} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日券息收入"
            value={formatCurrency(data.todayInterest)}
            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            trend="up" trendValue="+12.5%"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="活跃交易"
            value={data.activeTransactions}
            suffix={`/ ${data.pendingConfirmations} 待确认`}
            prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 券源利用率趋势图 */}
        <Col xs={24} lg={14}>
          <Card title="📈 券源利用率趋势（近7日）" size="small">
            {data.utilizationTrend.length > 0 ? (
              <ReactECharts option={utilizationOption} style={{ height: 360 }} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>

        {/* 可借券源概览 */}
        <Col xs={24} lg={10}>
          <Card title="📦 我的可借券源" size="small">
            <Table
              dataSource={mockAvailableSecurities.filter(s => s.brokerCode === user?.brokerCode)}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: 400 }}
              columns={[
                { title: '股票', key: 'stock', render: (_: any, r) => `${r.stockCode} ${r.stockName}`, width: 140 },
                { title: '可借', dataIndex: 'remainingQuantity', key: 'qty', render: (v: number) => formatNumber(v), width: 80 },
                { title: '费率', dataIndex: 'suggestedRate', key: 'rate', render: (v: number) => formatRate(v), width: 80 },
                { title: '状态', dataIndex: 'published', key: 'pub', render: (v: boolean) => v ? <Tag color="green">已发布</Tag> : <Tag>待发布</Tag>, width: 80 },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 待处理事项 */}
      <Card
        title={<><ClockCircleOutlined /> 待处理事项</>}
        size="small"
        style={{ marginTop: 16 }}
      >
        {pendingTransactions.length > 0 ? (
          <Table
            dataSource={pendingTransactions}
            rowKey="id"
            size="small"
            columns={pendingCols}
            pagination={false}
            scroll={{ x: 600 }}
          />
        ) : (
          <Empty description="暂无待处理事项" />
        )}
      </Card>
    </div>
  );
};

export default LenderDashboard;
