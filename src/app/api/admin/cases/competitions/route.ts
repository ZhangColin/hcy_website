import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const competitions = await prisma.competitionHonor.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ competitionHonors: competitions });
  } catch (error) {
    console.error("[API Error] GET /admin/cases/competitions:", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.title || !body.level || !body.year) {
      return NextResponse.json(
        { error: "缺少必需字段: title, level, year" },
        { status: 400 }
      );
    }

    // 获取当前最大 order 值
    const maxOrder = await prisma.competitionHonor.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newCompetition = await prisma.competitionHonor.create({
      data: {
        title: body.title,
        level: body.level,
        year: body.year,
        achievements: body.achievements || "",
        image: body.image || null,
        order: (maxOrder?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({
      competitionHonor: newCompetition,
    });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/competitions:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
