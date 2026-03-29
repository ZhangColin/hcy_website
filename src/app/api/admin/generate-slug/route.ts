import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

export async function POST(request: NextRequest) {
  console.log('[generate-slug] Request received');

  // 认证检查
  const isAuthenticated = await authenticateRequest(request);
  if (!isAuthenticated) {
    console.log('[generate-slug] Authentication failed');
    return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log('[generate-slug] Request body:', body);

    const { title } = body;

    if (!title || typeof title !== 'string') {
      console.log('[generate-slug] Invalid title:', title);
      return NextResponse.json({ error: '标题无效' }, { status: 400 });
    }

    // 获取现有 slug
    const existingArticles = await prisma.newsArticle.findMany({
      select: { slug: true },
    });
    const existingSlugs = existingArticles.map((a) => a.slug);

    console.log('[generate-slug] Existing slugs:', existingSlugs.length);

    // 生成新 slug
    const slug = generateSlug(title, existingSlugs);
    console.log('[generate-slug] Generated slug:', slug);

    return NextResponse.json({ slug });
  } catch (error) {
    console.error('[generate-slug] Error:', error);
    return NextResponse.json({
      error: '生成失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
