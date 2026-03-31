import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// 获取所有按钮配置
export async function GET(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const buttons = await prisma.pageButton.findMany({
      orderBy: [
        { pageKey: "asc" },
        { positionKey: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json({ buttons });
  } catch (error) {
    console.error("[API Error] GET /admin/buttons:", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}

// 批量更新按钮配置
export async function PUT(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { buttons } = body;

    if (!Array.isArray(buttons)) {
      return NextResponse.json({ error: "无效的按钮数据" }, { status: 400 });
    }

    // 使用事务批量更新
    await prisma.$transaction(async (tx) => {
      for (const btn of buttons) {
        await tx.pageButton.update({
          where: { id: btn.id },
          data: {
            label: btn.label,
            href: btn.href,
            openNewTab: btn.openNewTab,
            order: btn.order,
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: "保存成功" });
  } catch (error) {
    console.error("[API Error] PUT /admin/buttons:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
