import React, { useState } from 'react';
import { Card, List, Tag, Typography, Button, Space, Badge, Tabs, Empty } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  MailOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { useNotificationStore } from '../../stores/notificationStore';
import { mockNotifications } from '../../mocks/data';
import { formatDate } from '../../utils';
import type { Notification, NotificationType } from '../../types';

const { Title, Text, Paragraph } = Typography;

const typeConfig: Record<NotificationType, { label: string; color: string; icon: React.ReactNode }> = {
  match_request: { label: '撮合请求', color: 'blue', icon: <BellOutlined /> },
  match_response: { label: '撮合响应', color: 'orange', icon: <BellOutlined /> },
  delivery_update: { label: '交收更新', color: 'cyan', icon: <MailOutlined /> },
  due_reminder: { label: '到期提醒', color: 'gold', icon: <AlertOutlined /> },
  position_alert: { label: '持仓预警', color: 'red', icon: <AlertOutlined /> },
  publish_success: { label: '发布成功', color: 'green', icon: <CheckCircleOutlined /> },
  daily_report: { label: '每日报告', color: 'purple', icon: <MailOutlined /> },
};

const priorityColor: Record<string, string> = {
  urgent: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'default',
};

const MessageCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, setNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('all');

  // 初始加载
  React.useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const filtered = (() => {
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    if (activeTab === 'urgent') return notifications.filter(n => n.priority === 'urgent' || n.priority === 'high');
    return notifications;
  })();

  const tabItems = [
    { key: 'all', label: `全部 (${notifications.length})` },
    { key: 'unread', label: `未读 (${unreadCount})` },
    { key: 'urgent', label: '紧急' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          消息中心
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: 8 }} />
          )}
        </Title>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllAsRead}>
            全部标为已读
          </Button>
        )}
      </div>

      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        {filtered.length === 0 ? (
          <Empty description="暂无消息" />
        ) : (
          <List
            dataSource={filtered}
            renderItem={(item: Notification) => (
              <List.Item
                key={item.id}
                style={{
                  background: item.read ? undefined : '#f0f5ff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                onClick={() => !item.read && markAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Tag color={typeConfig[item.type].color}>
                      {typeConfig[item.type].label}
                    </Tag>
                  }
                  title={
                    <Space>
                      {!item.read && <Badge status="processing" />}
                      <Text strong={!item.read}>{item.title}</Text>
                      <Tag color={priorityColor[item.priority]} style={{ fontSize: 10 }}>
                        {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <>
                      <Paragraph
                        style={{ margin: '4px 0', color: item.read ? '#999' : '#333' }}
                        ellipsis={{ rows: 2 }}
                      >
                        {item.content}
                      </Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default MessageCenter;
