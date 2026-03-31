"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TiptapEditor } from '@/components/TiptapEditor';
import { ImageButton } from '@/components/ImageButton';
import { isValidSlug } from '@/lib/slug';
import { convertVideoTagsToIframe } from '@/components/video/VideoHtmlConverter';

interface NewsArticle {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image?: string;
  featured: boolean;
  showOnHomepage: boolean;
  published: boolean;
  views?: number;
}

const categoryOptions = [
  { value: 'company', label: '公司新闻' },
  { value: 'industry', label: '行业资讯' },
  { value: 'media', label: '媒体报道' },
];

interface NewsEditorClientProps {
  article?: NewsArticle;
}

export function NewsEditorClient({ article }: NewsEditorClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<NewsArticle>(
    article || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'company',
      date: new Date().toISOString().slice(0, 10),
      featured: false,
      showOnHomepage: true,
      published: false,  // 默认未发布
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlugFromTitle = async () => {
    if (!formData.title) {
      alert('请先输入标题');
      return;
    }

    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      alert('未登录，请先登录后台管理系统');
      return;
    }

    try {
      console.log('[generateSlug] Requesting slug for:', formData.title);
      const res = await fetch('/api/admin/generate-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: formData.title }),
      });

      const data = await res.json();
      console.log('[generateSlug] Response:', data);

      if (res.ok) {
        setFormData({ ...formData, slug: data.slug });
      } else {
        alert(`生成失败: ${data.error || '未知错误'}${data.details ? '\n' + data.details : ''}`);
      }
    } catch (error) {
      console.error('Generate slug error:', error);
      alert(`生成失败，请检查网络连接\n错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = '请输入标题';
    if (!formData.slug.trim()) newErrors.slug = '请输入URL标识';
    if (!isValidSlug(formData.slug)) newErrors.slug = 'URL标识格式不正确';
    if (!formData.category) newErrors.category = '请选择分类';
    if (!formData.date) newErrors.date = '请选择日期';
    if (!formData.content.trim()) newErrors.content = '请输入正文内容';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const token = sessionStorage.getItem('admin_token') || '';
      const url = article ? `/api/admin/news/${article.id}` : '/api/admin/news';
      const method = article ? 'PUT' : 'POST';

      // 将 video-platform 标签转换为 iframe
      const contentToSave = convertVideoTagsToIframe(formData.content);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, content: contentToSave }),
      });

      if (res.ok) {
        router.push('/admin/news');
      } else {
        const data = await res.json();
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('保存失败，请检查网络');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/news"
          className="text-[#1A3C8A] hover:underline flex items-center gap-1"
        >
          ← 返回列表
        </Link>
        <h1 className="text-xl font-bold">{article ? '编辑文章' : '新建文章'}</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/news"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            取消
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-[#1A3C8A] text-white rounded-md text-sm hover:bg-[#15306e] disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 表单 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSlugFromTitle}
            placeholder="请输入文章标题"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* URL 标识 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL 标识 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className={`flex-1 border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm font-mono`}
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="自动生成或手动输入"
            />
            <button
              onClick={generateSlugFromTitle}
              type="button"
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200"
            >
              重新生成
            </button>
          </div>
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          <p className="text-gray-400 text-xs mt-1">用于详情页 URL，如: /news/{formData.slug}</p>
        </div>

        {/* 分类和日期 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm`}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* 复选框 */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">置顶显示</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.showOnHomepage}
              onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">首页显示</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">已发布</span>
          </label>
        </div>

        {/* 封面图片 */}
        <div>
          <ImageButton
            label="封面图片"
            value={formData.image || ''}
            onChange={(value) => setFormData({ ...formData, image: value })}
            type="news"
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="简短描述，用于列表展示"
          />
        </div>

        {/* 正文内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            正文内容 <span className="text-red-500">*</span>
          </label>
          <TiptapEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="请输入正文内容..."
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* 浏览量（只读） */}
        {article && article.views !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">浏览量</label>
            <p className="text-gray-600">{article.views}</p>
          </div>
        )}
      </div>
    </div>
  );
}
