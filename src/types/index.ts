// ============ 用户与角色 ============
export type UserRole = 'lender' | 'trader' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  brokerCode?: string; // 券商编码（借出方）
  avatar?: string;
}

// ============ 持仓相关 ============
export type PositionType = 'cash' | 'margin'; // 现金账户 / 保证金账户

export interface Position {
  id: string;
  stockCode: string;        // 如 0700.HK
  stockName: string;        // 腾讯控股
  quantity: number;         // 总持仓股数
  clientId: string;         // 脱敏客户标识
  positionType: PositionType;
  uploadDate: string;       // 持仓快照日期
  authorized: boolean;      // 客户是否授权借出
  brokerCode: string;       // 所属券商
}

// ============ 可借券源 ============
export interface AvailableSecurity {
  id: string;
  stockCode: string;
  stockName: string;
  totalPosition: number;    // 总持仓数量
  availableQuantity: number; // 可借出数量
  lentQuantity: number;     // 已借出数量
  remainingQuantity: number; // 剩余可借数量
  riskFlag?: string;        // 风控标记
  brokerCode: string;
  suggestedRate?: number;   // 建议费率（年化%）
  minTerm?: number;         // 最短借出期限（天）
  remark?: string;
  published: boolean;       // 是否已发布至券池
  publishDate?: string;
  lastUpdated: string;
}

// ============ 券池广场 ============
export interface PoolItem {
  stockCode: string;
  stockName: string;
  totalAvailable: number;   // 总可借数量（所有借出方汇总）
  lenderCount: number;      // 借出方数量
  rateRange: [number, number]; // 费率区间 [最低, 最高]
  lastUpdated: string;
  stockType?: 'blue_chip' | 'mid_cap' | 'small_cap';
  hot: boolean;             // 是否热门券源
  lenders: PoolLenderDetail[];
}

export interface PoolLenderDetail {
  brokerCode: string;
  availableQuantity: number;
  suggestedRate: number;
  minTerm: number;
  remark: string;
}

// ============ 交易管理 ============
export type TransactionStatus =
  | 'matching'       // 撮合中
  | 'pending'        // 待确认
  | 'confirmed'      // 已确认
  | 'delivering'     // 交收中
  | 'delivered'      // 已交收
  | 'returning'      // 还券中
  | 'returned'       // 已还券
  | 'settled'        // 已结算
  | 'cancelled';     // 已取消

export interface Transaction {
  id: string;
  transactionNo: string;    // 交易编号 TR-YYYYMMDD-XXXX
  stockCode: string;
  stockName: string;
  lenderBroker: string;     // 借出方
  borrowerId: string;       // 借入方
  quantity: number;         // 借出数量
  agreedRate: number;       // 协议费率（年化%）
  startDate: string;        // 借出起始日
  expectedEndDate: string;  // 预计到期日
  actualEndDate?: string;   // 实际到期日
  status: TransactionStatus;
  accumulatedInterest: number; // 累计券息
  ccassRef?: string;        // CCASS交收参考号
  logs: TransactionLog[];
  matches: MatchDetail[];
}

export interface TransactionLog {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  fromStatus?: TransactionStatus;
  toStatus?: TransactionStatus;
  remark: string;
}

export interface MatchDetail {
  brokerCode: string;
  quantity: number;
  rate: number;
  status: 'pending' | 'approved' | 'rejected' | 'counter_offer';
  counterRate?: number;
  counterQuantity?: number;
  remark?: string;
}

// ============ 撮合请求 ============
export interface MatchRequest {
  borrowerId: string;
  stockCode: string;
  quantity: number;
  negotiatedRate: number;
  termDays: number;
  selectedLenders: { brokerCode: string; quantity: number }[];
  remark: string;
}

// ============ 消息通知 ============
export type NotificationType = 'match_request' | 'match_response' | 'delivery_update'
  | 'due_reminder' | 'position_alert' | 'publish_success' | 'daily_report';

export type NotificationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  relatedTransactionId?: string;
  relatedStockCode?: string;
}

// ============ 风控规则 ============
export interface RiskRule {
  id: string;
  name: string;
  dimension: string;
  description: string;
  value: string | number;
  unit?: string;
  enabled: boolean;
  lastModified: string;
}

// ============ 报表 ============
export interface UtilizationData {
  date: string;
  totalAvailable: number;
  totalLent: number;
  utilizationRate: number;
}

export interface InterestData {
  stockCode: string;
  stockName: string;
  dailyInterest: number;
  accumulatedInterest: number;
  period: string;
}

export interface MatchStats {
  date: string;
  totalRequests: number;
  successCount: number;
  successRate: number;
  avgDuration: number; // 平均撮合时长（分钟）
}

// ============ 审计日志 ============
export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  operatorRole: UserRole;
  action: string;
  module: string;
  detail: string;
  ipAddress: string;
}

// ============ API 响应 ============
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ 仪表盘 ============
export interface LenderDashboardData {
  totalAvailableSecurities: number;
  totalPublishedSecurities: number;
  todayInterest: number;
  accumulatedInterest: number;
  activeTransactions: number;
  pendingConfirmations: number;
  utilizationTrend: UtilizationData[];
  recentNotifications: Notification[];
}

export interface TraderDashboardData {
  totalPoolStocks: number;
  totalAvailableQuantity: number;
  todayMatches: number;
  pendingDeliveries: number;
  poolOverview: { stockCode: string; stockName: string; available: number }[];
  matchTrend: MatchStats[];
  recentTransactions: Transaction[];
}
