import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

/**
 * GET /api/admin/users
 * 获取所有管理员列表
 */
export async function GET(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API Error] GET /admin/users:", error);
    return NextResponse.json({ error: "加载数据失败" }, { status: 500 });
  }
}
