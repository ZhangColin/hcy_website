import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";
import bcrypt from "bcryptjs";

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

/**
 * 验证创建用户请求体
 */
function validateCreateUserBody(body: unknown): body is { username: string; password: string; name?: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { username, password } = body as Record<string, unknown>;
  return typeof username === "string" && username.length > 0 &&
         typeof password === "string" && password.length > 0;
}

/**
 * POST /api/admin/users
 * 创建新管理员
 */
export async function POST(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 输入验证
    if (!validateCreateUserBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    const { username, password, name } = body;

    // 检查用户名是否已存在
    const existing = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json({ error: "用户名已存在" }, { status: 409 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.adminUser.create({
      data: {
        username,
        password: hashedPassword,
        name: name || username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[API Error] POST /admin/users:", error);
    return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
  }
}
