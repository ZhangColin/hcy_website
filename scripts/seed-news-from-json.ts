/**
 * Migration Script: Import static news data from JSON to database
 *
 * Run: npx ts-node --esm scripts/seed-news-from-json.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env file
config();

// Create adapter with connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

interface NewsArticleJson {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
}

interface NewsDataJson {
  articles: NewsArticleJson[];
}

async function main() {
  console.log('🌱 Starting news data migration...\n');

  // 1. Read JSON file
  const jsonPath = join(process.cwd(), 'data', 'news.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const data: NewsDataJson = JSON.parse(jsonContent);

  console.log(`📄 Found ${data.articles.length} articles in news.json\n`);

  // 2. Check existing data
  const existingArticles = await prisma.newsArticle.findMany({
    select: { slug: true, title: true },
  });

  if (existingArticles.length > 0) {
    console.log(`⚠️  Database already has ${existingArticles.length} articles:`);
    existingArticles.forEach((a) => console.log(`   - ${a.slug}: ${a.title}`));
    console.log('');

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('Continue with import? (will skip existing slugs) [y/N]: ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Migration cancelled');
      return;
    }
  }

  const existingSlugs = new Set(existingArticles.map((a) => a.slug));

  // 3. Import articles
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const article of data.articles) {
    try {
      // Skip if slug already exists
      if (existingSlugs.has(article.slug)) {
        console.log(`⏭️  Skipped (exists): ${article.slug}`);
        skipped++;
        continue;
      }

      // Convert date string to Date object
      const dateObj = new Date(article.date);

      if (isNaN(dateObj.getTime())) {
        console.error(`❌ Invalid date for article "${article.title}": ${article.date}`);
        errors++;
        continue;
      }

      // Create article
      await prisma.newsArticle.create({
        data: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          date: dateObj,
          image: article.image || null,
          featured: false,
          showOnHomepage: true,
          published: true,
          views: 0,
        },
      });

      console.log(`✅ Created: ${article.slug} - ${article.title}`);
      created++;
      existingSlugs.add(article.slug); // Track for duplicate detection within same batch
    } catch (error) {
      console.error(`❌ Error creating article "${article.title}":`, error);
      errors++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Migration Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors:  ${errors}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (created > 0) {
    console.log('\n✨ Migration completed successfully!');
  } else if (skipped > 0 && errors === 0) {
    console.log('\n✨ All articles already exist in database');
  } else {
    console.log('\n⚠️  Migration completed with some issues');
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
