import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Select, Space, Typography, Button } from 'antd';
import { SearchOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { mockTransactions } from '../../mocks/data';
import StatusTag from '../../components/common/StatusTag';
import { formatNumber, formatRate, formatDate } from '../../utils';
import type { Transaction, TransactionStatus } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const TransactionList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const transactions = useMemo(() => {
    let data = [...mockTransactions];
    if (searchText) {
      const s = searchText.toLowerCase();
      data = data.filter(t =>
        t.transactionNo.toLowerCase().includes(s) ||
        t.stockCode.toLowerCase().includes(s) ||
        t.stockName.includes(s) ||
        t.lenderBroker.includes(s)
      );
    }
    if (statusFilter !== 'all') {
      data = data.filter(t => t.status === statusFilter);
    }
    return data;
  }, [searchText, statusFilter]);

  const columns: ColumnsType<Transaction> = [
    { title: '交易编号', dataIndex: 'transactionNo', key: 'no', width: 180 },
    { title: '股票', key: 'stock', width: 140, render: (_: any, r: Transaction) => `${r.stockCode} ${r.stockName}` },
    { title: '借出方', dataIndex: 'lenderBroker', key: 'lender', width: 100 },
    { title: '数量', dataIndex: 'quantity', key: 'qty', render: (v: number) => formatNumber(v), align: 'right', width: 100 },
    { title: '费率', dataIndex: 'agreedRate', key: 'rate', render: (v: number) => formatRate(v), width: 90 },
    { title: '起始日', dataIndex: 'startDate', key: 'start', render: (v: string) => v ? formatDate(v, 'date') : '-', width: 100 },
    { title: '预计到期', dataIndex: 'expectedEndDate', key: 'end', render: (v: string) => formatDate(v, 'date'), width: 100 },
    { title: '累计券息', dataIndex: 'accumulatedInterest', key: 'interest', render: (v: number) => `HK$ ${v.toFixed(2)}`, align: 'right', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: TransactionStatus) => <StatusTag status={s} /> },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: (_: any, record: Transaction) => (
        <Button type="link" size="small" onClick={() => navigate(`/trading/${record.id}`)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>📝 交易记录</Title>
        <Space wrap>
          <Button icon={<CalendarOutlined />} onClick={() => navigate('/trading/calendar')}>
            到期日历
          </Button>
          <Button icon={<DollarOutlined />} onClick={() => navigate('/trading/interest')}>
            券息明细
          </Button>
        </Space>
      </div>

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索交易编号/股票/借出方"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'matching', label: '撮合中' },
              { value: 'pending', label: '待确认' },
              { value: 'confirmed', label: '已确认' },
              { value: 'delivering', label: '交收中' },
              { value: 'delivered', label: '已交收' },
              { value: 'returning', label: '还券中' },
              { value: 'settled', label: '已结算' },
              { value: 'cancelled', label: '已取消' },
            ]}
          />
        </Space>

        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 笔交易` }}
        />
      </Card>
    </div>
  );
};

export default TransactionList;
