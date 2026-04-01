/**
 * 生成新闻迁移 SQL 文件
 *
 * 1. 从旧数据库读取新闻（使用分页查询避免超时）
 * 2. 图片上传到 COS
 * 3. 写入 SQL 文件
 */

import { Pool } from 'pg';
import { config } from 'dotenv';
import { pinyin } from 'pinyin-pro';
import COS from 'cos-nodejs-sdk-v5';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env') });

const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL!;
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const COS_BUCKET = process.env.COS_BUCKET || 'hcy-website-1415442236';
const COS_REGION = process.env.COS_REGION || 'ap-beijing';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
const OUTPUT_FILE = join(__dirname, '..', 'sql', 'news-migration.sql');

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
  content: string;
  category: string;
  date: string;
  image: string;
}

// 单次查询函数（带超时）
async function queryOne(pool: Pool, sql: string, timeoutMs: number = 60000): Promise<NewsRow[]> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Query timeout')), timeoutMs);

    pool.connect((err, client) => {
      if (err) {
        clearTimeout(timeout);
        return reject(err);
      }

      client.query(sql, (err2, result: { rows: NewsRow[] }) => {
        clearTimeout(timeout);
        client.release();

        if (err2) return reject(err2);
        resolve(result.rows);
      });
    });
  });
}

async function main() {
  console.error('📡 连接旧数据库...\n');

  const pool = new Pool({
    connectionString: OLD_DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 30000,
  });

  try {
    // 首先获取所有 ID
    console.error('   获取所有新闻 ID...');
    const ids = await queryOne(
      pool,
      `SELECT id FROM news ORDER BY date DESC`
    );
    console.error(`✅ 找到 ${ids.length} 篇新闻\n`);

    const allRows: NewsRow[] = [];

    // 逐条获取完整数据
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i].id;
      console.error(`   获取第 ${i + 1}/${ids.length} 篇...`);

      try {
        const rows = await queryOne(
          pool,
          `SELECT id, title, excerpt, content, category, date, image
           FROM news
           WHERE id = '${id}'`,
          60000  // 60秒超时
        );

        if (rows.length > 0) {
          allRows.push(rows[0]);
          console.error(`      ✅ ${rows[0].title.substring(0, 30)}...`);
        }
      } catch (e) {
        console.error(`      ⚠️  跳过 ID ${id}:`, (e as Error).message);
      }
    }

    await pool.end();

    console.error(`\n✅ 获取完成，共 ${allRows.length} 篇新闻\n`);

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

      sqlLines.push(`-- ${row.title}`);
      sqlLines.push(`-- 日期: ${row.date}`);
      sqlLines.push(`INSERT INTO "NewsArticle" (slug, title, excerpt, content, category, "date", image, featured, "showOnHomepage", published, views, "createdAt", "updatedAt")`);
      sqlLines.push(`VALUES ('${slug}', '${escapeSql(row.title)}', '${escapeSql(row.excerpt)}', '${escapeSql(row.content)}', '${escapeSql(row.category)}', '${dateObj.toISOString()}', ${imageSql}, false, true, true, 0, NOW(), NOW());`);
      sqlLines.push('');
    }

    // 写入文件
    console.error(`\n📝 写入文件: ${OUTPUT_FILE}`);
    writeFileSync(OUTPUT_FILE, sqlLines.join('\n'), 'utf-8');

    console.error('');
    console.error('✅ 完成！');
    console.error(`📄 SQL 文件: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ 错误:', error);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

main();
