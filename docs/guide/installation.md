# 安装指南

本指南将帮助你在不同平台上安装和配置 MaiLauncher。

## 🔧 系统要求

在开始安装之前，请确保你的系统满足以下要求：

### 基本要求
- **操作系统**: Windows 10/11（Linux/macOS 正在开发中）
- **内存**: 至少 2GB RAM
- **存储空间**: 至少 4GB 可用空间（包含一个 MaiBot 实例）
- **网络**: 需要互联网连接用于下载 MaiBot 版本

### 环境依赖
- **Python**: 3.10 或更高版本
- **Git**: 用于版本控制和代码管理
- **Node.js**: 16.0 或更高版本（如需从源码构建前端）

## 📦 安装方式

### 方式一：下载预编译版本（推荐）

1. 访问 [GitHub Releases 页面](https://github.com/MaiM-with-u/mailauncher/releases)
2. 下载适合你操作系统的最新版本
3. 解压到你选择的目录
4. 运行可执行文件即可启动

### 方式二：从源码构建

#### 1. 克隆代码仓库

```bash
# 克隆前端项目
git clone https://github.com/MaiM-with-u/mailauncher.git
cd mailauncher

# 克隆后端项目
git clone https://github.com/MaiM-with-u/mailauncher-backend.git
```

#### 2. 安装后端依赖

```bash
cd mailauncher-backend

# 安装 Python 依赖
pip install -r requirements.txt

# 或者使用虚拟环境（推荐）
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

#### 3. 配置后端

```bash
# 复制配置模板
copy template\config_template.toml config.toml  # Windows
# cp template/config_template.toml config.toml  # Linux/macOS

# 编辑配置文件（可选）
notepad config.toml  # Windows
# nano config.toml  # Linux/macOS
```

#### 4. 启动后端服务

```bash
python main.py
```

后端服务将在 `http://localhost:23456` 启动。

#### 5. 安装前端依赖

打开新的终端窗口：

```bash
cd mailauncher

# 安装依赖
pnpm install
# 或者
npm install
```

#### 6. 启动前端开发服务器

```bash
# 开发模式
pnpm dev
# 或者
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

#### 7. 构建桌面应用（可选）

```bash
# 构建 Tauri 桌面应用
pnpm tauri build
# 或者
npm run tauri build
```

## ⚙️ 配置说明

### 后端配置 (config.toml)

主要配置项：

```toml
[server]
host = "127.0.0.1"          # 服务器地址
port = 23456                # 服务器端口
api_prefix = "/api/v1"      # API 路径前缀

[debug]
level = "INFO"              # 日志级别: DEBUG, INFO, WARNING, ERROR
```

### 前端配置

创建 `.env.local` 文件：

```env
# API 服务器地址
VITE_API_BASE_URL=http://localhost:23456
VITE_WS_BASE_URL=ws://localhost:23456
```

## 🚀 首次启动

1. 确保后端服务正在运行
2. 打开前端应用或桌面应用
3. 你将看到 MaiLauncher 的主界面
4. 点击"部署中心"开始部署你的第一个 MaiBot 实例

## 🔧 常见问题

### 端口冲突

如果遇到端口冲突，请修改 `config.toml` 中的端口设置：

```toml
[server]
port = 23457  # 更改为其他可用端口
```

### Python 版本问题

确保使用 Python 3.10 或更高版本：

```bash
python --version
```

如果版本过低，请从 [Python 官网](https://www.python.org/downloads/) 下载最新版本。

### 安装失败
- 确保有管理员权限
- 检查防病毒软件是否阻止安装
- 关闭其他正在运行的程序

### 无法启动
- 检查系统要求是否满足
- 查看错误日志文件
- 尝试以管理员身份运行

### 网络连接问题

如果下载 MaiBot 版本时遇到网络问题，请检查：

1. 网络连接是否正常
2. 防火墙是否阻止了连接
3. 是否需要配置代理

## 📱 移动端访问

MaiLauncher 支持通过移动设备访问：

1. 确保移动设备与运行 MaiLauncher 的设备在同一网络
2. 修改后端配置：
   ```toml
   [server]
   host = "0.0.0.0"  # 允许外部访问
   ```
3. 在移动设备浏览器中访问：`http://[服务器IP]:23456`

## 🔐 安全注意事项

- 默认情况下，MaiLauncher 只监听本地连接
- 如需远程访问，请确保网络环境安全
- 建议在生产环境中使用 HTTPS
- 定期备份数据库文件 (`data/MaiLauncher.db`)

## 📞 获取帮助

如果在安装过程中遇到问题：

1. 查看 [常见问题](#常见问题)
2. 在 [GitHub Issues](https://github.com/MaiM-with-u/mailauncher/issues) 中搜索相关问题
3. 提交新的 Issue 寻求帮助

## 下一步

完成安装和配置后，你可以继续阅读：

- [用户指南](./index.md) - 学习如何使用 MaiLauncher 的各项功能
- [API 文档](../api/) - 了解后端 API 接口详情

安装完成后，你就可以开始使用 MaiLauncher 了！

### 启动应用

安装完成后，你可以通过以下方式启动 MaiLauncher：

1. 从开始菜单启动
2. 从桌面快捷方式启动
3. 从安装目录直接运行

### 初始设置

首次运行时，MaiLauncher 会引导你完成基本设置：

1. **选择语言**：选择你偏好的界面语言
2. **游戏路径设置**：指定舞萌DX游戏的安装路径
3. **数据目录设置**：选择存储启动器数据的位置

## 配置选项

### 基本配置

在设置界面中，你可以配置以下选项：

#### 常规设置
- **启动时自动运行**：系统启动时自动启动 MaiLauncher
- **最小化到系统托盘**：关闭窗口时最小化到托盘而不是退出
- **检查更新**：自动检查并提醒软件更新

#### 游戏设置
- **默认游戏路径**：设置游戏的默认安装路径
- **启动参数**：自定义游戏启动参数
- **显示模式**：设置游戏的显示模式（全屏/窗口）

#### 高级设置
- **WebSocket 端口**：设置 WebSocket 服务的端口
- **日志级别**：设置日志记录的详细程度
- **代理设置**：配置网络代理（如果需要）

### 配置文件位置

MaiLauncher 的配置文件存储在以下位置：

- **Windows**：`%APPDATA%/MaiLauncher/config.json`
- **macOS**：`~/Library/Application Support/MaiLauncher/config.json`
- **Linux**：`~/.config/MaiLauncher/config.json`

## 故障排除

### 常见安装问题

#### 安装失败
- 确保有管理员权限
- 检查防病毒软件是否阻止安装
- 关闭其他正在运行的游戏相关程序

#### 无法启动
- 检查系统要求是否满足
- 查看错误日志文件
- 尝试以管理员身份运行

#### 游戏路径识别错误
- 手动设置正确的游戏路径
- 确保游戏文件完整
- 检查文件夹权限

### 获取帮助

如果遇到其他问题，可以：

1. 查看 [常见问题](./faq.md) 章节
2. 在 GitHub 提交 [Issue](https://github.com/MaiM-with-u/mailauncher/issues)
3. 加入社区讨论群组

## 下一步

完成安装和配置后，你可以继续阅读：

- [基本使用](./basic-usage.md) - 学习如何使用 MaiLauncher
- [高级功能](./advanced.md) - 探索更多高级功能
