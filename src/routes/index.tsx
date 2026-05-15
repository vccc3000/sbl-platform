import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import AppLayout from '../components/layout/AppLayout';

// Lazy load all page components
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const PositionList = lazy(() => import('../pages/Positions/PositionList'));
const PositionUpload = lazy(() => import('../pages/Positions/PositionUpload'));
const AvailableSecurities = lazy(() => import('../pages/Positions/AvailableSecurities'));
const PoolMarket = lazy(() => import('../pages/Pool/PoolMarket'));
const PoolDetail = lazy(() => import('../pages/Pool/PoolDetail'));
const TransactionList = lazy(() => import('../pages/Trading/TransactionList'));
const TransactionDetail = lazy(() => import('../pages/Trading/TransactionDetail'));
const DueCalendar = lazy(() => import('../pages/Trading/DueCalendar'));
const InterestDetail = lazy(() => import('../pages/Trading/InterestDetail'));
const MessageCenter = lazy(() => import('../pages/Messages/MessageCenter'));
const UtilizationReport = lazy(() => import('../pages/Reports/UtilizationReport'));
const InterestReport = lazy(() => import('../pages/Reports/InterestReport'));
const MatchReport = lazy(() => import('../pages/Reports/MatchReport'));
const RiskRules = lazy(() => import('../pages/Settings/RiskRules'));
const UserManagement = lazy(() => import('../pages/Settings/UserManagement'));
const AuditLog = lazy(() => import('../pages/Settings/AuditLog'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 登录页 - 无布局 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 主应用 - 带布局 */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* 持仓管理 */}
                  <Route path="/positions" element={<PositionList />} />
                  <Route path="/positions/upload" element={<PositionUpload />} />
                  <Route path="/positions/available" element={<AvailableSecurities />} />

                  {/* 券池广场 */}
                  <Route path="/pool" element={<PoolMarket />} />
                  <Route path="/pool/:stockCode" element={<PoolDetail />} />

                  {/* 交易管理 */}
                  <Route path="/trading" element={<TransactionList />} />
                  <Route path="/trading/:id" element={<TransactionDetail />} />
                  <Route path="/trading/calendar" element={<DueCalendar />} />
                  <Route path="/trading/interest" element={<InterestDetail />} />

                  {/* 消息中心 */}
                  <Route path="/messages" element={<MessageCenter />} />

                  {/* 报表中心 */}
                  <Route path="/reports/utilization" element={<UtilizationReport />} />
                  <Route path="/reports/interest" element={<InterestReport />} />
                  <Route path="/reports/match" element={<MatchReport />} />

                  {/* 系统设置 */}
                  <Route path="/settings/risk" element={<RiskRules />} />
                  <Route path="/settings/users" element={<UserManagement />} />
                  <Route path="/settings/audit" element={<AuditLog />} />
                </Routes>
              </Suspense>
            </AppLayout>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
