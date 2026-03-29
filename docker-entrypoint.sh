#!/bin/sh
set -e

echo "========================================="
echo "   海创元网站 - 容器启动"
echo "========================================="
echo ""

# 运行数据库迁移（会自动等待数据库可用）
echo "运行数据库迁移..."
if npx prisma migrate deploy; then
  echo "✓ 数据库迁移完成"
else
  echo "⚠ 迁移失败，尝试使用 prisma db push 同步 schema..."
  if npx prisma db push --skip-generate; then
    echo "✓ Schema 同步完成"
  else
    echo "✗ 数据库同步失败，请检查 DATABASE_URL"
    exit 1
  fi
fi

# 启动应用
echo "启动应用..."
exec node server.js
