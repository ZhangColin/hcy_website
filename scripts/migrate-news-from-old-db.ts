/**
 * News Migration Script
 *
 * Migrates news articles from the old aieducenter.com database to the new website.
 * Handles:
 * - Chinese date parsing (e.g., "2025年7月30日")
 * - Slug generation from titles using pinyin
 * - Base64 image upload to COS
 * - Dry-run mode for preview
 *
 * Usage:
 *   npm run migrate:old-news          # Run migration
 *   npm run migrate:old-news -- --dry-run  # Preview without changes
 *
 * Environment variables required:
 *   OLD_DATABASE_URL - Connection string to old database
 *   DATABASE_URL - Connection string to new database (already configured)
 *   COS_SECRET_ID, COS_SECRET_KEY - For image upload (already configured)
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';
import { config } from 'dotenv';
import { pinyin } from 'pinyin-pro';
import COS from 'cos-nodejs-sdk-v5';
import { randomUUID } from 'node:crypto';

// Load .env file
config();

// ============================================================================
// TYPES
// ============================================================================

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
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  image_alt?: string;
}

interface MigrationResult {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{ id: string; title: string; error: string }>;
}

interface MigrateOptions {
  dryRun: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;
if (!OLD_DATABASE_URL) {
  console.error('❌ OLD_DATABASE_URL environment variable is required');
  console.error('   Add it to your .env file:');
  console.error('   OLD_DATABASE_URL=postgresql://user:password@host:port/database');
  process.exit(1);
}

// COS configuration (reuse from existing code)
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const COS_CONFIG = {
  bucket: process.env.COS_BUCKET || 'hcy-website-1415442236',
  region: process.env.COS_REGION || 'ap-beijing',
  domain: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '',
};

// ============================================================================
// DATABASE CONNECTIONS
// ============================================================================

/**
 * Create connection pool to old database
 */
function createOldDBPool(): Pool {
  const poolConfig: PoolConfig = {
    connectionString: OLD_DATABASE_URL,
  };

  return new Pool(poolConfig);
}

/**
 * Create Prisma client for new database
 */
function createNewDBClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Parse Chinese date string to Date object
 * Supports formats:
 *   - "2025年7月30日"
 *   - "2025年12月5日"
 *   - "2025-07-30" (ISO format fallback)
 *   - "2025/07/30" (fallback)
 */
function parseChineseDate(dateStr: string): Date {
  // Trim whitespace
  dateStr = dateStr.trim();

  // Try ISO format first (YYYY-MM-DD)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Try slash format (YYYY/MM/DD)
  const slashMatch = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (slashMatch) {
    const [, year, month, day] = slashMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Parse Chinese format: "2025年7月30日" or "2025年12月5日"
  const chineseMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日?/);
  if (chineseMatch) {
    const [, year, month, day] = chineseMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Fallback: try JavaScript's built-in parser
  const jsDate = new Date(dateStr);
  if (!isNaN(jsDate.getTime())) {
    return jsDate;
  }

  // Last resort: use current date and log warning
  console.warn(`   ⚠️  Could not parse date: "${dateStr}", using current date`);
  return new Date();
}

/**
 * Generate URL-friendly slug from Chinese title
 * Uses pinyin-pro to convert Chinese to pinyin, then formats for URL
 *
 * Example: "海创元AI研学科创营纪实" → "hai-chuang-yuan-ai-yan-xue-ke-chuang-ying-ji-shi"
 */
function generateSlug(title: string, existingSlugs: Set<string>): string {
  // Convert to pinyin (first letter of each character)
  const pinyinStr = pinyin(title, {
    pattern: 'first',
    toneType: 'none',
  })
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric with dashes
    .replace(/-+/g, '-')          // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '');       // Remove leading/trailing dashes

  // Generate date suffix from current date
  const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // Add random suffix for uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  let slug = `${pinyinStr}-${dateSuffix}-${randomSuffix}`;

  // Ensure uniqueness
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${pinyinStr}-${dateSuffix}-${randomSuffix}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Process image field:
 * - If base64 data URI, upload to COS and return URL
 * - If http/https URL, validate and use as-is
 * - Otherwise return null
 */
async function processImage(image: string, articleId: string): Promise<string | null> {
  if (!image || image.trim() === '') {
    return null;
  }

  image = image.trim();

  // Check for base64 data URI
  const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (base64Match) {
    const [, format, base64Data] = base64Match;

    try {
      // Convert base64 to Buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Check size (limit to 10MB)
      if (buffer.length > 10 * 1024 * 1024) {
        console.warn(`      ⚠️  Image too large (${(buffer.length / 1024 / 1024).toFixed(2)}MB), skipping`);
        return null;
      }

      // Generate filename
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomId = randomUUID();
      const key = `news/${date}-${randomId}.${format}`;

      // Upload to COS
      await new Promise<void>((resolve, reject) => {
        cos.putObject({
          Bucket: COS_CONFIG.bucket,
          Region: COS_CONFIG.region,
          Key: key,
          Body: buffer,
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const url = `${COS_CONFIG.domain}/${key}`;
      console.log(`      ✅ Uploaded base64 image to COS`);
      return url;

    } catch (error) {
      console.error(`      ❌ Failed to upload base64 image:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  // Check for http/https URL
  if (image.startsWith('http://') || image.startsWith('https://')) {
    // Validate URL format
    try {
      new URL(image);
      // Check for undefined in URL (common bug in old data)
      if (image.includes('undefined')) {
        console.warn(`      ⚠️  Image URL contains 'undefined', skipping`);
        return null;
      }
      console.log(`      ✓ Using existing URL`);
      return image;
    } catch {
      console.warn(`      ⚠️  Invalid URL format, skipping`);
      return null;
    }
  }

  console.warn(`      ⚠️  Unrecognized image format, skipping`);
  return null;
}

// ============================================================================
// MIGRATION FUNCTION
// ============================================================================

/**
 * Main migration function
 */
async function migrateNews(options: MigrateOptions): Promise<MigrationResult> {
  const { dryRun } = options;

  const result: MigrationResult = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Create database connections
  const oldPool = createOldDBPool();
  const newPrisma = createNewDBClient();

  try {
    // Fetch existing slugs from new database
    const existingArticles = await newPrisma.newsArticle.findMany({
      select: { slug: true, title: true },
    });
    const existingSlugs = new Set(existingArticles.map((a) => a.slug));

    console.log(`📥 Fetching articles from old database...`);
    const oldClient = await oldPool.connect();
    const { rows } = await oldClient.query(`
      SELECT id, title, excerpt, content, category, date, image, "order", updated_at
      FROM news
      ORDER BY date DESC, "order" ASC
    `);
    oldClient.release();

    result.total = rows.length;
    console.log(`   Found ${rows.length} articles\n`);

    // Process each article
    for (const row of rows) {
      const article: OldNewsArticle = row;
      console.log(`\n📰 [${result.success + result.failed + 1}/${result.total}] ${article.title}`);

      try {
        // Parse date
        const dateObj = parseChineseDate(article.date);
        console.log(`   📅 Date: ${article.date} → ${dateObj.toISOString().slice(0, 10)}`);

        // Generate slug
        const slug = generateSlug(article.title, existingSlugs);
        console.log(`   🔖 Slug: ${slug}`);
        existingSlugs.add(slug);

        // Process image
        console.log(`   🖼️  Processing image...`);
        const imageUrl = await processImage(article.image, article.id);

        if (!dryRun) {
          // Create article in new database
          await newPrisma.newsArticle.create({
            data: {
              slug,
              title: article.title,
              excerpt: article.excerpt,
              content: article.content,
              category: article.category,
              date: dateObj,
              image: imageUrl,
              featured: false,
              showOnHomepage: true,
              published: true,
              views: 0,
            },
          });
          console.log(`   ✅ Created in database`);
        } else {
          console.log(`   🔍 [DRY RUN] Would create article`);
        }

        result.success++;

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Error: ${errorMsg}`);
        result.errors.push({
          id: article.id,
          title: article.title,
          error: errorMsg,
        });
        result.failed++;
      }
    }

  } finally {
    await oldPool.end();
    await newPrisma.$disconnect();
  }

  return result;
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
  console.log('🌟 News Migration from Old Database\n');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Check for --dry-run flag
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Run migration
  console.log(`\n🚀 Starting migration...\n`);
  const result = await migrateNews({ dryRun });

  // Print summary
  console.log('\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 MIGRATION SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total articles:   ${result.total}`);
  console.log(`   ✅ Successful:    ${result.success}`);
  console.log(`   ⏭️  Skipped:       ${result.skipped}`);
  console.log(`   ❌ Failed:        ${result.failed}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const error of result.errors) {
      console.log(`   - ${error.title}: ${error.error}`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE - No changes were made');
    console.log('   Run without --dry-run to execute migration');
  } else if (result.failed === 0) {
    console.log('\n✨ Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with errors');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
