import React from 'react';
import { Tag } from 'antd';
import type { TransactionStatus } from '../../types';
import { TRANSACTION_STATUS_MAP } from '../../utils';

interface StatusTagProps {
  status: TransactionStatus;
}

const STATUS_STYLE_MAP: Record<TransactionStatus, React.CSSProperties> = {
  matching: { color: '#0f766e', background: '#e7f5f3', borderColor: '#b7deda' },
  pending: { color: '#92400e', background: '#fff7ed', borderColor: '#fed7aa' },
  confirmed: { color: '#1d4ed8', background: '#eff6ff', borderColor: '#bfdbfe' },
  delivering: { color: '#0e7490', background: '#ecfeff', borderColor: '#a5f3fc' },
  delivered: { color: '#047857', background: '#ecfdf5', borderColor: '#a7f3d0' },
  returning: { color: '#9a3412', background: '#fff7ed', borderColor: '#fdba74' },
  returned: { color: '#6d28d9', background: '#f5f3ff', borderColor: '#ddd6fe' },
  settled: { color: '#475569', background: '#f8fafc', borderColor: '#cbd5e1' },
  cancelled: { color: '#b42318', background: '#fef3f2', borderColor: '#fecaca' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const config = TRANSACTION_STATUS_MAP[status];
  return (
    <Tag
      style={{
        ...STATUS_STYLE_MAP[status],
        borderRadius: 999,
        fontWeight: 700,
        paddingInline: 10,
        lineHeight: '22px',
      }}
    >
      {config.label}
    </Tag>
  );
};

export default StatusTag;
