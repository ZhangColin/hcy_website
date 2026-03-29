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
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('[API Error] GET /news:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
