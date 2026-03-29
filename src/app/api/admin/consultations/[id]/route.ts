import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

type Params = Promise<{ id: string }>;

/**
 * PATCH /api/admin/consultations/[id]
 * 更新咨询记录（标记已处理、添加备注）
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    // 字段白名单
    const allowedData: Record<string, unknown> = {};
    if ("handled" in body) {
      allowedData.handled = body.handled;
      // 如果标记为已处理且没有 repliedAt，设置当前时间
      if (body.handled === true) {
        const existing = await prisma.contactSubmission.findUnique({
          where: { id },
        });
        if (existing && !existing.repliedAt) {
          allowedData.repliedAt = new Date();
        }
      }
    }
    if ("replyNotes" in body) {
      allowedData.replyNotes = body.replyNotes;
    }

    // 更新记录
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: allowedData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`[API Error] PATCH /admin/consultations/${id}:`, error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/consultations/[id]
 * 删除咨询记录
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.contactSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API Error] DELETE /admin/consultations/${id}:`, error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
