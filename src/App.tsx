import { HashRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import type { ThemeConfig } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRoutes from './routes';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#0f766e',
    colorSuccess: '#059669',
    colorWarning: '#b7791f',
    colorError: '#b42318',
    colorInfo: '#0f766e',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorBorder: '#d9e2ec',
    colorBorderSecondary: '#e6edf3',
    colorBgBase: '#f4f7fb',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#eef3f8',
    colorFillSecondary: '#eef6f5',
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    controlHeight: 36,
    controlHeightSM: 28,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSize: 14,
    boxShadowTertiary: '0 8px 24px rgba(15, 23, 42, 0.06)',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#071426',
      bodyBg: '#eef3f8',
      triggerBg: '#0b1f36',
      triggerColor: '#cbd5e1',
    },
    Menu: {
      darkItemBg: '#071426',
      darkSubMenuItemBg: '#0b1f36',
      darkItemColor: '#94a3b8',
      darkItemHoverBg: 'rgba(20, 184, 166, 0.12)',
      darkItemHoverColor: '#e2e8f0',
      darkItemSelectedBg: '#0f766e',
      darkItemSelectedColor: '#ffffff',
      itemBorderRadius: 6,
    },
    Card: {
      headerBg: '#ffffff',
      borderRadiusLG: 8,
      paddingLG: 20,
    },
    Table: {
      headerBg: '#f3f7fb',
      headerColor: '#334155',
      rowHoverBg: '#f7fbfc',
      borderColor: '#e6edf3',
    },
    Button: {
      borderRadius: 6,
      defaultBorderColor: '#cbd5e1',
      primaryShadow: '0 4px 12px rgba(15, 118, 110, 0.22)',
    },
    Input: {
      borderRadius: 6,
      hoverBorderColor: '#0f766e',
      activeBorderColor: '#0f766e',
    },
    Select: {
      borderRadius: 6,
      optionSelectedBg: '#e7f5f3',
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Modal: {
      borderRadiusLG: 8,
      titleFontSize: 16,
    },
    Pagination: {
      itemActiveBg: '#0f766e',
      itemActiveColorDisabled: '#ffffff',
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <AntApp>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
