import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok", database: "connected" })
  } catch (error) {
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 }
    )
  }
}
