const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.homeContent.findFirst().then(home => {
  console.log('HomeContent exists:', !!home);
  if (home) {
    console.log('heroSlides type:', typeof home.heroSlides);
    console.log('heroSlides value:', JSON.stringify(home.heroSlides).substring(0, 200));
    console.log('highlights type:', typeof home.highlights);
    console.log('highlights value:', JSON.stringify(home.highlights).substring(0, 200));
  }
  process.exit(0);
});
