import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Typography, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockTransactions } from '../../mocks/data';
import StatusTag from '../../components/common/StatusTag';
import { formatNumber, formatRate, daysRemaining, formatDate } from '../../utils';
import type { Transaction } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const DueCalendar: React.FC = () => {
  const navigate = useNavigate();

  const dueTransactions = useMemo(() => {
    // 筛选有到期日且状态为活跃的交易
    return mockTransactions
      .filter(t => t.expectedEndDate && ['delivered', 'delivering', 'confirmed'].includes(t.status))
      .map(t => ({ ...t, _remaining: daysRemaining(t.expectedEndDate) }))
      .sort((a, b) => (a._remaining as number) - (b._remaining as number));
  }, []);

  const columns: ColumnsType<Transaction & { _remaining?: number }> = [
    { title: '交易编号', dataIndex: 'transactionNo', key: 'no', width: 180 },
    { title: '股票', key: 'stock', render: (_: any, r: Transaction) => `${r.stockCode} ${r.stockName}`, width: 140 },
    { title: '借出方', dataIndex: 'lenderBroker', key: 'lender', width: 100 },
    { title: '数量', dataIndex: 'quantity', key: 'qty', render: (v: number) => formatNumber(v), align: 'right', width: 100 },
    { title: '费率', dataIndex: 'agreedRate', key: 'rate', render: (v: number) => formatRate(v), width: 80 },
    { title: '起始日', dataIndex: 'startDate', key: 'start', render: (v: string) => v ? formatDate(v, 'date') : '-', width: 100 },
    { title: '到期日', dataIndex: 'expectedEndDate', key: 'end', render: (v: string) => formatDate(v, 'date'), width: 100 },
    {
      title: '剩余天数', key: 'remaining', width: 100, sorter: (a, b) => (a._remaining || 0) - (b._remaining || 0),
      render: (_: any, r: any) => {
        const d = r._remaining as number;
        return (
          <Tag color={d <= 1 ? 'red' : d <= 3 ? 'orange' : d <= 7 ? 'gold' : 'green'}>
            {d <= 0 ? '已到期' : `${d} 天`}
          </Tag>
        );
      },
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: any) => <StatusTag status={s} /> },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/trading')}>返回</Button>
      </Space>

      <Title level={4} style={{ margin: '0 0 16px' }}>📅 到期日历</Title>

      <Card size="small">
        <Table
          dataSource={dueTransactions}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default DueCalendar;
