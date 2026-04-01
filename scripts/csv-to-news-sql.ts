/**
 * 从 CSV 文件生成新闻迁移 SQL
 *
 * 1. 读取 CSV 文件
 * 2. 图片上传到 COS
 * 3. 写入 SQL 文件
 */

import { promises as fs } from 'fs';
import { config } from 'dotenv';
import { pinyin } from 'pinyin-pro';
import COS from 'cos-nodejs-sdk-v5';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createId } from '@paralleldrive/cuid2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env') });

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const COS_BUCKET = process.env.COS_BUCKET || 'hcy-website-1415442236';
const COS_REGION = process.env.COS_REGION || 'ap-beijing';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
const CSV_FILE = join(__dirname, '..', 'docs', 'news_export.csv');
const OUTPUT_FILE = join(__dirname, '..', 'sql', 'news-migration.sql');

// 解析 CSV 行（处理带引号的字段）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // 跳过下一个引号
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// 解析中文日期
function parseChineseDate(dateStr: string): Date {
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return new Date();
}

// 生成 slug
function generateSlug(title: string): string {
  const pinyinStr = pinyin(title, { pattern: 'first', toneType: 'none' })
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${pinyinStr}-${date}-${random}`;
}

// 上传图片到 COS
async function uploadImage(image: string): Promise<string | null> {
  if (!image || image.trim() === '') return null;
  image = image.trim();

  // Base64
  const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (base64Match) {
    const [, format, base64Data] = base64Match;
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 10 * 1024 * 1024) return null;

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const key = `news/${date}-${randomUUID()}.${format}`;

    await new Promise<void>((resolve, reject) => {
      cos.putObject({
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        Body: buffer,
      }, (err, data) => err ? reject(err) : resolve());
    });

    return `${IMAGE_BASE_URL}/${key}`;
  }

  // URL
  if (image.startsWith('http')) {
    return image.includes('undefined') ? null : image;
  }

  return null;
}

// 转义 SQL 字符串
function escapeSql(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

interface NewsRow {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  order: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  image_alt: string;
  image: string;
  updated_at: string;
  content: string;
}

async function main() {
  console.error('📄 读取 CSV 文件...\n');

  const csvContent = await fs.readFile(CSV_FILE, 'utf-8');
  const lines = csvContent.trim().split('\n');

  // 解析表头
  const headers = parseCSVLine(lines[0]);

  // 解析数据行
  const allRows: NewsRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Partial<NewsRow> = {};
    headers.forEach((header, index) => {
      row[header as keyof NewsRow] = values[index] || '';
    });
    allRows.push(row as NewsRow);
  }

  console.error(`✅ 找到 ${allRows.length} 篇新闻\n`);

  // 收集所有 SQL 语句
  const sqlLines: string[] = [];

  sqlLines.push(`-- 新闻迁移 SQL`);
  sqlLines.push(`-- 共 ${allRows.length} 篇`);
  sqlLines.push(`-- 生成时间: ${new Date().toLocaleString('zh-CN')}`);
  sqlLines.push('');

  for (let i = 0; i < allRows.length; i++) {
    const row = allRows[i];
    console.error(`📰 [${i + 1}/${allRows.length}] ${row.title}`);

    const dateObj = parseChineseDate(row.date);
    const slug = generateSlug(row.title);

    console.error('   🖼️  处理图片...');
    const imageUrl = await uploadImage(row.image);

    if (imageUrl) {
      console.error('   ✅ 图片已上传');
    } else {
      console.error('   ⚠️  无图片或上传失败');
    }

    const imageSql = imageUrl ? `'${escapeSql(imageUrl)}'` : 'NULL';

    const id = createId();

    sqlLines.push(`-- ${row.title}`);
    sqlLines.push(`-- 日期: ${row.date}`);
    sqlLines.push(`INSERT INTO "NewsArticle" (id, slug, title, excerpt, content, category, "date", image, featured, "showOnHomepage", published, views, "createdAt", "updatedAt")`);
    sqlLines.push(`VALUES ('${id}', '${slug}', '${escapeSql(row.title)}', '${escapeSql(row.excerpt)}', '${escapeSql(row.content)}', '${escapeSql(row.category)}', '${dateObj.toISOString()}', ${imageSql}, false, true, true, 0, NOW(), NOW());`);
    sqlLines.push('');
  }

  // 写入文件
  console.error(`\n📝 写入文件: ${OUTPUT_FILE}`);
  await fs.mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, sqlLines.join('\n'), 'utf-8');

  console.error('');
  console.error('✅ 完成！');
  console.error(`📄 SQL 文件: ${OUTPUT_FILE}`);
}

main().catch(console.error);
