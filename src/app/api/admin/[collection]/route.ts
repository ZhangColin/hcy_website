import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_COLLECTIONS = ["home", "news", "about", "cases", "contact", "site", "join"];

// 字段白名单配置 - 防止批量赋值漏洞
const FIELD_WHITELISTS = {
  home: ["heroSlides", "dataStrip", "highlights", "partners"],
  news: ["title", "excerpt", "content", "category", "date", "image", "published"],
  about: ["intro", "culture", "timeline", "honors", "partners"],
  schoolCase: ["name", "type", "region", "stage", "summary", "order"],
  competitionHonor: ["title", "level", "year", "order"],
  contact: ["address", "contacts"],
  jobPosition: ["title", "department", "location", "type", "description", "requirements", "active", "order"],
  site: ["companyName", "shortName", "address", "icp", "copyright", "friendlyLinks", "socialLinks"],
} as const;

// 提取允许的字段
function extractAllowedFields<T extends keyof typeof FIELD_WHITELISTS>(
  collection: T,
  body: Record<string, unknown>
): Partial<Record<(typeof FIELD_WHITELISTS)[T][number], unknown>> {
  const allowed = FIELD_WHITELISTS[collection];
  const result: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      result[key] = body[key];
    }
  }
  return result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "无效的集合类型" }, { status: 400 });
  }
  try {
    let data;
    switch (collection) {
      case "home":
        data = await prisma.homeContent.findFirst();
        break;
      case "news":
        data = { articles: await prisma.newsArticle.findMany({ orderBy: { date: 'desc' } }) };
        break;
      case "about":
        data = await prisma.aboutContent.findFirst();
        break;
      case "cases":
        const [schools, competitions] = await Promise.all([
          prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
          prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
        ]);
        data = { schoolCases: schools, competitionHonors: competitions };
        break;
      case "contact":
        data = await prisma.contactInfo.findFirst();
        break;
      case "join":
        data = { jobPositions: await prisma.jobPosition.findMany({ where: { active: true }, orderBy: { order: 'asc' } }) };
        break;
      case "site":
        data = await prisma.siteConfig.findFirst();
        break;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[API Error] GET /admin/${collection}:`, error);
    return NextResponse.json({ error: "加载数据失败" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "无效的集合类型" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // 验证 body 是对象
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
    }

    switch (collection) {
      // 单例类型的内容更新
      case "home": {
        const existing = await prisma.homeContent.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "记录不存在" }, { status: 404 });
        }
        const allowedData = extractAllowedFields("home", body);
        await prisma.homeContent.update({
          where: { id: existing.id },
          data: allowedData,
        });
        break;
      }
      case "about": {
        const existing = await prisma.aboutContent.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "记录不存在" }, { status: 404 });
        }
        const allowedData = extractAllowedFields("about", body);
        await prisma.aboutContent.update({
          where: { id: existing.id },
          data: allowedData,
        });
        break;
      }
      case "contact": {
        const existing = await prisma.contactInfo.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "记录不存在" }, { status: 404 });
        }
        const allowedData = extractAllowedFields("contact", body);
        await prisma.contactInfo.update({
          where: { id: existing.id },
          data: allowedData,
        });
        break;
      }
      case "site": {
        const existing = await prisma.siteConfig.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "记录不存在" }, { status: 404 });
        }
        const allowedData = extractAllowedFields("site", body);
        await prisma.siteConfig.update({
          where: { id: existing.id },
          data: allowedData,
        });
        break;
      }
      // 数组类型的内容更新 (需要 id)
      case "news": {
        if (!body.id) {
          return NextResponse.json({ error: "缺少必需参数: id" }, { status: 400 });
        }
        const allowedData = extractAllowedFields("news", body);
        await prisma.newsArticle.update({
          where: { id: body.id },
          data: allowedData,
        });
        break;
      }
      case "cases": {
        // cases 需要指定类型: schoolCase 或 competitionHonor
        if (!body.id || !body.type) {
          return NextResponse.json({ error: "缺少必需参数: id 和 type (schoolCase|competitionHonor)" }, { status: 400 });
        }
        if (body.type === "schoolCase") {
          const allowedData = extractAllowedFields("schoolCase", body);
          await prisma.schoolCase.update({
            where: { id: body.id },
            data: allowedData,
          });
        } else if (body.type === "competitionHonor") {
          const allowedData = extractAllowedFields("competitionHonor", body);
          await prisma.competitionHonor.update({
            where: { id: body.id },
            data: allowedData,
          });
        } else {
          return NextResponse.json({ error: "无效的类型，必须是 'schoolCase' 或 'competitionHonor'" }, { status: 400 });
        }
        break;
      }
      case "join": {
        if (!body.id) {
          return NextResponse.json({ error: "缺少必需参数: id" }, { status: 400 });
        }
        const allowedData = extractAllowedFields("jobPosition", body);
        await prisma.jobPosition.update({
          where: { id: body.id },
          data: allowedData,
        });
        break;
      }
      default:
        return NextResponse.json({ error: "未处理的集合类型" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API Error] PUT /admin/${collection}:`, error);
    return NextResponse.json({ error: "保存数据失败" }, { status: 500 });
  }
}
