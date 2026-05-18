import React from 'react';
import { Card, Statistic, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
  valueStyle?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  loading = false,
  valueStyle,
}) => {
  const trendColor = trend === 'down' ? '#b42318' : '#047857';
  const iconNode = trend ? (
    trend === 'up' ? (
      <ArrowUpOutlined style={{ color: trendColor, fontSize: 13 }} />
    ) : (
      <ArrowDownOutlined style={{ color: trendColor, fontSize: 13 }} />
    )
  ) : prefix ? (
    prefix
  ) : undefined;

  return (
    <Card
      size="small"
      loading={loading}
      style={{
        height: '100%',
        borderRadius: 8,
        background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
        border: '1px solid #e6edf3',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
      }}
      styles={{ body: { padding: 18 } }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }} align="center">
          <Typography.Text
            style={{
              color: '#64748b',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </Typography.Text>
          {iconNode ? (
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                background: '#eef6f5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {iconNode}
            </span>
          ) : null}
        </Space>
        <Statistic
          value={value}
          suffix={
            trendValue ? (
              <span
                style={{
                  fontSize: 13,
                  color: trendColor,
                  fontWeight: 700,
                  marginLeft: 6,
                }}
              >
                {trendValue}
              </span>
            ) : suffix ? (
              suffix
            ) : undefined
          }
          valueStyle={valueStyle || { fontSize: 26, fontWeight: 750, color: '#0f172a', letterSpacing: '-0.02em' }}
        />
      </Space>
    </Card>
  );
};

export default StatCard;
