# MaiLauncher API 参考文档

MaiLauncher 后端提供了完整的 RESTful API 和 WebSocket 接口，用于管理 MaiBot 实例和系统资源。

## 📋 概述

MaiLauncher API 提供了全面的接口来管理 MaiBot 实例、部署管理、系统监控和资源管理。本文档描述了所有已实现的 API 端点及其使用方法。

### 基础信息

- **Base URL**: `http://localhost:23456/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: JSON
- **认证方式**: 暂无（本地应用）

### 端点结构

所有 API 端点都遵循 RESTful 设计原则：

```
GET    /api/v1/instances               # 获取实例列表
GET    /api/v1/instances/stats         # 获取实例统计
GET    /api/v1/instance/{id}/start     # 启动实例
GET    /api/v1/instance/{id}/stop      # 停止实例
GET    /api/v1/instance/{id}/restart   # 重启实例
DELETE /api/v1/instance/{id}/delete    # 删除实例
GET    /api/v1/system/health           # 系统健康检查
GET    /api/v1/system/metrics          # 系统性能指标
POST   /api/v1/deploy/deploy           # 部署新实例
POST   /api/v1/instances/add           # 添加现有实例
WS     /ws/{session_id}                # WebSocket 连接
```

### 响应格式

所有 API 响应都采用统一的格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
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
  }
}
```

## 📖 文档导航

- **[API 参考文档](#-api-参考文档)**（本页）- 已实现的所有 API 端点
- **[API 开发指南](./development.md)** - 如何开发新的 API 和前端调用方法

## 主要 API 模块

### 🤖 实例管理 API
管理 MaiBot 实例的创建、启动、停止和删除。

**相关端点：**
- `GET /api/v1/instances` - 获取实例列表
- `GET /api/v1/instances/stats` - 获取实例统计
- `GET /api/v1/instance/{id}/start` - 启动实例
- `GET /api/v1/instance/{id}/stop` - 停止实例
- `GET /api/v1/instance/{id}/restart` - 重启实例
- `DELETE /api/v1/instance/{id}/delete` - 删除实例
- `GET /api/v1/start/{id}/napcat` - 启动 NapCat 服务
- `GET /api/v1/start/{id}/nonebot` - 启动 NoneBot-ada 服务

### 🚀 部署管理 API
管理实例的部署和添加。

**相关端点：**
- `GET /api/v1/deploy/versions` - 获取可用版本
- `GET /api/v1/deploy/services` - 获取可部署服务列表
- `POST /api/v1/deploy/deploy` - 部署新实例
- `POST /api/v1/instances/add` - 添加现有实例
- `GET /api/v1/install-status/{instanceId}` - 检查安装状态

### 📊 系统监控 API
监控系统状态和性能指标。

**相关端点：**
- `GET /api/v1/system/health` - 系统健康检查
- `GET /api/v1/system/metrics` - 系统性能指标

### 🎨 资源管理 API
管理 MaiBot 实例的数据资源，包括表情包和用户信息。

**相关端点：**
- `POST /api/v1/resource/{instance_id}/emoji` - 创建表情包
- `GET /api/v1/resource/{instance_id}/emoji/{emoji_id}` - 获取表情包
- `POST /api/v1/resource/{instance_id}/emoji/search` - 搜索表情包
- `POST /api/v1/resource/{instance_id}/person` - 创建用户信息
- `GET /api/v1/resource/{instance_id}/person/{person_id}` - 获取用户信息

### ⚙️ 配置管理 API
管理实例配置文件和环境变量。

**相关端点：**
- `GET /api/v1/resources/{instance_id}/config/get` - 获取 Bot 配置
- `POST /api/v1/resources/{instance_id}/config/update` - 更新 Bot 配置
- `GET /api/v1/resources/{instance_id}/lpmm/get` - 获取 LPMM 配置
- `POST /api/v1/resources/{instance_id}/lpmm/update` - 更新 LPMM 配置
- `GET /api/v1/resources/{instance_id}/env/get` - 获取环境变量
- `POST /api/v1/resources/{instance_id}/env/update` - 更新环境变量

### 🔌 WebSocket API
提供实时终端交互能力。

**连接地址：**
- `ws://localhost:23456/ws/{session_id}`

## 快速开始

### 获取实例列表

```bash
curl -X GET http://localhost:23456/api/v1/instances
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
          "status": "running",
          "port": 8095
        }
      ]
    }
  ],
  "success": true
}
```

### 启动实例

```bash
curl -X GET http://localhost:23456/api/v1/instance/{instance_id}/start
```

### WebSocket 连接

```javascript
const ws = new WebSocket('ws://localhost:23456/ws/abc123_main');

ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log('终端输出:', message.data);
};

// 发送命令
ws.send(JSON.stringify({
    type: 'input',
    data: 'echo "Hello World"\n'
}));
```

## ❌ 错误处理

### 常见错误码

| 错误码 | 描述 | HTTP状态码 |
|--------|------|-----------|
| `INSTANCE_NOT_FOUND` | 实例不存在 | 404 |
| `INSTANCE_ALREADY_RUNNING` | 实例已在运行 | 400 |
| `INVALID_CONFIG` | 配置无效 | 400 |
| `PERMISSION_DENIED` | 权限不足 | 403 |
| `FILE_NOT_FOUND` | 文件未找到 | 404 |
| `SERVICE_START_FAILED` | 服务启动失败 | 500 |

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "INSTANCE_NOT_FOUND",
    "message": "指定的实例不存在"
  }
}
```

## 详细文档

更多详细信息请查看各个模块的专门文档：

- [API 开发指南](./development.md) - 后端API开发和前端调用指南
- [实例管理 API](./instances.md) - 实例创建、启动、停止管理
- [部署 API](./deploy.md) - 实例部署和安装管理
- [资源管理 API](./resources.md) - 表情包和用户信息管理
- [配置管理 API](./config.md) - 配置文件和环境变量管理
- [WebSocket API](./websocket.md) - 实时终端通信接口

## 🚀 快速调用示例

### JavaScript

```javascript
// 获取实例列表
const response = await fetch('http://localhost:23456/api/v1/instances');
const data = await response.json();

// 启动实例
const result = await fetch('http://localhost:23456/api/v1/instance/abc123/start');
```

### Python

```python
import requests

# 获取实例列表
response = requests.get('http://localhost:23456/api/v1/instances')
data = response.json()

# 启动实例
result = requests.get('http://localhost:23456/api/v1/instance/abc123/start')
```

## 🌟 API 版本信息

### 当前版本: v1.0.0

**已实现功能：**
- ✅ 完整的实例管理 API
- ✅ 部署和安装管理
- ✅ 资源管理（表情包、用户信息）
- ✅ 配置管理（Bot配置、LPMM配置、环境变量）
- ✅ WebSocket 终端交互支持
- ✅ 系统监控和健康检查

**计划功能：**
- 🔄 API 认证机制
- 🔄 更多实例配置选项
- 🔄 插件 API 支持
## � 完整 API 参考

以下是所有已实现的 API 端点的详细说明：

## 🤖 实例管理 API

### 获取实例列表

获取所有 MaiBot 实例的列表及其状态信息。

```http
GET /api/v1/instances
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
        },
        {
          "name": "nonebot-ada",
          "path": "D:\\MaiBot\\MaiBot-1\\nonebot-ada",
          "status": "stopped",
          "port": 18002
        }
      ]
    }
  ],
  "success": true
}
```

### 获取实例统计

```http
GET /api/v1/instances/stats
```

**响应示例**:
```json
{
  "total": 3,
  "running": 2,
  "stopped": 1
}
```

### 启动实例

```http
GET /api/v1/instance/{id}/start
```

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 已启动"
}
```

### 停止实例

```http
GET /api/v1/instance/{id}/stop
```

### 重启实例

```http
GET /api/v1/instance/{id}/restart
```

### 删除实例

```http
DELETE /api/v1/instance/{id}/delete
```

### 启动服务

启动 NapCat 服务：
```http
GET /api/v1/start/{id}/napcat
```

启动 NoneBot-ada 服务：
```http
GET /api/v1/start/{id}/nonebot
```

## 🚀 部署管理 API

### 获取可用版本

```http
GET /api/v1/deploy/versions
```

**响应示例**:
```json
{
  "versions": ["latest", "main", "v0.6.3", "v0.6.2", "v0.6.1"]
}
```

### 获取可部署服务

```http
GET /api/v1/deploy/services
```

**响应示例**:
```json
{
  "services": [
    {
      "name": "napcat",
      "description": "NapCat 服务"
    },
    {
      "name": "nonebot-ada",
      "description": "NoneBot-ada 服务"
    },
    {
      "name": "nonebot",
      "description": "NoneBot 服务"
    }
  ]
}
```

### 部署实例

```http
POST /api/v1/deploy/deploy
```

**请求体**:
```json
{
  "instance_name": "maibot-instance-1",
  "install_services": [
    {
      "name": "napcat",
      "path": "D:\\MaiBot\\MaiBot-1\\napcat",
      "port": 8095,
      "run_cmd": "python main.py"
    }
  ],
  "install_path": "D:\\MaiBot\\MaiBot-1",
  "port": 8000,
  "version": "latest"
}
```

### 添加现有实例

```http
POST /api/v1/instances/add
```

**请求体**:
```json
{
  "instance_name": "maibot-existing-1",
  "install_services": [
    {
      "name": "napcat",
      "path": "D:\\MaiBot\\MaiBot-existing\\napcat",
      "port": 8095,
      "run_cmd": "python main.py"
    }
  ],
  "install_path": "D:\\MaiBot\\MaiBot-existing",
  "port": 8000,
  "version": "0.6.3"
}
```

### 检查安装状态

```http
GET /api/v1/install-status/{instanceId}
```

**响应示例**:
```json
{
  "status": "installing",
  "progress": 50,
  "message": "正在安装依赖...",
  "services_install_status": [
    {
      "name": "napcat",
      "status": "installing",
      "progress": 50,
      "message": "正在安装 NapCat"
    }
  ]
}
```

## 📊 系统监控 API

### 系统健康检查

```http
GET /api/v1/system/health
```

**响应示例**:
```json
{
  "status": "success",
  "time": "2023-10-15T12:00:00Z"
}
```

### 系统指标

```http
GET /api/v1/system/metrics
```

**响应示例**:
```json
{
  "status": "success",
  "data": {
    "system_info": {
      "system": "Windows",
      "release": "11",
      "version": "10.0.26100",
      "machine": "AMD64",
      "processor": "Intel(R) Core(TM) i9-14900HX"
    },
    "python_version": "3.12.4",
    "cpu_usage_percent": 18.8,
    "memory_usage": {
      "total_mb": 32386.52,
      "available_mb": 10222.87,
      "percent": 68.4,
      "used_mb": 22163.65,
      "free_mb": 10222.87
    },
    "disk_usage_root": {
      "total_gb": 726.17,
      "used_gb": 506.15,
      "free_gb": 220.02,
      "percent": 69.7
    }
  }
}
```

## 🎨 资源管理 API

### 表情包管理

**创建表情包**:
```http
POST /api/v1/resource/{instance_id}/emoji
```

**获取表情包**:
```http
GET /api/v1/resource/{instance_id}/emoji/{emoji_id}
```

**搜索表情包**:
```http
POST /api/v1/resource/{instance_id}/emoji/search
```

**更新表情包**:
```http
PUT /api/v1/resource/{instance_id}/emoji/{emoji_id}
```

**删除表情包**:
```http
DELETE /api/v1/resource/{instance_id}/emoji/{emoji_id}
```

### 用户信息管理

**创建用户信息**:
```http
POST /api/v1/resource/{instance_id}/person
```

**获取用户信息**:
```http
GET /api/v1/resource/{instance_id}/person/{person_id}
```

**搜索用户信息**:
```http
POST /api/v1/resource/{instance_id}/person/search
```

**更新用户信息**:
```http
PUT /api/v1/resource/{instance_id}/person/{person_id}
```

## ⚙️ 配置管理 API

### Bot 配置

```http
GET /api/v1/resources/{instance_id}/config/get
POST /api/v1/resources/{instance_id}/config/update
```

### LPMM 配置

```http
GET /api/v1/resources/{instance_id}/lpmm/get
POST /api/v1/resources/{instance_id}/lpmm/update
```

### 环境变量管理

```http
GET /api/v1/resources/{instance_id}/env/get
POST /api/v1/resources/{instance_id}/env/update
```

## 🔌 WebSocket 接口

### 连接地址

```
ws://localhost:23456/ws/{session_id}
```

其中 `session_id` 格式为：`{instance_id}_{type}`
- `type` 可选值：`main`, `napcat`, `nonebot`

### 消息格式

**客户端发送**:
```json
{
  "type": "input",
  "data": "ls -la\n"
}
```

**服务端返回**:
```json
{
  "type": "output",
  "data": "terminal output..."
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

## 📝 简单示例

### 获取实例列表 (JavaScript)

```javascript
async function getInstances() {
  const response = await fetch('http://localhost:23456/api/v1/instances');
  const data = await response.json();
  return data.instances;
}
```

### 启动实例 (Python)

```python
import requests

def start_instance(instance_id):
    response = requests.get(f'http://localhost:23456/api/v1/instance/{instance_id}/start')
    return response.json()
```

---

> **提示**: 如需了解如何开发新的 API 或更详细的前端集成方法，请查看 [API 开发指南](./development.md)。

> **参考**: 完整的后端 API 实现细节请参考后端项目中的 `backend_api.md` 文件。
