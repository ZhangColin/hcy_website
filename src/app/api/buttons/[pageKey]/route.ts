import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取指定页面的按钮配置，按位置分组返回
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  const { pageKey } = await params;

  const buttons = await prisma.pageButton.findMany({
    where: { pageKey },
    orderBy: { order: "asc" },
  });

  // 按位置分组
  const grouped: Record<string, Array<{
    label: string;
    href: string;
    openNewTab: boolean;
  }>> = {};

  for (const btn of buttons) {
    if (!grouped[btn.positionKey]) {
      grouped[btn.positionKey] = [];
    }
    grouped[btn.positionKey].push({
      label: btn.label,
      href: btn.href,
      openNewTab: btn.openNewTab,
    });
  }

  return NextResponse.json(grouped);
}
