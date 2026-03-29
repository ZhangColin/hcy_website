"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image?: string;
  views: number;
}

const categoryLabels: Record<string, string> = {
  company: '公司新闻',
  industry: '行业资讯',
  media: '媒体报道',
};

const categoryColors: Record<string, string> = {
  company: 'bg-[#1A3C8A] text-white',
  industry: 'bg-[#2B6CB0] text-white',
  media: 'bg-[#D4A843] text-white',
};

export function NewsDetailClient({ article }: { article: NewsArticle }) {
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [prevArticle, setPrevArticle] = useState<NewsArticle | null>(null);
  const [nextArticle, setNextArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    // 加载相关新闻
    const loadRelated = async () => {
      try {
        const res = await fetch(`/api/news?category=${article.category}&limit=4`);
        if (res.ok) {
          const data = await res.json();
          const related = data.articles.filter((a: NewsArticle) => a.id !== article.id).slice(0, 3);
          setRelatedArticles(related);

          // 设置上一篇/下一篇
          const allArticles = data.articles;
          const currentIndex = allArticles.findIndex((a: NewsArticle) => a.id === article.id);
          if (currentIndex > 0) setPrevArticle(allArticles[currentIndex - 1]);
          if (currentIndex < allArticles.length - 1) setNextArticle(allArticles[currentIndex + 1]);
        }
      } catch (error) {
        console.error('Failed to load related articles:', error);
      }
    };

    loadRelated();
  }, [article]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;

    switch (platform) {
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('链接已复制');
        break;
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* 面包屑 */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1A3C8A]">首页</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-[#1A3C8A]">新闻动态</Link>
        <span>/</span>
        <span className="text-[#1A3C8A]">{categoryLabels[article.category]}</span>
      </nav>

      {/* 封面图片 */}
      {article.image && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${article.image}`}
            alt={article.title}
            className="w-full"
          />
        </div>
      )}

      {/* 文章头部 */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[article.category]}`}>
            {categoryLabels[article.category]}
          </span>
          <time className="text-sm text-gray-500">
            {new Date(article.date).toLocaleDateString('zh-CN')}
          </time>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </header>

      <hr className="border-gray-200 mb-8" />

      {/* 正文内容 */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* 分享 */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">分享：</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleShare('weibo')}
            className="px-4 py-2 bg-[#E6162D] text-white rounded-md text-sm hover:bg-[#c41226]"
          >
            分享到微博
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
          >
            复制链接
          </button>
        </div>
      </div>

      {/* 上一篇/下一篇 */}
      {(prevArticle || nextArticle) && (
        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between">
          {prevArticle ? (
            <Link
              href={`/news/${prevArticle.slug}`}
              className="text-[#1A3C8A] hover:underline"
            >
              ← {prevArticle.title}
            </Link>
          ) : <div />}
          {nextArticle ? (
            <Link
              href={`/news/${nextArticle.slug}`}
              className="text-[#1A3C8A] hover:underline"
            >
              {nextArticle.title} →
            </Link>
          ) : <div />}
        </div>
      )}

      {/* 相关新闻 */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">相关新闻</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/news/${related.slug}`}
                className="group"
              >
                <div className="bg-[#F5F7FA] rounded-xl p-5 hover:shadow-md transition-shadow">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mb-3 ${categoryColors[related.category]}`}>
                    {categoryLabels[related.category]}
                  </span>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#1A3C8A] line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(related.date).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
