# API 参考文档

本文档详细说明了 MaiLauncher 后端提供的所有 API 端点。

## 📋 目录

- [基础信息](#基础信息)
- [实例管理 API](#实例管理-api)
- [部署管理 API](#部署管理-api)
- [系统监控 API](#系统监控-api)
- [资源管理 API](#资源管理-api)
- [配置管理 API](#配置管理-api)
- [WebSocket 接口](#websocket-接口)
- [错误代码参考](#错误代码参考)

## 基础信息

### 服务器信息
- **Base URL**: `http://localhost:23456/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: JSON
- **认证方式**: 暂无（本地应用）

### 通用响应格式

成功响应：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

错误响应：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 实例管理 API

### 获取实例列表

**GET** `/instances`

获取所有 Bot 实例的列表。

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

**GET** `/instances/stats`

获取实例统计数据，如总数、运行中的数量等。

**响应示例**:
```json
{
  "total": 3,
  "running": 2,
  "stopped": 1
}
```

### 启动实例

**GET** `/instance/{id}/start`

启动指定的实例。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 已启动"
}
```

### 停止实例

**GET** `/instance/{id}/stop`

停止指定的实例。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 已停止"
}
```

### 重启实例

**GET** `/instance/{id}/restart`

重启指定的实例。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 已重启"
}
```

### 删除实例

**DELETE** `/instance/{id}/delete`

删除指定的实例。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 已删除"
}
```

### 启动 NapCat 服务

**GET** `/start/{id}/napcat`

为指定实例启动 NapCat 服务。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 的NapCat服务已启动"
}
```

### 启动 NoneBot 服务

**GET** `/start/{id}/nonebot`

为指定实例启动 NoneBot 服务。

**路径参数**:
- `id` (string): 实例ID

**响应示例**:
```json
{
  "success": true,
  "message": "实例 maibot-stable-1 的NoneBot服务已启动"
}
```

### 添加现有实例

**POST** `/instances/add`

添加现有的实例到管理系统中。

**请求体**:
```json
{
  "name": "existing-instance",
  "path": "/path/to/existing/instance",
  "port": 8080
}
```

**响应示例**:
```json
{
  "success": true,
  "instance_id": "new_generated_id",
  "message": "实例已成功添加"
}
```

## 部署管理 API

### 获取可用版本

**GET** `/deploy/versions`

获取可用于部署的版本列表。

**响应示例**:
```json
{
  "versions": ["latest", "main", "v0.6.3", "v0.6.2", "v0.6.1"]
}
```

### 获取可部署服务

**GET** `/deploy/services`

获取可以部署的服务列表。

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
      "description": "NoneBot Ada 服务"
    }
  ]
}
```

### 部署新实例

**POST** `/deploy/deploy`

部署一个新的 MaiBot 实例。

**请求体**:
```json
{
  "instance_name": "new-instance",
  "install_path": "/path/to/install",
  "port": 8080,
  "version": "latest",
  "install_services": ["napcat", "nonebot-ada"],
  "auto_start": true
}
```

**响应示例**:
```json
{
  "success": true,
  "instance_id": "generated_instance_id",
  "message": "部署已开始"
}
```

### 获取安装状态

**GET** `/install-status/{instance_id}`

获取实例的安装状态。

**路径参数**:
- `instance_id` (string): 实例ID

**响应示例**:
```json
{
  "status": "installing",
  "progress": 75,
  "current_step": "Installing NapCat service",
  "logs": ["Step 1 completed", "Step 2 in progress"]
}
```

## 系统监控 API

### 系统健康检查

**GET** `/system/health`

检查系统健康状态。

**响应示例**:
```json
{
  "status": "healthy",
  "uptime": 86400,
  "version": "1.0.0",
  "timestamp": "2025-07-05T10:30:00Z"
}
```

### 系统性能指标

**GET** `/system/metrics`

获取系统性能指标。

**响应示例**:
```json
{
  "cpu": {
    "usage": 25.5,
    "cores": 8
  },
  "memory": {
    "total": 16777216,
    "used": 8388608,
    "free": 8388608,
    "usage_percent": 50.0
  },
  "disk": {
    "total": 1000000000,
    "used": 500000000,
    "free": 500000000,
    "usage_percent": 50.0
  },
  "network": {
    "bytes_sent": 1048576,
    "bytes_recv": 2097152
  }
}
```

## 资源管理 API

### Emoji 表情包管理

#### 创建表情包

**POST** `/resource/{instance_id}/emoji`

为指定实例创建新的表情包。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "name": "happy",
  "description": "开心的表情",
  "image_data": "base64_encoded_image_data",
  "tags": ["emotion", "happy"],
  "category": "emotions"
}
```

**响应示例**:
```json
{
  "success": true,
  "emoji_id": "generated_emoji_id",
  "message": "表情包已创建"
}
```

#### 获取表情包

**GET** `/resource/{instance_id}/emoji/{emoji_id}`

获取指定的表情包信息。

**路径参数**:
- `instance_id` (string): 实例ID
- `emoji_id` (string): 表情包ID

**响应示例**:
```json
{
  "id": "emoji_id",
  "name": "happy",
  "description": "开心的表情",
  "image_url": "/static/emojis/happy.png",
  "tags": ["emotion", "happy"],
  "category": "emotions",
  "created_at": "2025-07-05T10:30:00Z"
}
```

#### 搜索表情包

**POST** `/resource/{instance_id}/emoji/search`

搜索表情包。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "query": "happy",
  "tags": ["emotion"],
  "category": "emotions",
  "limit": 20,
  "offset": 0
}
```

**响应示例**:
```json
{
  "emojis": [
    {
      "id": "emoji_id",
      "name": "happy",
      "description": "开心的表情",
      "image_url": "/static/emojis/happy.png",
      "tags": ["emotion", "happy"],
      "category": "emotions"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### 更新表情包

**PUT** `/resource/{instance_id}/emoji/{emoji_id}`

更新表情包信息。

**路径参数**:
- `instance_id` (string): 实例ID
- `emoji_id` (string): 表情包ID

**请求体**:
```json
{
  "name": "super_happy",
  "description": "超级开心的表情",
  "tags": ["emotion", "happy", "super"],
  "category": "emotions"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "表情包已更新"
}
```

#### 删除表情包

**DELETE** `/resource/{instance_id}/emoji/{emoji_id}`

删除指定的表情包。

**路径参数**:
- `instance_id` (string): 实例ID
- `emoji_id` (string): 表情包ID

**响应示例**:
```json
{
  "success": true,
  "message": "表情包已删除"
}
```

### 用户信息管理

#### 创建用户信息

**POST** `/resource/{instance_id}/person`

创建新的用户信息。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "user_id": "12345",
  "username": "testuser",
  "nickname": "测试用户",
  "avatar_url": "https://example.com/avatar.jpg",
  "profile": {
    "age": 25,
    "location": "北京",
    "bio": "这是一个测试用户"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "person_id": "generated_person_id",
  "message": "用户信息已创建"
}
```

#### 获取用户信息

**GET** `/resource/{instance_id}/person/{person_id}`

获取指定的用户信息。

**路径参数**:
- `instance_id` (string): 实例ID
- `person_id` (string): 用户信息ID

**响应示例**:
```json
{
  "id": "person_id",
  "user_id": "12345",
  "username": "testuser",
  "nickname": "测试用户",
  "avatar_url": "https://example.com/avatar.jpg",
  "profile": {
    "age": 25,
    "location": "北京",
    "bio": "这是一个测试用户"
  },
  "created_at": "2025-07-05T10:30:00Z",
  "updated_at": "2025-07-05T10:30:00Z"
}
```

#### 搜索用户信息

**POST** `/resource/{instance_id}/person/search`

搜索用户信息。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "query": "test",
  "user_id": "12345",
  "username": "testuser",
  "limit": 20,
  "offset": 0
}
```

**响应示例**:
```json
{
  "persons": [
    {
      "id": "person_id",
      "user_id": "12345",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar_url": "https://example.com/avatar.jpg"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### 更新用户信息

**PUT** `/resource/{instance_id}/person/{person_id}`

更新用户信息。

**路径参数**:
- `instance_id` (string): 实例ID
- `person_id` (string): 用户信息ID

**请求体**:
```json
{
  "nickname": "新测试用户",
  "profile": {
    "age": 26,
    "location": "上海",
    "bio": "这是一个更新的测试用户"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户信息已更新"
}
```

#### 删除用户信息

**DELETE** `/resource/{instance_id}/person/{person_id}`

删除指定的用户信息。

**路径参数**:
- `instance_id` (string): 实例ID
- `person_id` (string): 用户信息ID

**响应示例**:
```json
{
  "success": true,
  "message": "用户信息已删除"
}
```

## 配置管理 API

### Bot 配置管理

#### 获取 Bot 配置

**GET** `/config/{instance_id}/bot`

获取指定实例的 Bot 配置。

**路径参数**:
- `instance_id` (string): 实例ID

**响应示例**:
```json
{
  "config": {
    "name": "MaiBot",
    "version": "1.0.0",
    "debug": false,
    "plugins": ["plugin1", "plugin2"],
    "database": {
      "url": "sqlite:///maibot.db"
    },
    "api": {
      "host": "0.0.0.0",
      "port": 8080
    }
  }
}
```

#### 更新 Bot 配置

**PUT** `/config/{instance_id}/bot`

更新指定实例的 Bot 配置。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "debug": true,
  "plugins": ["plugin1", "plugin2", "plugin3"],
  "api": {
    "host": "127.0.0.1",
    "port": 8081
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Bot 配置已更新"
}
```

### LPMM 配置管理

#### 获取 LPMM 配置

**GET** `/config/{instance_id}/lpmm`

获取指定实例的 LPMM 配置。

**路径参数**:
- `instance_id` (string): 实例ID

**响应示例**:
```json
{
  "config": {
    "enabled": true,
    "server": "lpmm.server.com",
    "port": 443,
    "ssl": true,
    "auth": {
      "username": "user",
      "token": "encrypted_token"
    }
  }
}
```

#### 更新 LPMM 配置

**PUT** `/config/{instance_id}/lpmm`

更新指定实例的 LPMM 配置。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "enabled": false,
  "server": "new.lpmm.server.com",
  "port": 8443
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "LPMM 配置已更新"
}
```

### 环境变量管理

#### 获取环境变量

**GET** `/config/{instance_id}/env`

获取指定实例的环境变量。

**路径参数**:
- `instance_id` (string): 实例ID

**响应示例**:
```json
{
  "variables": {
    "DEBUG": "false",
    "DATABASE_URL": "sqlite:///maibot.db",
    "API_KEY": "your_api_key"
  }
}
```

#### 更新环境变量

**PUT** `/config/{instance_id}/env`

更新指定实例的环境变量。

**路径参数**:
- `instance_id` (string): 实例ID

**请求体**:
```json
{
  "DEBUG": "true",
  "NEW_VARIABLE": "new_value"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "环境变量已更新"
}
```

## WebSocket 接口

### 连接终端

**WebSocket** `/ws/{session_id}`

连接到指定的终端会话。

**路径参数**:
- `session_id` (string): 会话ID，格式为 `{instance_id}_{terminal_type}`

**支持的终端类型**:
- `main`: 主终端
- `napcat`: NapCat 服务终端
- `nonebot`: NoneBot 服务终端

### 发送命令

向终端发送命令：

```json
{
  "type": "input",
  "data": "ls -la\n"
}
```

### 接收消息

#### 终端输出

```json
{
  "type": "output",
  "data": "total 8\ndrwxr-xr-x 3 user user 4096 Jan  1 12:00 .\n"
}
```

#### 状态信息

```json
{
  "type": "status",
  "message": "已连接到 main 终端"
}
```

#### 历史日志

```json
{
  "type": "history_logs",
  "logs": [
    {
      "timestamp": 1672531200000,
      "data": "Command executed successfully\n"
    }
  ],
  "session_id": "abc123_main"
}
```

#### 错误信息

```json
{
  "type": "error",
  "message": "未找到实例 'invalid_id'"
}
```

#### 心跳响应

```json
{
  "type": "pong"
}
```

### 使用示例

```javascript
// 连接到实例 abc123 的主终端
const ws = new WebSocket('ws://localhost:23456/ws/abc123_main');

ws.onopen = function() {
    console.log('WebSocket 连接已建立');
    
    // 发送命令
    ws.send(JSON.stringify({
        type: 'input',
        data: 'echo "Hello World"\n'
    }));
};

ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    
    if (message.type === 'output') {
        console.log('终端输出:', message.data);
    } else if (message.type === 'status') {
        console.log('状态:', message.message);
    }
};

ws.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};

ws.onclose = function() {
    console.log('WebSocket 连接已关闭');
};
```

## 错误代码参考

### 通用错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `INSTANCE_NOT_FOUND` | 404 | 实例不存在 |
| `INVALID_PARAMETER` | 400 | 参数无效 |
| `DATABASE_ERROR` | 500 | 数据库错误 |
| `PERMISSION_DENIED` | 403 | 权限不足 |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 |
| `INTERNAL_ERROR` | 500 | 内部服务器错误 |

### 实例管理错误

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `INSTANCE_ALREADY_RUNNING` | 409 | 实例已在运行 |
| `INSTANCE_NOT_RUNNING` | 409 | 实例未运行 |
| `PORT_IN_USE` | 409 | 端口已被占用 |
| `INVALID_PATH` | 400 | 路径无效 |

### 部署管理错误

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `VERSION_NOT_FOUND` | 404 | 版本不存在 |
| `DEPLOYMENT_FAILED` | 500 | 部署失败 |
| `INSUFFICIENT_SPACE` | 400 | 磁盘空间不足 |
| `DOWNLOAD_FAILED` | 500 | 下载失败 |

### 资源管理错误

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `INVALID_IMAGE_FORMAT` | 400 | 图片格式无效 |
| `FILE_TOO_LARGE` | 400 | 文件过大 |
| `DUPLICATE_RESOURCE` | 409 | 资源已存在 |

### WebSocket 错误

| 错误代码 | 描述 |
|---------|------|
| `INVALID_SESSION` | 会话ID无效 |
| `CONNECTION_FAILED` | 连接失败 |
| `TERMINAL_NOT_FOUND` | 终端不存在 |
| `COMMAND_FAILED` | 命令执行失败 |
