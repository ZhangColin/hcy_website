import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

function safeParseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const cases = await prisma.schoolCase.findMany({
      orderBy: { order: "asc" },
    });

    const formattedCases = cases.map((c) => ({
      ...c,
      grade: safeParseJson(c.grade || "[]", []),
    }));

    return NextResponse.json({ schoolCases: formattedCases });
  } catch (error) {
    console.error("[API Error] GET /admin/cases/schools:", error);
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

    if (!body.name || !body.region) {
      return NextResponse.json(
        { error: "缺少必需字段: name, region" },
        { status: 400 }
      );
    }

    const gradeJson = Array.isArray(body.grade)
      ? JSON.stringify(body.grade)
      : body.grade || "[]";

    const maxOrder = await prisma.schoolCase.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newCase = await prisma.schoolCase.create({
      data: {
        name: body.name,
        region: body.region,
        grade: gradeJson,
        abbr: body.abbr || "",
        partnership: body.partnership || "",
        results: body.results || "",
        color: body.color || "from-[#1A3C8A] to-[#2B6CB0]",
        coverImage: body.coverImage || null,
        schoolLogo: body.schoolLogo || null,
        order: (maxOrder?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({
      schoolCase: { ...newCase, grade: safeParseJson(newCase.grade, []) },
    });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/schools:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
