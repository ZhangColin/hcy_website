import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [schoolCases, competitionHonors] = await Promise.all([
      prisma.schoolCase.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.competitionHonor.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    // 转换 grade 从 JSON 字符串到数组
    const formattedCases = schoolCases.map((c) => ({
      ...c,
      grade: JSON.parse(c.grade || "[]"),
    }));

    return NextResponse.json({
      schoolCases: formattedCases,
      competitionHonors,
    });
  } catch (error) {
    console.error("[API Error] GET /cases:", error);
    return NextResponse.json(
      { error: "加载数据失败" },
      { status: 500 }
    );
  }
}
