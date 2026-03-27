#!/bin/bash
# 本地发布脚本 - 将项目拷贝到服务器并触发部署

set -e

# ═══════════════════════════════════════════════════════════════
# 服务器配置
# ═══════════════════════════════════════════════════════════════

SERVER_USER="root"
SERVER_HOST="43.140.211.9"
SERVER_PATH="/opt/hcy/hcy_website"

# SSH 密码登录
SERVER_PASSWORD="Hcy@20260327"

# ═══════════════════════════════════════════════════════════════

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   海创元网站 - 本地发布脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 sshpass
if ! command -v sshpass &> /dev/null; then
  echo -e "${YELLOW}未安装 sshpass，正在安装...${NC}"
  brew install hudochenkov/sshpass/sshpass 2>/dev/null || {
    echo -e "${RED}安装失败，请手动安装: brew install hudochenkov/sshpass/sshpass${NC}"
    exit 1
  }
fi

# 检查配置
if [ "$SERVER_HOST" = "your-server-ip" ]; then
  echo -e "${RED}错误: 请先修改脚本中的服务器配置${NC}"
  exit 1
fi

# 构建 SSH/SCP 命令
if [ -n "$SSH_KEY" ]; then
  SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"
  SCP="scp -i $SSH_KEY -o StrictHostKeyChecking=no"
elif [ -n "$SERVER_PASSWORD" ]; then
  SSH="sshpass -p $SERVER_PASSWORD ssh -o StrictHostKeyChecking=no"
  SCP="sshpass -p $SERVER_PASSWORD scp -o StrictHostKeyChecking=no"
else
  SSH="ssh -o StrictHostKeyChecking=no"
  SCP="scp -o StrictHostKeyChecking=no"
fi

echo -e "${BLUE}服务器: ${SERVER_USER}@${SERVER_HOST}${NC}"
echo -e "${BLUE}部署路径: ${SERVER_PATH}${NC}"
echo ""

# 询问是否首次部署
echo -e "${YELLOW}────────────────────────────────────${NC}"
read -p "首次部署？需要在服务器上创建 .env.production 吗？(y/n): " -n 1 -r
echo ""
FIRST_DEPLOY=$REPLY

# 创建临时目录打包
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}正在打包项目...${NC}"

# 拷贝必要文件（排除不需要的）
rsync -av --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  ./ "$TEMP_DIR/" > /dev/null

echo -e "${GREEN}✓ 打包完成${NC}"

# 创建服务器目录
echo -e "${YELLOW}正在连接服务器...${NC}"
$SSH ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"

# 拷贝文件到服务器
echo -e "${YELLOW}正在上传文件到服务器...${NC}"
$SCP -r "$TEMP_DIR/"* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# 清理临时目录
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✓ 上传完成${NC}"

# 首次部署：创建 .env.production
if [[ $FIRST_DEPLOY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}创建 .env.production...${NC}"
  $SSH ${SERVER_USER}@${SERVER_HOST} "cat > ${SERVER_PATH}/.env.production << 'EOFP'
DATABASE_URL=\"postgresql://hcy_pgsql:hcy_admin_pgsql@postgres-server:5432/hcy_website\"
ADMIN_PASSWORD=\"haichuangyuan2026\"
NEXT_PUBLIC_SITE_URL=\"https://portal.aieducenter.com\"
NODE_ENV=\"production\"
EOFP"
  echo -e "${GREEN}✓ .env.production 已创建${NC}"
fi

# 在服务器上执行部署
echo ""
echo -e "${YELLOW}────────────────────────────────────${NC}"
echo -e "${YELLOW}正在服务器上执行部署...${NC}"
echo ""

$SSH ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_PATH} && bash deploy.sh"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ 发布完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "访问地址: https://portal.aieducenter.com"
