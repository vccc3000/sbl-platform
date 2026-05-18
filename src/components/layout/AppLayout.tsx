import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Typography,
  theme,
  Select,
  Space,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  ShopOutlined,
  FileTextOutlined,
  BellOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import type { UserRole } from '../../types';

const { Header: AntHeader, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, switchRole, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { token } = theme.useToken();

  // 鉴权守卫：未登录时跳转到登录页
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // 如果用户未登录，不渲染布局（等待重定向）
  if (!user) {
    return null;
  }

  // 根据角色定义菜单
  const lenderMenuItems: MenuProps['items'] = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    {
      key: '/positions',
      icon: <InboxOutlined />,
      label: '持仓管理',
      children: [
        { key: '/positions', label: '持仓列表' },
        { key: '/positions/upload', label: '上传持仓' },
        { key: '/positions/available', label: '可借券源' },
      ],
    },
    { key: '/pool', icon: <ShopOutlined />, label: '券池广场' },
    {
      key: '/trading',
      icon: <FileTextOutlined />,
      label: '交易管理',
      children: [
        { key: '/trading', label: '交易记录' },
        { key: '/trading/calendar', label: '到期日历' },
        { key: '/trading/interest', label: '券息明细' },
      ],
    },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '报表中心',
      children: [
        { key: '/reports/utilization', label: '券源利用率' },
        { key: '/reports/interest', label: '券息收入' },
      ],
    },
  ];

  const traderMenuItems: MenuProps['items'] = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/pool', icon: <ShopOutlined />, label: '券池广场' },
    {
      key: '/trading',
      icon: <FileTextOutlined />,
      label: '交易管理',
      children: [
        { key: '/trading', label: '交易记录' },
        { key: '/trading/calendar', label: '到期日历' },
        { key: '/trading/interest', label: '券息明细' },
      ],
    },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '报表中心',
      children: [
        { key: '/reports/utilization', label: '券源利用率' },
        { key: '/reports/match', label: '撮合统计' },
      ],
    },
  ];

  const adminMenuItems: MenuProps['items'] = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/pool', icon: <ShopOutlined />, label: '券池广场' },
    {
      key: '/trading',
      icon: <FileTextOutlined />,
      label: '交易管理',
      children: [
        { key: '/trading', label: '交易记录' },
        { key: '/trading/calendar', label: '到期日历' },
      ],
    },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '报表中心',
      children: [
        { key: '/reports/utilization', label: '券源利用率' },
        { key: '/reports/interest', label: '券息收入' },
        { key: '/reports/match', label: '撮合统计' },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        { key: '/settings/risk', label: '风控规则' },
        { key: '/settings/users', label: '用户管理' },
        { key: '/settings/audit', label: '操作日志' },
      ],
    },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'lender': return lenderMenuItems;
      case 'trader': return traderMenuItems;
      case 'admin': return adminMenuItems;
      default: return [];
    }
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const roleLabel: Record<UserRole, string> = {
    lender: '借出方',
    trader: '交易员',
    admin: '管理员',
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'role-lender', label: '借出方视角', onClick: () => switchRole('lender') },
    { key: 'role-trader', label: '交易员视角', onClick: () => switchRole('trader') },
    { key: 'role-admin', label: '管理员视角', onClick: () => switchRole('admin') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: logout, danger: true },
  ];

  // 获取当前选中菜单
  const selectedKey = location.pathname.startsWith('/positions')
    ? '/positions'
    : location.pathname.startsWith('/trading')
    ? '/trading'
    : location.pathname.startsWith('/reports')
    ? '/reports'
    : location.pathname.startsWith('/settings')
    ? '/settings'
    : location.pathname.startsWith('/pool')
    ? '/pool'
    : location.pathname;

  const openKeys = location.pathname.startsWith('/positions')
    ? ['/positions']
    : location.pathname.startsWith('/trading')
    ? ['/trading']
    : location.pathname.startsWith('/reports')
    ? ['/reports']
    : location.pathname.startsWith('/settings')
    ? ['/settings']
    : undefined;

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        theme="dark"
        width={236}
        style={{
          background: 'linear-gradient(180deg, #071426 0%, #0b1f36 100%)',
          borderRight: '1px solid rgba(148, 163, 184, 0.16)',
          boxShadow: '8px 0 24px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
            padding: collapsed ? '0 12px' : '0 18px',
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: '0.08em',
              }}
            >
              SBL
            </div>
          ) : (
            <Space size={12} align="center">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  boxShadow: '0 10px 24px rgba(20, 184, 166, 0.24)',
                }}
              >
                SBL
              </div>
              <Space size={1} direction="vertical">
                <Text strong style={{ fontSize: 16, color: '#e2e8f0', lineHeight: 1.2 }}>
                  Securities Lending
                </Text>
                <Text style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.05em' }}>
                  HK / US Securities Lending Desk
                </Text>
              </Space>
            </Space>
          )}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={getMenuItems()}
          onClick={handleMenuClick}
          style={{ border: 'none', marginTop: 12, background: 'transparent', paddingInline: 8 }}
        />
      </Sider>

      <Layout style={{ background: token.colorBgLayout }}>
        <AntHeader
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            height: 64,
            boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
          }}
        >
          <Space size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40, color: '#334155' }}
            />
            <Space size={2} direction="vertical" style={{ lineHeight: 1.2 }}>
              <Text strong style={{ color: '#0f172a', fontSize: 14 }}>
                证券借贷运营台
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Real-time lending, matching and settlement overview
              </Text>
            </Space>
          </Space>

          <Space size="middle">
            {/* 角色快速切换 */}
            <Select
              size="small"
              value={user?.role}
              onChange={(val: UserRole) => switchRole(val)}
              style={{ width: 132 }}
              options={[
                { value: 'lender', label: '借出方' },
                { value: 'trader', label: '交易员' },
                { value: 'admin', label: '管理员' },
              ]}
            />

            {/* 消息通知 */}
            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => navigate('/messages')}
                style={{ fontSize: 16, color: '#334155' }}
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }} size={10}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ background: '#0f766e', color: '#ffffff' }}
                />
                <Space size={0} direction="vertical" style={{ lineHeight: 1.2 }}>
                  <Text style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{user?.name}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {user ? `${roleLabel[user.role]} · ${user.brokerCode}` : ''}
                  </Text>
                </Space>
              </Space>
            </Dropdown>
          </Space>
        </AntHeader>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: 'rgba(255, 255, 255, 0.88)',
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
