import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug: (await params).slug },
    });

    if (!article) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 });
    }

    // 浏览量 +1
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: { ...article, views: article.views + 1 } });
  } catch (error) {
    console.error('[API Error] GET /news/[slug]:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
