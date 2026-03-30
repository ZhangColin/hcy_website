// Check site config in database
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function checkSiteConfig() {
  const connectionString = process.env.DATABASE_URL || "postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website";
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    const siteConfig = await prisma.siteConfig.findFirst();
    console.log('=== Site Config in Database ===\n');
    if (siteConfig) {
      console.log('✓ Site config exists');
      console.log('ID:', siteConfig.id);
      console.log('Company Name:', siteConfig.companyName);
      console.log('Short Name:', siteConfig.shortName);
      console.log('Address:', siteConfig.address);
      console.log('ICP:', siteConfig.icp);
      console.log('Copyright:', siteConfig.copyright);
      console.log('Email:', siteConfig.email);
      console.log('HR Email:', siteConfig.hrEmail);
      console.log('Phone:', siteConfig.phone);
    } else {
      console.log('✗ NO site config found in database!');
      console.log('This is why Footer shows fake data.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSiteConfig();
