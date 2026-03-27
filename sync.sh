#!/bin/bash
# 代码同步脚本 - 仅将本地代码同步到服务器，不触发部署

set -e

# ═══════════════════════════════════════════════════════════════
# 服务器配置
# ═══════════════════════════════════════════════════════════════

SERVER_USER="root"
SERVER_HOST="43.140.211.9"
SERVER_PATH="/opt/hcy/hcy_website"
SERVER_PASSWORD="Hcy@20260327"

# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   代码同步到服务器${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 sshpass
if ! command -v sshpass &> /dev/null; then
  echo -e "${RED}错误: 未安装 sshpass${NC}"
  echo "安装: brew install hudochenkov/sshpass/sshpass"
  exit 1
fi

# 构建 SSH/SCP 命令
SSH="sshpass -p $SERVER_PASSWORD ssh -o StrictHostKeyChecking=no"
SCP="sshpass -p $SERVER_PASSWORD scp -o StrictHostKeyChecking=no"

echo -e "${BLUE}服务器: ${SERVER_USER}@${SERVER_HOST}${NC}"
echo -e "${BLUE}目标路径: ${SERVER_PATH}${NC}"
echo ""

# 创建临时目录打包
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}正在打包项目...${NC}"

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
echo -e "${YELLOW}正在上传文件...${NC}"
$SCP -r "$TEMP_DIR/"* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# 清理临时目录
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✓ 上传完成${NC}"
echo ""
echo -e "${BLUE}下一步，在服务器上执行：${NC}"
echo "  ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  cd ${SERVER_PATH}"
echo "  ./deploy.sh"
