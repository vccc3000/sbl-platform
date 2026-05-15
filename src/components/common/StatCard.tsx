import React from 'react';
import { Card, Statistic } from 'antd';
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
  return (
    <Card size="small" loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={
          trend ? (
            trend === 'up' ? (
              <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 14 }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 14 }} />
            )
          ) : prefix ? (
            prefix
          ) : undefined
        }
        suffix={
          trendValue ? (
            <span
              style={{
                fontSize: 13,
                color: trend === 'up' ? '#52c41a' : '#ff4d4f',
              }}
            >
              {trendValue}
            </span>
          ) : suffix ? (
            suffix
          ) : undefined
        }
        valueStyle={valueStyle || { fontSize: 28, fontWeight: 600 }}
      />
    </Card>
  );
};

export default StatCard;
