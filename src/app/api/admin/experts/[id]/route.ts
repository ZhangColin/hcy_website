import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// PUT /api/admin/experts/[id] - 更新专家
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // 验证专家是否存在
    const existing = await prisma.expert.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "专家不存在" }, { status: 404 });
    }

    // 更新专家
    const expert = await prisma.expert.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.org !== undefined && { org: body.org }),
        ...(body.focus !== undefined && { focus: body.focus }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(expert);
  } catch (error) {
    console.error("[API Error] PUT /admin/experts/[id]:", error);
    return NextResponse.json({ error: "更新专家失败" }, { status: 500 });
  }
}

// DELETE /api/admin/experts/[id] - 删除专家
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.expert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/experts/[id]:", error);
    return NextResponse.json({ error: "删除专家失败" }, { status: 500 });
  }
}
