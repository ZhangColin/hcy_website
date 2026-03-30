// Check CompetitionHonor structure
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function checkSchema() {
  const connectionString = "postgresql://hcy_pgsql:hcy_admin_pgsql@43.140.211.9:5432/hcy_website";
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'CompetitionHonor'
      ORDER BY ordinal_position;
    `;

    console.log('=== Production CompetitionHonor Table Structure ===\n');
    result.forEach(col => console.log(`  ${col.column_name}: ${col.data_type}`));

    console.log('\n=== Expected from schema.prisma ===');
    console.log('  id, title, level, year, achievements, image, order, createdAt, updatedAt');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
