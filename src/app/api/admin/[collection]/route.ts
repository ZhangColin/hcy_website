import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_COLLECTIONS = ["home", "news", "about", "partners", "cases", "contact", "site", "join"];

// 字段白名单配置 - 防止批量赋值漏洞
const FIELD_WHITELISTS = {
  home: ["heroSlides", "dataStrip", "highlights", "partners"],
  news: ["title", "excerpt", "content", "category", "date", "image", "published"],
  about: ["intro", "culture", "timeline", "honors", "partners"],
  schoolCase: ["name", "region", "grade", "abbr", "partnership", "results", "color", "coverImage", "schoolLogo", "order"],
  competitionHonor: ["title", "level", "year", "achievements", "image", "order"],
  contact: ["address", "contacts"],
  jobPosition: ["title", "department", "location", "type", "description", "requirements", "active", "order"],
  site: ["companyName", "shortName", "address", "phone", "email", "hrEmail", "mapLng", "mapLat", "icp", "copyright", "friendlyLinks", "socialLinks", "wechatOfficialQr", "wechatServiceQr"],
} as const;

// 提取允许的字段
function extractAllowedFields<T extends keyof typeof FIELD_WHITELISTS>(
  collection: T,
  body: Record<string, unknown>
): Record<string, unknown> {
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
        data = { articles: await prisma.newsArticle.findMany({
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
        }) };
        break;
      case "about":
        data = await prisma.aboutContent.findFirst();
        break;
      case "cases":
        const [schools, competitions] = await Promise.all([
          prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
          prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
        ]);
        // Parse grade from JSON string to array
        data = {
          schoolCases: schools.map((s) => ({
            ...s,
            grade: typeof s.grade === 'string' ? JSON.parse(s.grade) : s.grade,
          })),
          competitionHonors: competitions,
        };
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
      case "partners":
        const homeData = await prisma.homeContent.findFirst();
        data = { partners: homeData?.partners ?? [] };
        break;
    }

    // socialLinks 数据格式迁移：对象转数组
    if (collection === "site" && data && typeof data === "object") {
      const siteData = data as { socialLinks?: unknown };
      if (siteData.socialLinks && typeof siteData.socialLinks === 'object' && !Array.isArray(siteData.socialLinks)) {
        // 从 { weibo: "url" } 转换为 [{ platform: "weibo", url: "url" }]
        const oldLinks = siteData.socialLinks as Record<string, string>;
        siteData.socialLinks = Object.entries(oldLinks)
          .filter(([_, url]) => typeof url === 'string' && url.trim().length > 0)
          .map(([platform, url]) => ({ platform, url: url.trim() }));
      }
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
      case "partners": {
        const existing = await prisma.homeContent.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "记录不存在" }, { status: 404 });
        }
        // partners is in home content
        if ("partners" in body) {
          await prisma.homeContent.update({
            where: { id: existing.id },
            data: { partners: body.partners },
          });
        }
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
        // 支持批量保存 schoolCases 和 competitionHonors 数组
        const hasSchoolCases = "schoolCases" in body && Array.isArray(body.schoolCases);
        const hasCompetitionHonors = "competitionHonors" in body && Array.isArray(body.competitionHonors);

        if (hasSchoolCases || hasCompetitionHonors) {
          // 处理学校案例
          if (hasSchoolCases) {
            const schools = body.schoolCases as Array<{ id?: string; order?: number } & Record<string, unknown>>;

            // 获取现有记录
            const existingSchools = await prisma.schoolCase.findMany({ select: { id: true } });
            const existingIds = new Set(existingSchools.map((s) => s.id));
            const incomingIds = new Set(schools.filter((s) => s.id).map((s) => s.id as string));

            // 1. 更新现有记录
            for (const school of schools) {
              if (school.id) {
                const allowedData = extractAllowedFields("schoolCase", school);
                // Stringify grade array to JSON for database
                if (Array.isArray(allowedData.grade)) {
                  (allowedData as any).grade = JSON.stringify(allowedData.grade);
                }
                await prisma.schoolCase.update({
                  where: { id: school.id },
                  data: allowedData,
                });
              }
            }

            // 2. 创建新记录（没有 id 的）
            for (const school of schools) {
              if (!school.id) {
                const allowedData = extractAllowedFields("schoolCase", school);
                // Stringify grade array to JSON for database
                if (Array.isArray(allowedData.grade)) {
                  (allowedData as any).grade = JSON.stringify(allowedData.grade);
                }
                await prisma.schoolCase.create({
                  data: {
                    ...allowedData,
                    order: school.order ?? 0,
                  } as any,
                });
              }
            }

            // 3. 删除不在前端数据中的记录
            const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
            if (idsToDelete.length > 0) {
              await prisma.schoolCase.deleteMany({
                where: { id: { in: idsToDelete } },
              });
            }
          }

          // 处理赛事荣誉
          if (hasCompetitionHonors) {
            const competitions = body.competitionHonors as Array<{ id?: string; order?: number } & Record<string, unknown>>;

            // 获取现有记录
            const existingCompetitions = await prisma.competitionHonor.findMany({ select: { id: true } });
            const existingIds = new Set(existingCompetitions.map((c) => c.id));
            const incomingIds = new Set(competitions.filter((c) => c.id).map((c) => c.id as string));

            // 1. 更新现有记录
            for (const competition of competitions) {
              if (competition.id) {
                const allowedData = extractAllowedFields("competitionHonor", competition);
                await prisma.competitionHonor.update({
                  where: { id: competition.id },
                  data: allowedData,
                });
              }
            }

            // 2. 创建新记录（没有 id 的）
            for (const competition of competitions) {
              if (!competition.id) {
                const allowedData = extractAllowedFields("competitionHonor", competition);
                await prisma.competitionHonor.create({
                  data: {
                    ...allowedData,
                    order: competition.order ?? 0,
                  } as any,
                });
              }
            }

            // 3. 删除不在前端数据中的记录
            const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
            if (idsToDelete.length > 0) {
              await prisma.competitionHonor.deleteMany({
                where: { id: { in: idsToDelete } },
              });
            }
          }
        } else if (body.id && body.type) {
          // 单条记录更新（向后兼容）
          if (body.type === "schoolCase") {
            const allowedData = extractAllowedFields("schoolCase", body);
            // Stringify grade array to JSON for database
            if (Array.isArray(allowedData.grade)) {
              (allowedData as any).grade = JSON.stringify(allowedData.grade);
            }
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
        } else {
          return NextResponse.json({ error: "缺少必需参数: schoolCases/competitionHonors 数组，或 id 和 type" }, { status: 400 });
        }
        break;
      }
      case "join": {
        // 支持批量保存 jobPositions 数组
        if ("jobPositions" in body && Array.isArray(body.jobPositions)) {
          const positions = body.jobPositions as Array<{ id?: string; order?: number } & Record<string, unknown>>;

          // 获取数据库中所有现有的 active 记录
          const existingPositions = await prisma.jobPosition.findMany({
            where: { active: true },
            select: { id: true },
          });
          const existingIds = new Set(existingPositions.map((p) => p.id));
          const incomingIds = new Set(positions.filter((p) => p.id).map((p) => p.id as string));

          // 1. 更新现有记录
          for (const pos of positions) {
            if (pos.id) {
              const allowedData = extractAllowedFields("jobPosition", pos);
              // 保留 id 用于更新
              (allowedData as any).id = pos.id;
              await prisma.jobPosition.update({
                where: { id: pos.id },
                data: allowedData,
              });
            }
          }

          // 2. 创建新记录（没有 id 的）
          for (const pos of positions) {
            if (!pos.id) {
              const allowedData = extractAllowedFields("jobPosition", pos);
              await prisma.jobPosition.create({
                data: {
                  ...allowedData,
                  active: true,
                  order: pos.order ?? 0,
                } as any,
              });
            }
          }

          // 3. 标记不在前端数据中的记录为 inactive（软删除）
          const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
          if (idsToDelete.length > 0) {
            await prisma.jobPosition.updateMany({
              where: { id: { in: idsToDelete } },
              data: { active: false },
            });
          }
        } else if (body.id) {
          // 单条记录更新（向后兼容）
          const allowedData = extractAllowedFields("jobPosition", body);
          await prisma.jobPosition.update({
            where: { id: body.id },
            data: allowedData,
          });
        } else {
          return NextResponse.json({ error: "缺少必需参数: id 或 jobPositions" }, { status: 400 });
        }
        break;
      }
      default:
        return NextResponse.json({ error: "未处理的集合类型" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API Error] PUT /admin/${collection}:`, error);
    // 返回更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : "保存数据失败";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
