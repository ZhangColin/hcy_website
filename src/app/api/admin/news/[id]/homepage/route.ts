import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const article = await prisma.newsArticle.update({
      where: { id: params.id },
      data: { showOnHomepage: body.showOnHomepage },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('[API Error] PATCH /admin/news/[id]/homepage:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
