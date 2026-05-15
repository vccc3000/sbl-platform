import React, { useState } from 'react';
import { Card, Table, Button, InputNumber, Input, message, Space, Tag, Typography, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { mockAvailableSecurities } from '../../mocks/data';
import { formatNumber, formatRate } from '../../utils';
import type { AvailableSecurity } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const AvailableSecurities: React.FC = () => {
  const { user } = useAuthStore();
  const [securities, setSecurities] = useState(
    mockAvailableSecurities.filter(s => s.brokerCode === user?.brokerCode)
  );
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<AvailableSecurity | null>(null);
  const [publishQuantity, setPublishQuantity] = useState(0);
  const [suggestedRate, setSuggestedRate] = useState(0);
  const [minTerm, setMinTerm] = useState(7);
  const [remark, setRemark] = useState('');

  const handleOpenPublish = (record: AvailableSecurity) => {
    setSelectedStock(record);
    setPublishQuantity(record.remainingQuantity);
    setSuggestedRate(record.suggestedRate || 3.0);
    setMinTerm(record.minTerm || 7);
    setRemark(record.remark || '');
    setPublishModalOpen(true);
  };

  const handlePublish = () => {
    if (!selectedStock) return;
    if (publishQuantity > selectedStock.remainingQuantity) {
      message.error('发布数量不能超过剩余可借数量');
      return;
    }
    setSecurities(prev =>
      prev.map(s =>
        s.id === selectedStock.id
          ? { ...s, published: true, publishDate: new Date().toISOString(), suggestedRate, minTerm, remark }
          : s
      )
    );
    message.success(`${selectedStock.stockCode} ${selectedStock.stockName} 已发布至券池广场`);
    setPublishModalOpen(false);
  };

  const handlePublishAll = () => {
    setSecurities(prev => prev.map(s => ({ ...s, published: true, publishDate: new Date().toISOString() })));
    message.success('已一键发布所有可借券源至券池广场');
  };

  const columns: ColumnsType<AvailableSecurity> = [
    { title: '股票代码', dataIndex: 'stockCode', key: 'code', width: 100 },
    { title: '股票名称', dataIndex: 'stockName', key: 'name', width: 100 },
    { title: '总持仓', dataIndex: 'totalPosition', key: 'total', render: (v: number) => formatNumber(v), align: 'right', width: 100 },
    { title: '可借出', dataIndex: 'availableQuantity', key: 'available', render: (v: number) => formatNumber(v), align: 'right', width: 100 },
    { title: '已借出', dataIndex: 'lentQuantity', key: 'lent', render: (v: number) => formatNumber(v), align: 'right', width: 80 },
    { title: '剩余可借', dataIndex: 'remainingQuantity', key: 'remaining', render: (v: number) => <Text strong>{formatNumber(v)}</Text>, align: 'right', width: 100 },
    { title: '建议费率', dataIndex: 'suggestedRate', key: 'rate', render: (v: number) => v ? formatRate(v) : '-', width: 90 },
    { title: '最短期限', dataIndex: 'minTerm', key: 'term', render: (v: number) => v ? `${v}天` : '-', width: 80 },
    { title: '风控标记', dataIndex: 'riskFlag', key: 'risk', width: 100, render: (v: string) => v ? <Tag color="warning">{v}</Tag> : <Tag color="green">正常</Tag> },
    { title: '状态', dataIndex: 'published', key: 'status', width: 90, render: (v: boolean) => v ? <Tag color="green">已发布</Tag> : <Tag>待发布</Tag> },
    {
      title: '操作', key: 'action', width: 100, fixed: 'right',
      render: (_: any, record: AvailableSecurity) => (
        <Button
          type="link"
          size="small"
          icon={<SendOutlined />}
          disabled={record.published}
          onClick={() => handleOpenPublish(record)}
        >
          {record.published ? '已发布' : '发布'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>📋 可借券源清单</Title>
        <Button type="primary" icon={<SendOutlined />} onClick={handlePublishAll}>
          一键全部发布
        </Button>
      </div>

      <Card size="small">
        <Table
          dataSource={securities}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 只可借券源` }}
        />
      </Card>

      {/* 发布弹窗 */}
      <Modal
        title={`发布券源 - ${selectedStock?.stockCode} ${selectedStock?.stockName}`}
        open={publishModalOpen}
        onCancel={() => setPublishModalOpen(false)}
        onOk={handlePublish}
        okText="确认发布"
        cancelText="取消"
      >
        {selectedStock && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text type="secondary">剩余可借数量：</Text>
              <Text strong>{formatNumber(selectedStock.remainingQuantity)} 股</Text>
            </div>
            <div>
              <Text type="secondary">发布数量（不可超过可借数量上限）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={publishQuantity}
                onChange={v => setPublishQuantity(v || 0)}
                max={selectedStock.remainingQuantity}
                min={0}
                formatter={v => formatNumber(Number(v))}
              />
            </div>
            <div>
              <Text type="secondary">建议费率（年化%）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={suggestedRate}
                onChange={v => setSuggestedRate(v || 0)}
                min={0}
                step={0.1}
                suffix="% p.a."
              />
            </div>
            <div>
              <Text type="secondary">最短借出期限（天）：</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 4 }}
                value={minTerm}
                onChange={v => setMinTerm(v || 7)}
                min={1}
                suffix="天"
              />
            </div>
            <div>
              <Text type="secondary">借出方备注：</Text>
              <Input.TextArea
                style={{ marginTop: 4 }}
                value={remark}
                onChange={e => setRemark(e.target.value)}
                rows={2}
                placeholder="可选，如：大额可议"
              />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default AvailableSecurities;
