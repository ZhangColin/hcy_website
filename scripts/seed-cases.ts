/**
 * School Cases and Competition Honors Seed Script
 *
 * This script seeds the database with initial school cases and competition honors data.
 * It uses upsert operations to support repeated runs.
 *
 * Usage: npx tsx scripts/seed-cases.ts
 */

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

// School cases data
const schoolCasesData = [
  {
    id: 'sc-1',
    name: '北京中学',
    region: '北京',
    grade: JSON.stringify(['初中', '高中']),
    abbr: '北中',
    partnership: '共建青少年AI创新学院，打造人工智能创新人才培养基地',
    results: '培养学生获全国赛事一等奖12项，AI课程纳入校本必修课',
    color: 'from-[#1A3C8A] to-[#2B6CB0]',
    order: 1,
  },
  {
    id: 'sc-2',
    name: '上外附中',
    region: '上海',
    grade: JSON.stringify(['初中', '高中']),
    abbr: '上外',
    partnership: '5年深度合作，AI课程入校全学段覆盖',
    results: '师生满意度98%，学生竞赛获奖率提升200%',
    color: 'from-[#2B6CB0] to-blue-500',
    order: 2,
  },
  {
    id: 'sc-3',
    name: '海亮教育',
    region: '浙江',
    grade: JSON.stringify(['小学', '初中', '高中']),
    abbr: '海亮',
    partnership: '120所院校签约，集团化AI教育解决方案落地',
    results: '覆盖学生超10万人，教师AI素养认证通过率95%',
    color: 'from-[#D4A843] to-amber-500',
    order: 3,
  },
  {
    id: 'sc-4',
    name: '绵阳南山中学',
    region: '其他',
    grade: JSON.stringify(['高中']),
    abbr: '南山',
    partnership: 'AI创客实验室共建，赛事培训一体化服务',
    results: '学生获省级以上奖项8项，学校获评AI教育示范校',
    color: 'from-purple-600 to-indigo-600',
    order: 4,
  },
  {
    id: 'sc-5',
    name: '北京开放大学',
    region: '北京',
    grade: JSON.stringify(['高中']),
    abbr: '北开',
    partnership: '政企AI赋能培训基地，师资认证考核中心',
    results: '年培训教师500+人次，认证体系获行业认可',
    color: 'from-teal-600 to-cyan-600',
    order: 5,
  },
  {
    id: 'sc-6',
    name: '其他代表院校',
    region: '其他',
    grade: JSON.stringify(['小学', '初中', '高中']),
    abbr: '更多',
    partnership: '覆盖全国30+省市，70+合作渠道共建AI教育生态',
    results: '累计服务130+所院校，授课1000+课时',
    color: 'from-rose-500 to-pink-600',
    order: 6,
  },
]

// Competition honors data
const competitionHonorsData = [
  {
    id: 'ch-1',
    title: 'Intel AI全球影响力嘉年华',
    level: '国际',
    year: '2023',
    achievements: '全球总冠军',
    order: 1,
  },
  {
    id: 'ch-2',
    title: '丘成桐中学科学奖',
    level: '国际',
    year: '2024',
    achievements: '全球总冠军',
    order: 2,
  },
  {
    id: 'ch-3',
    title: 'ISEF 国际科学与工程大奖赛',
    level: '国际',
    year: '2024',
    achievements: '全球总冠军',
    order: 3,
  },
  {
    id: 'ch-4',
    title: '全国青少年人工智能创新挑战赛',
    level: '全国',
    year: '2022-2024',
    achievements: '全国总冠军 x3',
    order: 4,
  },
  {
    id: 'ch-5',
    title: '全国中小学信息技术创新与实践大赛',
    level: '全国',
    year: '2023-2024',
    achievements: '全国总冠军 x2',
    order: 5,
  },
  {
    id: 'ch-6',
    title: '世界机器人大赛',
    level: '国际',
    year: '2023',
    achievements: '全国总冠军 x2',
    order: 6,
  },
]

async function seed() {
  console.log('Starting seed: School Cases and Competition Honors...\n')

  let schoolCasesCreated = 0
  let schoolCasesUpdated = 0
  let honorsCreated = 0
  let honorsUpdated = 0

  await prisma.$transaction(async (tx) => {
    // Seed school cases
    for (const schoolCase of schoolCasesData) {
      const result = await tx.schoolCase.upsert({
        where: { id: schoolCase.id },
        update: {
          name: schoolCase.name,
          region: schoolCase.region,
          grade: schoolCase.grade,
          abbr: schoolCase.abbr,
          partnership: schoolCase.partnership,
          results: schoolCase.results,
          color: schoolCase.color,
          order: schoolCase.order,
        },
        create: schoolCase,
      })
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        schoolCasesCreated++
      } else {
        schoolCasesUpdated++
      }
    }
    console.log(`✓ School cases seeded (${schoolCasesCreated} created, ${schoolCasesUpdated} updated)`)

    // Seed competition honors
    for (const honor of competitionHonorsData) {
      const result = await tx.competitionHonor.upsert({
        where: { id: honor.id },
        update: {
          title: honor.title,
          level: honor.level,
          year: honor.year,
          achievements: honor.achievements,
          order: honor.order,
        },
        create: honor,
      })
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        honorsCreated++
      } else {
        honorsUpdated++
      }
    }
    console.log(`✓ Competition honors seeded (${honorsCreated} created, ${honorsUpdated} updated)`)
  })

  console.log('\n✓ Seed completed successfully!')
  console.log(`  Total: ${schoolCasesCreated + schoolCasesUpdated} school cases, ${honorsCreated + honorsUpdated} competition honors`)
}

seed()
  .catch((error) => {
    console.error('\n✗ Seed failed:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
