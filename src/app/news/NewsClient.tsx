"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ───────── scroll-reveal hook ───────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/* ───────── types ───────── */
type CategoryKey = "company" | "industry" | "media";
type CategoryLabel = "全部" | "公司新闻" | "行业资讯" | "媒体报道";

const categoryKeyToLabel: Record<CategoryKey, Exclude<CategoryLabel, "全部">> = {
  company: "公司新闻",
  industry: "行业资讯",
  media: "媒体报道",
};

const categoryLabels: CategoryLabel[] = ["全部", "公司新闻", "行业资讯", "媒体报道"];

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: CategoryKey;
  date: string;
  image: string;
  featured?: boolean;
}

const categoryColors: Record<Exclude<CategoryLabel, "全部">, string> = {
  公司新闻: "bg-[#1A3C8A] text-white",
  行业资讯: "bg-[#2B6CB0] text-white",
  媒体报道: "bg-[#D4A843] text-white",
};

/* ───────── client component ───────── */
export default function NewsClient({ articles }: { articles: NewsArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryLabel>("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const heroReveal = useScrollReveal();
  const listReveal = useScrollReveal();

  const filtered = activeCategory === "全部"
    ? articles
    : articles.filter((a) => categoryKeyToLabel[a.category] === activeCategory);

  const featuredArticle = filtered.find((a) => a.featured) || filtered[0];
  const restArticles = filtered.filter((a) => a.id !== featuredArticle?.id);

  const totalPages = Math.max(1, Math.ceil(restArticles.length / itemsPerPage));
  const paginatedArticles = restArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">新闻动态</span>
          </nav>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-[#1A3C8A] via-[#2B6CB0] to-[#1A3C8A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
        </div>
        <div
          ref={heroReveal.ref}
          className={`relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">新闻动态</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">了解海创元最新资讯</p>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categoryLabels.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#1A3C8A] text-white shadow-lg shadow-[#1A3C8A]/25"
                    : "text-[#666666] hover:text-[#333333] hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── News Content ── */}
      <section className="py-12 md:py-16">
        <div
          ref={listReveal.ref}
          className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${listReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Featured Article */}
          {featuredArticle && (
            <Link href={`/news/${featuredArticle.slug}`} className="group block mb-10">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent">
                <div className="flex flex-col md:flex-row">
                  {/* thumbnail placeholder */}
                  <div className="md:w-[420px] h-56 md:h-auto bg-gradient-to-br from-[#1A3C8A] to-[#2B6CB0] relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-white/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span className="text-white/40 text-sm">Featured</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#D4A843] text-white text-xs font-bold rounded-full">置顶</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[categoryKeyToLabel[featuredArticle.category]]}`}>
                        {categoryKeyToLabel[featuredArticle.category]}
                      </span>
                      <span className="text-sm text-[#666666]">{featuredArticle.date}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#333333] mb-3 group-hover:text-[#1A3C8A] transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-[#666666] leading-relaxed line-clamp-3 mb-4">{featuredArticle.excerpt}</p>
                    <span className="inline-flex items-center text-[#2B6CB0] font-medium text-sm group-hover:text-[#1A3C8A] transition-colors">
                      阅读全文
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article, i) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group block"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-1 h-full flex flex-col">
                  {/* thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${categoryColors[categoryKeyToLabel[article.category]]}`}>
                        {categoryKeyToLabel[article.category]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-[#333333] mb-2 group-hover:text-[#1A3C8A] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-[#666666]">{article.date}</span>
                      <span className="inline-flex items-center text-[#2B6CB0] text-sm font-medium group-hover:text-[#1A3C8A] transition-colors">
                        阅读
                        <svg className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {paginatedArticles.length === 0 && (
            <div className="text-center py-16 text-[#666666]">
              <div className="text-5xl mb-4">&#128240;</div>
              <p className="text-lg">暂无相关新闻</p>
            </div>
          )}

          {/* Pagination */}
          {restArticles.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : "text-[#666666] hover:bg-white hover:shadow-md hover:text-[#333333] bg-white border border-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#1A3C8A] text-white shadow-lg shadow-[#1A3C8A]/25"
                      : "text-[#666666] hover:bg-white hover:shadow-md hover:text-[#333333] bg-white border border-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : "text-[#666666] hover:bg-white hover:shadow-md hover:text-[#333333] bg-white border border-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
