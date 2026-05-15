import type { TransactionStatus } from '../types';

/** 格式化数字为千分位 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/** 格式化金额（港币） */
export function formatCurrency(amount: number): string {
  return `HK$ ${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** 格式化百分比 */
export function formatPercent(rate: number, decimals = 2): string {
  return `${rate.toFixed(decimals)}%`;
}

/** 格式化费率 */
export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}% p.a.`;
}

/** 生成交易编号 */
export function generateTransactionNo(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `TR-${date}-${seq}`;
}

/** 计算每日券息 */
export function calcDailyInterest(quantity: number, closePrice: number, annualRate: number): number {
  return (quantity * closePrice * annualRate / 100) / 365;
}

/** 交易状态配置 */
export const TRANSACTION_STATUS_MAP: Record<TransactionStatus, { label: string; color: string }> = {
  matching:    { label: '撮合中',   color: 'processing' },
  pending:     { label: '待确认',   color: 'warning' },
  confirmed:   { label: '已确认',   color: 'blue' },
  delivering:  { label: '交收中',   color: 'cyan' },
  delivered:   { label: '已交收',   color: 'green' },
  returning:   { label: '还券中',   color: 'orange' },
  returned:    { label: '已还券',   color: 'purple' },
  settled:     { label: '已结算',   color: 'default' },
  cancelled:   { label: '已取消',   color: 'error' },
};

/** 截断长文本 */
export function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

/** 日期格式化 */
export function formatDate(dateStr: string, format: 'full' | 'short' | 'date' = 'full'): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'date') return `${y}-${m}-${day}`;
  if (format === 'short') return `${m}-${day}`;
  
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

/** 剩余天数计算 */
export function daysRemaining(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
