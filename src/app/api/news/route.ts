import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get('homepage') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { published: true };
    if (homepage) where.showOnHomepage = true;
    if (category) where.category = category;

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { date: 'desc' }],
      take: limit,
      // 列表页面不需要 content 字段，避免序列化大量数据
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        date: true,
        image: true,
        featured: true,
        showOnHomepage: true,
        published: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        // content: false,  // 排除 content 字段
      }
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('[API Error] GET /news:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
