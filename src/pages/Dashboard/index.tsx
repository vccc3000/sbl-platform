import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import LenderDashboard from './LenderDashboard';
import TraderDashboard from './TraderDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return user.role === 'lender' ? <LenderDashboard /> : <TraderDashboard />;
};

export default Dashboard;
