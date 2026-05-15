import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, message, Typography, Steps, Alert, Space, Button, Table, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import FileUpload from '../../components/common/FileUpload';
import { useAuthStore } from '../../stores/authStore';
import { mockPositions } from '../../mocks/data';
import { formatNumber } from '../../utils';

const { Title, Text } = Typography;

const PositionUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [uploaded, setUploaded] = useState(false);
  const [parsed, setParsed] = useState(false);

  const handleUpload = (_data: any[]) => {
    message.success('文件解析成功！');
    setUploaded(true);
    // 模拟解析延迟
    setTimeout(() => {
      setParsed(true);
    }, 1500);
  };

  const brokerPositions = mockPositions.filter(p => p.brokerCode === user?.brokerCode);

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>📤 上传持仓数据</Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Alert
          message="上传说明"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>支持 .xlsx、.xls、.csv 格式文件</li>
              <li>必填字段：股票代码、持仓数量、客户标识、持仓类型、上传日期</li>
              <li>股票名称由系统自动匹配补全</li>
              <li>重复数据将按最新上传覆盖</li>
              <li>上传后将自动触发风控计算引擎</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Steps
          current={uploaded ? (parsed ? 2 : 1) : 0}
          size="small"
          items={[
            { title: '选择文件', description: '选择Excel/CSV持仓文件' },
            { title: '数据校验', description: '系统校验股票代码、数量格式' },
            { title: '风控计算', description: '自动计算可借券源数量' },
          ]}
        />

        <div style={{ marginTop: 24 }}>
          {!uploaded ? (
            <FileUpload onUpload={handleUpload} />
          ) : (
            <div style={{ textAlign: 'center', padding: 24 }}>
              {!parsed ? (
                <>
                  <Text>文件已上传，正在解析数据...</Text>
                </>
              ) : (
                <>
                  <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                  <br /><br />
                  <Text strong style={{ fontSize: 16 }}>持仓数据上传并校验完成！</Text>
                  <br />
                  <Text type="secondary">共解析 {brokerPositions.length} 条持仓记录</Text>
                  <br /><br />
                  <Space>
                    <Button type="primary" onClick={() => navigate('/positions/available')}>
                      查看可借券源
                    </Button>
                    <Button onClick={() => { setUploaded(false); setParsed(false); }}>
                      继续上传
                    </Button>
                  </Space>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* 预览最近上传 */}
      <Card title="📋 当前持仓预览" size="small">
        <Table
          dataSource={brokerPositions.slice(0, 10)}
          rowKey="id"
          size="small"
          scroll={{ x: 700 }}
          columns={[
            { title: '股票代码', dataIndex: 'stockCode', key: 'code', width: 100 },
            { title: '股票名称', dataIndex: 'stockName', key: 'name', width: 100 },
            { title: '持仓数量', dataIndex: 'quantity', key: 'qty', render: (v: number) => formatNumber(v), align: 'right' },
            { title: '客户ID', dataIndex: 'clientId', key: 'client' },
            { title: '类型', dataIndex: 'positionType', key: 'type', render: (v: string) => v === 'cash' ? '现金' : '保证金' },
            { title: '授权', dataIndex: 'authorized', key: 'auth', render: (v: boolean) => v ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag> },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default PositionUpload;
