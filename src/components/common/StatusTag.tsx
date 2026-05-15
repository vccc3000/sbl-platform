import React from 'react';
import { Tag } from 'antd';
import type { TransactionStatus } from '../../types';
import { TRANSACTION_STATUS_MAP } from '../../utils';

interface StatusTagProps {
  status: TransactionStatus;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const config = TRANSACTION_STATUS_MAP[status];
  return <Tag color={config.color}>{config.label}</Tag>;
};

export default StatusTag;
