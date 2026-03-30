const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.homeContent.findFirst().then(home => {
  if (home) {
    console.log('=== heroSlides ===');
    console.log(JSON.stringify(home.heroSlides, null, 2));
    console.log('\n=== highlights ===');
    console.log(JSON.stringify(home.highlights, null, 2));
  } else {
    console.log('No home content found');
  }
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
