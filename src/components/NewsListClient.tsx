// src/components/NewsListClient.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  published: boolean;
  featured: boolean;
};

const categoryLabels: Record<string, string> = {
  company: '公司新闻',
  industry: '行业资讯',
  media: '媒体报道',
};

export function NewsListClient() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadArticles = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token') || '';
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (categoryFilter) params.append('category', categoryFilter);
      if (publishedFilter) params.append('published', publishedFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/news?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(data.items);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [page, categoryFilter, publishedFilter, search]);

  const togglePublish = async (id: string, published: boolean) => {
    const token = sessionStorage.getItem('admin_token') || '';
    const res = await fetch(`/api/admin/news/${id}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ published: !published }),
    });

    if (res.ok) {
      loadArticles();
    } else {
      alert('操作失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">全部分类</option>
            <option value="company">公司新闻</option>
            <option value="industry">行业资讯</option>
            <option value="media">媒体报道</option>
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={publishedFilter}
            onChange={(e) => { setPublishedFilter(e.target.value); setPage(1); }}
          >
            <option value="">全部状态</option>
            <option value="true">已发布</option>
            <option value="false">草稿</option>
          </select>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
            placeholder="搜索标题或摘要..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Link
            href="/admin/news/new"
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 新建文章
          </Link>
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-gray-400">暂无数据</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">标题</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">日期</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">分类</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {article.featured && <span className="text-[#D4A843] mr-1">[置顶]</span>}
                    {article.title}
                  </td>
                  <td className="py-3 px-4">{new Date(article.date).toLocaleDateString('zh-CN')}</td>
                  <td className="py-3 px-4">{categoryLabels[article.category] || article.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/news/${article.id}/edit`}
                      className="text-[#1A3C8A] hover:underline mr-3"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => togglePublish(article.id, article.published)}
                      className={`hover:underline ${article.published ? 'text-orange-500' : 'text-green-500'}`}
                    >
                      {article.published ? '下架' : '发布'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            上一页
          </button>
          <span className="text-sm">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
