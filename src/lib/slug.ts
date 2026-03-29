import { pinyin } from 'pinyin-pro';

/**
 * 生成 URL 友好的 slug
 * 格式: {pinyin}-{date}-{random}
 * 示例: xinwen-gsgs-20260329-a1b2c3
 */
export function generateSlug(title: string, existingSlugs: string[] = []): string {
  // 1. 中文转拼音首字母
  const pinyinStr = pinyin(title, { pattern: 'first', toneType: 'none' })
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 20);

  // 2. 添加日期和随机后缀
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7);

  let slug = `${pinyinStr}-${date}-${random}`;

  // 3. 处理冲突
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${pinyinStr}-${date}-${random}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * 验证 slug 格式
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 5 && slug.length <= 100;
}

/**
 * 从现有标题生成唯一 slug
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const { prisma } = await import('@/lib/prisma');
  const existingArticles = await prisma.newsArticle.findMany({
    select: { slug: true },
  });
  const existingSlugs = existingArticles.map((a) => a.slug);
  return generateSlug(title, existingSlugs);
}
