import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockUtilizationData } from '../../mocks/data';
import { formatNumber } from '../../utils';

const { Title, Text } = Typography;

const UtilizationReport: React.FC = () => {
  const data = mockUtilizationData;

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['可借总数', '已借数量', '利用率'] },
    grid: { left: 70, right: 60, bottom: 40, top: 40 },
    xAxis: { type: 'category', data: data.map(d => d.date.slice(5)) },
    yAxis: [
      {
        type: 'value', name: '数量(万股)',
        axisLabel: { formatter: (v: number) => `${(v / 10000).toFixed(0)}` },
      },
      {
        type: 'value', name: '利用率(%)',
        axisLabel: { formatter: '{value}%' },
        min: 0, max: 20,
      },
    ],
    series: [
      {
        name: '可借总数', type: 'bar', stack: 'total',
        data: data.map(d => d.totalAvailable),
        itemStyle: { color: '#e2e8f0' },
        barWidth: 24,
      },
      {
        name: '已借数量', type: 'bar', stack: 'total',
        data: data.map(d => d.totalLent),
        itemStyle: { color: '#0f766e' },
        barWidth: 24,
        label: { show: true, position: 'inside', formatter: (p: any) => p.value > 100000 ? `${(p.value/10000).toFixed(1)}万` : '' },
      },
      {
        name: '利用率', type: 'line', yAxisIndex: 1,
        data: data.map(d => d.utilizationRate),
        itemStyle: { color: '#059669' },
        smooth: true,
        label: { show: true, formatter: '{c}%' },
      },
    ],
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>券源利用率报告</Title>

      {/* 汇总卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">总可借数量</Text>
            <Title level={3} style={{ margin: '8px 0' }}>
              {formatNumber(data[data.length - 1].totalAvailable)} 股
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">当前已借出</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#0f766e' }}>
              {formatNumber(data[data.length - 1].totalLent)} 股
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">当前利用率</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#059669' }}>
              {data[data.length - 1].utilizationRate}%
            </Title>
          </Card>
        </Col>
      </Row>

      <Card title="利用率趋势（近7日）" size="small">
        <ReactECharts option={trendOption} style={{ height: 400 }} />
      </Card>
    </div>
  );
};

export default UtilizationReport;
