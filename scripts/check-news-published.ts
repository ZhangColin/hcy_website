import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'

// Load .env file
config()

// Create adapter with connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const articles = await prisma.newsArticle.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      date: true,
    },
    orderBy: { date: 'desc' },
    take: 10,
  });

  console.log('新闻列表及其发布状态：');
  console.table(articles.map(a => ({
    标题: a.title,
    已发布: a.published,
    日期: a.date.toISOString().split('T')[0],
  })));

  const unpublishedCount = await prisma.newsArticle.count({
    where: { published: false }
  });

  console.log(`\n未发布新闻总数: ${unpublishedCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
