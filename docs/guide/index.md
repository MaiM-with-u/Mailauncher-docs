# 用户指南

欢迎使用 MaiLauncher！本指南将帮助你快速上手并充分利用启动器的各项功能。

## 什么是 MaiLauncher？

MaiLauncher 是一个功能强大的 MaiBot 实例管理和部署工具，为用户提供直观的图形化界面来管理多个 MaiBot 实例。它具有以下特点：

- **简单易用**：现代化的 Web 界面，一键部署和管理
- **功能强大**：完整的实例生命周期管理和资源管理
- **实时监控**：WebSocket 实时通信和状态更新
- **跨平台**：支持 Windows、Linux、macOS
- **开源免费**：基于 GPL-3.0 许可证开源

## 🎯 产品概述

MaiLauncher 旨在简化 MaiBot 的部署和管理流程，通过现代化的 Web 界面替代复杂的命令行操作，让用户能够轻松地：

- 部署和管理 MaiBot 实例
- 监控实例运行状态
- 管理 Bot 资源和配置
- 与 Bot 进行实时交互

## 🌟 主要功能

### 🚀 一键部署
- 图形化选择 MaiBot 版本
- 自动下载和配置依赖
- 实时显示部署进度
- 支持多种部署配置

### 📊 实例管理
- 多实例并行管理
- 实时状态监控
- 一键启停控制
- 实例详情查看

### 💬 实时交互
- 集成 xterm.js 终端
- WebSocket 实时通信
- 聊天界面（开发中）
- 实时日志查看

### 🔧 资源管理
- 表情包管理
- 用户数据管理
- 配置文件编辑
- 批量操作支持

### 📈 监控面板
- 系统资源监控
- 实例性能指标
- 可视化图表
- 实时数据更新

## 🏗️ 架构设计

MaiLauncher 采用前后端分离的架构设计：

### 前端 (mailauncher)
- **技术栈**: Vue 3 + DaisyUI + Tailwind CSS
- **构建工具**: Vite
- **状态管理**: Pinia
- **跨平台**: Tauri

### 后端 (mailauncher-backend)
- **技术栈**: FastAPI + SQLite
- **异步处理**: asyncio
- **WebSocket**: 实时通信
- **日志系统**: 结构化日志

## 🚀 快速开始

准备好开始使用 MaiLauncher 了吗？查看我们的[安装指南](./installation.md)来快速开始！

## 📚 文档结构

- **[安装指南](./installation.md)** - 安装和配置说明
- **[API 文档](../api/)** - 后端 API 接口文档
- **[开发文档](../dev/)** - 开发环境搭建和贡献指南

### 启动功能
- 一键启动游戏
- 自定义启动参数
- 游戏环境检测

### 高级特性
- WebSocket API 支持
- 插件系统
- 自动更新机制

## 快速导航

- [安装配置](./installation.md) - 了解如何安装和配置 MaiLauncher
- [基本使用](./basic-usage.md) - 学习基本的使用方法
- [高级功能](./advanced.md) - 探索更多高级功能
- [常见问题](./faq.md) - 查看常见问题解答

## 需要帮助？

如果你在使用过程中遇到问题，可以：

1. 查看本文档的其他章节
2. 在 [GitHub Issues](https://github.com/MaiM-with-u/Mailauncher-docs/issues) 提交问题
3. 加入我们的社区讨论

让我们开始吧！
