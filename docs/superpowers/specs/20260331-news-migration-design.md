# News Migration Design

> **一次性脚本**: 从旧数据库读取新闻，上传图片到 COS，生成 SQL 文件

## Goal

从 aieducenter.com 旧数据库迁移约 17 篇新闻文章到新数据库。

## Approach

1. 使用 `pg` 直接连接旧数据库读取数据
2. 处理图片字段：Base64 上传到 COS / URL 验证
3. 生成 SQL INSERT 语句写入文件
4. 手动执行 SQL 文件

## Data Mapping

| Old Field | New Field | Processing |
|-----------|-----------|------------|
| title | title | 直接使用 |
| excerpt | excerpt | 直接使用 |
| content | content | 直接使用 |
| category | category | 直接使用 |
| date (Chinese) | date | 解析 "2025年7月30日" → DateTime |
| image (base64/URL) | image | 上传 COS / 验证 URL |
| - | slug | 标题 → 拼音 → URL slug |
| - | featured | 默认 false |
| - | showOnHomepage | 默认 true |
| - | published | 默认 true |
| - | views | 默认 0 |
| - | createdAt, updatedAt | NOW() |

## Tech Stack

- `pg` - PostgreSQL 连接
- `cos-nodejs-sdk-v5` - 腾讯云 COS 上传
- `pinyin-pro` - 中文转拼音 slug

## Files

- **Script**: `scripts/generate-news-sql.ts`
- **Output**: `sql/news-migration.sql`
- **Env**: `.env` (OLD_DATABASE_URL, COS_*)

## SQL Output Format

```sql
-- 标题: xxx
-- 日期: xxx
INSERT INTO "NewsArticle" (slug, title, excerpt, content, category, "date", image, featured, "showOnHomepage", published, views, "createdAt", "updatedAt")
VALUES ('...', '...', '...', '...', '...', '2025-07-30T00:00:00.000Z', 'https://...', false, true, true, 0, NOW(), NOW());
```

## Error Handling

- 图片上传失败 → 记录警告，image 设为 NULL
- 日期解析失败 → 使用当前日期
- 无效 URL → 跳过该图片
