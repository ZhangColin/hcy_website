import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.schoolCases || !Array.isArray(body.schoolCases)) {
      return NextResponse.json(
        { error: "缺少 schoolCases 数组" },
        { status: 400 }
      );
    }

    // 批量更新学校案例排序
    for (const item of body.schoolCases) {
      if (item.id && typeof item.order === 'number') {
        await prisma.schoolCase.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    }

    // 批量更新赛事荣誉排序
    if (body.competitionHonors && Array.isArray(body.competitionHonors)) {
      for (const item of body.competitionHonors) {
        if (item.id && typeof item.order === 'number') {
          await prisma.competitionHonor.update({
            where: { id: item.id },
            data: { order: item.order },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/reorder:", error);
    return NextResponse.json(
      { error: "排序失败" },
      { status: 500 }
    );
  }
}
