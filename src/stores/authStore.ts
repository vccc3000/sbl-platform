import { create } from 'zustand';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const roleUserMap: Record<UserRole, User> = {
  lender: {
    id: 'L001',
    name: '张经理',
    role: 'lender',
    brokerCode: 'BRK001',
    avatar: undefined,
  },
  trader: {
    id: 'T001',
    name: '李交易员',
    role: 'trader',
    brokerCode: undefined,
    avatar: undefined,
  },
  admin: {
    id: 'A001',
    name: '王管理员',
    role: 'admin',
    brokerCode: undefined,
    avatar: undefined,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (role: UserRole) => {
    set({ user: roleUserMap[role], isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  switchRole: (role: UserRole) => {
    set({ user: roleUserMap[role], isAuthenticated: true });
  },
}));
