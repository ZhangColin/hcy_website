import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

/**
 * 生成更安全的认证令牌
 * 格式: base64(userId + ":" + timestamp + ":" + randomBytes(16))
 * 包含随机熵以增加不可预测性
 */
function generateAuthToken(userId: string): string {
  const timestamp = Date.now();
  const randomPart = randomBytes(16).toString("hex");
  const tokenData = `${userId}:${timestamp}:${randomPart}`;
  return Buffer.from(tokenData).toString("base64");
}

/**
 * 基本验证：确保请求体存在且包含必需字段
 */
function validateLoginBody(body: unknown): body is { password: string; username?: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { password } = body as Record<string, unknown>;
  return typeof password === "string" && password.length > 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 输入验证
    if (!validateLoginBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    const { password, username } = body;

    const user = await prisma.adminUser.findUnique({
      where: { username: username || 'admin' }
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: generateAuthToken(user.id),
      user: { name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("[API Error] POST /admin/auth:", error);
    return NextResponse.json({ error: "请求处理失败" }, { status: 500 });
  }
}
