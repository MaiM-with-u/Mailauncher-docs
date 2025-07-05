# 贡献指南

欢迎参与 MaiLauncher 项目的开发！本指南将帮助您了解如何为项目做出贡献。

## 📋 目录

- [参与方式](#参与方式)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [问题报告](#问题报告)
- [文档贡献](#文档贡献)
- [社区准则](#社区准则)

## 🤝 参与方式

您可以通过以下方式为 MaiLauncher 项目做出贡献：

### 代码贡献
- 修复 Bug
- 添加新功能
- 性能优化
- 代码重构

### 文档贡献
- 改进现有文档
- 编写教程
- 翻译文档
- API 文档完善

### 测试贡献
- 编写单元测试
- 集成测试
- 用户测试
- 性能测试

### 社区贡献
- 回答问题
- 代码审查
- 功能建议
- Bug 报告

## 🛠️ 开发环境设置

### 1. 前置要求

- **Git**: 版本控制
- **Python 3.8+**: 后端开发
- **Node.js 16+**: 前端开发
- **VSCode**: 推荐 IDE（可选）

### 2. 克隆项目

```bash
# 1. Fork 项目到您的 GitHub 账户
# 2. 克隆您的 fork
git clone https://github.com/YOUR-USERNAME/mailauncher.git
cd mailauncher
# 3. 克隆后端项目
git clone https://github.com/YOUR-USERNAME/mailauncher-backend.git
```

### 3. 设置开发环境

#### 后端环境

```bash
cd mailauncher-backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装开发依赖
pip install -r requirements-dev.txt

```

#### 前端环境

```bash
cd mailauncher

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 4. VSCode 配置

#### 推荐扩展

创建 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.flake8",
    "ms-python.mypy-type-checker",
    "vue.volar",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

#### 工作区设置

创建 `.vscode/settings.json`：

```json
{
  "python.defaultInterpreterPath": "./mailauncher-backend/venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.linting.mypyEnabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "vue.volar"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📝 代码规范

### Python 代码规范

#### 1. 代码风格

我们使用 **Black** 进行代码格式化，遵循 **PEP 8** 规范：

```python
# 好的示例
class InstanceManager:
    """实例管理器类"""
    
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url
        self.instances: Dict[str, Instance] = {}
    
    async def start_instance(self, instance_id: str) -> Dict[str, Any]:
        """启动指定实例"""
        if instance_id not in self.instances:
            raise ValueError(f"Instance {instance_id} not found")
        
        instance = self.instances[instance_id]
        await instance.start()
        
        return {
            "success": True,
            "message": f"Instance {instance.name} started successfully"
        }

# 坏的示例
class instancemanager:
    def __init__(self,database_url):
        self.database_url=database_url
        self.instances={}
    def start_instance(self,instance_id):
        if instance_id not in self.instances:raise ValueError("not found")
        instance=self.instances[instance_id]
        instance.start()
        return {"success":True}
```

#### 2. 类型提示

所有函数都应该包含类型提示：

```python
from typing import Dict, List, Optional, Union

async def get_instances(
    filter_status: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Union[List[Dict], int, bool]]:
    """获取实例列表"""
    # 实现代码
    pass
```

#### 3. 文档字符串

使用 Google 风格的文档字符串：

```python
def deploy_instance(config: DeployConfig) -> str:
    """部署新实例
    
    Args:
        config: 部署配置对象，包含实例名称、路径等信息
        
    Returns:
        新创建实例的 ID
        
    Raises:
        ValueError: 当配置无效时
        RuntimeError: 当部署失败时
        
    Example:
        >>> config = DeployConfig(name="test", path="/tmp")
        >>> instance_id = deploy_instance(config)
        >>> print(f"Instance created: {instance_id}")
    """
    pass
```

#### 4. 错误处理

```python
# 好的示例
async def start_instance(instance_id: str) -> Dict[str, Any]:
    """启动实例"""
    try:
        instance = await self.get_instance(instance_id)
        if not instance:
            raise HTTPException(
                status_code=404,
                detail=f"Instance {instance_id} not found"
            )
        
        await instance.start()
        logger.info(f"Instance {instance_id} started successfully")
        
        return {
            "success": True,
            "message": f"Instance {instance.name} started"
        }
        
    except InstanceNotRunningError as e:
        logger.warning(f"Instance {instance_id} already running: {e}")
        return {
            "success": False,
            "error": "Instance already running"
        }
    except Exception as e:
        logger.error(f"Failed to start instance {instance_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

# 坏的示例
def start_instance(instance_id):
    try:
        instance = self.get_instance(instance_id)
        instance.start()
        return {"success": True}
    except:
        return {"success": False}
```

### JavaScript/Vue 代码规范

#### 1. 代码风格

使用 **Prettier** 和 **ESLint** 进行代码格式化：

```javascript
// 好的示例
export class ApiService {
  constructor(baseURL = 'http://localhost:23456/api/v1') {
    this.baseURL = baseURL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
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
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed [${endpoint}]:`, error);
      throw error;
    }
  }
}

// 坏的示例
export class ApiService{
constructor(baseURL){
this.baseURL=baseURL||'http://localhost:23456/api/v1'
}
async request(endpoint,options){
const url=this.baseURL+endpoint
try{
const response=await fetch(url,options)
return response.json()
}catch(error){
throw error
}
}
}
```

#### 2. Vue 组件规范

```vue
<!-- 好的示例 -->
<template>
  <div class="instance-card bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ instance.name }}
      </h3>
      <span 
        class="px-2 py-1 rounded-full text-sm font-medium"
        :class="statusClasses"
      >
        {{ instance.status }}
      </span>
    </div>
    
    <div class="space-y-2 text-sm text-gray-600">
      <p><span class="font-medium">路径:</span> {{ instance.path }}</p>
      <p><span class="font-medium">端口:</span> {{ instance.port }}</p>
      <p><span class="font-medium">版本:</span> {{ instance.version }}</p>
    </div>
    
    <div class="flex gap-2 mt-4">
      <button
        v-if="instance.status === 'stopped'"
        class="btn btn-primary btn-sm"
        :disabled="loading"
        @click="handleStart"
      >
        {{ loading ? '启动中...' : '启动' }}
      </button>
      
      <button
        v-if="instance.status === 'running'"
        class="btn btn-secondary btn-sm"
        :disabled="loading"
        @click="handleStop"
      >
        {{ loading ? '停止中...' : '停止' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInstancesStore } from '@/stores/instances';

// Props
const props = defineProps({
  instance: {
    type: Object,
    required: true
  }
});

// Store
const instancesStore = useInstancesStore();

// State
const loading = ref(false);

// Computed
const statusClasses = computed(() => ({
  'bg-green-100 text-green-800': props.instance.status === 'running',
  'bg-red-100 text-red-800': props.instance.status === 'stopped',
  'bg-yellow-100 text-yellow-800': props.instance.status === 'starting'
}));

// Methods
const handleStart = async () => {
  loading.value = true;
  try {
    await instancesStore.startInstance(props.instance.id);
  } catch (error) {
    console.error('Failed to start instance:', error);
  } finally {
    loading.value = false;
  }
};

const handleStop = async () => {
  loading.value = true;
  try {
    await instancesStore.stopInstance(props.instance.id);
  } catch (error) {
    console.error('Failed to stop instance:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.instance-card {
  transition: all 0.2s ease-in-out;
}

.instance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
```

## 📤 提交规范

### 1. 提交消息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### 类型 (Type)

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 作用域 (Scope)

- `backend`: 后端相关
- `frontend`: 前端相关
- `api`: API 相关
- `ui`: 用户界面
- `docs`: 文档
- `deploy`: 部署相关

#### 示例

```bash
# 好的提交消息
feat(backend): 添加实例批量操作 API

添加了批量启动、停止和重启实例的 API 端点：
- POST /api/v1/instances/batch/start
- POST /api/v1/instances/batch/stop  
- POST /api/v1/instances/batch/restart

每个端点都支持并发处理和错误处理。

Closes #123

fix(frontend): 修复实例状态显示不更新的问题

当实例状态改变时，UI 没有及时更新。
现在通过 WebSocket 监听状态变化并实时更新 UI。

docs: 更新 API 文档中的身份验证说明

chore(deps): 升级 Vue 到 3.3.0

# 坏的提交消息
update stuff
fix bug
add feature
various changes
```

### 2. 分支命名规范

```bash
# 功能分支
feature/add-batch-operations
feature/improve-ui-performance

# Bug 修复分支
fix/instance-status-update
fix/memory-leak-websocket

# 文档分支
docs/update-api-reference
docs/add-deployment-guide

# 重构分支
refactor/simplify-api-client
refactor/extract-common-components
```

## 🔄 Pull Request 流程

### 1. 创建分支

```bash
# 更新主分支
git checkout main
git pull upstream main

# 创建新分支
git checkout -b feature/your-feature-name
```

### 2. 开发和测试

```bash
# 开发您的功能
# ... 编写代码 ...

# 运行测试
cd mailauncher-backend
pytest

cd ../mailauncher
pnpm test

# 代码格式化
black .
pnpm format

# 提交更改
git add .
git commit -m "feat(backend): add new feature"
```

### 3. 提交 Pull Request

#### PR 标题格式

```
<type>(<scope>): <description>
```

#### PR 描述模板

```markdown
## 🎯 目标

简要描述此 PR 的目标和解决的问题。

## 📝 更改内容

- [ ] 添加新功能 X
- [ ] 修复 Bug Y
- [ ] 更新文档 Z
- [ ] 添加测试用例

## 🧪 测试

### 测试步骤

1. 启动开发环境
2. 访问功能页面
3. 验证功能正常工作

### 测试结果

- [ ] 所有单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试通过
- [ ] 性能测试通过

## 📸 截图（如适用）

在这里添加相关截图

## 🔗 相关 Issue

Closes #123
Related to #456

## ✅ 检查清单

- [ ] 代码遵循项目规范
- [ ] 已添加必要的测试
- [ ] 已更新相关文档
- [ ] 已测试在不同环境下的兼容性
- [ ] PR 描述清晰明确
```

### 4. 代码审查

#### 审查者检查清单

- **功能性**
  - [ ] 功能按预期工作
  - [ ] 边界情况处理正确
  - [ ] 错误处理适当

- **代码质量**
  - [ ] 代码清晰易懂
  - [ ] 遵循项目规范
  - [ ] 没有重复代码

- **测试**
  - [ ] 有充分的测试覆盖
  - [ ] 测试用例有意义
  - [ ] 测试可以可靠地运行

- **文档**
  - [ ] 代码有适当的注释
  - [ ] API 文档已更新
  - [ ] 用户文档已更新

#### 回应审查意见

```bash
# 根据审查意见修改代码
# ... 修改代码 ...

# 提交更改
git add .
git commit -m "fix: address review comments"

# 推送更新
git push origin feature/your-feature-name
```

## 🐛 问题报告

### 1. Bug 报告模板

```markdown
## 🐛 Bug 描述

简要描述遇到的问题。

## 📋 重现步骤

1. 访问 '...'
2. 点击 '....'
3. 向下滚动到 '....'
4. 看到错误

## 🎯 期望行为

描述您期望发生的行为。

## 📸 截图

如果适用，请添加截图来帮助解释您的问题。

## 🖥️ 环境信息

- 操作系统: [例如 Windows 11]
- 浏览器: [例如 Chrome 91]
- MaiLauncher 版本: [例如 1.0.0]

## 📋 附加信息

添加关于问题的任何其他上下文。

## 📝 日志

```
粘贴相关的日志输出
```
```

### 2. 功能请求模板

```markdown
## 🚀 功能描述

简要描述您希望看到的功能。

## 🎯 解决的问题

这个功能解决了什么问题？

## 💡 建议的解决方案

描述您希望如何实现这个功能。

## 🔄 替代方案

描述您考虑过的任何替代解决方案或功能。

## 📋 附加信息

添加关于功能请求的任何其他上下文或截图。
```

## 📚 文档贡献

### 1. 文档类型

- **API 文档**: 接口说明和示例
- **用户指南**: 使用教程和说明
- **开发文档**: 架构和开发指南
- **部署文档**: 安装和部署说明

### 2. 文档标准

#### Markdown 格式

```markdown
# 一级标题

## 二级标题

### 三级标题

#### 代码示例

```python
def example_function():
    """示例函数"""
    return "Hello, World!"
```

#### 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |

#### 注意事项

> **注意**: 这是一个重要的注意事项。

> **警告**: 这是一个警告信息。

> **提示**: 这是一个有用的提示。
```

#### 代码注释

```python
# 好的注释
def calculate_response_time(start_time: float, end_time: float) -> float:
    """计算响应时间
    
    计算从请求开始到响应结束的时间差。
    
    Args:
        start_time: 请求开始时间（Unix 时间戳）
        end_time: 响应结束时间（Unix 时间戳）
        
    Returns:
        响应时间（毫秒）
        
    Example:
        >>> start = time.time()
        >>> time.sleep(0.1)
        >>> end = time.time()
        >>> response_time = calculate_response_time(start, end)
        >>> print(f"Response time: {response_time}ms")
    """
    return (end_time - start_time) * 1000

# 坏的注释
def calc_time(start, end):  # 计算时间
    return (end - start) * 1000  # 返回毫秒
```

### 3. 文档审查

- 内容准确性
- 语法和拼写
- 格式一致性
- 示例代码可运行
- 链接有效性

## 🌟 社区准则

### 1. 行为准则

我们致力于为每个人提供一个友好、安全和受欢迎的环境，无论：

- 性别、性别认同和表达
- 性取向
- 残疾
- 个人外貌
- 体型
- 种族
- 年龄
- 宗教
- 国籍

### 2. 预期行为

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表现出同理心

### 3. 不可接受的行为

- 使用性化的语言或图像
- 恶意评论、侮辱/贬损评论，以及人身或政治攻击
- 公开或私下骚扰
- 未经明确许可，发布他人的私人信息
- 在专业环境中可能被认为不适当的其他行为

### 4. 报告问题

如果您遇到或目睹不可接受的行为，请通过以下方式联系我们：

- 发送邮件到：[community@mailauncher.org]
- 创建私有 Issue
- 联系维护者

## 🎉 致谢

感谢所有为 MaiLauncher 项目做出贡献的开发者！

### 贡献者类型

- 🐛 Bug 修复
- 📝 文档
- 💡 想法和规划
- 🤔 答疑
- ⚠️ 测试
- 🔧 工具
- 🌍 翻译
- 📦 打包
- 💵 财务支持

### 认可方式

- 贡献者列表
- 发布说明致谢
- 社区聚光灯
- 贡献徽章

---

再次感谢您对 MaiLauncher 项目的贡献！您的参与让这个项目变得更好。如果您有任何问题，请随时在 GitHub 上创建 Issue 或联系维护者。
