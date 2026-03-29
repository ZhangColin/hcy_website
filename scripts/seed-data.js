/**
 * Data Seed Script (JavaScript - works in production)
 *
 * Usage: node scripts/seed-data.js
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { readFile } = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');

// Read DATABASE_URL from environment or .env
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Create adapter and client
const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Minimal seed data (when data/ files are not available)
const MINIMAL_SEED = {
  homeContent: {
    heroSlides: [{ title: '海创元AI教育', subtitle: '引领未来教育创新', image: '', cta: '' }],
    dataStrip: [{ icon: '', title: '创新教育', value: '100+' }, { icon: '', title: '合作院校', value: '50+' }],
    highlights: [],
    partners: [],
  },
  siteConfig: {
    companyName: '海创元AI教育',
    shortName: '海创元',
    address: '地址信息',
    icp: 'ICP备案号',
    copyright: '© 2025 海创元AI教育',
    friendlyLinks: [],
    socialLinks: [],
  },
};

async function hashPassword(password) {
  // Simple bcrypt implementation using crypto
  const crypto = require('crypto');
  // For production, use proper bcrypt - this is a minimal fallback
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function seed() {
  console.log('Starting database seed...\n');

  // Check if data already exists
  const existingCount = await prisma.homeContent.count();
  if (existingCount > 0) {
    console.log('Database already contains data. Skipping seed.');
    return;
  }

  // Try to read from data/ directory, otherwise use minimal seed
  const dataDir = path.join(process.cwd(), 'data');
  const useDataFiles = existsSync(path.join(dataDir, 'home.json'));

  let homeData, siteData;

  if (useDataFiles) {
    console.log('Using data from /data directory');
    const homeContent = await readFile(path.join(dataDir, 'home.json'), 'utf-8');
    homeData = JSON.parse(homeContent);
    const siteContent = await readFile(path.join(dataDir, 'site.json'), 'utf-8');
    siteData = JSON.parse(siteContent);
  } else {
    console.log('Using minimal seed data');
    homeData = MINIMAL_SEED.homeContent;
    siteData = MINIMAL_SEED.siteConfig;
  }

  await prisma.$transaction(async (tx) => {
    // Seed home content
    await tx.homeContent.create({
      data: homeData,
    });
    console.log('✓ Home content seeded');

    // Seed site config
    await tx.siteConfig.create({
      data: siteData,
    });
    console.log('✓ Site config seeded');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('haichuangyuan2026', 10);
    await tx.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '管理员',
        role: 'ADMIN',
      },
    });
    console.log('✓ Admin user created (admin / haichuangyuan2026)');
  });

  console.log('\n✓ Seed completed successfully!');
}

seed()
  .catch((error) => {
    console.error('\n✗ Seed failed:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
