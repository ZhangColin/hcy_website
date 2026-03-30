import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.homeContent.findFirst();
  if (!home) {
    console.log('No home content found!');
    return;
  }
  
  console.log('=== ID:', home.id);
  console.log('=== heroSlides ===');
  const slides = home.heroSlides;
  if (Array.isArray(slides)) {
    slides.forEach((s, i) => {
      console.log(`Slide ${i}:`, JSON.stringify(s));
    });
  } else {
    console.log('Not an array:', typeof slides);
  }
  
  console.log('\n=== highlights ===');
  const highlights = home.highlights;
  if (Array.isArray(highlights)) {
    highlights.forEach((h, i) => {
      console.log(`Highlight ${i}:`, JSON.stringify(h));
    });
  } else {
    console.log('Not an array:', typeof highlights);
  }
  
  console.log('\n=== updatedAt:', home.updatedAt);
}

main().catch(console.error).finally(() => prisma.$disconnect());
