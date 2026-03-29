import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// 字段白名单 - 防止批量赋值漏洞
const ALLOWED_FIELDS = [
  "title",
  "level",
  "year",
  "achievements",
  "image",
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
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // 验证记录是否存在
    const existing = await prisma.competitionHonor.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "荣誉不存在" }, { status: 404 });
    }

    // 提取允许的字段
    const allowedData = extractAllowedFields(body);

    const updatedCompetition = await prisma.competitionHonor.update({
      where: { id },
      data: allowedData,
    });

    return NextResponse.json({
      competitionHonor: updatedCompetition,
    });
  } catch (error) {
    console.error("[API Error] PUT /admin/cases/competitions/[id]:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // 验证记录是否存在
    const existing = await prisma.competitionHonor.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "荣誉不存在" }, { status: 404 });
    }

    await prisma.competitionHonor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/cases/competitions/[id]:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
