# API 文档

MaiLauncher 后端提供了完整的 RESTful API 和 WebSocket 接口，用于管理 MaiBot 实例和系统资源。

## 📋 概述

MaiLauncher API 提供了全面的接口来管理 MaiBot 实例、部署管理、系统监控和资源管理。

### 基础信息

- **Base URL**: `http://localhost:23456/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: JSON
- **认证方式**: 暂无（本地应用）

### 端点结构

所有 API 端点都遵循 RESTful 设计原则：

```
GET    /api/v1/instances          # 获取实例列表
POST   /api/v1/instance/{id}/start # 启动实例
GET    /api/v1/system/health      # 系统健康检查
WS     /api/v1/ws/{session_id}    # WebSocket 连接
POST   /api/v1/resource     # 创建新资源
PUT    /api/v1/resource/:id # 更新特定资源
DELETE /api/v1/resource/:id # 删除特定资源
```

### 响应格式

所有 API 响应都采用统一的格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2025-07-02T10:30:00Z"
}
```

错误响应格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2025-07-02T10:30:00Z"
}
```

## 主要 API 模块

### 1. 启动器 API
管理游戏启动、进程监控等核心功能。

**相关端点：**
- `GET /api/v1/launcher/status` - 获取启动器状态
- `POST /api/v1/launcher/start` - 启动游戏
- `POST /api/v1/launcher/stop` - 停止游戏

### 2. 实例管理 API
管理游戏实例的创建、配置和删除。

**相关端点：**
- `GET /api/v1/instances` - 获取实例列表
- `POST /api/v1/instances` - 创建新实例
- `PUT /api/v1/instances/:id` - 更新实例配置
- `DELETE /api/v1/instances/:id` - 删除实例

### 3. 配置 API
管理应用配置和游戏设置。

**相关端点：**
- `GET /api/v1/config` - 获取配置
- `PUT /api/v1/config` - 更新配置
- `POST /api/v1/config/reset` - 重置配置

### 4. WebSocket API
提供实时通信能力，用于状态更新、日志推送等。

**连接地址：**
- `ws://localhost:8888/ws`

## 快速开始

### 获取启动器状态

```bash
curl -X GET http://localhost:8888/api/v1/launcher/status
```

响应示例：
```json
{
  "success": true,
  "data": {
    "status": "idle",
    "version": "1.0.0",
    "uptime": 3600,
    "instances": 2
  },
  "message": "获取状态成功",
  "timestamp": "2025-07-02T10:30:00Z"
}
```

### 创建游戏实例

```bash
curl -X POST http://localhost:8888/api/v1/instances \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的游戏实例",
    "game_path": "C:/MaiDX/",
    "config": {
      "resolution": "1920x1080",
      "fullscreen": true
    }
  }'
```

### WebSocket 连接示例

```javascript
const ws = new WebSocket('ws://localhost:8888/ws');

ws.onopen = function() {
    console.log('WebSocket 连接已建立');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('收到消息:', data);
};

ws.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};
```

## 错误处理

### 常见错误码

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| `INSTANCE_NOT_FOUND` | 实例不存在 | 检查实例 ID 是否正确 |
| `GAME_ALREADY_RUNNING` | 游戏已在运行 | 先停止当前游戏实例 |
| `INVALID_CONFIG` | 配置无效 | 检查配置格式和必需字段 |
| `PERMISSION_DENIED` | 权限不足 | 以管理员身份运行启动器 |
| `FILE_NOT_FOUND` | 文件未找到 | 检查游戏路径是否正确 |

### 错误处理最佳实践

1. **总是检查响应状态**：
```javascript
if (response.success) {
    // 处理成功响应
    console.log(response.data);
} else {
    // 处理错误
    console.error(response.error.message);
}
```

2. **实现重试机制**：
```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * i));
        }
    }
}
```

## 详细文档

更多详细信息请查看各个模块的专门文档：

- [启动器 API](./launcher.md) - 游戏启动和进程管理
- [WebSocket API](./websocket.md) - 实时通信接口
- [配置 API](./config.md) - 配置管理接口

## SDK 和工具

### JavaScript SDK

我们提供了 JavaScript SDK 来简化 API 调用：

```bash
npm install mailauncher-sdk
```

使用示例：
```javascript
import { MaiLauncherClient } from 'mailauncher-sdk';

const client = new MaiLauncherClient('http://localhost:8888');

// 获取实例列表
const instances = await client.instances.list();

// 启动游戏
await client.launcher.start(instanceId);
```

### Postman 集合

我们提供了 Postman 集合文件，包含所有 API 端点的示例请求：

[下载 Postman 集合](./mailauncher-api.postman_collection.json)

## 更新日志

### v1.0.0
- 初始 API 版本
- 基础启动器功能
- 实例管理
- WebSocket 支持

### 即将推出
- API 认证机制
- 更多实例配置选项
- 插件 API 支持
- 批量操作接口

## 🤖 实例管理 API

### 获取实例列表

获取所有 MaiBot 实例的列表及其状态信息。

```http
GET /instances
```

**响应示例**:
```json
{
  "instances": [
    {
      "id": "a2fe529b51999fc2d45df5196c6c50a46a608fa1",
      "name": "maibot-stable-1",
      "status": "running",
      "installedAt": "1747404418536",
      "path": "D:\\MaiBot\\MaiBot-1",
      "port": 8000,
      "version": "0.6.3",
      "services": [
        {
          "name": "napcat",
          "path": "D:\\MaiBot\\MaiBot-1\\napcat",
          "status": "running",
          "port": 8095
        }
      ]
    }
  ],
  "success": true
}
```

### 获取实例统计

```http
GET /instances/stats
```

**响应示例**:
```json
{
  "total": 3,
  "running": 2,
  "stopped": 1,
  "success": true
}
```

### 启动实例

```http
POST /instance/{id}/start
```

### 停止实例

```http
POST /instance/{id}/stop
```

### 重启实例

```http
POST /instance/{id}/restart
```

### 删除实例

```http
DELETE /instance/{id}
```

## 🚀 部署管理 API

### 获取可用版本

```http
GET /deploy/versions
```

### 部署实例

```http
POST /deploy/deploy
```

**请求体**:
```json
{
  "version": "v0.6.3",
  "instanceName": "my-bot-instance",
  "configuration": {
    "enableNapCat": true,
    "enableNoneBotAda": false
  }
}
```

## 📊 系统监控 API

### 系统健康检查

```http
GET /system/health
```

### 系统指标

```http
GET /system/metrics
```

**响应示例**:
```json
{
  "cpu": {
    "usage": 25.5,
    "cores": 8
  },
  "memory": {
    "used": 4096,
    "total": 16384,
    "usage": 25.0
  },
  "instances": {
    "total": 3,
    "running": 2
  }
}
```

## 🎨 资源管理 API

### 表情包管理

```http
GET /maibot/{instanceId}/resources/emojis
POST /maibot/{instanceId}/resources/emojis
DELETE /maibot/{instanceId}/resources/emojis/{emojiId}
```

### 用户信息管理

```http
GET /maibot/{instanceId}/resources/users
GET /maibot/{instanceId}/resources/users/{userId}
```

## ⚙️ 配置管理 API

### Bot 配置

```http
GET /maibot/{instanceId}/config/bot
PUT /maibot/{instanceId}/config/bot
```

### 环境变量管理

```http
GET /maibot/{instanceId}/config/env
PUT /maibot/{instanceId}/config/env
```

## 🔌 WebSocket 接口

### 通用 WebSocket

```
ws://localhost:23456/api/v1/ws/{sessionId}
```

### 部署日志 WebSocket

```
ws://localhost:23456/api/v1/deploy/logs/{deploymentId}
```

### 实例日志 WebSocket

```
ws://localhost:23456/api/v1/instance/{instanceId}/logs
```

**消息格式**:
```json
{
  "type": "log",
  "timestamp": "2024-12-30T10:00:00Z",
  "level": "INFO",
  "message": "Bot started successfully",
  "source": "maibot"
}
```

## ❌ 错误处理

API 使用标准的 HTTP 状态码：

- `200 OK` - 请求成功
- `400 Bad Request` - 请求参数错误
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器内部错误

**错误响应格式**:
```json
{
  "success": false,
  "error": {
    "code": "INSTANCE_NOT_FOUND",
    "message": "指定的实例不存在"
  }
}
```

## 📝 示例代码

### JavaScript

```javascript
// 获取实例列表
async function getInstances() {
  const response = await fetch('http://localhost:23456/api/v1/instances');
  const data = await response.json();
  return data.instances;
}

// 启动实例
async function startInstance(instanceId) {
  const response = await fetch(`http://localhost:23456/api/v1/instance/${instanceId}/start`, {
    method: 'POST'
  });
  return await response.json();
}
```

### Python

```python
import requests

# 获取实例列表
def get_instances():
    response = requests.get('http://localhost:23456/api/v1/instances')
    return response.json()

# 启动实例
def start_instance(instance_id):
    response = requests.post(f'http://localhost:23456/api/v1/instance/{instance_id}/start')
    return response.json()
```

更多详细信息请参考后端项目中的 `backend_api.md` 文件。
