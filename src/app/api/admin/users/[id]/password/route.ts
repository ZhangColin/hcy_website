import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * 验证密码重置请求体
 */
function validatePasswordBody(body: unknown): body is { password: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { password } = body as Record<string, unknown>;
  return typeof password === "string" && password.length > 0;
}

/**
 * POST /api/admin/users/[id]/password
 * 重置管理员密码
 */
export async function POST(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    // 输入验证
    if (!validatePasswordBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 更新密码
    await prisma.adminUser.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /admin/users/[id]/password:", error);
    return NextResponse.json({ error: "重置密码失败" }, { status: 500 });
  }
}
