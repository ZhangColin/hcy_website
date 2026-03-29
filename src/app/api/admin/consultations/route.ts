import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

/**
 * GET /api/admin/consultations
 * 获取咨询列表（支持分页、搜索、筛选）
 */
export async function GET(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // 解析查询参数
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";
    const needType = searchParams.get("needType") || "";
    const handled = searchParams.get("handled");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // 构建 where 条件
    const where: Record<string, unknown> = {};

    // 搜索：姓名、电话、邮箱、单位
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    // 需求类型筛选
    if (needType) {
      where.needType = needType;
    }

    // 处理状态筛选
    if (handled !== null && handled !== "") {
      where.handled = handled === "true";
    }

    // 日期范围筛选
    if (startDate || endDate) {
      const dateCondition: { gte?: Date; lt?: Date } = {};
      if (startDate) {
        dateCondition.gte = new Date(startDate);
      }
      if (endDate) {
        // 包含结束日期当天，加一天
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        dateCondition.lt = end;
      }
      where.createdAt = dateCondition;
    }

    // 计算分页
    const skip = (page - 1) * limit;

    // 查询总数
    const total = await prisma.contactSubmission.count({ where });

    // 查询数据
    const items = await prisma.contactSubmission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    });

    return NextResponse.json({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("[API Error] GET /admin/consultations:", error);
    return NextResponse.json({ error: "加载数据失败" }, { status: 500 });
  }
}
