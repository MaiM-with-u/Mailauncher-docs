# 设置组件库

MaiLauncher 设置组件库提供了一套完整的、模块化的设置界面组件，基于 Vue 3 + DaisyUI 构建，旨在简化设置页面的开发工作。

> 🚀 **在线演示**: [查看完整演示页面](/settings-demo.html)

## 概述

设置组件库采用分层架构设计：

- **基础组件层**：提供通用的设置项组件
- **专用组件层**：针对特定功能的复合组件
- **面板组件层**：预构建的完整设置面板

## 架构设计

```
src/components/settings/
├── index.js                    # 统一导出入口
├── SettingsDemo.vue           # 完整使用演示
├── base/                      # 基础设置组件
│   ├── SettingItem.vue        # 设置项容器
│   ├── SettingGroup.vue       # 设置组容器
│   ├── SettingSwitch.vue      # 开关组件
│   ├── SettingSlider.vue      # 滑块组件
│   ├── SettingSelect.vue      # 下拉选择
│   ├── SettingInput.vue       # 输入框
│   └── SettingRadioGroup.vue  # 单选组
├── forms/                     # 专用表单组件
│   ├── ThemeSelector.vue      # 主题选择器
│   ├── PathSelector.vue       # 路径选择器
│   ├── PortConfig.vue         # 端口配置
│   └── ConnectionTester.vue   # 连接测试
└── panels/                    # 设置面板组件
    └── AppearancePanel.vue    # 外观设置面板
```

## 快速开始

### 安装使用

```javascript
// 导入需要的组件
import {
  SettingGroup,
  SettingSwitch,
  SettingSlider,
  ThemeSelector
} from '@/components/settings'
```

### 基础用法

```vue
<template>
  <SettingGroup title="基础设置" icon="mdi:cog">
    <SettingSwitch
      label="启用功能"
      description="启用或禁用此功能"
      v-model="enabled"
    />
    
    <SettingSlider
      label="数值设置"
      description="调整数值大小"
      :min="0"
      :max="100"
      suffix="%"
      v-model="value"
    />
  </SettingGroup>
</template>

<script setup>
import { ref } from 'vue'
import { SettingGroup, SettingSwitch, SettingSlider } from '@/components/settings'

const enabled = ref(true)
const value = ref(50)
</script>
```

## 基础组件

### SettingItem

设置项的基础容器组件，提供统一的布局结构。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |

#### 使用示例

```vue
<SettingItem label="自定义设置" description="这是一个自定义设置项">
  <!-- 自定义控件内容 -->
  <input type="text" class="input input-bordered" />
</SettingItem>
```

### SettingGroup

设置组容器组件，用于组织相关的设置项。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 组标题 |
| subtitle | String | '' | 组副标题 |
| icon | String | '' | 图标名称（Iconify） |
| iconClass | String | '' | 图标样式类 |

#### Slots

| 插槽 | 说明 |
|------|------|
| header | 自定义组头部内容 |
| default | 设置项内容 |

#### 使用示例

```vue
<SettingGroup 
  title="外观设置" 
  subtitle="自定义界面外观"
  icon="mdi:palette" 
  icon-class="text-purple-500"
>
  <SettingSwitch label="暗色模式" v-model="darkMode" />
  <SettingSlider label="字体大小" v-model="fontSize" />
</SettingGroup>
```

### SettingSwitch

开关设置组件，用于布尔值类型的设置。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | Boolean | false | 绑定值 |
| disabled | Boolean | false | 是否禁用 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: Boolean | 值变化时触发 |
| change | value: Boolean | 值变化时触发 |

#### 使用示例

```vue
<SettingSwitch
  label="启用通知"
  description="接收系统通知消息"
  v-model="notificationEnabled"
  @change="handleNotificationChange"
/>
```

### SettingSlider

滑块设置组件，用于数值范围选择。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | Number\|String | 0 | 绑定值 |
| min | Number | 0 | 最小值 |
| max | Number | 100 | 最大值 |
| step | Number | 1 | 步进值 |
| suffix | String | '' | 后缀文字 |
| prefix | String | '' | 前缀文字 |
| disabled | Boolean | false | 是否禁用 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: Number | 值变化时触发 |
| change | value: Number | 值变化时触发 |

#### 使用示例

```vue
<SettingSlider
  label="音量大小"
  description="调整系统音量"
  :min="0"
  :max="100"
  suffix="%"
  v-model="volume"
/>
```

### SettingSelect

下拉选择设置组件，用于从预定义选项中选择。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | String\|Number | '' | 绑定值 |
| options | Array | - | 选项数组（必填） |
| placeholder | String | '' | 占位符 |
| disabled | Boolean | false | 是否禁用 |

#### Options 格式

```javascript
const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' }
]
```

#### 使用示例

```vue
<SettingSelect
  label="语言设置"
  description="选择界面语言"
  :options="languageOptions"
  v-model="language"
/>
```

### SettingInput

输入框设置组件，支持多种输入类型。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | String\|Number | '' | 绑定值 |
| type | String | 'text' | 输入类型 |
| placeholder | String | '' | 占位符 |
| disabled | Boolean | false | 是否禁用 |
| readonly | Boolean | false | 是否只读 |
| error | String | '' | 错误信息 |
| hint | String | '' | 提示信息 |
| showResetButton | Boolean | false | 显示重置按钮 |
| defaultValue | String\|Number | '' | 默认值 |

#### 支持的输入类型

- `text` - 文本输入
- `number` - 数字输入
- `email` - 邮箱输入
- `url` - URL输入
- `password` - 密码输入
- `tel` - 电话输入

#### 使用示例

```vue
<SettingInput
  label="用户名"
  description="设置登录用户名"
  type="text"
  placeholder="请输入用户名"
  :show-reset-button="true"
  default-value="admin"
  v-model="username"
/>
```

### SettingRadioGroup

单选组设置组件，用于从多个选项中选择一个。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | String\|Number\|Boolean | null | 绑定值 |
| options | Array | - | 选项数组（必填） |
| name | String | '' | 单选组名称 |
| vertical | Boolean | false | 垂直布局 |
| disabled | Boolean | false | 是否禁用 |

#### Options 格式

```javascript
const options = [
  { 
    value: 'option1', 
    label: '选项一', 
    icon: 'mdi:check', // 可选
    disabled: false    // 可选
  }
]
```

#### 使用示例

```vue
<SettingRadioGroup
  label="主题模式"
  description="选择界面主题"
  :options="themeOptions"
  v-model="themeMode"
/>
```

## 专用组件

### ThemeSelector

专用的主题选择器组件，内置常用主题选项。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | 'system' | 当前主题模式 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: String | 主题变化时触发 |
| change | value: String | 主题变化时触发 |

#### 内置选项

- `system` - 跟随系统
- `light` - 亮色模式  
- `dark` - 暗色模式

#### 使用示例

```vue
<ThemeSelector 
  v-model="themeMode" 
  @change="applyTheme" 
/>
```

### PathSelector

路径选择器组件，提供文件夹选择功能。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | String | '' | 路径值 |
| placeholder | String | '请选择路径' | 占位符 |
| dialogTitle | String | '选择文件夹' | 对话框标题 |
| defaultPath | String | '' | 默认路径 |
| readonly | Boolean | false | 是否只读 |
| disabled | Boolean | false | 是否禁用 |
| showResetButton | Boolean | true | 显示重置按钮 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: String | 路径变化时触发 |
| change | value: String | 路径变化时触发 |
| select | value: String | 选择路径时触发 |
| reset | value: String | 重置时触发 |

#### 使用示例

```vue
<PathSelector
  label="安装路径"
  description="选择软件安装位置"
  dialog-title="选择安装目录"
  :default-path="getDefaultInstallPath()"
  v-model="installPath"
  @select="handlePathSelect"
/>
```

### PortConfig

端口配置组件，提供端口设置和连接测试功能。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | - | 设置项标签（必填） |
| description | String | '' | 设置项描述 |
| modelValue | Number\|String | 8080 | 端口号 |
| placeholder | String | '请输入端口号' | 占位符 |
| minPort | Number | 1 | 最小端口号 |
| maxPort | Number | 65535 | 最大端口号 |
| defaultPort | Number | 8080 | 默认端口号 |
| showTestButton | Boolean | false | 显示测试按钮 |
| showResetButton | Boolean | true | 显示重置按钮 |
| showStatus | Boolean | false | 显示状态信息 |
| disabled | Boolean | false | 是否禁用 |
| testUrl | String | '' | 测试URL |
| accessUrls | Array | [] | 访问URL列表 |
| hint | String | '' | 提示信息 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: Number | 端口变化时触发 |
| change | value: Number | 端口变化时触发 |
| test | value: Number | 测试端口时触发 |
| reset | value: Number | 重置时触发 |

#### 使用示例

```vue
<PortConfig
  label="HTTP服务端口"
  description="配置HTTP服务监听端口"
  :default-port="8080"
  :show-test-button="true"
  :show-status="true"
  :access-urls="httpAccessUrls"
  hint="请确保端口未被占用"
  v-model="httpPort"
  @test="testHttpPort"
/>
```

### ConnectionTester

连接测试组件，提供服务连接状态检测功能。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | String | - | 测试URL（必填） |
| autoTest | Boolean | false | 自动测试 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| test | url: String | 开始测试时触发 |
| reconnect | url: String | 重新连接时触发 |
| statusChange | status: Object | 状态变化时触发 |

#### 使用示例

```vue
<ConnectionTester 
  :url="backendUrl"
  :auto-test="true"
  @test="handleConnectionTest"
  @reconnect="handleReconnect"
  @status-change="handleStatusChange"
/>
```

## 预构建面板

### AppearancePanel

完整的外观设置面板，包含主题、字体、布局等设置。

#### 使用示例

```vue
<template>
  <AppearancePanel />
</template>

<script setup>
import { AppearancePanel } from '@/components/settings'
</script>
```

## 样式定制

### 主题变量

所有组件都支持DaisyUI主题系统，可以通过CSS变量自定义样式：

```css
:root {
  --p: 259 94% 51%;   /* 主色调 */
  --s: 314 100% 47%;  /* 次色调 */
  --a: 174 60% 51%;   /* 强调色 */
  --b1: 255 255 255;  /* 背景色1 */
  --b2: 245 245 245;  /* 背景色2 */
  --b3: 229 229 229;  /* 背景色3 */
  --bc: 0 0 0;        /* 文字色 */
}
```

### 自定义样式类

可以通过CSS类进一步自定义组件样式：

```css
/* 自定义设置组样式 */
.custom-setting-group {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
}

/* 自定义开关样式 */
.custom-toggle .toggle-slider {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
}
```

## 响应式设计

所有组件都内置了响应式设计支持：

- **桌面端**：水平布局，完整功能
- **平板端**：自适应布局调整
- **移动端**：垂直布局，简化界面

## 完整示例

### 综合设置页面

下面是一个完整的设置页面示例，展示了如何使用各种组件：

```vue
<template>
  <div class="settings-page">
    <!-- 应用设置 -->
    <SettingGroup title="应用设置" icon="mdi:cog" icon-class="text-blue-500">
      <SettingSwitch
        label="自动启动"
        description="开机时自动启动应用"
        v-model="settings.autoStart"
      />
      
      <SettingSwitch
        label="最小化到托盘"
        description="关闭窗口时最小化到系统托盘"
        v-model="settings.minimizeToTray"
      />
      
      <ThemeSelector v-model="settings.theme" />
    </SettingGroup>

    <!-- 外观设置 -->
    <SettingGroup title="外观设置" icon="mdi:palette" icon-class="text-purple-500">
      <SettingSlider
        label="界面缩放"
        description="调整界面大小"
        :min="80"
        :max="150"
        suffix="%"
        v-model="settings.zoom"
      />
      
      <SettingSelect
        label="语言"
        description="界面显示语言"
        :options="languageOptions"
        v-model="settings.language"
      />
    </SettingGroup>

    <!-- 高级设置 -->
    <SettingGroup title="高级设置" icon="mdi:cog-outline" icon-class="text-orange-500">
      <PathSelector
        label="数据目录"
        description="应用数据存储位置"
        dialog-title="选择数据目录"
        v-model="settings.dataPath"
      />
      
      <PortConfig
        label="服务端口"
        description="后端服务监听端口"
        :min="1000"
        :max="65535"
        v-model="settings.port"
        @test="testConnection"
      />
    </SettingGroup>

    <!-- 操作按钮 -->
    <div class="settings-actions">
      <button class="btn btn-primary" @click="saveSettings">
        <Icon name="mdi:content-save" />
        保存设置
      </button>
      <button class="btn btn-outline" @click="resetSettings">
        <Icon name="mdi:restore" />
        重置为默认
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  SettingGroup,
  SettingSwitch,
  SettingSlider,
  SettingSelect,
  ThemeSelector,
  PathSelector,
  PortConfig
} from '@/components/settings'

// 设置数据
const settings = reactive({
  autoStart: false,
  minimizeToTray: true,
  theme: 'system',
  zoom: 100,
  language: 'zh-CN',
  dataPath: '',
  port: 8080
})

// 语言选项
const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' }
]

// 保存设置
const saveSettings = () => {
  // 保存逻辑
  console.log('保存设置:', settings)
}

// 重置设置
const resetSettings = () => {
  // 重置逻辑
  Object.assign(settings, getDefaultSettings())
}

// 测试连接
const testConnection = async (port) => {
  // 连接测试逻辑
  try {
    const response = await fetch(`http://localhost:${port}/health`)
    return response.ok
  } catch (error) {
    return false
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  space-y: 1.5rem;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--b3));
}

@media (max-width: 640px) {
  .settings-actions {
    flex-direction: column;
  }
}
</style>
```

### 动态配置示例

```vue
<template>
  <SettingGroup title="动态配置">
    <SettingSelect
      label="连接类型"
      :options="connectionTypes"
      v-model="connectionType"
    />
    
    <!-- 根据连接类型显示不同配置 -->
    <component
      :is="currentConfigComponent"
      v-model="connectionConfig"
    />
  </SettingGroup>
</template>

<script setup>
import { computed } from 'vue'

const connectionType = ref('http')
const connectionConfig = ref({})

const connectionTypes = [
  { value: 'http', label: 'HTTP 连接' },
  { value: 'websocket', label: 'WebSocket 连接' },
  { value: 'grpc', label: 'gRPC 连接' }
]

// 动态组件
const currentConfigComponent = computed(() => {
  const components = {
    http: 'HttpConfig',
    websocket: 'WebSocketConfig', 
    grpc: 'GrpcConfig'
  }
  return components[connectionType.value]
})
</script>
```

## 最佳实践

### 1. 组件组织

```vue
<template>
  <!-- 按功能分组 -->
  <SettingGroup title="基础设置">
    <SettingSwitch />
    <SettingSlider />
  </SettingGroup>
  
  <SettingGroup title="高级设置">
    <PathSelector />
    <PortConfig />
  </SettingGroup>
</template>
```

### 2. 数据管理

```javascript
// 使用响应式对象管理设置数据
const settings = reactive({
  theme: 'system',
  fontSize: 14,
  enableNotifications: true,
  installPath: ''
})

// 持久化存储
watch(settings, (newSettings) => {
  localStorage.setItem('app-settings', JSON.stringify(newSettings))
}, { deep: true })
```

### 3. 错误处理

```javascript
const handleSettingChange = async (key, value) => {
  try {
    await validateSetting(key, value)
    settings[key] = value
    await saveSetting(key, value)
  } catch (error) {
    showError(`设置失败: ${error.message}`)
    // 恢复原值
    settings[key] = originalValue
  }
}
```

### 4. 性能优化

```javascript
// 使用防抖处理高频变化的设置
import { debounce } from 'lodash-es'

const debouncedSave = debounce((settings) => {
  saveSettings(settings)
}, 300)

watch(settings, debouncedSave, { deep: true })
```

## 迁移指南

### 从旧版设置组件迁移

1. **识别现有设置项**：
   ```vue
   <!-- 旧版 -->
   <div class="setting-item">
     <label>启用功能</label>
     <input type="checkbox" v-model="enabled" />
   </div>
   
   <!-- 新版 -->
   <SettingSwitch 
     label="启用功能" 
     v-model="enabled" 
   />
   ```

2. **逐步替换**：
   - 先替换简单的开关和输入框
   - 再替换复杂的组合组件
   - 最后整合成完整面板

3. **数据结构调整**：
   ```javascript
   // 旧版分散的数据
   const theme = ref('light')
   const fontSize = ref(14)
   const enabled = ref(true)
   
   // 新版统一的设置对象
   const settings = reactive({
     theme: 'light',
     fontSize: 14,
     enabled: true
   })
   ```

## 性能优化

### 1. 懒加载组件

对于复杂的设置页面，建议使用懒加载：

```javascript
// 异步加载组件
const AdvancedSettings = defineAsyncComponent(() => 
  import('@/components/settings/panels/AdvancedSettings.vue')
)

// 使用 Suspense 包装
<Suspense>
  <template #default>
    <AdvancedSettings />
  </template>
  <template #fallback>
    <div class="loading loading-spinner"></div>
  </template>
</Suspense>
```

### 2. 数据缓存

使用 Pinia 或 Composables 缓存设置数据：

```javascript
// composables/useSettings.js
import { ref, computed } from 'vue'

const settingsCache = ref({})

export function useSettings() {
  const getSettings = (key) => {
    if (!settingsCache.value[key]) {
      settingsCache.value[key] = loadSettings(key)
    }
    return settingsCache.value[key]
  }

  const saveSettings = (key, value) => {
    settingsCache.value[key] = value
    persistSettings(key, value)
  }

  return {
    getSettings,
    saveSettings
  }
}
```

### 3. 防抖处理

对于频繁更新的设置项，使用防抖处理：

```javascript
import { debounce } from 'lodash-es'

const debouncedSave = debounce((value) => {
  saveSettings('autoSave', value)
}, 500)

// 在组件中使用
watch(autoSaveValue, debouncedSave)
```

## 使用技巧

### 1. 条件渲染

根据权限或状态显示不同的设置项：

```vue
<template>
  <SettingGroup title="权限设置">
    <SettingSwitch
      v-if="userRole === 'admin'"
      label="管理员功能"
      v-model="adminFeatures"
    />
    
    <SettingSwitch
      v-show="!isGuest"
      label="用户功能"
      v-model="userFeatures"
    />
  </SettingGroup>
</template>
```

### 2. 动态验证

添加实时验证功能：

```vue
<template>
  <SettingInput
    label="服务器地址"
    placeholder="https://example.com"
    v-model="serverUrl"
    :error="urlError"
    @input="validateUrl"
  />
</template>

<script setup>
const serverUrl = ref('')
const urlError = ref('')

const validateUrl = (value) => {
  try {
    new URL(value)
    urlError.value = ''
  } catch {
    urlError.value = '请输入有效的URL地址'
  }
}
</script>
```

### 3. 设置同步

实现设置的实时同步：

```javascript
// 使用 WebSocket 同步设置
const ws = new WebSocket('ws://localhost:8080/settings')

ws.onmessage = (event) => {
  const { key, value } = JSON.parse(event.data)
  settings[key] = value
}

// 监听本地更改
watch(settings, (newSettings) => {
  ws.send(JSON.stringify({ type: 'update', settings: newSettings }))
}, { deep: true })
```

## 部署和集成

### 1. 项目集成

将设置组件库集成到现有项目：

```bash
# 1. 确保已安装依赖
npm install vue@^3.0.0 @iconify/vue

# 2. 复制组件文件到项目
cp -r src/components/settings ./src/components/

# 3. 配置 CSS 样式
# 确保项目中已包含 DaisyUI 和 Tailwind CSS
```

### 2. 配置文件

创建统一的配置文件：

```javascript
// src/config/settings.js
export const SETTINGS_CONFIG = {
  // 主题配置
  themes: [
    { value: 'light', label: '明亮', icon: 'mdi:white-balance-sunny' },
    { value: 'dark', label: '暗黑', icon: 'mdi:weather-night' },
    { value: 'system', label: '跟随系统', icon: 'mdi:theme-light-dark' }
  ],
  
  // 语言配置
  languages: [
    { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { value: 'en-US', label: 'English', flag: '🇺🇸' },
    { value: 'ja-JP', label: '日本語', flag: '🇯🇵' }
  ],
  
  // 默认设置
  defaults: {
    theme: 'system',
    language: 'zh-CN',
    autoStart: false,
    minimizeToTray: true,
    zoom: 100,
    port: 8080
  }
}
```

### 3. 类型定义

为 TypeScript 项目添加类型定义：

```typescript
// src/types/settings.ts
export interface SettingOption {
  value: string | number
  label: string
  icon?: string
  disabled?: boolean
}

export interface SettingGroupProps {
  title: string
  subtitle?: string
  icon?: string
  iconClass?: string
}

export interface SettingItemProps {
  label: string
  description?: string
  error?: string
  disabled?: boolean
}

export interface AppSettings {
  theme: string
  language: string
  autoStart: boolean
  minimizeToTray: boolean
  zoom: number
  port: number
  dataPath: string
}
```

### 4. 状态管理

使用 Pinia 进行状态管理：

```javascript
// src/stores/settings.js
import { defineStore } from 'pinia'
import { SETTINGS_CONFIG } from '@/config/settings'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: { ...SETTINGS_CONFIG.defaults },
    loading: false,
    error: null
  }),

  actions: {
    async loadSettings() {
      this.loading = true
      try {
        const saved = await this.getSavedSettings()
        this.settings = { ...this.settings, ...saved }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveSettings(settings) {
      this.loading = true
      try {
        await this.persistSettings(settings)
        this.settings = { ...this.settings, ...settings }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async getSavedSettings() {
      // 从本地存储或 API 获取设置
      return JSON.parse(localStorage.getItem('app-settings') || '{}')
    },

    async persistSettings(settings) {
      // 保存到本地存储或 API
      localStorage.setItem('app-settings', JSON.stringify(settings))
    }
  }
})
```

## 版本更新

### v1.0.0 (当前版本)

**新增功能：**
- ✅ 完整的基础组件库
- ✅ 专用表单组件
- ✅ 预构建面板示例
- ✅ 响应式设计支持
- ✅ 完整文档和 API 参考
- ✅ TypeScript 类型定义
- ✅ 性能优化

**改进：**
- 🔧 组件 API 标准化
- 🔧 样式系统优化
- 🔧 无障碍支持改进

### v1.1.0 (计划中)

**新增功能：**
- 🚀 颜色选择器组件
- 🚀 文件选择器组件
- 🚀 快捷键配置组件
- 🚀 高级表单验证
- 🚀 设置导入/导出

**改进：**
- 🔧 更多预构建面板
- 🔧 动画效果优化
- 🔧 移动端体验改进

### v1.2.0 (规划中)

**新增功能：**
- 🌟 可视化设置编辑器
- 🌟 设置版本控制
- 🌟 批量配置管理
- 🌟 设置同步功能
- 🌟 插件系统支持

## 迁移指南

### 从旧版本升级

如果您的项目中已有设置页面，可以按以下步骤进行迁移：

#### 1. 分析现有代码

```javascript
// 旧版本代码分析
const oldSettings = {
  // 识别所有设置项
  // 分析数据结构
  // 确定组件对应关系
}
```

#### 2. 逐步迁移

```vue
<!-- 旧版本 -->
<div class="setting-item">
  <label>开关设置</label>
  <input type="checkbox" v-model="value" />
</div>

<!-- 新版本 -->
<SettingSwitch
  label="开关设置"
  description="设置项描述"
  v-model="value"
/>
```

#### 3. 数据兼容

```javascript
// 数据转换函数
const migrateSettings = (oldSettings) => {
  return {
    theme: oldSettings.ui?.theme || 'system',
    language: oldSettings.locale || 'zh-CN',
    // ... 其他字段映射
  }
}
```

## 故障排除

### 常见问题

1. **组件不显示**
   - 检查导入路径是否正确
   - 确认组件已正确注册

2. **样式异常**
   - 确认DaisyUI已正确安装和配置
   - 检查CSS变量是否被覆盖

3. **事件不触发**
   - 确认事件名称拼写正确
   - 检查v-model绑定是否正确

4. **路径选择器不工作**
   - 确认运行在Tauri环境中
   - 检查文件系统权限

### 调试技巧

```javascript
// 开启调试模式
const DEBUG = process.env.NODE_ENV === 'development'

const handleChange = (value) => {
  if (DEBUG) {
    console.log('Setting changed:', value)
  }
  // 处理逻辑
}
```

## 版本更新

### v1.0.0 (当前版本)

- ✅ 基础组件库
- ✅ 专用表单组件
- ✅ 预构建面板
- ✅ 完整文档和示例

### 计划更新

- 🔄 颜色选择器组件
- 🔄 文件选择器组件
- 🔄 键盘快捷键配置
- 🔄 更多预构建面板
- 🔄 TypeScript类型定义

## 贡献指南

欢迎为 MaiLauncher 设置组件库贡献代码！

### 开发流程

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/mailauncher.git
   cd mailauncher
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/new-setting-component
   ```

3. **开发和测试**
   ```bash
   # 安装依赖
   npm install
   
   # 启动开发服务器
   npm run dev
   
   # 运行测试
   npm run test
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新的设置组件"
   ```

5. **推送并创建 Pull Request**
   ```bash
   git push origin feature/new-setting-component
   ```

### 代码规范

- 使用 Vue 3 Composition API
- 遵循 ESLint 配置
- 添加必要的类型定义
- 编写单元测试
- 更新相关文档

### 提交规范

使用 [约定式提交](https://www.conventionalcommits.org/) 格式：

```
feat: 添加新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式化
refactor: 重构代码
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 常见问题

### Q: 如何自定义组件样式？
A: 通过 DaisyUI 主题变量或 CSS 类进行自定义，详见 [样式自定义](#样式自定义) 章节。

### Q: 组件不支持我需要的功能怎么办？
A: 可以通过组合基础组件或提交功能请求来实现。

### Q: 如何处理复杂的表单验证？
A: 建议使用 VeeValidate 或 Vuelidate 等表单验证库。

### Q: 组件在移动端表现如何？
A: 所有组件都经过响应式设计优化，支持移动端使用。

## 相关资源

- **项目主页**: [MaiLauncher GitHub](https://github.com/MaiM-with-u/Mailauncher)
- **在线演示**: [设置组件演示](/settings-demo.html)
- **问题反馈**: [GitHub Issues](https://github.com/MaiM-with-u/Mailauncher/issues)
- **讨论区**: [GitHub Discussions](https://github.com/MaiM-with-u/Mailauncher/discussions)

## 技术支持

如需技术支持，请通过以下方式联系：

- 📧 邮件: support@mailauncher.com
- 💬 讨论区: [GitHub Discussions](https://github.com/MaiM-with-u/Mailauncher/discussions)
- 🐛 Bug 报告: [GitHub Issues](https://github.com/MaiM-with-u/Mailauncher/issues)

## 致谢

感谢以下开源项目：

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [DaisyUI](https://daisyui.com/) - 最受欢迎的 Tailwind CSS 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Iconify](https://iconify.design/) - 统一图标框架

## 更新日志

查看 [CHANGELOG.md](https://github.com/MaiM-with-u/Mailauncher/blob/main/CHANGELOG.md) 了解详细更新历史。

## 许可证

本组件库基于 [GPL-3.0 许可证](https://github.com/MaiM-with-u/Mailauncher/blob/main/LICENSE) 开源。

---

**📝 文档最后更新时间**: 2025年7月5日  
**🔄 组件库版本**: v1.0.0  
**📚 文档版本**: v1.0.0