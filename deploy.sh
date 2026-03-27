#!/bin/bash
# 生产环境部署脚本
# 使用方法: ./deploy.sh [你的数据库连接字符串]

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   海创元网站 - 生产环境部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查必需的环境变量
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}错误: 未设置 DATABASE_URL 环境变量${NC}"
  echo "使用方法: DATABASE_URL='postgresql://user:pass@host:5432/dbname' ./deploy.sh"
  exit 1
fi

echo -e "${YELLOW}数据库连接: ${DATABASE_URL%@*}@***${NC}"

# 询问是否运行数据迁移
echo ""
read -p "是否首次部署？是否需要运行数据迁移？(y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}正在构建镜像并运行数据迁移...${NC}"

  # 构建镜像
  docker build --build-arg STANDALONE=true -t hcy-website:latest .

  # 运行迁移
  echo -e "${YELLOW}运行数据迁移...${NC}"
  docker run --rm \
    -e DATABASE_URL="$DATABASE_URL" \
    hcy-website:latest \
    sh -c "npx prisma db push && npm run migrate:data"
fi

# 停止旧容器
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 启动新容器
echo -e "${YELLOW}启动新容器...${NC}"
DATABASE_URL="$DATABASE_URL" \
ADMIN_PASSWORD="${ADMIN_PASSWORD:-haichuangyuan2026}" \
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}" \
docker-compose -f docker-compose.prod.yml up -d

# 等待容器启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 5

# 检查容器状态
if docker ps | grep -q hcy-website; then
  echo -e "${GREEN}✓ 容器启动成功！${NC}"
  echo ""
  echo "访问地址: ${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
  echo "后台管理: ${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}/admin"
  echo ""
  echo "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
else
  echo -e "${RED}✗ 容器启动失败${NC}"
  echo "查看错误日志: docker-compose -f docker-compose.prod.yml logs"
  exit 1
fi
