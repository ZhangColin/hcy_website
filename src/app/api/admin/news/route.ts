import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const search = searchParams.get('search');

    const where: any = {};
    if (category) where.category = category;
    if (published !== null) where.published = published === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[API Error] GET /admin/news:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.slug || !body.category) {
      return NextResponse.json(
        { error: '缺少必填字段: title, slug, category' },
        { status: 400 }
      );
    }

    const article = await prisma.newsArticle.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content || '',
        category: body.category,
        date: new Date(body.date),
        image: body.image || null,
        featured: body.featured || false,
        showOnHomepage: body.showOnHomepage !== false,
        published: body.published !== false,
        views: 0,
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error('[API Error] POST /admin/news:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'URL 标识已存在' }, { status: 400 });
    }
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
