import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Select, Button, Space, Typography, Tag } from 'antd';
import { SearchOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { mockPositions } from '../../mocks/data';
import { formatNumber, formatDate } from '../../utils';
import type { ColumnsType } from 'antd/es/table';
import type { Position } from '../../types';

const { Title } = Typography;

const PositionList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const positions = useMemo(() => {
    let data = mockPositions.filter(p => p.brokerCode === user?.brokerCode);
    if (searchText) {
      const s = searchText.toLowerCase();
      data = data.filter(p => p.stockCode.toLowerCase().includes(s) || p.stockName.includes(s) || p.clientId.includes(s));
    }
    if (typeFilter !== 'all') {
      data = data.filter(p => p.positionType === typeFilter);
    }
    return data;
  }, [searchText, typeFilter, user]);

  const columns: ColumnsType<Position> = [
    { title: '股票代码', dataIndex: 'stockCode', key: 'stockCode', width: 110, sorter: (a, b) => a.stockCode.localeCompare(b.stockCode) },
    { title: '股票名称', dataIndex: 'stockName', key: 'stockName', width: 120 },
    { title: '持仓数量', dataIndex: 'quantity', key: 'quantity', width: 110, sorter: (a, b) => a.quantity - b.quantity, render: (v: number) => formatNumber(v), align: 'right' },
    { title: '客户ID', dataIndex: 'clientId', key: 'clientId', width: 100 },
    { title: '账户类型', dataIndex: 'positionType', key: 'type', width: 100, render: (v: string) => v === 'cash' ? <Tag color="blue">现金账户</Tag> : <Tag color="orange">保证金账户</Tag> },
    { title: '授权状态', dataIndex: 'authorized', key: 'auth', width: 100, render: (v: boolean) => v ? <Tag color="green">已授权</Tag> : <Tag color="red">未授权</Tag> },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'date', width: 110, render: (v: string) => formatDate(v, 'date') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>持仓列表</Title>
        <Space wrap>
          <Button type="primary" icon={<UploadOutlined />} onClick={() => navigate('/positions/upload')}>
            上传持仓
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/positions/available')}>
            查看可借券源
          </Button>
        </Space>
      </div>

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索股票代码/名称/客户ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部类型' },
              { value: 'cash', label: '现金账户' },
              { value: 'margin', label: '保证金账户' },
            ]}
          />
        </Space>

        <Table
          dataSource={positions}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条持仓记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default PositionList;
