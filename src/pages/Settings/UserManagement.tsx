import React from 'react';
import { Card, Table, Tag, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface BrokerUser {
  id: string;
  name: string;
  role: string;
  brokerCode?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const mockUsers: BrokerUser[] = [
  { id: 'U001', name: '张经理', role: '借出方', brokerCode: 'BRK001', status: 'active', lastLogin: '2026-05-15 10:30' },
  { id: 'U002', name: '李交易员', role: '交易员', status: 'active', lastLogin: '2026-05-15 14:20' },
  { id: 'U003', name: '王管理员', role: '管理员', status: 'active', lastLogin: '2026-05-15 09:00' },
  { id: 'U004', name: '陈经理', role: '借出方', brokerCode: 'BRK002', status: 'active', lastLogin: '2026-05-14 16:45' },
  { id: 'U005', name: '刘经理', role: '借出方', brokerCode: 'BRK003', status: 'inactive', lastLogin: '2026-05-01 08:00' },
  { id: 'U006', name: '周交易员', role: '交易员', status: 'active', lastLogin: '2026-05-15 11:30' },
];

const UserManagement: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>👥 用户/券商管理</Title>
        <Button type="primary" icon={<PlusOutlined />}>添加用户</Button>
      </div>

      <Card size="small">
        <Table
          dataSource={mockUsers}
          rowKey="id"
          size="middle"
          scroll={{ x: 700 }}
          columns={[
            { title: '用户ID', dataIndex: 'id', key: 'id', width: 80 },
            { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
            { title: '角色', dataIndex: 'role', key: 'role', width: 90, render: (v: string) => <Tag color={v === '管理员' ? 'purple' : v === '交易员' ? 'green' : 'blue'}>{v}</Tag> },
            { title: '券商编码', dataIndex: 'brokerCode', key: 'broker', width: 110, render: (v?: string) => v || '-' },
            { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: string) => v === 'active' ? <Tag color="green">活跃</Tag> : <Tag color="default">停用</Tag> },
            { title: '最后登录', dataIndex: 'lastLogin', key: 'login', width: 160 },
            { title: '操作', key: 'action', width: 120, render: () => (
              <Space>
                <Button type="link" size="small">编辑</Button>
                <Button type="link" size="small" danger>停用</Button>
              </Space>
            )},
          ]}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
