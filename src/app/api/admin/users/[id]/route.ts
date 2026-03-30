import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, parseAuthToken } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * 验证更新用户请求体
 */
function validateUpdateUserBody(body: unknown): body is { name?: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { name } = body as Record<string, unknown>;
  // name 是可选的，但如果存在必须是字符串
  return name === undefined || typeof name === "string";
}

/**
 * PUT /api/admin/users/[id]
 * 更新管理员信息（仅支持修改显示名称）
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    // 输入验证
    if (!validateUpdateUserBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 更新用户
    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[API Error] PUT /admin/users/[id]:", error);
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * 删除管理员
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    // 获取当前用户 ID
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7) || "";
    const currentUserId = parseAuthToken(token);

    // 检查是否尝试删除自己
    if (currentUserId === id) {
      return NextResponse.json({ error: "不能删除当前登录的账号" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 检查是否是最后一个管理员
    const count = await prisma.adminUser.count();
    if (count <= 1) {
      return NextResponse.json({ error: "不能删除最后一个管理员账号" }, { status: 400 });
    }

    // 删除用户
    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/users/[id]:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
}
