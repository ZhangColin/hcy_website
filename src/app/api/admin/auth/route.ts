import { NextRequest, NextResponse } from "next/server";

// Simple password-based auth for admin panel
// In production, replace with proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "haichuangyuan2026";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, token: Buffer.from(`admin:${Date.now()}`).toString("base64") });
    }
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
