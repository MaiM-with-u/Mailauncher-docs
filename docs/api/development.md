# API 开发指南

本文档介绍如何为 MaiLauncher 后端开发新的 API 端点，以及前端如何调用这些 API。

## 📖 目录

- [后端 API 开发指南](#后端-api-开发指南)
- [前端调用指南](#前端调用指南)
- [最佳实践](#最佳实践)
- [测试指南](#测试指南)

## 🔧 后端 API 开发指南

### 项目结构

MaiLauncher 后端采用 FastAPI 框架，项目结构如下：

```
mailauncher-backend/
├── main.py                    # 主应用入口
├── src/
│   ├── modules/               # API 模块
│   │   ├── instance_api.py    # 实例管理 API
│   │   ├── deploy_api.py      # 部署管理 API
│   │   ├── system.py          # 系统监控 API
│   │   ├── maibot_api.py      # MaiBot 资源 API
│   │   └── messages_api.py    # 消息管理 API
│   └── utils/                 # 工具类
│       ├── database.py        # 数据库操作
│       ├── logger.py          # 日志管理
│       └── server.py          # 服务器配置
```

### 创建新的 API 模块

#### 1. 创建模块文件

在 `src/modules/` 目录下创建新的 API 模块文件：

```python
# src/modules/your_new_api.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging

# 创建路由器
router = APIRouter(prefix="/api/v1", tags=["your-feature"])
logger = logging.getLogger(__name__)

# 定义数据模型
class YourRequestModel(BaseModel):
    name: str
    description: Optional[str] = None
    enabled: bool = True

class YourResponseModel(BaseModel):
    id: str
    name: str
    description: Optional[str]
    enabled: bool
    created_at: str

# API 端点实现
@router.get("/your-endpoint", response_model=List[YourResponseModel])
async def get_your_data():
    """
    获取数据列表
    
    Returns:
        List[YourResponseModel]: 数据列表
    """
    try:
        # 业务逻辑实现
        data = []  # 从数据库或其他数据源获取数据
        
        return {
            "status": "success",
            "data": data,
            "message": "获取数据成功"
        }
    except Exception as e:
        logger.error(f"获取数据失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取数据失败: {str(e)}")

@router.post("/your-endpoint")
async def create_your_data(request: YourRequestModel):
    """
    创建新数据
    
    Args:
        request: 请求数据
        
    Returns:
        dict: 创建结果
    """
    try:
        # 验证输入数据
        if not request.name.strip():
            raise HTTPException(status_code=400, detail="名称不能为空")
        
        # 业务逻辑实现
        new_id = "generated_id"  # 实际实现中生成唯一ID
        
        return {
            "status": "success",
            "data": {"id": new_id},
            "message": "创建成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"创建数据失败: {e}")
        raise HTTPException(status_code=500, detail=f"创建数据失败: {str(e)}")

@router.put("/your-endpoint/{item_id}")
async def update_your_data(item_id: str, request: YourRequestModel):
    """
    更新数据
    
    Args:
        item_id: 数据ID
        request: 更新数据
        
    Returns:
        dict: 更新结果
    """
    try:
        # 检查数据是否存在
        exists = True  # 实际实现中检查数据库
        if not exists:
            raise HTTPException(status_code=404, detail=f"数据 {item_id} 不存在")
        
        # 业务逻辑实现
        
        return {
            "status": "success",
            "message": "更新成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"更新数据失败: {e}")
        raise HTTPException(status_code=500, detail=f"更新数据失败: {str(e)}")

@router.delete("/your-endpoint/{item_id}")
async def delete_your_data(item_id: str):
    """
    删除数据
    
    Args:
        item_id: 数据ID
        
    Returns:
        dict: 删除结果
    """
    try:
        # 检查数据是否存在
        exists = True  # 实际实现中检查数据库
        if not exists:
            raise HTTPException(status_code=404, detail=f"数据 {item_id} 不存在")
        
        # 业务逻辑实现
        
        return {
            "status": "success",
            "message": "删除成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除数据失败: {e}")
        raise HTTPException(status_code=500, detail=f"删除数据失败: {str(e)}")
```

#### 2. 注册路由

在 `main.py` 中注册新的路由：

```python
# main.py
from fastapi import FastAPI
from src.modules import your_new_api

app = FastAPI(
    title="MaiLauncher API",
    description="MaiLauncher 后端 API",
    version="1.0.0"
)

# 注册路由
app.include_router(your_new_api.router)

# 其他已有路由...
```

### 数据库操作

#### 使用数据库工具类

```python
# 在你的 API 模块中
from src.utils.database import DatabaseManager

async def get_data_from_db(instance_id: str):
    """从数据库获取数据"""
    try:
        db_manager = DatabaseManager(instance_id)
        
        # 执行查询
        query = "SELECT * FROM your_table WHERE enabled = ?"
        results = db_manager.execute_query(query, (True,))
        
        return results
    except Exception as e:
        logger.error(f"数据库查询失败: {e}")
        raise

async def insert_data_to_db(instance_id: str, data: dict):
    """向数据库插入数据"""
    try:
        db_manager = DatabaseManager(instance_id)
        
        # 执行插入
        query = """
        INSERT INTO your_table (name, description, enabled, created_at)
        VALUES (?, ?, ?, ?)
        """
        values = (data['name'], data['description'], data['enabled'], data['created_at'])
        
        db_manager.execute_update(query, values)
        
        return True
    except Exception as e:
        logger.error(f"数据库插入失败: {e}")
        raise
```

### 错误处理

#### 统一错误处理

```python
from fastapi import HTTPException
from enum import Enum

class ErrorCode(Enum):
    INSTANCE_NOT_FOUND = "INSTANCE_NOT_FOUND"
    INVALID_PARAMETER = "INVALID_PARAMETER"
    DATABASE_ERROR = "DATABASE_ERROR"
    PERMISSION_DENIED = "PERMISSION_DENIED"

def handle_api_error(error_code: ErrorCode, message: str, status_code: int = 400):
    """统一错误处理"""
    raise HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "error": {
                "code": error_code.value,
                "message": message
            }
        }
    )

# 使用示例
@router.get("/example/{instance_id}")
async def example_endpoint(instance_id: str):
    try:
        # 验证实例是否存在
        if not instance_exists(instance_id):
            handle_api_error(
                ErrorCode.INSTANCE_NOT_FOUND,
                f"实例 {instance_id} 不存在",
                404
            )
        
        # 业务逻辑...
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"API 执行失败: {e}")
        handle_api_error(
            ErrorCode.DATABASE_ERROR,
            "服务器内部错误",
            500
        )
```

### 日志记录

#### 使用日志工具

```python
from src.utils.logger import setup_logger

# 在模块顶部设置日志
logger = setup_logger(__name__)

@router.post("/example")
async def example_endpoint(request: ExampleRequest):
    logger.info(f"收到请求: {request.dict()}")
    
    try:
        # 业务逻辑
        result = process_request(request)
        
        logger.info(f"请求处理成功: {result}")
        return result
        
    except Exception as e:
        logger.error(f"请求处理失败: {e}", exc_info=True)
        raise
```

### 数据验证

#### 使用 Pydantic 模型

```python
from pydantic import BaseModel, validator, Field
from typing import Optional, List
from enum import Enum

class StatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"
    pending = "pending"

class CreateInstanceRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="实例名称")
    path: str = Field(..., description="安装路径")
    port: int = Field(..., ge=1024, le=65535, description="端口号")
    status: StatusEnum = Field(default=StatusEnum.pending, description="状态")
    services: Optional[List[str]] = Field(default=[], description="服务列表")
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('名称不能为空')
        return v.strip()
    
    @validator('path')
    def validate_path(cls, v):
        # 验证路径格式
        if not v or len(v.strip()) == 0:
            raise ValueError('路径不能为空')
        return v.strip()
    
    @validator('port')
    def validate_port(cls, v):
        # 检查端口是否被占用
        if is_port_in_use(v):
            raise ValueError(f'端口 {v} 已被占用')
        return v

class InstanceResponse(BaseModel):
    id: str
    name: str
    path: str
    port: int
    status: StatusEnum
    services: List[str]
    created_at: str
    updated_at: Optional[str] = None
```

## 🌐 前端调用指南

### API 客户端封装

#### 创建 API 客户端类

```javascript
// src/api/client.js
class MaiLauncherClient {
    constructor(baseUrl = 'http://localhost:23456') {
        this.baseUrl = baseUrl;
        this.timeout = 30000; // 30秒超时
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/api/v1${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API 请求失败 [${endpoint}]:`, error);
            throw error;
        }
    }

    // GET 请求
    async get(endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${endpoint}?${query}` : endpoint;
        return await this.request(url, { method: 'GET' });
    }

    // POST 请求
    async post(endpoint, data = {}) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT 请求
    async put(endpoint, data = {}) {
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE 请求
    async delete(endpoint) {
        return await this.request(endpoint, { method: 'DELETE' });
    }
}

// 创建全局实例
export const apiClient = new MaiLauncherClient();
```

#### 创建具体的 API 服务

```javascript
// src/api/instances.js
import { apiClient } from './client.js';

export class InstancesAPI {
    // 获取实例列表
    static async getInstances() {
        return await apiClient.get('/instances');
    }

    // 获取实例统计
    static async getInstanceStats() {
        return await apiClient.get('/instances/stats');
    }

    // 启动实例
    static async startInstance(instanceId) {
        return await apiClient.get(`/instance/${instanceId}/start`);
    }

    // 停止实例
    static async stopInstance(instanceId) {
        return await apiClient.get(`/instance/${instanceId}/stop`);
    }

    // 重启实例
    static async restartInstance(instanceId) {
        return await apiClient.get(`/instance/${instanceId}/restart`);
    }

    // 删除实例
    static async deleteInstance(instanceId) {
        return await apiClient.delete(`/instance/${instanceId}/delete`);
    }

    // 部署新实例
    static async deployInstance(config) {
        return await apiClient.post('/deploy/deploy', config);
    }

    // 添加现有实例
    static async addExistingInstance(config) {
        return await apiClient.post('/instances/add', config);
    }

    // 检查安装状态
    static async getInstallStatus(instanceId) {
        return await apiClient.get(`/install-status/${instanceId}`);
    }
}
```

```javascript
// src/api/system.js
import { apiClient } from './client.js';

export class SystemAPI {
    // 系统健康检查
    static async getHealth() {
        return await apiClient.get('/system/health');
    }

    // 获取系统指标
    static async getMetrics() {
        return await apiClient.get('/system/metrics');
    }
}
```

```javascript
// src/api/resources.js
import { apiClient } from './client.js';

export class ResourcesAPI {
    // 表情包管理
    static async createEmoji(instanceId, emojiData) {
        return await apiClient.post(`/resource/${instanceId}/emoji`, emojiData);
    }

    static async getEmoji(instanceId, emojiId) {
        return await apiClient.get(`/resource/${instanceId}/emoji/${emojiId}`);
    }

    static async searchEmojis(instanceId, searchParams) {
        return await apiClient.post(`/resource/${instanceId}/emoji/search`, searchParams);
    }

    static async updateEmoji(instanceId, emojiId, updateData) {
        return await apiClient.put(`/resource/${instanceId}/emoji/${emojiId}`, updateData);
    }

    static async deleteEmoji(instanceId, emojiId) {
        return await apiClient.delete(`/resource/${instanceId}/emoji/${emojiId}`);
    }

    // 用户信息管理
    static async createPerson(instanceId, personData) {
        return await apiClient.post(`/resource/${instanceId}/person`, personData);
    }

    static async getPerson(instanceId, personId) {
        return await apiClient.get(`/resource/${instanceId}/person/${personId}`);
    }

    static async searchPersons(instanceId, searchParams) {
        return await apiClient.post(`/resource/${instanceId}/person/search`, searchParams);
    }

    static async updatePerson(instanceId, personId, updateData) {
        return await apiClient.put(`/resource/${instanceId}/person/${personId}`, updateData);
    }

    static async deletePerson(instanceId, personId) {
        return await apiClient.delete(`/resource/${instanceId}/person/${personId}`);
    }
}
```

### Vue.js 组合式 API 示例

#### 创建组合函数

```javascript
// src/composables/useInstances.js
import { ref, reactive } from 'vue';
import { InstancesAPI } from '@/api/instances.js';

export function useInstances() {
    const instances = ref([]);
    const stats = ref({});
    const loading = ref(false);
    const error = ref(null);

    // 获取实例列表
    const fetchInstances = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await InstancesAPI.getInstances();
            if (response.success) {
                instances.value = response.instances || [];
            } else {
                throw new Error(response.error?.message || '获取实例列表失败');
            }
        } catch (err) {
            error.value = err.message;
            console.error('获取实例列表失败:', err);
        } finally {
            loading.value = false;
        }
    };

    // 获取实例统计
    const fetchStats = async () => {
        try {
            const response = await InstancesAPI.getInstanceStats();
            stats.value = response;
        } catch (err) {
            console.error('获取实例统计失败:', err);
        }
    };

    // 启动实例
    const startInstance = async (instanceId) => {
        try {
            const response = await InstancesAPI.startInstance(instanceId);
            if (response.success) {
                // 更新本地状态
                const instance = instances.value.find(i => i.id === instanceId);
                if (instance) {
                    instance.status = 'running';
                }
                return true;
            } else {
                throw new Error(response.error?.message || '启动实例失败');
            }
        } catch (err) {
            error.value = err.message;
            console.error('启动实例失败:', err);
            return false;
        }
    };

    // 停止实例
    const stopInstance = async (instanceId) => {
        try {
            const response = await InstancesAPI.stopInstance(instanceId);
            if (response.success) {
                // 更新本地状态
                const instance = instances.value.find(i => i.id === instanceId);
                if (instance) {
                    instance.status = 'stopped';
                }
                return true;
            } else {
                throw new Error(response.error?.message || '停止实例失败');
            }
        } catch (err) {
            error.value = err.message;
            console.error('停止实例失败:', err);
            return false;
        }
    };

    // 部署新实例
    const deployInstance = async (config) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await InstancesAPI.deployInstance(config);
            if (response.success) {
                // 刷新实例列表
                await fetchInstances();
                return response.instance_id;
            } else {
                throw new Error(response.error?.message || '部署实例失败');
            }
        } catch (err) {
            error.value = err.message;
            console.error('部署实例失败:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        instances,
        stats,
        loading,
        error,
        fetchInstances,
        fetchStats,
        startInstance,
        stopInstance,
        deployInstance
    };
}
```

#### 在组件中使用

```vue
<!-- src/components/InstanceList.vue -->
<template>
  <div class="instance-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">
      错误: {{ error }}
      <button @click="fetchInstances">重试</button>
    </div>

    <!-- 实例列表 -->
    <div v-if="!loading && !error" class="instances">
      <div
        v-for="instance in instances"
        :key="instance.id"
        class="instance-card"
      >
        <h3>{{ instance.name }}</h3>
        <p>状态: {{ instance.status }}</p>
        <p>端口: {{ instance.port }}</p>
        
        <div class="actions">
          <button
            v-if="instance.status === 'stopped'"
            @click="handleStart(instance.id)"
            :disabled="actionLoading"
          >
            启动
          </button>
          
          <button
            v-if="instance.status === 'running'"
            @click="handleStop(instance.id)"
            :disabled="actionLoading"
          >
            停止
          </button>
          
          <button
            @click="handleRestart(instance.id)"
            :disabled="actionLoading"
          >
            重启
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useInstances } from '@/composables/useInstances.js';

const {
  instances,
  loading,
  error,
  fetchInstances,
  startInstance,
  stopInstance
} = useInstances();

const actionLoading = ref(false);

// 处理启动实例
const handleStart = async (instanceId) => {
  actionLoading.value = true;
  const success = await startInstance(instanceId);
  if (success) {
    console.log('实例启动成功');
  }
  actionLoading.value = false;
};

// 处理停止实例
const handleStop = async (instanceId) => {
  actionLoading.value = true;
  const success = await stopInstance(instanceId);
  if (success) {
    console.log('实例停止成功');
  }
  actionLoading.value = false;
};

// 处理重启实例
const handleRestart = async (instanceId) => {
  actionLoading.value = true;
  await stopInstance(instanceId);
  await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
  await startInstance(instanceId);
  actionLoading.value = false;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchInstances();
});
</script>

<style scoped>
.instance-list {
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #e74c3c;
}

.instances {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.instance-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
}

.actions {
  margin-top: 12px;
}

.actions button {
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.actions button:hover:not(:disabled) {
  background: #0056b3;
}
</style>
```

### WebSocket 客户端

#### WebSocket 封装

```javascript
// src/api/websocket.js
export class WebSocketClient {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.url = `ws://localhost:23456/ws/${sessionId}`;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.callbacks = {
            open: [],
            message: [],
            close: [],
            error: []
        };
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);
            
            this.ws.onopen = (event) => {
                console.log('WebSocket 连接已建立');
                this.reconnectAttempts = 0;
                this.callbacks.open.forEach(callback => callback(event));
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.callbacks.message.forEach(callback => callback(data));
                } catch (error) {
                    console.error('解析 WebSocket 消息失败:', error);
                }
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket 连接已关闭');
                this.callbacks.close.forEach(callback => callback(event));
                
                // 自动重连
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                        this.connect();
                    }, this.reconnectDelay * this.reconnectAttempts);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket 错误:', error);
                this.callbacks.error.forEach(callback => callback(error));
            };
        } catch (error) {
            console.error('WebSocket 连接失败:', error);
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket 未连接，无法发送消息');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    // 事件监听器
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }
}
```

#### 在 Vue 组件中使用 WebSocket

```vue
<!-- src/components/Terminal.vue -->
<template>
  <div class="terminal">
    <div class="terminal-header">
      <h3>终端 - {{ sessionId }}</h3>
      <button @click="toggleConnection">
        {{ connected ? '断开' : '连接' }}
      </button>
    </div>
    
    <div
      ref="terminalOutput"
      class="terminal-output"
      v-html="formattedOutput"
    ></div>
    
    <div class="terminal-input">
      <input
        v-model="command"
        @keyup.enter="sendCommand"
        placeholder="输入命令..."
        :disabled="!connected"
      />
      <button @click="sendCommand" :disabled="!connected">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { WebSocketClient } from '@/api/websocket.js';

const props = defineProps({
  sessionId: {
    type: String,
    required: true
  }
});

const wsClient = ref(null);
const connected = ref(false);
const output = ref([]);
const command = ref('');
const terminalOutput = ref(null);

// 格式化输出
const formattedOutput = computed(() => {
  return output.value
    .map(line => `<div>${escapeHtml(line)}</div>`)
    .join('');
});

// HTML 转义
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// 连接 WebSocket
const connect = () => {
  wsClient.value = new WebSocketClient(props.sessionId);
  
  wsClient.value.on('open', () => {
    connected.value = true;
    addOutput('>>> 终端连接已建立');
  });
  
  wsClient.value.on('message', (data) => {
    handleMessage(data);
  });
  
  wsClient.value.on('close', () => {
    connected.value = false;
    addOutput('>>> 终端连接已断开');
  });
  
  wsClient.value.on('error', (error) => {
    addOutput(`>>> 连接错误: ${error.message}`);
  });
  
  wsClient.value.connect();
};

// 断开连接
const disconnect = () => {
  if (wsClient.value) {
    wsClient.value.close();
    wsClient.value = null;
  }
};

// 切换连接状态
const toggleConnection = () => {
  if (connected.value) {
    disconnect();
  } else {
    connect();
  }
};

// 处理 WebSocket 消息
const handleMessage = (data) => {
  switch (data.type) {
    case 'output':
      addOutput(data.data);
      break;
    case 'status':
      addOutput(`>>> ${data.message}`);
      break;
    case 'error':
      addOutput(`>>> 错误: ${data.message}`);
      break;
    case 'pong':
      // 心跳响应，不需要显示
      break;
    default:
      console.log('未知消息类型:', data);
  }
};

// 添加输出
const addOutput = (text) => {
  output.value.push(text);
  
  // 自动滚动到底部
  nextTick(() => {
    if (terminalOutput.value) {
      terminalOutput.value.scrollTop = terminalOutput.value.scrollHeight;
    }
  });
};

// 发送命令
const sendCommand = () => {
  if (!command.value.trim() || !connected.value) return;
  
  // 显示输入的命令
  addOutput(`$ ${command.value}`);
  
  // 发送到后端
  wsClient.value.send({
    type: 'input',
    data: command.value + '\n'
  });
  
  // 清空输入
  command.value = '';
};

// 组件挂载时自动连接
onMounted(() => {
  connect();
});

// 组件卸载时断开连接
onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
.terminal {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #000;
  color: #fff;
  font-family: 'Courier New', monospace;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #333;
  border-bottom: 1px solid #555;
}

.terminal-header h3 {
  margin: 0;
  color: #fff;
}

.terminal-header button {
  padding: 4px 8px;
  border: none;
  border-radius: 2px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.terminal-output {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.4;
}

.terminal-input {
  display: flex;
  padding: 8px;
  background: #222;
  border-top: 1px solid #555;
}

.terminal-input input {
  flex: 1;
  padding: 6px;
  margin-right: 8px;
  border: 1px solid #555;
  border-radius: 2px;
  background: #333;
  color: #fff;
  font-family: inherit;
}

.terminal-input button {
  padding: 6px 12px;
  border: none;
  border-radius: 2px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.terminal-input button:disabled {
  background: #555;
  cursor: not-allowed;
}
</style>
```

## 📋 最佳实践

### 后端开发最佳实践

1. **API 设计原则**
   - 遵循 RESTful 设计规范
   - 使用统一的响应格式
   - 合理使用 HTTP 状态码
   - 提供详细的错误信息

2. **代码组织**
   - 按功能模块组织代码
   - 使用清晰的命名规范
   - 编写完整的文档字符串
   - 实现适当的错误处理

3. **性能优化**
   - 使用数据库连接池
   - 实现适当的缓存策略
   - 避免 N+1 查询问题
   - 使用异步处理长时间操作

4. **安全考虑**
   - 验证所有输入数据
   - 使用参数化查询防止 SQL 注入
   - 实现适当的访问控制
   - 记录敏感操作日志

### 前端开发最佳实践

1. **API 调用**
   - 封装统一的 HTTP 客户端
   - 实现错误处理和重试机制
   - 使用 TypeScript 提供类型安全
   - 实现 Loading 状态管理

2. **状态管理**
   - 使用组合式 API 管理状态
   - 实现响应式数据更新
   - 避免不必要的 API 调用
   - 使用缓存提高性能

3. **用户体验**
   - 提供清晰的错误信息
   - 实现加载状态指示
   - 支持操作取消和重试
   - 保持界面响应性

4. **代码质量**
   - 使用 TypeScript 提供类型检查
   - 编写单元测试和集成测试
   - 使用 ESLint 和 Prettier 保持代码风格
   - 实现适当的错误边界

## 🧪 测试指南

### 后端 API 测试

#### 使用 pytest 进行单元测试

```python
# tests/test_instance_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestInstanceAPI:
    def test_get_instances(self):
        """测试获取实例列表"""
        response = client.get("/api/v1/instances")
        assert response.status_code == 200
        
        data = response.json()
        assert "instances" in data
        assert "success" in data
        assert data["success"] is True

    def test_start_instance_success(self):
        """测试启动实例成功"""
        instance_id = "test_instance_id"
        response = client.get(f"/api/v1/instance/{instance_id}/start")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "已启动" in data["message"]

    def test_start_instance_not_found(self):
        """测试启动不存在的实例"""
        instance_id = "non_existent_instance"
        response = client.get(f"/api/v1/instance/{instance_id}/start")
        
        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False
        assert "不存在" in data["error"]["message"]

    def test_deploy_instance(self):
        """测试部署实例"""
        deploy_config = {
            "instance_name": "test-instance",
            "install_path": "/test/path",
            "port": 8080,
            "version": "latest",
            "install_services": []
        }
        
        response = client.post("/api/v1/deploy/deploy", json=deploy_config)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "instance_id" in data
```

#### 集成测试示例

```python
# tests/test_integration.py
import pytest
import asyncio
from src.utils.database import DatabaseManager

class TestIntegration:
    @pytest.fixture
    async def setup_test_instance(self):
        """设置测试实例"""
        # 创建测试实例
        instance_data = {
            "name": "test-instance",
            "path": "/test/path",
            "port": 8080
        }
        
        # 部署实例
        response = client.post("/api/v1/deploy/deploy", json=instance_data)
        instance_id = response.json()["instance_id"]
        
        yield instance_id
        
        # 清理测试实例
        client.delete(f"/api/v1/instance/{instance_id}/delete")

    async def test_instance_lifecycle(self, setup_test_instance):
        """测试实例生命周期"""
        instance_id = setup_test_instance
        
        # 启动实例
        response = client.get(f"/api/v1/instance/{instance_id}/start")
        assert response.status_code == 200
        
        # 检查状态
        response = client.get("/api/v1/instances")
        instances = response.json()["instances"]
        test_instance = next(i for i in instances if i["id"] == instance_id)
        assert test_instance["status"] == "running"
        
        # 停止实例
        response = client.get(f"/api/v1/instance/{instance_id}/stop")
        assert response.status_code == 200
        
        # 再次检查状态
        response = client.get("/api/v1/instances")
        instances = response.json()["instances"]
        test_instance = next(i for i in instances if i["id"] == instance_id)
        assert test_instance["status"] == "stopped"
```

### 前端测试

#### 使用 Vitest 进行单元测试

```javascript
// tests/api/instances.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstancesAPI } from '@/api/instances.js';

// Mock fetch
global.fetch = vi.fn();

describe('InstancesAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('应该获取实例列表', async () => {
        const mockResponse = {
            success: true,
            instances: [
                {
                    id: 'test-id',
                    name: 'test-instance',
                    status: 'running'
                }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const result = await InstancesAPI.getInstances();
        
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:23456/api/v1/instances',
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('应该启动实例', async () => {
        const instanceId = 'test-id';
        const mockResponse = {
            success: true,
            message: '实例 test-instance 已启动'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const result = await InstancesAPI.startInstance(instanceId);
        
        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:23456/api/v1/instance/${instanceId}/start`,
            expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
    });

    it('应该处理 API 错误', async () => {
        fetch.mockRejectedValueOnce(new Error('网络错误'));

        await expect(InstancesAPI.getInstances()).rejects.toThrow('网络错误');
    });
});
```

#### 组件测试示例

```javascript
// tests/components/InstanceList.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import InstanceList from '@/components/InstanceList.vue';
import { InstancesAPI } from '@/api/instances.js';

// Mock API
vi.mock('@/api/instances.js', () => ({
    InstancesAPI: {
        getInstances: vi.fn(),
        startInstance: vi.fn(),
        stopInstance: vi.fn()
    }
}));

describe('InstanceList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('应该渲染实例列表', async () => {
        const mockInstances = [
            {
                id: 'test-id-1',
                name: 'test-instance-1',
                status: 'running',
                port: 8080
            },
            {
                id: 'test-id-2',
                name: 'test-instance-2',
                status: 'stopped',
                port: 8081
            }
        ];

        InstancesAPI.getInstances.mockResolvedValueOnce({
            success: true,
            instances: mockInstances
        });

        const wrapper = mount(InstanceList);
        
        // 等待异步操作完成
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 0));

        // 检查是否渲染了实例卡片
        const instanceCards = wrapper.findAll('.instance-card');
        expect(instanceCards).toHaveLength(2);
        
        // 检查实例信息
        expect(wrapper.text()).toContain('test-instance-1');
        expect(wrapper.text()).toContain('test-instance-2');
        expect(wrapper.text()).toContain('running');
        expect(wrapper.text()).toContain('stopped');
    });

    it('应该处理启动实例操作', async () => {
        const mockInstances = [
            {
                id: 'test-id',
                name: 'test-instance',
                status: 'stopped',
                port: 8080
            }
        ];

        InstancesAPI.getInstances.mockResolvedValueOnce({
            success: true,
            instances: mockInstances
        });

        InstancesAPI.startInstance.mockResolvedValueOnce({
            success: true,
            message: '实例已启动'
        });

        const wrapper = mount(InstanceList);
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 0));

        // 点击启动按钮
        const startButton = wrapper.find('button:contains("启动")');
        await startButton.trigger('click');

        // 验证 API 调用
        expect(InstancesAPI.startInstance).toHaveBeenCalledWith('test-id');
    });

    it('应该显示加载状态', () => {
        InstancesAPI.getInstances.mockImplementationOnce(
            () => new Promise(() => {}) // 永不resolve，保持loading状态
        );

        const wrapper = mount(InstanceList);
        
        expect(wrapper.find('.loading').exists()).toBe(true);
        expect(wrapper.text()).toContain('加载中');
    });

    it('应该显示错误信息', async () => {
        InstancesAPI.getInstances.mockRejectedValueOnce(
            new Error('获取实例列表失败')
        );

        const wrapper = mount(InstanceList);
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.find('.error').exists()).toBe(true);
        expect(wrapper.text()).toContain('获取实例列表失败');
    });
});
```

这个开发指南提供了完整的后端API开发和前端调用的指导，包括：

1. **后端开发**：API模块创建、数据库操作、错误处理、数据验证等
2. **前端调用**：API客户端封装、Vue组合式API使用、WebSocket集成等
3. **最佳实践**：代码组织、性能优化、安全考虑、用户体验等
4. **测试指南**：单元测试、集成测试、组件测试等

开发者可以按照这个指南来扩展MaiLauncher的功能。
