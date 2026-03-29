import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function safeParseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// 字段白名单 - 防止批量赋值漏洞
const ALLOWED_FIELDS = [
  "name",
  "region",
  "grade",
  "abbr",
  "partnership",
  "results",
  "color",
  "coverImage",
  "schoolLogo",
  "order",
] as const;

function extractAllowedFields(
  body: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) {
      result[key] = body[key];
    }
  }
  return result;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 验证记录是否存在
    const existing = await prisma.schoolCase.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "案例不存在" }, { status: 404 });
    }

    // 提取允许的字段
    const allowedData = extractAllowedFields(body);

    // 处理 grade 字段 - 如果是数组则转换为 JSON 字符串
    if ("grade" in allowedData && Array.isArray(allowedData.grade)) {
      allowedData.grade = JSON.stringify(allowedData.grade);
    }

    const updatedCase = await prisma.schoolCase.update({
      where: { id },
      data: allowedData,
    });

    return NextResponse.json({
      schoolCase: {
        ...updatedCase,
        grade: safeParseJson(updatedCase.grade, []),
      },
    });
  } catch (error) {
    console.error("[API Error] PUT /admin/cases/schools/[id]:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 验证记录是否存在
    const existing = await prisma.schoolCase.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "案例不存在" }, { status: 404 });
    }

    await prisma.schoolCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/cases/schools/[id]:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
