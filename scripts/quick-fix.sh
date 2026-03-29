#!/bin/bash
# 快速修复脚本 - 直接设置容器环境变量

DB_URL="postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website"

echo "=== 快速修复数据库连接 ==="
echo ""
echo "停止容器..."
docker stop hcy-website 2>/dev/null || true

echo "删除容器..."
docker rm hcy-website 2>/dev/null || true

echo "启动新容器（直接传入 DATABASE_URL）..."
docker run -d \
  --name hcy-website \
  --restart unless-stopped \
  -p 3000:3000 \
  -e DATABASE_URL="$DB_URL" \
  -e ADMIN_PASSWORD="haichuangyuan2026" \
  -e NEXT_PUBLIC_SITE_URL="https://portal.aieducenter.com" \
  -e NODE_ENV="production" \
  --add-host="host.docker.internal:host-gateway" \
  hcy-website-app:latest

echo "等待容器启动..."
sleep 10

echo ""
echo "测试服务..."
curl -s http://localhost:3000/api/health | head -c 200
echo ""

echo "测试首页..."
if curl -sf http://localhost:3000/ > /dev/null 2>&1; then
  echo "✓ 首页正常"
else
  echo "✗ 首页失败，查看日志："
  docker logs hcy-website | tail -20
fi
