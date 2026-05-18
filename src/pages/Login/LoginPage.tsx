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
        background:
          'radial-gradient(circle at 20% 15%, rgba(20, 184, 166, 0.18), transparent 28rem), linear-gradient(135deg, #071426 0%, #0b1f36 52%, #12263f 100%)',
        padding: 24,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div
          style={{
            width: 82,
            height: 82,
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 20px 44px rgba(20, 184, 166, 0.24)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text strong style={{ fontSize: 30, color: '#ffffff', letterSpacing: '0.08em' }}>
            SBL
          </Text>
        </div>
        <Title level={2} style={{ color: '#f8fafc', marginBottom: 6, letterSpacing: '-0.02em' }}>
          SBL 券源聚合平台
        </Title>
        <Paragraph style={{ color: '#cbd5e1', fontSize: 16, marginBottom: 0 }}>
          HK / US Securities Lending Desk · 券源撮合 · 资产效率管理
        </Paragraph>
      </div>

      {/* 角色选择 */}
      <Title level={4} style={{ color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
        选择工作台视角
      </Title>

      <Space size="large" wrap style={{ justifyContent: 'center' }}>
        <Card
          hoverable
          style={{
            width: 214,
            textAlign: 'center',
            borderRadius: 10,
            border: '1px solid rgba(226, 232, 240, 0.18)',
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 18px 40px rgba(2, 8, 23, 0.18)',
          }}
          onClick={() => handleLogin('lender')}
        >
          <UserOutlined style={{ fontSize: 36, color: '#0f766e', marginBottom: 16 }} />
          <Title level={5} style={{ marginBottom: 4 }}>借出方</Title>
          <Text type="secondary">下手券商</Text>
          <br />
          <Text type="secondary">上传持仓 · 发布券源</Text>
        </Card>

        <Card
          hoverable
          style={{
            width: 214,
            textAlign: 'center',
            borderRadius: 10,
            border: '1px solid rgba(226, 232, 240, 0.18)',
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 18px 40px rgba(2, 8, 23, 0.18)',
          }}
          onClick={() => handleLogin('trader')}
        >
          <TeamOutlined style={{ fontSize: 36, color: '#1d4ed8', marginBottom: 16 }} />
          <Title level={5} style={{ marginBottom: 4 }}>交易员</Title>
          <Text type="secondary">平台运营</Text>
          <br />
          <Text type="secondary">券池寻源 · 撮合交易</Text>
        </Card>

        <Card
          hoverable
          style={{
            width: 214,
            textAlign: 'center',
            borderRadius: 10,
            border: '1px solid rgba(226, 232, 240, 0.18)',
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 18px 40px rgba(2, 8, 23, 0.18)',
          }}
          onClick={() => handleLogin('admin')}
        >
          <SettingOutlined style={{ fontSize: 36, color: '#b7791f', marginBottom: 16 }} />
          <Title level={5} style={{ marginBottom: 4 }}>管理员</Title>
          <Text type="secondary">系统管理</Text>
          <br />
          <Text type="secondary">风控配置 · 用户管理</Text>
        </Card>
      </Space>

      <Text style={{ color: 'rgba(226, 232, 240, 0.58)', marginTop: 48, fontSize: 12 }}>
        © 2026 SBL Platform. Professional Securities Lending Operations.
      </Text>
    </div>
  );
};

export default LoginPage;
