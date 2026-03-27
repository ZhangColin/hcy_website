#!/bin/bash
# 首次部署脚本 - 创建数据库、运行迁移、启动服务

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   首次部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 加载环境变量
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
else
  echo -e "${RED}错误: 未找到 .env.production 文件${NC}"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}错误: .env.production 中未设置 DATABASE_URL${NC}"
  exit 1
fi

DB_DISPLAY="${DATABASE_URL%:*}@***"
echo -e "${YELLOW}数据库: ${DB_DISPLAY}${NC}"
echo ""

# Step 1: 创建数据库
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo -e "${YELLOW}Step 1: 创建数据库${NC}"
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo ""
echo "请在 postgres-server 容器中创建数据库："
echo ""
echo "  docker exec -i postgres-server psql -U hcy_pgsql -c \"CREATE DATABASE hcy_website;\""
echo ""
read -p "数据库已创建？按回车继续..."
echo ""

# Step 2: 构建镜像
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo -e "${YELLOW}Step 2: 构建镜像${NC}"
echo -e "${YELLOW}────────────────────────────────────${NC}"
docker build --build-arg STANDALONE=true --build-arg DATABASE_URL="$DATABASE_URL" -t hcy-website:latest .
echo -e "${GREEN}✓ 镜像构建完成${NC}"
echo ""

# Step 3: 运行数据库迁移
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo -e "${YELLOW}Step 3: 运行数据库迁移${NC}"
echo -e "${YELLOW}────────────────────────────────────${NC}"
docker run --rm \
  -e DATABASE_URL="$DATABASE_URL" \
  hcy-website:latest \
  sh -c "npx prisma db push --accept-data-loss && npm run migrate:data"
echo -e "${GREEN}✓ 数据迁移完成${NC}"
echo ""

# Step 4: 启动服务
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo -e "${YELLOW}Step 4: 启动服务${NC}"
echo -e "${YELLOW}────────────────────────────────────${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
DATABASE_URL="$DATABASE_URL" docker-compose -f docker-compose.prod.yml up -d

sleep 8

if docker ps | grep -q hcy-website; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}   ✓ 首次部署成功！${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "访问地址: ${BLUE}${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}${NC}"
  echo ""
else
  echo -e "${RED}✗ 容器启动失败${NC}"
  docker-compose -f docker-compose.prod.yml logs
  exit 1
fi
