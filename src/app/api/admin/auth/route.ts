import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { password, username } = await request.json();

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
      token: Buffer.from(`${user.id}:${Date.now()}`).toString("base64"),
      user: { name: user.name, role: user.role }
    });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
