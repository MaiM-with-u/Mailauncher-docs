# 部署指南

本文档详细说明如何部署 MaiLauncher 到不同的环境中。

## 📋 目录

- [环境要求](#环境要求)
- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [容器化部署](#容器化部署)
- [自动化部署](#自动化部署)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 🛠️ 环境要求

### 系统要求

**最低要求**：
- 操作系统：Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- 内存：4GB RAM
- 存储：2GB 可用空间
- 网络：互联网连接（用于下载依赖）

**推荐配置**：
- 操作系统：Windows 11, macOS 12+, Ubuntu 22.04+
- 内存：8GB RAM
- 存储：10GB 可用空间
- CPU：多核处理器

### 软件依赖

**必需软件**：
- Python 3.10+
- Node.js 18+
- Git

**可选软件**：
- Docker（容器化部署）
- nginx（反向代理）
- systemd（Linux 服务管理）

## 🔧 开发环境部署

### 1. 克隆项目

```bash
# 克隆主项目
git clone https://github.com/your-org/mailauncher.git
cd mailauncher

# 克隆后端项目
git clone https://github.com/your-org/mailauncher-backend.git
```

### 2. 后端环境设置

```bash
# 进入后端目录
cd mailauncher-backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python main.py
```

### 3. 前端环境设置

```bash
# 进入前端目录
cd mailauncher

# 安装依赖
npm install
# 或使用 pnpm
pnpm install

# 启动开发服务器
npm run dev
# 或使用 pnpm
pnpm dev
```

### 4. 开发环境配置

#### 后端配置文件

创建 `mailauncher-backend/config/development.json`：

```json
{
  "server": {
    "host": "127.0.0.1",
    "port": 23456,
    "debug": true,
    "reload": true
  },
  "database": {
    "url": "sqlite:///./data/mailauncher_dev.db",
    "echo": true
  },
  "logging": {
    "level": "DEBUG",
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  },
  "cors": {
    "allow_origins": ["http://localhost:5173"],
    "allow_credentials": true,
    "allow_methods": ["*"],
    "allow_headers": ["*"]
  }
}
```

#### 前端环境变量

创建 `mailauncher/.env.development`：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:23456/api/v1
VITE_WS_BASE_URL=ws://localhost:23456

# 开发模式
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG_PANEL=true
```

## 🚀 生产环境部署

### 1. 服务器准备

#### 创建专用用户

```bash
# 创建 mailauncher 用户
sudo useradd -m -s /bin/bash mailauncher
sudo usermod -aG sudo mailauncher

# 切换到 mailauncher 用户
sudo su - mailauncher
```

#### 安装系统依赖

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm git nginx

# CentOS/RHEL
sudo yum install -y python3 python3-pip nodejs npm git nginx

# 安装 pnpm（可选）
npm install -g pnpm
```

### 2. 部署后端

#### 下载和配置

```bash
# 创建应用目录
sudo mkdir -p /opt/mailauncher
sudo chown mailauncher:mailauncher /opt/mailauncher
cd /opt/mailauncher

# 克隆项目
git clone https://github.com/your-org/mailauncher-backend.git backend
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 创建生产配置
mkdir -p config
cat > config/production.json << EOF
{
  "server": {
    "host": "127.0.0.1",
    "port": 23456,
    "debug": false,
    "reload": false
  },
  "database": {
    "url": "sqlite:///./data/mailauncher_prod.db",
    "echo": false
  },
  "logging": {
    "level": "INFO",
    "file": "/var/log/mailauncher/backend.log"
  },
  "cors": {
    "allow_origins": ["http://localhost"],
    "allow_credentials": true,
    "allow_methods": ["GET", "POST", "PUT", "DELETE"],
    "allow_headers": ["*"]
  }
}
EOF

# 创建日志目录
sudo mkdir -p /var/log/mailauncher
sudo chown mailauncher:mailauncher /var/log/mailauncher

# 创建数据目录
mkdir -p data

# 初始化数据库
python -c "from src.utils.database import init_database; init_database()"
```

#### 创建 systemd 服务

```bash
sudo cat > /etc/systemd/system/mailauncher-backend.service << EOF
[Unit]
Description=MaiLauncher Backend Service
After=network.target

[Service]
Type=simple
User=mailauncher
Group=mailauncher
WorkingDirectory=/opt/mailauncher/backend
Environment=PATH=/opt/mailauncher/backend/venv/bin
Environment=MAILAUNCHER_ENV=production
ExecStart=/opt/mailauncher/backend/venv/bin/python main.py
ExecReload=/bin/kill -HUP \$MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable mailauncher-backend
sudo systemctl start mailauncher-backend

# 检查服务状态
sudo systemctl status mailauncher-backend
```

### 3. 部署前端

#### 构建前端应用

```bash
cd /opt/mailauncher
git clone https://github.com/your-org/mailauncher.git frontend
cd frontend

# 创建生产环境变量
cat > .env.production << EOF
VITE_API_BASE_URL=/api/v1
VITE_WS_BASE_URL=ws://localhost:23456
VITE_DEV_MODE=false
VITE_LOG_LEVEL=warn
EOF

# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 复制构建文件到 nginx 目录
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

#### 配置 nginx

```bash
sudo cat > /etc/nginx/sites-available/mailauncher << EOF
server {
    listen 80;
    server_name localhost;
    
    # 前端静态文件
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
        
        # 缓存设置
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:23456;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket 代理
    location /ws/ {
        proxy_pass http://127.0.0.1:23456;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket 超时设置
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 日志
    access_log /var/log/nginx/mailauncher.access.log;
    error_log /var/log/nginx/mailauncher.error.log;
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/mailauncher /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. SSL 配置（可选）

#### 使用 Let's Encrypt

```bash
# 安装 certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🐳 容器化部署

### 1. 后端 Dockerfile

创建 `mailauncher-backend/Dockerfile`：

```dockerfile
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建数据目录
RUN mkdir -p data logs

# 设置环境变量
ENV PYTHONPATH=/app
ENV MAILAUNCHER_ENV=production

# 暴露端口
EXPOSE 23456

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:23456/api/v1/system/health || exit 1

# 启动命令
CMD ["python", "main.py"]
```

### 2. 前端 Dockerfile

创建 `mailauncher/Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./mailauncher-backend
      dockerfile: Dockerfile
    container_name: mailauncher-backend
    restart: unless-stopped
    ports:
      - "23456:23456"
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./config:/app/config
    environment:
      - MAILAUNCHER_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:23456/api/v1/system/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - mailauncher

  frontend:
    build:
      context: ./mailauncher
      dockerfile: Dockerfile
    container_name: mailauncher-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - mailauncher

  nginx:
    image: nginx:alpine
    container_name: mailauncher-proxy
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    networks:
      - mailauncher

networks:
  mailauncher:
    driver: bridge

volumes:
  data:
  logs:
```

### 4. 运行容器

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 🤖 自动化部署

### 1. GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy MaiLauncher

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install backend dependencies
      run: |
        cd mailauncher-backend
        pip install -r requirements.txt
    
    - name: Install frontend dependencies
      run: |
        cd mailauncher
        npm ci
    
    - name: Run backend tests
      run: |
        cd mailauncher-backend
        python -m pytest
    
    - name: Run frontend tests
      run: |
        cd mailauncher
        npm test
    
    - name: Build frontend
      run: |
        cd mailauncher
        npm run build

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    
    - name: Build and push Backend image
      uses: docker/build-push-action@v4
      with:
        context: ./mailauncher-backend
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:latest
        labels: ${{ steps.meta.outputs.labels }}
    
    - name: Build and push Frontend image
      uses: docker/build-push-action@v4
      with:
        context: ./mailauncher
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/mailauncher
          docker-compose pull
          docker-compose up -d
          docker system prune -f
```

### 2. 部署脚本

创建 `scripts/deploy.sh`：

```bash
#!/bin/bash

set -e

# 配置
DEPLOY_USER="mailauncher"
DEPLOY_HOST="your-server.com"
DEPLOY_PATH="/opt/mailauncher"
BACKUP_PATH="/opt/mailauncher/backups"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# 检查参数
if [ $# -eq 0 ]; then
    echo "Usage: $0 [frontend|backend|all]"
    exit 1
fi

DEPLOY_TARGET=$1

# 备份函数
backup() {
    log "创建备份..."
    ssh $DEPLOY_USER@$DEPLOY_HOST "
        mkdir -p $BACKUP_PATH
        backup_name=\$(date +'%Y%m%d_%H%M%S')
        tar -czf $BACKUP_PATH/mailauncher_\$backup_name.tar.gz -C $DEPLOY_PATH .
        ls -la $BACKUP_PATH/mailauncher_*.tar.gz | tail -5
    "
}

# 部署后端
deploy_backend() {
    log "部署后端..."
    
    # 上传代码
    rsync -avz --delete \
        --exclude 'venv' \
        --exclude '__pycache__' \
        --exclude '*.pyc' \
        --exclude 'data' \
        --exclude 'logs' \
        ./mailauncher-backend/ \
        $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/backend/
    
    # 安装依赖并重启服务
    ssh $DEPLOY_USER@$DEPLOY_HOST "
        cd $DEPLOY_PATH/backend
        source venv/bin/activate
        pip install -r requirements.txt
        sudo systemctl restart mailauncher-backend
        sleep 5
        sudo systemctl status mailauncher-backend
    "
}

# 部署前端
deploy_frontend() {
    log "部署前端..."
    
    # 本地构建
    cd mailauncher
    pnpm install
    pnpm build
    cd ..
    
    # 上传构建文件
    rsync -avz --delete \
        ./mailauncher/dist/ \
        $DEPLOY_USER@$DEPLOY_HOST:/var/www/html/
    
    # 重启 nginx
    ssh $DEPLOY_USER@$DEPLOY_HOST "
        sudo chown -R www-data:www-data /var/www/html/
        sudo nginx -t
        sudo systemctl reload nginx
    "
}

# 健康检查
health_check() {
    log "执行健康检查..."
    
    # 检查后端
    if ! curl -f http://$DEPLOY_HOST/api/v1/system/health > /dev/null 2>&1; then
        error "后端健康检查失败"
        return 1
    fi
    
    # 检查前端
    if ! curl -f http://$DEPLOY_HOST > /dev/null 2>&1; then
        error "前端健康检查失败"
        return 1
    fi
    
    log "健康检查通过"
}

# 主部署流程
main() {
    log "开始部署 MaiLauncher ($DEPLOY_TARGET)"
    
    # 创建备份
    backup
    
    # 根据参数部署
    case $DEPLOY_TARGET in
        "backend")
            deploy_backend
            ;;
        "frontend")
            deploy_frontend
            ;;
        "all")
            deploy_backend
            deploy_frontend
            ;;
        *)
            error "无效的部署目标: $DEPLOY_TARGET"
            exit 1
            ;;
    esac
    
    # 健康检查
    if health_check; then
        log "部署成功完成！"
    else
        error "部署失败，请检查日志"
        exit 1
    fi
}

# 执行主流程
main
```

## 📊 监控和维护

### 1. 系统监控

#### Prometheus 配置

创建 `monitoring/prometheus.yml`：

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'mailauncher-backend'
    static_configs:
      - targets: ['localhost:23456']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
```

#### Grafana 仪表盘

```json
{
  "dashboard": {
    "title": "MaiLauncher 监控",
    "panels": [
      {
        "title": "请求速率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "响应时间",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "实例状态",
        "type": "stat",
        "targets": [
          {
            "expr": "mailauncher_instances_total",
            "legendFormat": "Total Instances"
          },
          {
            "expr": "mailauncher_instances_running",
            "legendFormat": "Running Instances"
          }
        ]
      }
    ]
  }
}
```

### 2. 日志管理

#### 日志轮转配置

创建 `/etc/logrotate.d/mailauncher`：

```
/var/log/mailauncher/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 mailauncher mailauncher
    postrotate
        systemctl reload mailauncher-backend
    endscript
}
```

#### 日志聚合（ELK Stack）

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - /var/log/mailauncher:/var/log/mailauncher:ro
    networks:
      - elk
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    networks:
      - elk
    depends_on:
      - elasticsearch

networks:
  elk:
    driver: bridge

volumes:
  elasticsearch-data:
```

### 3. 备份策略

#### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/opt/mailauncher/backups"
DATA_DIR="/opt/mailauncher/backend/data"
CONFIG_DIR="/opt/mailauncher/backend/config"
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 创建时间戳
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')

# 备份数据库
sqlite3 $DATA_DIR/mailauncher_prod.db ".backup $BACKUP_DIR/db_$TIMESTAMP.sqlite"

# 备份配置文件
tar -czf $BACKUP_DIR/config_$TIMESTAMP.tar.gz -C $CONFIG_DIR .

# 清理旧备份
find $BACKUP_DIR -name "db_*.sqlite" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "config_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 验证备份
if [ -f "$BACKUP_DIR/db_$TIMESTAMP.sqlite" ]; then
    echo "数据库备份成功: db_$TIMESTAMP.sqlite"
else
    echo "数据库备份失败"
    exit 1
fi

echo "备份完成"
```

#### 定时备份

```bash
# 添加到 crontab
sudo crontab -e -u mailauncher

# 添加以下行：
# 每天凌晨 2 点执行备份
0 2 * * * /opt/mailauncher/scripts/backup.sh >> /var/log/mailauncher/backup.log 2>&1

# 每周执行完整备份
0 3 * * 0 /opt/mailauncher/scripts/full-backup.sh >> /var/log/mailauncher/backup.log 2>&1
```

## 🔧 故障排除

### 1. 常见问题

#### 后端无法启动

```bash
# 检查日志
sudo journalctl -u mailauncher-backend -f

# 检查端口占用
sudo netstat -tlnp | grep 23456

# 检查数据库
sqlite3 /opt/mailauncher/backend/data/mailauncher_prod.db ".tables"

# 手动启动检查
cd /opt/mailauncher/backend
source venv/bin/activate
python main.py
```

#### 前端无法访问

```bash
# 检查 nginx 状态
sudo systemctl status nginx

# 检查 nginx 配置
sudo nginx -t

# 查看 nginx 日志
sudo tail -f /var/log/nginx/mailauncher.error.log

# 检查文件权限
ls -la /var/www/html/
```

#### WebSocket 连接失败

```bash
# 检查防火墙
sudo ufw status

# 检查 nginx WebSocket 配置
sudo nginx -T | grep -A 10 -B 10 "location /ws"

# 测试 WebSocket 连接
wscat -c ws://localhost/ws/test
```

### 2. 性能问题

#### 内存使用过高

```bash
# 检查进程内存使用
ps aux | grep mailauncher

# 检查系统内存
free -h

# 调整 Python 内存设置
export PYTHONMALLOC=malloc
```

#### 响应时间过长

```bash
# 检查数据库性能
sqlite3 /opt/mailauncher/backend/data/mailauncher_prod.db ".timer on" "SELECT COUNT(*) FROM instances;"

# 查看慢查询日志
grep "slow" /var/log/mailauncher/backend.log

# 检查磁盘 I/O
iostat -x 1
```

### 3. 数据恢复

#### 从备份恢复数据库

```bash
# 停止服务
sudo systemctl stop mailauncher-backend

# 恢复数据库
cp /opt/mailauncher/backups/db_20231201_020000.sqlite \
   /opt/mailauncher/backend/data/mailauncher_prod.db

# 重启服务
sudo systemctl start mailauncher-backend

# 验证恢复
curl http://localhost:23456/api/v1/system/health
```

#### 回滚到上一个版本

```bash
# 使用 git 回滚代码
cd /opt/mailauncher/backend
git log --oneline -10
git checkout <commit-hash>

# 重启服务
sudo systemctl restart mailauncher-backend
```

这个部署指南提供了完整的部署流程，从开发环境到生产环境，包括容器化部署、自动化部署、监控维护和故障排除。根据实际需求选择合适的部署方式。
