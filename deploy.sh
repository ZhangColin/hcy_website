#!/bin/bash
# 生产环境部署脚本
# 使用方法: ./deploy.sh

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   海创元网站 - 生产环境部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 加载环境变量
if [ -f .env.production ]; then
  echo -e "${BLUE}读取 .env.production 配置...${NC}"
  export $(cat .env.production | grep -v '^#' | xargs)
else
  echo -e "${RED}错误: 未找到 .env.production 文件${NC}"
  echo "请先创建 .env.production 文件并配置数据库连接"
  echo ""
  echo "参考配置："
  echo 'DATABASE_URL="postgresql://username:password@your-host:5432/hcy_website"'
  echo 'ADMIN_PASSWORD="your-strong-password"'
  echo 'NEXT_PUBLIC_SITE_URL="https://your-domain.com"'
  exit 1
fi

# 检查必需的环境变量
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}错误: .env.production 中未设置 DATABASE_URL${NC}"
  exit 1
fi

# 隐藏密码显示
DB_DISPLAY="${DATABASE_URL%:*}@***"
echo -e "${YELLOW}数据库: ${DB_DISPLAY}${NC}"
echo -e "${YELLOW}网站地址: ${NEXT_PUBLIC_SITE_URL:-未设置}${NC}"
echo ""

# 询问是否运行数据迁移
echo -e "${YELLOW}────────────────────────────────────${NC}"
read -p "是否首次部署？需要运行数据迁移吗？(y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}正在构建镜像...${NC}"
  docker build --build-arg STANDALONE=true -t hcy-website:latest .

  echo -e "${YELLOW}正在运行数据库迁移...${NC}"
  docker run --rm \
    -e DATABASE_URL="$DATABASE_URL" \
    hcy-website:latest \
    sh -c "npx prisma db push --accept-data-loss && npm run migrate:data"

  echo -e "${GREEN}✓ 数据迁移完成${NC}"
  echo ""
fi

# 停止旧容器
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 启动新容器
echo -e "${YELLOW}启动服务...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# 等待容器启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 8

# 检查容器状态
if docker ps | grep -q hcy-website; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}   ✓ 部署成功！${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "网站地址: ${BLUE}${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}${NC}"
  echo -e "后台管理: ${BLUE}${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}/admin${NC}"
  echo ""
  echo "常用命令："
  echo "  查看日志: docker-compose -f docker-compose.prod.yml logs -f"
  echo "  停止服务: docker-compose -f docker-compose.prod.yml down"
  echo "  重启服务: docker-compose -f docker-compose.prod.yml restart"
  echo ""
else
  echo -e "${RED}✗ 容器启动失败${NC}"
  echo ""
  echo "查看错误日志:"
  echo "  docker-compose -f docker-compose.prod.yml logs"
  exit 1
fi
