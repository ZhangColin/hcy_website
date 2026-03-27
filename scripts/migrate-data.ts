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
  const home = await readJsonFile(path.join(dataDir, 'home.json'), 'home.json')
  const news = await readJsonFile(path.join(dataDir, 'news.json'), 'news.json')
  const about = await readJsonFile(path.join(dataDir, 'about.json'), 'about.json')
  const cases = await readJsonFile(path.join(dataDir, 'cases.json'), 'cases.json')
  const contact = await readJsonFile(path.join(dataDir, 'contact.json'), 'contact.json')
  const join = await readJsonFile(path.join(dataDir, 'join.json'), 'join.json')
  const site = await readJsonFile(path.join(dataDir, 'site.json'), 'site.json')
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
        heroSlides: home.heroSlides,
        dataStrip: home.dataStrip,
        highlights: home.highlights,
        partners: home.partners,
      },
    })
    console.log('✓ Home content migrated')

    // Migrate news articles
    for (const article of news.articles) {
      await tx.newsArticle.create({
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          date: new Date(article.date),
          image: article.image,
        },
      })
    }
    console.log(`✓ News articles migrated (${news.articles.length} records)`)

    // Migrate about content
    await tx.aboutContent.create({
      data: {
        intro: about.intro,
        culture: about.culture,
        timeline: about.timeline,
        honors: about.honors,
        partners: about.partners,
      },
    })
    console.log('✓ About content migrated')

    // Migrate school cases
    for (const item of cases.schoolCases) {
      await tx.schoolCase.create({
        data: {
          name: item.name,
          type: item.type,
          region: item.region,
          stage: item.stage,
          summary: item.summary,
        },
      })
    }
    console.log(`✓ School cases migrated (${cases.schoolCases.length} records)`)

    // Migrate competition honors
    for (const item of cases.competitionHonors) {
      await tx.competitionHonor.create({
        data: {
          title: item.title,
          level: item.level,
          year: item.year,
        },
      })
    }
    console.log(`✓ Competition honors migrated (${cases.competitionHonors.length} records)`)

    // Migrate contact info
    await tx.contactInfo.create({
      data: {
        address: contact.address,
        contacts: contact.contacts,
      },
    })
    console.log('✓ Contact info migrated')

    // Migrate job positions
    for (const item of join.jobPositions) {
      await tx.jobPosition.create({
        data: {
          title: item.title,
          department: item.department,
          location: item.location,
          type: item.type,
          description: item.description,
          requirements: item.requirements,
        },
      })
    }
    console.log(`✓ Job positions migrated (${join.jobPositions.length} records)`)

    // Migrate site config
    await tx.siteConfig.create({
      data: {
        companyName: site.companyName,
        shortName: site.shortName,
        address: site.address,
        icp: site.icp,
        copyright: site.copyright,
        friendlyLinks: site.friendlyLinks,
        socialLinks: site.socialLinks,
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
