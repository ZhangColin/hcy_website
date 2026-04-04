import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const currentSlug = searchParams.get('currentSlug');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    if (!currentSlug) {
      return NextResponse.json({ error: 'Missing currentSlug parameter' }, { status: 400 });
    }

    const relatedNews = await prisma.newsArticle.findMany({
      where: {
        published: true,
        slug: { not: currentSlug },
        ...(category && { category }),
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        date: true,
        category: true,
      },
      orderBy: { date: 'desc' },
      take: limit,
    });

    return NextResponse.json(relatedNews);
  } catch (error) {
    console.error('Error fetching related news:', error);
    return NextResponse.json({ error: 'Failed to fetch related news' }, { status: 500 });
  }
}
