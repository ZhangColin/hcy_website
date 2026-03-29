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
        { slug: { equals: '' } },
        { slug: { equals: null as any } },
      ],
    },
  });

  console.log(`Found ${articles.length} articles without slugs.`);

  if (articles.length === 0) {
    console.log('No articles without slugs found.');
    await prisma.$disconnect();
    return;
  }

  // Fetch all existing slugs ONCE before the loop (fix N+1 query issue)
  const allSlugs = await prisma.newsArticle.findMany({
    select: { slug: true },
    where: {
      NOT: {
        OR: [
          { slug: '' },
          { slug: { equals: null as any } },
        ],
      },
    },
  });
  const slugSet = new Set(allSlugs.map((a) => a.slug).filter(Boolean));

  for (const article of articles) {
    const slug = generateSlug(article.title, Array.from(slugSet));
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { slug },
    });
    // Add the newly generated slug to the set to avoid collisions in the same batch
    slugSet.add(slug);
    console.log(`Updated slug for "${article.title}": ${slug}`);
  }

  console.log('Seed completed successfully!');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
