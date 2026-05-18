import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Select, Button, Space, Typography, Tag, Slider, Modal, InputNumber, message } from 'antd';
import { SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { mockPoolItems } from '../../mocks/data';
import { formatNumber, formatRate } from '../../utils';
import type { PoolItem } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const PoolMarket: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [rateRange, setRateRange] = useState<[number, number]>([0, 10]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolItem | null>(null);
  const [matchQuantity, setMatchQuantity] = useState(0);
  const [matchRate, setMatchRate] = useState(0);
  const [matchTerm, setMatchTerm] = useState(30);
  const [matchBorrower, setMatchBorrower] = useState('');

  const filteredPool = useMemo(() => {
    let data = [...mockPoolItems];
    if (searchText) {
      const s = searchText.toLowerCase();
      data = data.filter(p => p.stockCode.toLowerCase().includes(s) || p.stockName.includes(s));
    }
    if (typeFilter !== 'all') {
      data = data.filter(p => p.stockType === typeFilter);
    }
    data = data.filter(p => {
      const avgRate = (p.rateRange[0] + p.rateRange[1]) / 2;
      return avgRate >= rateRange[0] && avgRate <= rateRange[1];
    });
    return data;
  }, [searchText, rateRange, typeFilter]);

  const handleOpenMatch = (pool: PoolItem) => {
    setSelectedPool(pool);
    setMatchQuantity(pool.totalAvailable > 100000 ? 100000 : Math.floor(pool.totalAvailable / 2));
    setMatchRate((pool.rateRange[0] + pool.rateRange[1]) / 2);
    setMatchTerm(30);
    setMatchBorrower('');
    setMatchModalOpen(true);
  };

  const handleMatch = () => {
    if (!selectedPool || matchQuantity <= 0 || !matchBorrower) {
      message.warning('请填写完整的撮合信息');
      return;
    }
    message.success(`已发起撮合：${selectedPool.stockCode} ${selectedPool.stockName}，${formatNumber(matchQuantity)}股，费率${formatRate(matchRate)}`);
    setMatchModalOpen(false);
  };

  const columns: ColumnsType<PoolItem> = [
    { title: '股票代码', dataIndex: 'stockCode', key: 'code', width: 100, sorter: (a, b) => a.stockCode.localeCompare(b.stockCode) },
    { title: '股票名称', dataIndex: 'stockName', key: 'name', width: 100 },
    { title: '总可借数量', dataIndex: 'totalAvailable', key: 'total', render: (v: number) => <Text strong>{formatNumber(v)}</Text>, align: 'right', sorter: (a, b) => a.totalAvailable - b.totalAvailable, width: 120 },
    { title: '借出方数', dataIndex: 'lenderCount', key: 'count', align: 'center', width: 80, render: (v: number) => `${v}家` },
    { title: '费率区间', key: 'rate', width: 110, render: (_: any, r: PoolItem) => `${r.rateRange[0].toFixed(1)}% ~ ${r.rateRange[1].toFixed(1)}%` },
    { title: '类型', dataIndex: 'stockType', key: 'type', width: 80, render: (v: string) => v === 'blue_chip' ? <Tag color="blue">蓝筹</Tag> : <Tag>其他</Tag> },
    { title: '热度', dataIndex: 'hot', key: 'hot', width: 70, render: (v: boolean) => v ? <Tag color="red">热门</Tag> : <Tag>普通</Tag> },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_: any, record: PoolItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/pool/${record.stockCode}`)}>
            明细
          </Button>
          <Button type="link" size="small" icon={<ThunderboltOutlined />} onClick={() => handleOpenMatch(record)}>
            撮合
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>券池广场</Title>
        <Text type="secondary">浏览所有已发布的可借券源，发起撮合交易</Text>
      </div>

      <Card size="small">
        {/* 搜索与筛选 */}
        <Space style={{ marginBottom: 16 }} wrap size="middle">
          <Input
            placeholder="搜索股票代码/名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部类型' },
              { value: 'blue_chip', label: '蓝筹股' },
              { value: 'mid_cap', label: '中小盘' },
            ]}
          />
          <div style={{ width: 240 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>费率范围 (% p.a.)</Text>
            <Slider
              range
              min={0}
              max={10}
              step={0.5}
              value={rateRange}
              onChange={v => setRateRange(v as [number, number])}
              marks={{ 0: '0%', 5: '5%', 10: '10%' }}
            />
          </div>
        </Space>

        <Table
          dataSource={filteredPool}
          columns={columns}
          rowKey="stockCode"
          size="middle"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 只券源` }}
        />
      </Card>

      {/* 撮合弹窗 */}
      <Modal
        title={`发起撮合 - ${selectedPool?.stockCode} ${selectedPool?.stockName}`}
        open={matchModalOpen}
        onCancel={() => setMatchModalOpen(false)}
        onOk={handleMatch}
        okText="发起撮合"
        cancelText="取消"
        width={520}
      >
        {selectedPool && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text type="secondary">总可借数量：</Text>
              <Text strong>{formatNumber(selectedPool.totalAvailable)} 股</Text>
              <Text type="secondary" style={{ marginLeft: 16 }}>费率区间：</Text>
              <Text strong>{selectedPool.rateRange[0].toFixed(1)}% ~ {selectedPool.rateRange[1].toFixed(1)}%</Text>
            </div>
            <div>
              <Text type="secondary">借入方标识：</Text>
              <Input
                style={{ marginTop: 4 }}
                placeholder="输入借入方编号，如 BOR001"
                value={matchBorrower}
                onChange={e => setMatchBorrower(e.target.value)}
              />
            </div>
            <div>
              <Text type="secondary">借入数量（股）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={matchQuantity}
                onChange={v => setMatchQuantity(v || 0)}
                min={0}
                max={selectedPool.totalAvailable}
                formatter={v => formatNumber(Number(v))}
              />
            </div>
            <div>
              <Text type="secondary">协商费率（年化%）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={matchRate}
                onChange={v => setMatchRate(v || 0)}
                min={0}
                step={0.1}
                suffix="% p.a."
              />
            </div>
            <div>
              <Text type="secondary">借出期限（天）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={matchTerm}
                onChange={v => setMatchTerm(v || 30)}
                min={1}
                suffix="天"
              />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default PoolMarket;
