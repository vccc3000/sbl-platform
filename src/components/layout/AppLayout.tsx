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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: '0 16px',
          }}
        >
          {collapsed ? (
            <Text strong style={{ fontSize: 20, color: token.colorPrimary }}>
              SBL
            </Text>
          ) : (
            <Space>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: token.colorPrimary,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                SBL
              </div>
              <Text strong style={{ fontSize: 16 }}>
                SBL平台
              </Text>
            </Space>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={getMenuItems()}
          onClick={handleMenuClick}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <AntHeader
          style={{
            background: token.colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />

          <Space size="middle">
            {/* 角色快速切换 */}
            <Select
              size="small"
              value={user?.role}
              onChange={(val: UserRole) => switchRole(val)}
              style={{ width: 120 }}
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
                style={{ fontSize: 16 }}
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Space size={0} direction="vertical" style={{ lineHeight: 1.2 }}>
                  <Text style={{ fontSize: 13 }}>{user?.name}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {user ? roleLabel[user.role] : ''}
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
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
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
