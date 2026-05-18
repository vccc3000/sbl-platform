import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockInterestData } from '../../mocks/data';
import { formatCurrency } from '../../utils';

const { Title, Text } = Typography;

const InterestReport: React.FC = () => {
  const data = mockInterestData;

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: HK$ {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['40%', '50%'],
      data: data.map(d => ({
        name: `${d.stockCode} ${d.stockName}`,
        value: parseFloat(d.accumulatedInterest.toFixed(2)),
      })),
      label: { formatter: '{b}\n{d}%' },
      emphasis: {
        label: { fontSize: 16, fontWeight: 'bold' },
      },
    }],
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 100, right: 40, bottom: 40, top: 20 },
    xAxis: { type: 'value', name: 'HK$', axisLabel: { formatter: (v: number) => `HK$ ${v.toFixed(0)}` } },
    yAxis: {
      type: 'category',
      data: data.map(d => d.stockCode).reverse(),
    },
    series: [
      {
        name: '每日券息', type: 'bar',
        data: data.map(d => parseFloat(d.dailyInterest.toFixed(2))).reverse(),
        itemStyle: { color: '#14b8a6' },
        label: { show: true, position: 'right', formatter: (p: any) => `HK$ ${p.value.toFixed(2)}` },
      },
      {
        name: '累计券息', type: 'bar',
        data: data.map(d => parseFloat(d.accumulatedInterest.toFixed(2))).reverse(),
        itemStyle: { color: '#0f766e' },
        label: { show: true, position: 'right', formatter: (p: any) => `HK$ ${p.value.toFixed(2)}` },
      },
    ],
  };

  const totalDaily = data.reduce((s, d) => s + d.dailyInterest, 0);
  const totalAcc = data.reduce((s, d) => s + d.accumulatedInterest, 0);

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>券息收入报告</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Text type="secondary">今日券息合计</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#0f766e' }}>
              {formatCurrency(totalDaily)}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Text type="secondary">累计券息合计</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#059669' }}>
              {formatCurrency(totalAcc)}
            </Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="累计券息分布" size="small">
            <ReactECharts option={pieOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="券息对比" size="small">
            <ReactECharts option={barOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InterestReport;
