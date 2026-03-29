#!/bin/bash
# 检查数据库迁移状态
# 确保所有 schema 更改都被迁移文件记录

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   数据库迁移状态检查${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查迁移状态
echo -e "${YELLOW}检查迁移状态...${NC}"
STATUS=$(npx prisma migrate status 2>&1)

echo "$STATUS"
echo ""

# 检查是否有未应用的迁移
if echo "$STATUS" | grep -q "have not yet been applied"; then
  echo -e "${RED}✗ 有未应用的迁移！${NC}"
  echo -e "${YELLOW}请运行: npm run prisma:migrate${NC}"
  exit 1
fi

# 检查 schema 是否同步
if echo "$STATUS" | grep -q "out of sync"; then
  echo -e "${YELLOW}⚠ Schema 与数据库不同步${NC}"
  echo -e "${YELLOW}请创建迁移: npm run prisma:migrate${NC}"
  echo -e "${YELLOW}或强制同步: npm run prisma:push${NC}"
  exit 1
fi

# 检查是否有未迁移的 schema 更改
# prisma migrate status 已经检查过了，如果显示 "Database schema is up to date" 就说明没问题
if echo "$STATUS" | grep -q "Database schema is up to date"; then
  echo -e "${GREEN}✓ Schema 与数据库完全同步${NC}"
else
  echo -e "${YELLOW}⚠ Schema 与数据库不同步${NC}"
  echo -e "${YELLOW}请创建迁移文件来记录更改:${NC}"
  echo -e "  npm run prisma:migrate -- --name describe_changes"
  exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ 迁移状态正常${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "迁移文件列表:"
ls -1 prisma/migrations/ | grep -v migration_lock
