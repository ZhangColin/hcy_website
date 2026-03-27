import "server-only";
import { prisma } from "./prisma";

// 首页内容
export async function loadHome() {
  const data = await prisma.homeContent.findFirst()
  if (!data) throw new Error("Home content not found")
  return {
    heroSlides: data.heroSlides as any[],
    dataStrip: data.dataStrip as any[],
    highlights: data.highlights as any[],
    partners: data.partners as string[],
  }
}

// 新闻
export async function loadNews() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { date: 'desc' }
  })
  // 将 Date 对象转换为 ISO 字符串格式
  return {
    articles: articles.map(a => ({
      ...a,
      date: a.date.toISOString(),
    }))
  }
}

// 关于我们
export async function loadAbout() {
  const data = await prisma.aboutContent.findFirst()
  if (!data) throw new Error("About content not found")
  return data
}

// 案例
export async function loadCases() {
  const [schools, competitions] = await Promise.all([
    prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
    prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
  ])
  return { schoolCases: schools, competitionHonors: competitions }
}

// 联系方式
export async function loadContact() {
  const data = await prisma.contactInfo.findFirst()
  if (!data) throw new Error("Contact info not found")
  return {
    address: data.address,
    contacts: data.contacts as any[],
  }
}

// 招聘
export async function loadJoin() {
  const positions = await prisma.jobPosition.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
  return { jobPositions: positions }
}

// 站点配置
export async function loadSite() {
  const data = await prisma.siteConfig.findFirst()
  if (!data) throw new Error("Site config not found")
  return data
}

// 保存内容（后台管理用）
export async function saveContent(collection: string, data: any) {
  switch (collection) {
    case 'home': {
      const existing = await prisma.homeContent.findFirst()
      if (!existing) throw new Error("No home content found")
      return await prisma.homeContent.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'about': {
      const existing = await prisma.aboutContent.findFirst()
      if (!existing) throw new Error("No about content found")
      return await prisma.aboutContent.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'contact': {
      const existing = await prisma.contactInfo.findFirst()
      if (!existing) throw new Error("No contact info found")
      return await prisma.contactInfo.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'site': {
      const existing = await prisma.siteConfig.findFirst()
      if (!existing) throw new Error("No site config found")
      return await prisma.siteConfig.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'join':
    case 'cases':
      // 这些集合使用子表，需要特殊处理
      throw new Error(`Use specific CRUD operations for ${collection}`)
    default:
      throw new Error(`Unknown collection: ${collection}`)
  }
}

// 兼容旧接口
export async function loadData<T = any>(filename: string): Promise<T> {
  const mapper: Record<string, () => Promise<any>> = {
    'home': loadHome,
    'news': loadNews,
    'about': loadAbout,
    'cases': loadCases,
    'contact': loadContact,
    'join': loadJoin,
    'site': loadSite,
  }
  const loader = mapper[filename]
  if (!loader) throw new Error(`Unknown data file: ${filename}`)
  return loader() as T
}

export async function saveData<T = any>(filename: string, data: T): Promise<void> {
  // 实现保存逻辑
  await saveContent(filename, data)
}
