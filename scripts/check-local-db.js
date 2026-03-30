// Check local database site config
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function checkLocalDB() {
  // Try local database first
  const localUrl = "postgresql://postgres:truth@localhost:5432/hcy_website?connection_limit=10&pool_timeout=20";
  const prodUrl = "postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website";

  let connectionString = localUrl;
  let isLocal = true;

  // Try to connect to local DB
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    const siteConfig = await prisma.siteConfig.findFirst();
    console.log('=== Local Database (localhost) ===\n');
    if (siteConfig) {
      console.log('✓ Site config exists in local DB');
      console.log('Company Name:', siteConfig.companyName);
      console.log('Address:', siteConfig.address);
      console.log('ICP:', siteConfig.icp);
    } else {
      console.log('✗ NO site config in local DB!');
      console.log('\nLocal database is empty. You need to either:');
      console.log('1. Seed the local database with data');      console.log('2. Or use production database for development');
    }

    // Check if other tables have data
    const homeCount = await prisma.homeContent.count();
    const aboutCount = await prisma.aboutContent.count();
    console.log('\nOther tables:');
    console.log('  HomeContent:', homeCount, 'records');
    console.log('  AboutContent:', aboutCount, 'records');

    if (homeCount === 0 && aboutCount === 0) {
      console.log('\n⚠️  Local database is mostly empty!');
    }

  } catch (error) {
    console.error('Error connecting to local DB:', error.message);
    console.log('\nMake sure PostgreSQL is running locally.');
  } finally {
    await prisma.$disconnect();
  }
}

checkLocalDB();
