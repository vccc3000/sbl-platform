import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Space, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            width: 80,
            height: 80,
            background: '#fff',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Text strong style={{ fontSize: 32, color: '#1677ff' }}>
            SBL
          </Text>
        </div>
        <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>
          SBL 券源聚合平台
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16 }}>
          香港股票市场 · 券源撮合 · 高效盘活资产
        </Paragraph>
      </div>

      {/* 角色选择 */}
      <Title level={4} style={{ color: '#fff', marginBottom: 24, textAlign: 'center' }}>
        选择登录角色
      </Title>

      <Space size="large" wrap style={{ justifyContent: 'center' }}>
        <Card
          hoverable
          style={{ width: 200, textAlign: 'center', borderRadius: 12 }}
          onClick={() => handleLogin('lender')}
        >
          <UserOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 16 }} />
          <Title level={5}>借出方</Title>
          <Text type="secondary">下手券商</Text>
          <br />
          <Text type="secondary">上传持仓·发布券源</Text>
        </Card>

        <Card
          hoverable
          style={{ width: 200, textAlign: 'center', borderRadius: 12 }}
          onClick={() => handleLogin('trader')}
        >
          <TeamOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 16 }} />
          <Title level={5}>交易员</Title>
          <Text type="secondary">平台运营</Text>
          <br />
          <Text type="secondary">券池寻源·撮合交易</Text>
        </Card>

        <Card
          hoverable
          style={{ width: 200, textAlign: 'center', borderRadius: 12 }}
          onClick={() => handleLogin('admin')}
        >
          <SettingOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 16 }} />
          <Title level={5}>管理员</Title>
          <Text type="secondary">系统管理</Text>
          <br />
          <Text type="secondary">风控配置·用户管理</Text>
        </Card>
      </Space>

      <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 48, fontSize: 12 }}>
        © 2026 SBL Platform. All rights reserved.
      </Text>
    </div>
  );
};

export default LoginPage;
