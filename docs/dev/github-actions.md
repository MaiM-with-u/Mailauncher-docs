# GitHub Actions 自动构建和部署工作流程

## 📋 概述

本项目使用 GitHub Actions 实现自动化构建和部署流程。当代码推送到 `main` 分支时，系统会自动触发构建流程，并将构建后的文档部署到服务器。

## 🔄 工作流程

### 触发条件
- 推送代码到 `main` 分支
- 创建针对 `main` 分支的 Pull Request

### 构建步骤
1. **检出代码**: 从 GitHub 仓库拉取最新代码
2. **设置环境**: 安装 Node.js 18 运行环境
3. **安装依赖**: 使用 `npm ci` 安装项目依赖
4. **构建项目**: 执行 `npm run build` 构建 VitePress 文档
5. **上传构建产物**: 将构建结果保存为 Actions 工件
6. **部署到服务器**: 通过 SCP 将构建产物传输到服务器（仅限 main 分支推送）

## ⚙️ 配置要求

### GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下机密信息：

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `SERVER_HOST` | 服务器IP地址或域名 | `192.168.1.100` 或 `example.com` |
| `SERVER_USERNAME` | 服务器用户名 | `ubuntu` 或 `root` |
| `SERVER_SSH_KEY` | SSH私钥内容 | 完整的私钥内容 |
| `SERVER_PORT` | SSH端口号（可选） | `22`（默认值） |
| `SERVER_TARGET_PATH` | 服务器目标路径 | `/var/www/html/docs` |

### SSH 密钥配置

1. **生成SSH密钥对**：
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"
   ```

2. **将公钥添加到服务器**：
   ```bash
   # 在服务器上执行
   echo "你的公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **将私钥添加到GitHub Secrets**：
   - 复制私钥文件的完整内容
   - 在GitHub仓库设置中添加为 `SERVER_SSH_KEY`

## 📁 目录结构

```
.github/
└── workflows/
    └── deploy.yml          # GitHub Actions工作流配置文件
```

## 🚀 使用方法

### 自动部署
1. 将代码推送到 `main` 分支
2. GitHub Actions 自动触发构建
3. 构建完成后自动部署到服务器

### 手动触发
1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "自动构建和部署文档" 工作流
3. 点击 "Run workflow" 按钮

## 📊 工作流状态

可以在以下位置查看工作流状态：
- GitHub 仓库的 Actions 标签页
- Pull Request 页面的检查状态
- README 文档的状态徽章

## 🛠️ 故障排除

### 常见问题

1. **SSH连接失败**
   - 检查服务器SSH密钥配置
   - 确认服务器防火墙设置
   - 验证GitHub Secrets中的服务器信息

2. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认依赖安装是否成功
   - 查看构建日志中的错误信息

3. **部署路径错误**
   - 确认服务器目标路径存在
   - 检查目录权限设置
   - 验证用户对目标路径的写入权限

### 调试方法

1. **查看工作流日志**：
   - 在 GitHub Actions 页面点击相应的工作流运行
   - 展开各个步骤查看详细日志

2. **本地测试构建**：
   ```bash
   npm install
   npm run build
   ```

3. **测试SSH连接**：
   ```bash
   ssh -i your-private-key username@server-host
   ```

## 🔧 自定义配置

### 修改构建命令
在 `.github/workflows/deploy.yml` 中修改构建步骤：
```yaml
- name: 构建项目
  run: npm run build  # 可以改为其他构建命令
```

### 添加构建前置步骤
```yaml
- name: 运行测试
  run: npm test

- name: 代码质量检查
  run: npm run lint
```

### 多环境部署
可以配置不同分支部署到不同环境：
```yaml
- name: 部署到测试环境
  if: github.ref == 'refs/heads/develop'
  # 部署配置...

- name: 部署到生产环境
  if: github.ref == 'refs/heads/main'
  # 部署配置...
```

## 📈 性能优化

1. **使用缓存**：工作流已配置 npm 缓存
2. **并行构建**：可以将测试和构建步骤并行执行
3. **增量部署**：仅传输变更的文件

## 🔒 安全注意事项

1. **保护敏感信息**：所有服务器信息都存储在GitHub Secrets中
2. **最小权限原则**：服务器用户仅拥有必要的文件操作权限
3. **定期更新密钥**：建议定期轮换SSH密钥
4. **审计日志**：GitHub Actions提供完整的操作日志

---

通过这个自动化工作流程，您可以专注于文档内容的编写，而不必担心构建和部署的繁琐过程。每次推送代码后，系统会自动处理所有后续流程。
