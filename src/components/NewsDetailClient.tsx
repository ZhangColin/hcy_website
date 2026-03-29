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
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code URL on client side only
    if (typeof window !== 'undefined') {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`);
    }
  }, []);

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

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
            {article.date.slice(0, 10)}
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
        <h3 className="text-sm font-medium text-gray-700 mb-4">分享到：</h3>
        <div className="flex flex-wrap gap-4">
          {/* 微信 */}
          <div className="relative">
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="flex items-center gap-2 px-4 py-2 bg-[#07C160] text-white rounded-md text-sm hover:bg-[#06ad56] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5-4c.83 0 1.5-.67 1.5-1.5S12.83 4 12 4s-.67 1.5-1.5 1.5zM8 2C4.69 2 2 4.69 2 8s2.69 6 6 6c.37 0 .72-.04 1.06-.1-.53.42-1.06.83-1.56 1.25-.09.07-.18.14-.27.21-.46.2-.9.38-1.35.55-.45.17-.9.33-1.35.55-.46.2-.91.4-1.35.55-.17.07-.34.13-.5.21-.53-.42-1.06-.83-1.56-1.25C14.72 13.96 15 13.5 15 13c0-.55-.45-1-1-1-.55 0-1 .45-1 1 0 .5-.45 1-1 1-.55 0-1-.45-1-1 0-.5.45-1 1-1 .55 0 1 .45 1 1 0 .5-.45 1-1 1zm3-6c.83 0 1.5-.67 1.5-1.5S15.83 4 15 4s-.67 1.5-1.5 1.5zM19 8c0 3.31-2.69 6-6 6-.37 0-.72.04-1.06.1.53-.42 1.06-.83 1.56-1.25.09-.07.18-.14.27-.21.46-.2.9-.38-1.35-.55-.45-.17-.9-.33-1.35-.55-.46-.2-.91-.4-1.35-.55-.17-.07-.34-.13-.5-.21.53-.42 1.06-.83 1.56-1.25C9.28 2.04 9 2.5 9 3c0 .55.45 1 1 1s1-.45 1-1c0-.5.45-1 1-1 .55 0 1 .45 1 1 0 .5.45 1 1 1 .55 0 1-.45 1-1 0-.5-.45-1-1-1zm-3.5 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
              </svg>
              微信
            </button>
            {/* QR Code Modal */}
            {showQRCode && (
              <div
                onClick={() => setShowQRCode(false)}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-4">扫码分享到微信</p>
                    <div className="bg-gray-50 rounded-xl p-4 inline-block">
                      {qrCodeUrl && (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-48 h-48"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 mb-2">使用微信扫一扫即可分享</p>
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 复制链接 */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              copySuccess
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copySuccess ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制链接
              </>
            )}
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
                    {related.date.slice(0, 10)}
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
