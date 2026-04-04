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
    where: { published: true },
    orderBy: { date: 'desc' },
    // 列表页面不需要 content 字段，避免序列化大量数据
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      date: true,
      image: true,
      featured: true,
      showOnHomepage: true,
      published: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      // content: false,  // 排除 content 字段
    }
  })
  // 将 Date 对象转换为 ISO 字符串格式
  return {
    articles: articles.map(a => ({
      ...a,
      date: a.date.toISOString(),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }))
  }
}

// 关于我们
export async function loadAbout() {
  const [aboutData, homeData] = await Promise.all([
    prisma.aboutContent.findFirst(),
    prisma.homeContent.findFirst(),
  ]);

  // 默认数据
  const defaultAbout = {
    intro: { title: "关于海创元", subtitle: "", description: "" },
    culture: { mission: "", vision: "", values: [] },
    timeline: [],
    honors: [],
    partners: { strategic: [], ecosystem: [] },
  };

  if (!aboutData) {
    return defaultAbout;
  }

  // 从 HomeContent 读取 partners 数据
  type PartnerData = { strategic: Array<{ name: string; logo?: string }>; ecosystem: Array<{ name: string; logo?: string }> };
  const partnersData: PartnerData = { strategic: [], ecosystem: [] };
  if (homeData?.partners) {
    const partners = homeData.partners as Array<{ name: string; logo?: string; category?: string }> | string[];
    // 兼容旧格式
    const normalizedPartners = partners.map((p) =>
      typeof p === "string" ? { name: p, logo: "", category: "strategic" } : { ...p, category: p.category || "strategic" }
    );

    // 按分类分组
    partnersData.strategic = normalizedPartners
      .filter((p) => p.category === "strategic" && p.name)
      .map((p) => ({ name: p.name, logo: p.logo }));
    partnersData.ecosystem = normalizedPartners
      .filter((p) => p.category === "ecosystem" && p.name)
      .map((p) => ({ name: p.name, logo: p.logo }));
  }

  return {
    ...aboutData,
    partners: partnersData,
  };
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
  if (!data) {
    // 返回默认数据，避免页面崩溃
    return {
      address: "北京市海淀区",
      contacts: [],
    }
  }
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

// 加载页面按钮配置
export async function loadPageButtons(pageKey: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/buttons/${pageKey}`, {
    // 缓存策略：5分钟
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`Failed to load buttons for page: ${pageKey}`);
    return { hero: [], cta: [] };
  }

  return await res.json();
}
