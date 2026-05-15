import React from 'react';
import { Row, Col, Card, Table, Typography, Progress, Space } from 'antd';
import {
  ShopOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAuthStore } from '../../stores/authStore';
import StatCard from '../../components/common/StatCard';
import StatusTag from '../../components/common/StatusTag';
import { mockTraderDashboard } from '../../mocks/data';
import { formatNumber, formatRate } from '../../utils';

const { Title } = Typography;

const TraderDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockTraderDashboard;

  const matchOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['撮合总数', '成功数', '成功率'] },
    grid: { left: 60, right: 60, bottom: 40, top: 40 },
    xAxis: { type: 'category', data: data.matchTrend.map(d => d.date.slice(5)) },
    yAxis: [
      { type: 'value', name: '数量' },
      { type: 'value', name: '成功率(%)', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    ],
    series: [
      { name: '撮合总数', type: 'bar', data: data.matchTrend.map(d => d.totalRequests), color: '#91caff' },
      { name: '成功数', type: 'bar', data: data.matchTrend.map(d => d.successCount), color: '#1677ff' },
      {
        name: '成功率', type: 'line', yAxisIndex: 1,
        data: data.matchTrend.map(d => d.successRate),
        color: '#52c41a', smooth: true,
      },
    ],
  };

  const poolOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 100, right: 40, bottom: 30, top: 20 },
    xAxis: { type: 'value', name: '可借数量(万)' },
    yAxis: { type: 'category', data: data.poolOverview.map(p => p.stockName).reverse() },
    series: [{
      type: 'bar',
      data: data.poolOverview.map(p => p.available / 10000).reverse(),
      label: { show: true, position: 'right', formatter: '{c}万' },
      color: '#1677ff',
    }],
  };

  const txCols = [
    { title: '编号', dataIndex: 'transactionNo', key: 'no', width: 160 },
    { title: '股票', key: 'stock', render: (_: any, r: any) => `${r.stockCode} ${r.stockName}` },
    { title: '借出方', dataIndex: 'lenderBroker', key: 'lender' },
    { title: '数量', dataIndex: 'quantity', key: 'qty', render: (v: number) => formatNumber(v) },
    { title: '费率', dataIndex: 'agreedRate', key: 'rate', render: (v: number) => formatRate(v) },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: any) => <StatusTag status={s} /> },
  ];

  const hotStocks = data.poolOverview.slice(0, 4);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          👋 {user?.name}，交易员工作台
        </Title>
        <Typography.Text type="secondary">
          券池总览 · {new Date().toLocaleDateString('zh-CN')}
        </Typography.Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="券池股票数"
            value={data.totalPoolStocks}
            suffix="只"
            prefix={<ShopOutlined style={{ color: '#1677ff' }} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总可借数量"
            value={`${(data.totalAvailableQuantity / 10000).toFixed(0)}万`}
            prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日撮合数"
            value={data.todayMatches}
            suffix="笔"
            prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
            trend="up" trendValue="+1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="待交收事项"
            value={data.pendingDeliveries}
            suffix="笔"
            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 撮合统计 */}
        <Col xs={24} lg={14}>
          <Card title="📊 撮合统计（近7日）" size="small">
            <ReactECharts option={matchOption} style={{ height: 340 }} />
          </Card>
        </Col>

        {/* 热门券源 */}
        <Col xs={24} lg={10}>
          <Card title="🔥 热门券源 TOP 4" size="small">
            {hotStocks.map((stock) => (
              <div key={stock.stockCode} style={{ marginBottom: 16 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Typography.Text strong>{stock.stockCode}</Typography.Text>
                  <Typography.Text type="secondary">{formatNumber(stock.available)} 股</Typography.Text>
                </Space>
                <Progress
                  percent={Math.round((stock.available / data.totalAvailableQuantity) * 100)}
                  strokeColor="#1677ff"
                  size="small"
                  format={(p) => `${p}%`}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 券池总览图 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="🏪 券池可借数量分布" size="small">
            <ReactECharts option={poolOption} style={{ height: 300 }} />
          </Card>
        </Col>

        {/* 最近交易 */}
        <Col xs={24} lg={12}>
          <Card title="📝 最近交易" size="small">
            <Table
              dataSource={data.recentTransactions}
              rowKey="id"
              size="small"
              columns={txCols}
              pagination={false}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TraderDashboard;
