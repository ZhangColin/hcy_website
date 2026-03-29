import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

/**
 * POST /api/admin/consultations/batch
 * 批量操作咨询记录
 */
export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids, action } = body as { ids: string[]; action: string };

    // 验证请求
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "无效的 ID 列表" }, { status: 400 });
    }

    const validActions = ["markHandled", "markUnhandled", "delete"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "无效的操作" }, { status: 400 });
    }

    switch (action) {
      case "markHandled":
        await prisma.contactSubmission.updateMany({
          where: { id: { in: ids } },
          data: {
            handled: true,
            repliedAt: new Date(),
          },
        });
        break;

      case "markUnhandled":
        await prisma.contactSubmission.updateMany({
          where: { id: { in: ids } },
          data: {
            handled: false,
            repliedAt: null,
          },
        });
        break;

      case "delete":
        await prisma.contactSubmission.deleteMany({
          where: { id: { in: ids } },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /admin/consultations/batch:", error);
    return NextResponse.json({ error: "批量操作失败" }, { status: 500 });
  }
}
