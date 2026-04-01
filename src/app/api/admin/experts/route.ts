import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/experts - 获取专家列表
export async function GET(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const experts = await prisma.expert.findMany({
      orderBy: { order: "asc" },
    });

    // 为头像添加 CDN 前缀
    const expertsWithUrls = experts.map((expert) => ({
      ...expert,
      avatar: expert.avatar ? `${imageBaseUrl}${expert.avatar}` : null,
    }));

    return NextResponse.json(expertsWithUrls);
  } catch (error) {
    console.error("[API Error] GET /admin/experts:", error);
    return NextResponse.json({ error: "获取专家列表失败" }, { status: 500 });
  }
}

// POST /api/admin/experts - 创建新专家
export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.name || !body.title || !body.org || !body.focus) {
      return NextResponse.json(
        { error: "缺少必填字段: name, title, org, focus" },
        { status: 400 }
      );
    }

    // 获取当前最大 order 值
    const maxOrderExpert = await prisma.expert.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrderExpert?.order ?? -1) + 1;

    const expert = await prisma.expert.create({
      data: {
        name: body.name,
        title: body.title,
        org: body.org,
        focus: body.focus,
        avatar: body.avatar || null,
        order: body.order !== undefined ? body.order : nextOrder,
      },
    });

    return NextResponse.json(expert);
  } catch (error) {
    console.error("[API Error] POST /admin/experts:", error);
    return NextResponse.json({ error: "创建专家失败" }, { status: 500 });
  }
}
