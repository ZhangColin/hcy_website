// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { readFile } from 'fs/promises'
import path from 'path'
import { config } from 'dotenv'

// Load .env file
config()

// Create adapter with connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function migrate() {
  console.log('开始迁移数据...')

  // 读取 JSON 文件
  const dataDir = path.join(process.cwd(), 'data')
  const home = JSON.parse(await readFile(path.join(dataDir, 'home.json'), 'utf-8'))
  const news = JSON.parse(await readFile(path.join(dataDir, 'news.json'), 'utf-8'))
  const about = JSON.parse(await readFile(path.join(dataDir, 'about.json'), 'utf-8'))
  const cases = JSON.parse(await readFile(path.join(dataDir, 'cases.json'), 'utf-8'))
  const contact = JSON.parse(await readFile(path.join(dataDir, 'contact.json'), 'utf-8'))
  const join = JSON.parse(await readFile(path.join(dataDir, 'join.json'), 'utf-8'))
  const site = JSON.parse(await readFile(path.join(dataDir, 'site.json'), 'utf-8'))

  // 清空现有数据
  await prisma.homeContent.deleteMany()
  await prisma.newsArticle.deleteMany()
  await prisma.aboutContent.deleteMany()
  await prisma.schoolCase.deleteMany()
  await prisma.competitionHonor.deleteMany()
  await prisma.contactInfo.deleteMany()
  await prisma.jobPosition.deleteMany()
  await prisma.siteConfig.deleteMany()

  // 迁移首页内容
  await prisma.homeContent.create({
    data: {
      heroSlides: home.heroSlides,
      dataStrip: home.dataStrip,
      highlights: home.highlights,
      partners: home.partners,
    },
  })
  console.log('首页内容')

  // 迁移新闻
  for (const article of news.articles) {
    await prisma.newsArticle.create({
      data: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        date: new Date(article.date),
        image: article.image,
      },
    })
  }
  console.log(`新闻文章 (${news.articles.length}条)`)

  // 迁移关于我们
  await prisma.aboutContent.create({
    data: {
      intro: about.intro,
      culture: about.culture,
      timeline: about.timeline,
      honors: about.honors,
      partners: about.partners,
    },
  })
  console.log('关于我们')

  // 迁移案例
  for (const item of cases.schoolCases) {
    await prisma.schoolCase.create({
      data: {
        name: item.name,
        type: item.type,
        region: item.region,
        stage: item.stage,
        summary: item.summary,
      },
    })
  }
  console.log(`学校案例 (${cases.schoolCases.length}条)`)

  for (const item of cases.competitionHonors) {
    await prisma.competitionHonor.create({
      data: {
        title: item.title,
        level: item.level,
        year: item.year,
      },
    })
  }
  console.log(`竞赛荣誉 (${cases.competitionHonors.length}条)`)

  // 迁移联系方式
  await prisma.contactInfo.create({
    data: {
      address: contact.address,
      contacts: contact.contacts,
    },
  })
  console.log('联系方式')

  // 迁移招聘
  for (const item of join.jobPositions) {
    await prisma.jobPosition.create({
      data: {
        title: item.title,
        department: item.department,
        location: item.location,
        type: item.type,
        description: item.description,
        requirements: item.requirements,
      },
    })
  }
  console.log(`招聘岗位 (${join.jobPositions.length}条)`)

  // 迁移站点配置
  await prisma.siteConfig.create({
    data: {
      companyName: site.companyName,
      shortName: site.shortName,
      address: site.address,
      icp: site.icp,
      copyright: site.copyright,
      friendlyLinks: site.friendlyLinks,
      socialLinks: site.socialLinks,
    },
  })
  console.log('站点配置')

  // 创建默认管理员
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('haichuangyuan2026', 10)
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '管理员',
      role: 'ADMIN',
    },
  })
  console.log('默认管理员 (用户名: admin, 密码: haichuangyuan2026)')

  console.log('\n数据迁移完成!')
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
