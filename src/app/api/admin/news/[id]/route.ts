import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('[API Error] GET /admin/news/[id]:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}

export async function PUT(
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
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        date: new Date(body.date),
        image: body.image,
        featured: body.featured,
        showOnHomepage: body.showOnHomepage,
        published: body.published,
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error('[API Error] PUT /admin/news/[id]:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'URL 标识已存在' }, { status: 400 });
    }
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    await prisma.newsArticle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Error] DELETE /admin/news/[id]:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
