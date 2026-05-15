import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockMatchStats } from '../../mocks/data';

const { Title, Text } = Typography;

const MatchReport: React.FC = () => {
  const data = mockMatchStats;

  const totalRequests = data.reduce((s, d) => s + d.totalRequests, 0);
  const totalSuccess = data.reduce((s, d) => s + d.successCount, 0);
  const avgSuccessRate = totalRequests > 0 ? (totalSuccess / totalRequests * 100) : 0;
  const avgDuration = data.reduce((s, d) => s + d.avgDuration * d.totalRequests, 0) / (totalRequests || 1);

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['撮合总数', '成功数', '成功率', '平均时长'] },
    grid: { left: 60, right: 60, bottom: 40, top: 40 },
    xAxis: { type: 'category', data: data.map(d => d.date.slice(5)) },
    yAxis: [
      { type: 'value', name: '数量' },
      { type: 'value', name: '成功率(%) / 时长(分钟)', axisLabel: { formatter: '{value}' } },
    ],
    series: [
      { name: '撮合总数', type: 'bar', data: data.map(d => d.totalRequests), color: '#91caff', barWidth: 20 },
      { name: '成功数', type: 'bar', data: data.map(d => d.successCount), color: '#1677ff', barWidth: 20 },
      {
        name: '成功率', type: 'line', yAxisIndex: 1,
        data: data.map(d => d.successRate),
        color: '#52c41a', smooth: true,
        label: { show: true, formatter: '{c}%' },
      },
      {
        name: '平均时长', type: 'line', yAxisIndex: 1,
        data: data.map(d => d.avgDuration),
        color: '#faad14', smooth: true, lineStyle: { type: 'dashed' },
        label: { show: true, formatter: '{c}min' },
      },
    ],
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>📊 撮合统计报告</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">累计撮合请求</Text>
            <Title level={3} style={{ margin: '8px 0' }}>{totalRequests} 笔</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">撮合成功率</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#52c41a' }}>
              {avgSuccessRate.toFixed(1)}%
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Text type="secondary">平均撮合时长</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#faad14' }}>
              {avgDuration.toFixed(0)} 分钟
            </Title>
          </Card>
        </Col>
      </Row>

      <Card title="📈 撮合趋势（近7日）" size="small">
        <ReactECharts option={option} style={{ height: 400 }} />
      </Card>
    </div>
  );
};

export default MatchReport;
