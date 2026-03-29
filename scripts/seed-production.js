#!/usr/bin/env node
/**
 * 生产环境数据迁移脚本
 * 从 data/ 目录的 JSON 文件读取数据并导入到生产数据库
 *
 * 使用方法:
 *   node scripts/seed-production.js
 *
 * 环境变量:
 *   DATABASE_URL - 数据库连接字符串
 */

const fs = require('fs');
const path = require('path');

// Prisma Client - 生成后动态导入
async function seedDatabase() {
  const { PrismaClient } = require('@prisma/client');
  const { PrismaPg } = require('@prisma/adapter-pg');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('错误: DATABASE_URL 环境变量未设置');
    process.exit(1);
  }

  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  console.log('=== 开始数据迁移 ===\n');

  try {
    // 1. 首页内容
    console.log('1. 迁移首页内容...');
    const homeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/home.json'), 'utf8'));
    const existingHome = await prisma.homeContent.findFirst();
    if (existingHome) {
      await prisma.homeContent.update({
        where: { id: existingHome.id },
        data: homeData
      });
      console.log('   ✓ 首页内容已更新');
    } else {
      await prisma.homeContent.create({ data: homeData });
      console.log('   ✓ 首页内容已创建');
    }

    // 2. 新闻文章
    console.log('2. 迁移新闻文章...');
    const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/news.json'), 'utf8'));
    // 清空现有新闻
    await prisma.newsArticle.deleteMany({});
    for (const article of newsData.articles) {
      await prisma.newsArticle.create({
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          date: new Date(article.date),
          image: article.image || null,
          published: true,
        }
      });
    }
    console.log(`   ✓ 已导入 ${newsData.articles.length} 条新闻`);

    // 3. 关于我们
    console.log('3. 迁移关于我们...');
    const aboutData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/about.json'), 'utf8'));
    const existingAbout = await prisma.aboutContent.findFirst();
    if (existingAbout) {
      await prisma.aboutContent.update({
        where: { id: existingAbout.id },
        data: aboutData
      });
      console.log('   ✓ 关于我们已更新');
    } else {
      await prisma.aboutContent.create({ data: aboutData });
      console.log('   ✓ 关于我们已创建');
    }

    // 4. 学校案例
    console.log('4. 迁移学校案例...');
    const casesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cases.json'), 'utf8'));
    await prisma.schoolCase.deleteMany({});
    for (const schoolCase of casesData.schoolCases) {
      await prisma.schoolCase.create({
        data: {
          name: schoolCase.name,
          type: schoolCase.type,
          region: schoolCase.region,
          stage: schoolCase.stage,
          summary: schoolCase.summary,
          order: 0
        }
      });
    }
    console.log(`   ✓ 已导入 ${casesData.schoolCases.length} 条学校案例`);

    // 5. 竞赛荣誉
    await prisma.competitionHonor.deleteMany({});
    for (const honor of casesData.competitionHonors) {
      await prisma.competitionHonor.create({
        data: {
          title: honor.title,
          level: honor.level,
          year: honor.year,
          order: 0
        }
      });
    }
    console.log(`   ✓ 已导入 ${casesData.competitionHonors.length} 条竞赛荣誉`);

    // 6. 联系方式
    console.log('5. 迁移联系方式...');
    const contactData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/contact.json'), 'utf8'));
    const existingContact = await prisma.contactInfo.findFirst();
    if (existingContact) {
      await prisma.contactInfo.update({
        where: { id: existingContact.id },
        data: contactData
      });
      console.log('   ✓ 联系方式已更新');
    } else {
      await prisma.contactInfo.create({ data: contactData });
      console.log('   ✓ 联系方式已创建');
    }

    // 7. 招聘岗位
    console.log('6. 迁移招聘岗位...');
    const joinData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/join.json'), 'utf8'));
    await prisma.jobPosition.deleteMany({});
    for (const position of joinData.jobPositions) {
      await prisma.jobPosition.create({
        data: {
          title: position.title,
          department: position.department,
          location: position.location,
          type: position.type,
          description: position.description,
          requirements: position.requirements,
          active: true,
          order: 0
        }
      });
    }
    console.log(`   ✓ 已导入 ${joinData.jobPositions.length} 个招聘岗位`);

    // 8. 站点配置
    console.log('7. 迁移站点配置...');
    const siteData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/site.json'), 'utf8'));
    const existingSite = await prisma.siteConfig.findFirst();
    if (existingSite) {
      await prisma.siteConfig.update({
        where: { id: existingSite.id },
        data: siteData
      });
      console.log('   ✓ 站点配置已更新');
    } else {
      await prisma.siteConfig.create({ data: siteData });
      console.log('   ✓ 站点配置已创建');
    }

    console.log('\n=== 数据迁移完成 ===');
    console.log('\n数据统计:');
    console.log(`  - 首页内容: 1 条`);
    console.log(`  - 新闻文章: ${newsData.articles.length} 条`);
    console.log(`  - 关于我们: 1 条 (含 ${aboutData.honors.length} 个荣誉, ${aboutData.timeline.length} 个里程碑)`);
    console.log(`  - 学校案例: ${casesData.schoolCases.length} 条`);
    console.log(`  - 竞赛荣誉: ${casesData.competitionHonors.length} 条`);
    console.log(`  - 联系方式: 1 条 (含 ${contactData.contacts.length} 个联系人)`);
    console.log(`  - 招聘岗位: ${joinData.jobPositions.length} 个`);
    console.log(`  - 站点配置: 1 条`);

  } catch (error) {
    console.error('\n错误:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
