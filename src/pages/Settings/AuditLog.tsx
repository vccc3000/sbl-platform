import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Input, Select, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { mockAuditLogs } from '../../mocks/data';
import { formatDate } from '../../utils';
import type { AuditLog } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AuditLog: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filtered = mockAuditLogs.filter(log => {
    if (searchText && !log.operator.includes(searchText) && !log.detail.includes(searchText)) return false;
    if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
    return true;
  });

  const roleColor: Record<string, string> = {
    lender: 'blue',
    trader: 'green',
    admin: 'purple',
  };
  const roleLabel: Record<string, string> = {
    lender: '借出方',
    trader: '交易员',
    admin: '管理员',
  };

  const columns: ColumnsType<AuditLog> = [
    { title: '时间', dataIndex: 'timestamp', key: 'time', width: 160, render: (v: string) => formatDate(v) },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '角色', dataIndex: 'operatorRole', key: 'role', width: 80, render: (v: string) => <Tag color={roleColor[v]}>{roleLabel[v]}</Tag> },
    { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
    { title: '模块', dataIndex: 'module', key: 'module', width: 100, render: (v: string) => <Tag>{v}</Tag> },
    { title: '详情', dataIndex: 'detail', key: 'detail', ellipsis: true },
    { title: 'IP地址', dataIndex: 'ipAddress', key: 'ip', width: 140 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>📜 操作日志</Title>

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索操作人或详情"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={moduleFilter}
            onChange={setModuleFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部模块' },
              { value: '持仓管理', label: '持仓管理' },
              { value: '券池广场', label: '券池广场' },
              { value: '交易管理', label: '交易管理' },
              { value: '系统设置', label: '系统设置' },
            ]}
          />
          <RangePicker size="middle" />
        </Space>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条操作记录` }}
        />
      </Card>
    </div>
  );
};

export default AuditLog;
