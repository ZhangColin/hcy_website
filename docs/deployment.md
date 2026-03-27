# 生产部署指南

本文档介绍如何将海创元AI教育官网部署到生产环境。

## 目录

- [环境要求](#环境要求)
- [环境变量](#环境变量)
- [Docker 镜像构建](#docker-镜像构建)
- [部署步骤](#部署步骤)
- [数据库迁移](#数据库迁移)
- [Nginx 反向代理配置](#nginx-反向代理配置)
- [健康检查](#健康检查)
- [故障排查](#故障排查)

## 环境要求

- Docker 20.10+
- Docker Compose 1.29+ (可选)
- PostgreSQL 14+ 数据库
- 至少 512MB 内存
- 至少 1GB 磁盘空间

## 环境变量

应用需要以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://user:pass@host:5432/dbname` |
| `ADMIN_PASSWORD` | 管理后台密码 | 建议使用强密码 |
| `NODE_ENV` | 运行环境 | `production` |
| `NEXT_PUBLIC_SITE_URL` | 站点访问地址 | `https://your-domain.com` |

### 环境变量文件示例

创建 `.env.production` 文件：

```bash
# 数据库连接
DATABASE_URL="postgresql://username:password@your-host:5432/hcy_website"

# 管理后台密码 (生产环境请使用强密码)
ADMIN_PASSWORD="your-secure-password-here"

# 应用配置
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## Docker 镜像构建

### 1. 本地构建镜像

```bash
docker build -t hcy-website:latest .
```

### 2. 导出镜像（用于传输到服务器）

```bash
docker save hcy-website:latest -o hcy-website.tar
```

### 3. 在服务器上加载镜像

```bash
docker load < hcy-website.tar
```

## 部署步骤

### 方式一：使用 Docker Compose（推荐）

1. 创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  app:
    image: hcy-website:latest
    container_name: hcy-website
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

2. 启动服务：

```bash
docker-compose up -d
```

### 方式二：使用 Docker 命令

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://username:password@host:5432/dbname" \
  -e ADMIN_PASSWORD="your-secure-password" \
  -e NODE_ENV="production" \
  -e NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  --name hcy-website \
  --restart=unless-stopped \
  hcy-website:latest
```

### 参数说明

- `-d`: 后台运行
- `-p 3000:3000`: 端口映射，宿主机端口:容器端口
- `-e`: 设置环境变量
- `--name`: 容器名称
- `--restart=unless-stopped`: 自动重启策略

## 数据库迁移

首次部署时需要执行数据库迁移和初始数据导入。

### 1. 执行 Prisma 迁移

```bash
docker exec hcy-website npx prisma migrate deploy
```

### 2. 导入初始数据

```bash
docker exec hcy-website npx tsx /app/scripts/migrate-data.ts
```

**注意**: 数据迁移脚本具有幂等性保护。如果数据库已存在数据，迁移将中止以防止数据丢失。

### 默认管理员账户

首次迁移后会创建默认管理员账户：

- 用户名: `admin`
- 密码: `haichuangyuan2026`

**重要**: 首次登录后请立即修改密码！

## Nginx 反向代理配置

如果需要使用 Nginx 作为反向代理，参考以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/hcy-website-access.log;
    error_log /var/log/nginx/hcy-website-error.log;

    # 反向代理
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # 请求头
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 缓存控制
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 健康检查

应用提供健康检查端点：

```bash
curl http://localhost:3000/api/health
```

正常返回：

```json
{"status":"ok"}
```

Docker Compose 配置了自动健康检查，会定期检测应用状态。

## 常用命令

### 查看日志

```bash
docker logs hcy-website
# 实时跟踪
docker logs -f hcy-website
```

### 进入容器

```bash
docker exec -it hcy-website sh
```

### 重启服务

```bash
docker restart hcy-website
```

### 停止服务

```bash
docker stop hcy-website
```

### 删除容器

```bash
docker rm hcy-website
```

### 更新镜像

```bash
# 停止并删除旧容器
docker stop hcy-website
docker rm hcy-website

# 加载新镜像
docker load < hcy-website-new.tar

# 启动新容器
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e ADMIN_PASSWORD="..." \
  --name hcy-website \
  --restart=unless-stopped \
  hcy-website:latest
```

## 故障排查

### 应用无法启动

1. 检查环境变量是否正确设置

```bash
docker exec hcy-website env | grep DATABASE_URL
```

2. 检查数据库连接

```bash
docker exec hcy-website npx prisma db push
```

3. 查看详细日志

```bash
docker logs hcy-website
```

### 数据库迁移失败

1. 确认数据库已创建

2. 检查数据库用户权限

3. 手动执行迁移并查看错误

```bash
docker exec -it hcy-website sh
npx prisma migrate deploy
```

### 页面显示异常

1. 清除容器缓存并重启

```bash
docker restart hcy-website
```

2. 检查 Next.js 构建是否完整

3. 确认 `NEXT_PUBLIC_SITE_URL` 设置正确

## 安全建议

1. **使用强密码**: 生产环境的 `ADMIN_PASSWORD` 必须使用强密码
2. **定期更新**: 及时更新 Docker 镜像以获取安全补丁
3. **限制访问**: 使用防火墙限制数据库直接访问
4. **HTTPS**: 生产环境务必启用 HTTPS
5. **日志监控**: 定期检查访问日志和错误日志
6. **备份**: 定期备份数据库数据

## 监控建议

1. 设置应用监控（如 Prometheus + Grafana）
2. 配置日志收集（如 ELK Stack）
3. 设置告警通知（邮件/短信/钉钉）
4. 监控资源使用情况（CPU/内存/磁盘）
