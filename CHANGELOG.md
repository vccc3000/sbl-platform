# Changelog

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，  
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] - 2026-05-15

### Added
- 🎉 SBL 券源聚合平台初始版本
- 三角色登录系统（借出方 / 交易员 / 管理员）
- 仪表盘：券源利用率趋势图、可借券源概览、待处理事项
- 持仓管理：持仓列表、上传持仓、可借券源
- 券池广场：券源市场总览、多借出方撮合、券池详情
- 交易管理：交易记录、交易详情（状态时间线）、到期日历、券息明细
- 报表中心：券源利用率报表、券息收入报表、撮合统计报表
- 系统设置：风控规则、用户管理、操作日志
- 消息中心：分类筛选、批量操作
- GitHub Pages 部署支持

### Tech Stack
- Vite 8 + React 19 + TypeScript 6
- Ant Design 6 + Ant Design Icons 6
- React Router v7 (HashRouter)
- Zustand 5 状态管理
- ECharts 6 数据可视化
- Day.js 日期处理
