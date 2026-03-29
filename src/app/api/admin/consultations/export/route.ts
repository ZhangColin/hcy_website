import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

/**
 * GET /api/admin/consultations/export
 * 导出咨询数据为 CSV
 */
export async function GET(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // 获取筛选参数（与列表 API 相同的逻辑）
    const search = searchParams.get("search") || "";
    const needType = searchParams.get("needType") || "";
    const handled = searchParams.get("handled");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 构建 where 条件
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    if (needType) {
      where.needType = needType;
    }

    if (handled !== null && handled !== "") {
      where.handled = handled === "true";
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.createdAt.lt = end;
      }
    }

    // 查询所有匹配数据（不分页）
    const items = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // 生成 CSV
    const headers = [
      "提交时间",
      "姓名",
      "单位",
      "电话",
      "邮箱",
      "需求类型",
      "留言",
      "状态",
      "回复时间",
      "回复备注",
    ];

    const rows = items.map((item) => [
      item.createdAt.toISOString().replace("T", " ").substring(0, 19),
      item.name,
      item.company || "",
      item.phone,
      item.email || "",
      item.needType,
      item.message.replace(/[\r\n]+/g, " "),
      item.handled ? "已回复" : "未回复",
      item.repliedAt?.toISOString().replace("T", " ").substring(0, 19) || "",
      item.replyNotes?.replace(/[\r\n]+/g, " ") || "",
    ]);

    // 组装 CSV 内容
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // 如果包含逗号、引号或换行，用引号包裹并转义引号
            if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join(",")
      ),
    ].join("\n");

    // 返回 CSV 文件
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="consultations_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("[API Error] GET /admin/consultations/export:", error);
    return NextResponse.json({ error: "导出失败" }, { status: 500 });
  }
}
