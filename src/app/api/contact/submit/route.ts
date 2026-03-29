import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateConsultationForm, ConsultationFormData } from "@/lib/validators";

/**
 * POST /api/contact/submit
 * 提交咨询表单
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体格式
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, errors: { general: "请求格式错误" } },
        { status: 400 }
      );
    }

    // 验证表单数据
    const validation = validateConsultationForm(body as ConsultationFormData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // 保存到数据库
    const { name, company, phone, email, needType, message } = body;
    await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        company: company?.trim() || null,
        phone: phone.trim(),
        email: email?.trim() || null,
        needType: needType.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /contact/submit:", error);
    return NextResponse.json(
      { success: false, errors: { general: "提交失败，请稍后重试" } },
      { status: 500 }
    );
  }
}
