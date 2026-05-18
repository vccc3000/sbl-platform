import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Timeline, Button, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockTransactions } from '../../mocks/data';
import StatusTag from '../../components/common/StatusTag';
import { formatNumber, formatRate, formatCurrency, formatDate, daysRemaining } from '../../utils';

const { Title, Text } = Typography;

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const transaction = mockTransactions.find(t => t.id === id);

  if (!transaction) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Title level={4}>交易不存在</Title>
        <Button onClick={() => navigate('/trading')}>返回交易列表</Button>
      </div>
    );
  }

  const remaining = transaction.expectedEndDate ? daysRemaining(transaction.expectedEndDate) : null;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/trading')}>
          返回交易列表
        </Button>
      </Space>

      {/* 基本信息 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions
          title={`交易详情 - ${transaction.transactionNo}`}
          column={{ xs: 1, sm: 2, md: 3 }}
          size="small"
          extra={<StatusTag status={transaction.status} />}
        >
          <Descriptions.Item label="股票">{transaction.stockCode} {transaction.stockName}</Descriptions.Item>
          <Descriptions.Item label="借出方">{transaction.lenderBroker}</Descriptions.Item>
          <Descriptions.Item label="借入方">{transaction.borrowerId}</Descriptions.Item>
          <Descriptions.Item label="借出数量">
            <Text strong>{formatNumber(transaction.quantity)} 股</Text>
          </Descriptions.Item>
          <Descriptions.Item label="协议费率">
            <Text strong>{formatRate(transaction.agreedRate)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="累计券息">
            <Text strong style={{ color: '#0f766e' }}>{formatCurrency(transaction.accumulatedInterest)}</Text>
          </Descriptions.Item>
          {transaction.startDate && (
            <Descriptions.Item label="借出起始日">{formatDate(transaction.startDate, 'date')}</Descriptions.Item>
          )}
          <Descriptions.Item label="预计到期日">
            {transaction.expectedEndDate ? (
              <Space>
                {formatDate(transaction.expectedEndDate, 'date')}
                {remaining !== null && remaining >= 0 && (
                  <Tag color={remaining <= 3 ? 'red' : remaining <= 7 ? 'orange' : 'green'}>
                    剩余 {remaining} 天
                  </Tag>
                )}
              </Space>
            ) : '-'}
          </Descriptions.Item>
          {transaction.ccassRef && (
            <Descriptions.Item label="CCASS参考号">{transaction.ccassRef}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 撮合明细 */}
      {transaction.matches.length > 0 && (
        <Card title="撮合拆分明细" size="small" style={{ marginBottom: 16 }}>
          {transaction.matches.map((m, idx) => (
            <Descriptions key={idx} size="small" bordered style={{ marginBottom: 8 }}>
              <Descriptions.Item label="借出方">{m.brokerCode}</Descriptions.Item>
              <Descriptions.Item label="数量">{formatNumber(m.quantity)} 股</Descriptions.Item>
              <Descriptions.Item label="费率">{formatRate(m.rate)}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={m.status === 'approved' ? 'green' : m.status === 'rejected' ? 'red' : 'orange'}>
                  {m.status === 'approved' ? '已同意' : m.status === 'rejected' ? '已拒绝' : '议价中'}
                </Tag>
              </Descriptions.Item>
              {m.counterRate && (
                <Descriptions.Item label="议价费率">{formatRate(m.counterRate)}</Descriptions.Item>
              )}
            </Descriptions>
          ))}
        </Card>
      )}

      {/* 操作日志时间线 */}
      <Card title="📜 操作日志" size="small">
        <Timeline
          items={transaction.logs.map(log => ({
            color: log.action.includes('完成') || log.action.includes('成功') ? 'green' :
                   log.action.includes('取消') || log.action.includes('拒绝') ? 'red' : 'blue',
            children: (
              <div>
                <Text strong>{log.action}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDate(log.timestamp)} · {log.operator}
                </Text>
                {log.remark && (
                  <>
                    <br />
                    <Text style={{ fontSize: 13 }}>{log.remark}</Text>
                  </>
                )}
                {log.fromStatus && log.toStatus && (
                  <>
                    <br />
                    <Space size={4}>
                      <StatusTag status={log.fromStatus} />
                      <Text type="secondary">→</Text>
                      <StatusTag status={log.toStatus} />
                    </Space>
                  </>
                )}
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
};

export default TransactionDetail;
