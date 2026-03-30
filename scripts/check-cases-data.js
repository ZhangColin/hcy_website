// Diagnostic script to check cases data for malformed JSON
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

async function checkCasesData() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('=== Checking SchoolCase data ===\n');

    const schools = await prisma.schoolCase.findMany({
      orderBy: { order: 'asc' }
    });

    console.log(`Total SchoolCase records: ${schools.length}\n`);

    for (const school of schools) {
      console.log(`--- School: ${school.name} (id: ${school.id}) ---`);
      console.log(`  grade type: ${typeof school.grade}`);
      console.log(`  grade value: ${school.grade}`);

      // Try to parse grade
      try {
        if (typeof school.grade === 'string') {
          const parsed = JSON.parse(school.grade);
          console.log(`  ✓ grade parsed successfully:`, parsed);
        } else {
          console.log(`  ✓ grade is not a string:`, school.grade);
        }
      } catch (parseError) {
        console.log(`  ✗ FAILED TO PARSE grade: ${parseError.message}`);
      }
      console.log('');
    }

    console.log('\n=== Checking CompetitionHonor data ===\n');
    const competitions = await prisma.competitionHonor.findMany({
      orderBy: { order: 'asc' }
    });
    console.log(`Total CompetitionHonor records: ${competitions.length}`);
    competitions.forEach(c => {
      console.log(`  - ${c.title} (${c.level}, ${c.year})`);
    });

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCasesData();
