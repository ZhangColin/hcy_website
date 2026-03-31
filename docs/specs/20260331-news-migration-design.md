# 新闻数据迁移设计文档

**日期:** 2026-03-31
**作者:** Claude Code
**状态:** 设计中

## 概述

从旧官网数据库（aieducenter.com）一次性迁移 17 篇新闻文章到新网站数据库。

## 背景

- 旧网站：https://www.aieducenter.com/news
- 新网站：hcy_website（Next.js + Prisma + PostgreSQL）
- 迁移原因：旧网站数据需要迁移到新网站
- 数据规模：17 篇新闻

## 旧数据库结构

```sql
CREATE TABLE news (
  id               varchar PRIMARY KEY,
  title            text NOT NULL,
  excerpt          text NOT NULL,
  content          text NOT NULL DEFAULT '',
  category         text NOT NULL,
  date             text NOT NULL,          -- 格式: "2025年7月30日"
  image            text NOT NULL,          -- base64 或 URL
  "order"          integer NOT NULL DEFAULT 0,
  updated_at       timestamp,
  meta_title       text,
  meta_description text,
  keywords         text,
  image_alt        text
);
```

## 新数据库结构

```prisma
model NewsArticle {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  excerpt       String
  content       String
  category      String
  date          DateTime
  image         String?
  featured      Boolean  @default(false)
  showOnHomepage Boolean @default(true)
  published     Boolean  @default(true)
  views         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 数据映射

| 旧字段 | 新字段 | 转换逻辑 |
|--------|--------|----------|
| title | title | 直接映射 |
| excerpt | excerpt | 直接映射 |
| content | content | 直接映射 |
| category | category | 直接映射 |
| date (文本) | date (DateTime) | 解析中文日期 |
| - | slug | 使用 pinyin-pro 从标题生成 |
| image (base64/URL) | image (URL) | base64 上传到 COS，URL 直接使用 |
| - | featured | 默认 `false` |
| - | showOnHomepage | 默认 `true` |
| - | published | 默认 `true` |
| - | views | 默认 `0` |

## 组件设计

### scripts/migrate-news.ts

```typescript
// 主要函数
interface OldNewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  order: number;
  updated_at?: Date;
}

// 1. 连接旧数据库
async function connectOldDB(): Promise<Pool>

// 2. 解析中文日期
// 输入: "2025年7月30日" 或 "2024年9月5日"
// 输出: Date 对象
function parseChineseDate(dateStr: string): Date

// 3. 生成拼音 slug
// 输入: "海创元AI研学科创营纪实"
// 输出: "hai-chuang-yuan-ai-yan-xue-ke-chuang-ying-ji-shi"
function generateSlug(title: string): string

// 4. 处理图片
// - 如果是 base64，上传到 COS 并返回 URL
// - 如果是 URL 且有效，直接使用
// - 否则返回 null
async function processImage(image: string): Promise<string | null>

// 5. 主迁移函数
async function migrateNews(): Promise<MigrationResult>

interface MigrationResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}
```

## 依赖

- `pg`: 连接旧 PostgreSQL 数据库
- `@prisma/client`: 写入新数据库
- `pinyin-pro`: 生成 slug
- `cos-nodejs-sdk-v5`: 上传图片

## 环境变量

需要添加到 `.env`:

```env
# 旧数据库连接（临时使用，迁移后可删除）
OLD_DATABASE_URL=postgresql://...
```

## 执行步骤

1. 配置旧数据库连接
2. 运行迁移脚本: `npm run migrate:news`
3. 检查迁移结果
4. 验证新数据库数据
5. 删除旧数据库连接配置

## 错误处理

| 场景 | 处理方式 |
|------|----------|
| 日期解析失败 | 使用当前日期，记录警告 |
| 图片上传失败 | 记录错误，继续迁移，image 设为 null |
| slug 重复 | 追加随机后缀确保唯一 |
| 单条记录失败 | 记录错误，继续处理下一条 |
| 数据库连接失败 | 中止迁移，输出错误信息 |

## 测试计划

1. 先在开发环境测试
2. 验证数据完整性（数量、内容）
3. 验证图片正确显示
4. 验证前端页面正常展示
5. 生产环境执行

## 回滚计划

如果迁移有问题：
1. 删除新数据库中的 NewsArticle 记录
2. 检查错误日志
3. 修复问题后重新迁移
