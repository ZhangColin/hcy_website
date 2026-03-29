import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.development BEFORE importing prisma
config({ path: resolve(__dirname, '../.env.development') });

// Dynamic import after env is loaded
async function main() {
  const { prisma } = await import('../src/lib/prisma');
  const { generateSlug } = await import('../src/lib/slug');

  // 查找没有 slug 的文章（新字段默认为 NULL 或空字符串）
  const articles = await prisma.newsArticle.findMany({
    where: {
      OR: [
        { slug: '' },
        { slug: null },
      ],
    },
  });

  console.log(`Found ${articles.length} articles without slugs.`);

  for (const article of articles) {
    const allSlugs = await prisma.newsArticle.findMany({
      select: { slug: true },
      where: {
        slug: { not: '' },
        AND: { slug: { not: null } },
      },
    });
    const slugSet = new Set(allSlugs.map((a) => a.slug).filter(Boolean));

    const slug = generateSlug(article.title, Array.from(slugSet));
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { slug },
    });
    console.log(`Updated slug for "${article.title}": ${slug}`);
  }

  console.log('Seed completed successfully!');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
