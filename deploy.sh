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
  set -a
  source .env.production
  set +a
else
  echo -e "${YELLOW}未找到 .env.production，使用默认配置创建...${NC}"
  cat > .env.production << 'EOF'
# 数据库连接
DATABASE_URL=postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website

# 管理后台密码
ADMIN_PASSWORD=haichuangyuan2026

# 网站访问地址
NEXT_PUBLIC_SITE_URL=https://portal.aieducenter.com

NODE_ENV=production
EOF
  echo -e "${GREEN}✓ 已创建 .env.production${NC}"
  set -a
  source .env.production
  set +a
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

# 检查迁移状态
echo -e "${YELLOW}检查数据库迁移状态...${NC}"
DATABASE_URL="$DATABASE_URL" npm run prisma:check || {
  echo -e "${RED}✗ 迁移检查失败！${NC}"
  echo -e "${YELLOW}请先运行 npm run prisma:migrate 创建迁移文件${NC}"
  exit 1
}
echo ""

# 停止旧容器
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 构建镜像（总是重新构建，使用 docker-compose）
echo -e "${YELLOW}构建镜像...${NC}"
DATABASE_URL="$DATABASE_URL" docker-compose -f docker-compose.prod.yml build

# 启动新容器
echo -e "${YELLOW}启动服务...${NC}"
DATABASE_URL="$DATABASE_URL" docker-compose -f docker-compose.prod.yml up -d

# 等待容器启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 8

# 检查容器状态
if docker ps | grep -q hcy-website; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}   ✓ 容器已启动${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""

  # 检查容器内环境变量
  echo -e "${YELLOW}检查容器内环境变量...${NC}"
  CONTAINER_DB_URL=$(docker exec hcy-website sh -c 'echo $DATABASE_URL' 2>/dev/null || echo "")
  if [ -n "$CONTAINER_DB_URL" ]; then
    echo -e "${GREEN}✓ DATABASE_URL 已设置${NC}"
  else
    echo -e "${RED}✗ DATABASE_URL 未设置！${NC}"
  fi

  # 测试数据库连接
  echo -e "${YELLOW}测试数据库连接...${NC}"
  HEALTH_CHECK=$(curl -s http://localhost:3000/api/health 2>&1)
  if echo "$HEALTH_CHECK" | grep -q '"database":"connected"'; then
    echo -e "${GREEN}✓ 数据库连接正常${NC}"
  else
    echo -e "${RED}✗ 数据库连接失败${NC}"
    echo -e "${YELLOW}  响应: $HEALTH_CHECK${NC}"
  fi

  # 测试首页
  echo -e "${YELLOW}测试首页访问...${NC}"
  HOME_PAGE=$(curl -s http://localhost:3000/ 2>&1)
  if echo "$HOME_PAGE" | grep -q "html"; then
    echo -e "${GREEN}✓ 首页正常${NC}"
  else
    echo -e "${RED}✗ 首页访问失败${NC}"
    echo -e "${YELLOW}  响应: $(echo "$HOME_PAGE" | head -c 200)${NC}"
    echo -e "${YELLOW}  查看日志: docker logs hcy-website${NC}"
  fi

  # 测试后台
  echo -e "${YELLOW}测试后台访问...${NC}"
  if curl -sf http://localhost:3000/admin > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后台正常${NC}"
  else
    echo -e "${RED}✗ 后台访问失败${NC}"
  fi

  echo ""
  echo -e "网站地址: ${BLUE}${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}${NC}"
  echo -e "后台管理: ${BLUE}${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}/admin${NC}"
  echo ""
  echo "常用命令："
  echo "  查看日志: docker-compose -f docker-compose.prod.yml logs -f"
  echo "  停止服务: docker-compose -f docker-compose.prod.yml down"
  echo "  重启服务: docker-compose -f docker-compose.prod.yml restart"
  echo "  进入容器: docker exec -it hcy-website sh"
  echo ""
else
  echo -e "${RED}✗ 容器启动失败${NC}"
  echo ""
  echo "查看错误日志:"
  echo "  docker-compose -f docker-compose.prod.yml logs"
  exit 1
fi
