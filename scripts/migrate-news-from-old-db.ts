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

  // Test database connections
  console.log('📡 Testing database connections...');

  let oldPool: Pool | null = null;
  let newPrisma: PrismaClient | null = null;

  try {
    oldPool = createOldDBPool();
    const oldClient = await oldPool.connect();
    const result = await oldClient.query('SELECT COUNT(*) as count FROM news');
    console.log(`   ✓ Old database: ${result.rows[0].count} articles found`);
    oldClient.release();

    newPrisma = createNewDBClient();
    const existingCount = await newPrisma.newsArticle.count();
    console.log(`   ✓ New database: ${existingCount} existing articles`);

    if (existingCount > 0 && !dryRun) {
      console.log('\n⚠️  WARNING: New database already has articles.');
      console.log('   Existing articles with matching slugs will be skipped.\n');
    }
  } catch (error) {
    console.error('   ❌ Database connection failed:', error);
    throw error;
  } finally {
    if (oldPool) await oldPool.end();
    if (newPrisma) await newPrisma.$disconnect();
  }

  console.log('\n✅ Connections verified');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
