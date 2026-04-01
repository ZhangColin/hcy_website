#!/bin/bash
# 从旧数据库导出新闻数据为 JSON 格式
# 使用 psql 逐条查询避免超时

set -e

# 数据库连接参数
DB_HOST="ep-crimson-pond-aerhorvq.c-2.us-east-2.aws.neon.tech"
DB_PORT="5432"
DB_NAME="neondb"
DB_USER="neondb_owner"
DB_PASS="npg_5Nr2XuYPUfge"
OUTPUT_DIR="scripts/news-data"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo "正在获取所有新闻 ID..."

# 获取所有 ID
IDS=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id FROM news ORDER BY date DESC" -t | grep -v '^$')

# 转换为数组
ID_ARRAY=($(echo "$IDS" | tr '\n' ' '))

TOTAL=${#ID_ARRAY[@]}
echo "找到 $TOTAL 篇新闻"
echo ""

# 逐条导出
for i in "${!ID_ARRAY[@]}"; do
  ID="${ID_ARRAY[$i]}"
  NUM=$((i + 1))

  echo "[$NUM/$TOTAL] 导出 ID: $ID"

  # 导出单条记录为 JSON
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -c "SELECT json_build_object(
      'id', id,
      'title', title,
      'excerpt', excerpt,
      'content', content,
      'category', category,
      'date', date,
      'image', image
    ) FROM news WHERE id = '$ID'" -t > "$OUTPUT_DIR/${ID}.json" 2>/dev/null

  if [ -s "$OUTPUT_DIR/${ID}.json" ]; then
    # 提取标题显示
    TITLE=$(cat "$OUTPUT_DIR/${ID}.json" 2>/dev/null | jq -r '.title' 2>/dev/null | head -c 50)
    echo "   ✅ $TITLE..."
  else
    echo "   ❌ 导出失败"
  fi
done

echo ""
echo "完成！数据已保存到 $OUTPUT_DIR/"
