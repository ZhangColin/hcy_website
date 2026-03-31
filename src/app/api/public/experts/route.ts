import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/experts - 获取专家列表（公开接口）
export async function GET() {
  try {
    const experts = await prisma.expert.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        title: true,
        org: true,
        focus: true,
        avatar: true,
      },
    });

    // 设置缓存头，减少数据库查询
    return NextResponse.json(experts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[API Error] GET /public/experts:", error);
    return NextResponse.json({ error: "获取专家列表失败" }, { status: 500 });
  }
}
