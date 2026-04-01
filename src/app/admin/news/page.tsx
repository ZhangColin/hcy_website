// src/app/admin/news/page.tsx
import { NewsListClient } from '@/components/NewsListClient';
import { ToastProvider } from '@/components/Toast';

export const dynamic = 'force-dynamic';

export default function NewsManagePage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        {/* 顶部导航 */}
        <header className="bg-[#1A3C8A] text-white h-14 flex items-center px-6">
          <div className="flex items-center gap-4">
            <a href="/admin" className="hover:underline">
              ← 返回后台
            </a>
            <h1 className="text-lg font-bold">新闻管理</h1>
          </div>
        </header>

        {/* 内容区 */}
        <main className="p-6">
          <NewsListClient />
        </main>
      </div>
    </ToastProvider>
  );
}
