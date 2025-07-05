# API 文档

欢迎使用 MaiLauncher API 文档！这里包含了所有 API 接口的详细说明和开发指南。

## 📚 文档导航

### [📖 开发指南](./development.md)
学习如何为 MaiLauncher 开发新的 API 端点，包括：
- 后端 API 开发指南
- 前端调用指南  
- 最佳实践
- 测试指南

### [📋 API 参考](./reference.md)
完整的 API 接口参考文档，包括：
- 实例管理 API
- 部署管理 API
- 系统监控 API
- 资源管理 API
- 配置管理 API
- WebSocket 接口
- 错误代码参考

## 🚀 快速开始

### 基础信息

- **Base URL**: `http://localhost:23456/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: JSON
- **认证方式**: 暂无（本地应用）

### 常用端点概览

| 功能 | 方法 | 端点 | 描述 |
|------|------|------|------|
| 实例管理 | GET | `/instances` | 获取实例列表 |
| 实例管理 | GET | `/instance/{id}/start` | 启动实例 |
| 实例管理 | GET | `/instance/{id}/stop` | 停止实例 |
| 部署管理 | POST | `/deploy/deploy` | 部署新实例 |
| 系统监控 | GET | `/system/health` | 系统健康检查 |
| 系统监控 | GET | `/system/metrics` | 系统性能指标 |
| WebSocket | WS | `/ws/{session_id}` | 终端连接 |

### 响应格式

所有 API 响应都采用统一的格式：

**成功响应**：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

**错误响应**：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 🛠️ 开发工具

### API 测试

推荐使用以下工具进行 API 测试：

- **Postman**: 图形化 API 测试工具
- **curl**: 命令行 HTTP 客户端
- **HTTPie**: 现代化命令行 HTTP 客户端

### 示例请求

**获取实例列表**：
```bash
curl -X GET "http://localhost:23456/api/v1/instances" \
  -H "Content-Type: application/json"
```

**启动实例**：
```bash
curl -X GET "http://localhost:23456/api/v1/instance/your_instance_id/start" \
  -H "Content-Type: application/json"
```

**部署新实例**：
```bash
curl -X POST "http://localhost:23456/api/v1/deploy/deploy" \
  -H "Content-Type: application/json" \
  -d '{
    "instance_name": "test-instance",
    "install_path": "/path/to/install",
    "port": 8080,
    "version": "latest",
    "install_services": ["napcat", "nonebot-ada"],
    "auto_start": true
  }'
```

## 📚 相关文档

- [开发指南](../dev/index.md) - 完整的开发文档
- [用户指南](../guide/index.md) - 用户使用说明
- [安装指南](../guide/installation.md) - 安装和配置

## 🤝 参与贡献

如果您发现 API 文档有任何问题或需要改进，欢迎：

1. 提交 Issue 报告问题
2. 提交 Pull Request 改进文档
3. 参与社区讨论

## 📞 获取支持

如果您在使用 API 时遇到问题：

1. 查看 [FAQ](../guide/index.md#常见问题)
2. 搜索现有的 Issues
3. 创建新的 Issue 描述问题
4. 加入社区讨论群
