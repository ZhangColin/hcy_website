/**
 * Data Migration Script
 *
 * This script migrates initial data from JSON files in the /data directory
 * into the PostgreSQL database. It is idempotent-safe and will abort if
 * data already exists to prevent accidental data loss.
 *
 * Usage: npm run migrate:data
 *
 * Default admin credentials:
 *   Username: admin
 *   Password: haichuangyuan2026
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { config } from 'dotenv'
import type { Prisma } from '@prisma/client'

// Load .env file
config()

// Create adapter with connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// Data files to migrate
const DATA_FILES = ['home.json', 'news.json', 'about.json', 'cases.json', 'contact.json', 'join.json', 'site.json'] as const

/**
 * Validate that all required data files exist
 */
function validateDataFiles(dataDir: string): void {
  const missing = DATA_FILES.filter(file => !existsSync(path.join(dataDir, file)))
  if (missing.length > 0) {
    throw new Error(`Missing required data files: ${missing.join(', ')}`)
  }
}

/**
 * Read and parse a JSON file with error context
 */
async function readJsonFile<T>(filePath: string, fileName: string): Promise<T> {
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch (error) {
    throw new Error(`Failed to parse ${fileName}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function migrate() {
  console.log('Starting data migration...\n')

  // Idempotency check: abort if data already exists
  const existingCount = await prisma.homeContent.count()
  if (existingCount > 0) {
    console.error('Database already contains data. Aborting migration to prevent data loss.')
    console.error('If you want to re-migrate, please clear the database first.')
    process.exit(1)
  }

  // Validate data files exist before proceeding
  const dataDir = path.join(process.cwd(), 'data')
  validateDataFiles(dataDir)
  console.log('✓ All required data files found')

  // Read all JSON files
  const home = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'home.json'), 'home.json')
  const news = await readJsonFile<{ articles: unknown[] }>(path.join(dataDir, 'news.json'), 'news.json')
  const about = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'about.json'), 'about.json')
  const cases = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'cases.json'), 'cases.json')
  const contact = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'contact.json'), 'contact.json')
  const join = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'join.json'), 'join.json')
  const site = await readJsonFile<Record<string, unknown>>(path.join(dataDir, 'site.json'), 'site.json')
  console.log('✓ Data files parsed successfully')

  // Wrap entire migration in a transaction for atomicity
  await prisma.$transaction(async (tx) => {
    // Clear existing data (should be empty due to idempotency check)
    await tx.homeContent.deleteMany()
    await tx.newsArticle.deleteMany()
    await tx.aboutContent.deleteMany()
    await tx.schoolCase.deleteMany()
    await tx.competitionHonor.deleteMany()
    await tx.contactInfo.deleteMany()
    await tx.jobPosition.deleteMany()
    await tx.siteConfig.deleteMany()
    await tx.adminUser.deleteMany()

    // Migrate home content
    await tx.homeContent.create({
      data: {
        heroSlides: home.heroSlides as Prisma.InputJsonValue,
        dataStrip: home.dataStrip as Prisma.InputJsonValue,
        highlights: home.highlights as Prisma.InputJsonValue,
        partners: home.partners as Prisma.InputJsonValue,
      },
    })
    console.log('✓ Home content migrated')

    // Migrate news articles
    for (const article of news.articles as Array<Record<string, unknown>>) {
      await tx.newsArticle.create({
        data: {
          title: String(article.title),
          excerpt: String(article.excerpt),
          content: String(article.content),
          category: String(article.category),
          date: new Date(String(article.date)),
          image: article.image ? String(article.image) : null,
        },
      })
    }
    console.log(`✓ News articles migrated (${(news.articles as unknown[]).length} records)`)

    // Migrate about content
    await tx.aboutContent.create({
      data: {
        intro: about.intro as Prisma.InputJsonValue,
        culture: about.culture as Prisma.InputJsonValue,
        timeline: about.timeline as Prisma.InputJsonValue,
        honors: about.honors as Prisma.InputJsonValue,
        partners: about.partners as Prisma.InputJsonValue,
      },
    })
    console.log('✓ About content migrated')

    // Migrate school cases
    for (const item of cases.schoolCases as Array<Record<string, unknown>>) {
      await tx.schoolCase.create({
        data: {
          name: String(item.name),
          type: String(item.type),
          region: String(item.region),
          stage: String(item.stage),
          summary: String(item.summary),
        },
      })
    }
    console.log(`✓ School cases migrated (${(cases.schoolCases as unknown[]).length} records)`)

    // Migrate competition honors
    for (const item of cases.competitionHonors as Array<Record<string, unknown>>) {
      await tx.competitionHonor.create({
        data: {
          title: String(item.title),
          level: String(item.level),
          year: String(item.year),
        },
      })
    }
    console.log(`✓ Competition honors migrated (${(cases.competitionHonors as unknown[]).length} records)`)

    // Migrate contact info
    await tx.contactInfo.create({
      data: {
        address: String(contact.address),
        contacts: contact.contacts as Prisma.InputJsonValue,
      },
    })
    console.log('✓ Contact info migrated')

    // Migrate job positions
    for (const item of join.jobPositions as Array<Record<string, unknown>>) {
      await tx.jobPosition.create({
        data: {
          title: String(item.title),
          department: String(item.department),
          location: String(item.location),
          type: String(item.type),
          description: String(item.description),
          requirements: item.requirements as Prisma.InputJsonValue,
        },
      })
    }
    console.log(`✓ Job positions migrated (${(join.jobPositions as unknown[]).length} records)`)

    // Migrate site config
    await tx.siteConfig.create({
      data: {
        companyName: String(site.companyName),
        shortName: String(site.shortName),
        address: String(site.address),
        icp: String(site.icp),
        copyright: String(site.copyright),
        friendlyLinks: site.friendlyLinks as Prisma.InputJsonValue,
        socialLinks: site.socialLinks as Prisma.InputJsonValue,
      },
    })
    console.log('✓ Site config migrated')

    // Create default admin user
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('haichuangyuan2026', 10)
    await tx.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '管理员',
        role: 'ADMIN',
      },
    })
    console.log('✓ Default admin user created (username: admin, password: haichuangyuan2026)')
  })

  console.log('\n✓ Data migration completed successfully!')
}

migrate()
  .catch((error) => {
    console.error('\n✗ Migration failed:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
