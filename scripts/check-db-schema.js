// Check actual database structure
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function checkSchema() {
  const connectionString = "postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website";
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    // Get actual table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'SchoolCase'
      ORDER BY ordinal_position;
    `;

    console.log('=== Production SchoolCase Table Structure ===\n');
    result.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
