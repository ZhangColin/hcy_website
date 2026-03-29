# 新闻动态系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 升级新闻动态系统，实现完整的内容管理功能（富文本编辑、详情页、列表管理）

**架构:**
- 新闻管理使用独立页面 (`/admin/news`) 和独立 API (`/api/admin/news`)
- 复用现有腾讯云 COS 图片上传
- 案例管理保持现有模式，仅移除"大保存"按钮

**技术栈:**
- Next.js (App Router)
- Prisma + PostgreSQL
- Tiptap 富文本编辑器
- pinyin-pro (slug 生成)

---

## 文件结构

### 新增文件

```
src/lib/slug.ts                           # Slug 生成工具函数
src/components/TiptapEditor.tsx           # Tiptap 编辑器封装
src/components/NewsListClient.tsx         # 新闻列表管理客户端
src/components/NewsEditorClient.tsx       # 新闻编辑表单客户端
src/components/NewsDetailClient.tsx       # 新闻详情页客户端
src/app/admin/news/page.tsx               # 新闻列表管理页
src/app/admin/news/new/page.tsx           # 新建新闻页
src/app/admin/news/[id]/edit/page.tsx     # 编辑新闻页
src/app/api/admin/news/route.ts           # 新闻列表/创建 API
src/app/api/admin/news/[id]/route.ts      # 新闻详情/更新/删除 API
src/app/api/admin/news/[id]/publish/route.ts   # 发布状态 API
src/app/api/admin/news/[id]/feature/route.ts   # 置顶 API
src/app/api/admin/news/[id]/homepage/route.ts  # 首页显示 API
src/app/api/news/route.ts                 # 前台新闻列表 API
src/app/api/news/[slug]/route.ts          # 前台新闻详情 API
src/app/news/[slug]/page.tsx              # 前台新闻详情页
```

### 修改文件

```
prisma/schema.prisma                      # NewsArticle 模型扩展
src/app/admin/page.tsx                    # 移除 cases 大保存按钮
src/app/page.tsx                          # 首页新闻链接调整
src/app/news/page.tsx                     # 新闻列表页链接调整
src/app/news/NewsClient.tsx               # 新闻卡片链接调整
package.json                              # 添加依赖
```

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装依赖包**

```bash
# 安装 Tiptap 相关包
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder pinyin-pro

# 安装 Tailwind Typography 插件（用于富文本内容样式）
npm install -D @tailwindcss/typography
```

Expected: 包安装成功，node_modules 更新

- [ ] **Step 2: 验证安装**

```bash
grep -E "tiptap|pinyin-pro" package.json
```

Expected: 输出包含所有新安装的包

- [ ] **Step 3: 更新 Tailwind 配置**

在 `tailwind.config.ts` 或 `tailwind.config.js` 中添加 typography 插件：

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // ... 现有配置
  ],
  theme: {
    // ... 现有配置
  },
  plugins: [
    require('@tailwindcss/typography'), // 添加此行
  ],
}
export default config
```

- [ ] **Step 4: 更新图片上传白名单**

修改 `src/app/api/upload/route.ts`，添加 `news/editor` 到白名单：

```typescript
// 修改前
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'hero', ...];

// 修改后
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'news/editor', 'hero', ...];
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts src/app/api/upload/route.ts
git commit -m "deps: add tiptap, pinyin-pro, typography; update upload whitelist"
```

---

## Task 2: 创建 Slug 生成工具

**Files:**
- Create: `src/lib/slug.ts`

- [ ] **Step 1: 创建 slug 工具函数**

```typescript
// src/lib/slug.ts
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
```

- [ ] **Step 2: 验证代码正确性（可选）**

可以跳过此步骤，或在后续集成测试中验证 slug 生成功能。

- [ ] **Step 3: Commit**

```bash
git add src/lib/slug.ts
git commit -m "feat: add slug generation utility"
```

---

## Task 3: 数据库迁移

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/xxx_add_news_fields/migration.sql`

- [ ] **Step 1: 修改 Prisma schema**

```prisma
// prisma/schema.prisma
// 在现有的 NewsArticle 模型中添加以下字段：

model NewsArticle {
  id            String   @id @default(cuid())
  slug          String   @unique           // 新增: URL 友好标识
  title         String
  excerpt       String
  content       String
  category      String
  date          DateTime
  image         String?
  featured      Boolean  @default(false)   // 新增: 是否置顶
  showOnHomepage Boolean @default(true)    // 新增: 是否首页显示
  published     Boolean  @default(true)    // 修改: 默认值改为 true
  views         Int      @default(0)       // 新增: 浏览量
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([date, published])
  @@index([featured, date])                // 新增索引
  @@index([showOnHomepage])                // 新增索引
}
```

- [ ] **Step 2: 生成迁移文件**

```bash
npx prisma migrate dev --name add_news_fields
```

Expected: 生成迁移文件，schema 更新成功

- [ ] **Step 3: 创建数据填充脚本（为现有数据生成 slug）**

```typescript
// prisma/seed-news-slugs.ts
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../src/lib/slug';

const prisma = new PrismaClient();

async function seedNewsSlugs() {
  // 查找没有 slug 的文章（新字段默认为 NULL 或空字符串）
  const articles = await prisma.newsArticle.findMany({
    where: {
      OR: [
        { slug: '' },
        { slug: null },
      ],
    },
  });

  for (const article of articles) {
    const allSlugs = await prisma.newsArticle.findMany({
      select: { slug: true },
      where: {
        slug: { not: '' },
        AND: { slug: { not: null } },
      },
    });
    const slugSet = new Set(allSlugs.map((a) => a.slug).filter(Boolean));

    const slug = generateSlug(article.title, Array.from(slugSet));
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { slug },
    });
    console.log(`Updated slug for "${article.title}": ${slug}`);
  }
}

seedNewsSlugs()
  .then(() => prisma.$disconnect())
  .catch(console.error);
```

- [ ] **Step 4: 运行数据填充**

```bash
npx tsx prisma/seed-news-slugs.ts
```

Expected: 所有现有新闻生成 slug

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations prisma/seed-news-slugs.ts
git commit -m "db: add news fields (slug, featured, showOnHomepage, views)"
```

---

## Task 4: 创建 Tiptap 编辑器组件

**Files:**
- Create: `src/components/TiptapEditor.tsx`

- [ ] **Step 1: 创建 Tiptap 编辑器组件**

```typescript
// src/components/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = '请输入内容...',
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#1A3C8A] underline hover:text-[#2B6CB0]',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 同步外部 content 变化
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'news/editor');

      try {
        const token = sessionStorage.getItem('admin_token') || '';
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          const imageUrl = result.url || `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${result.path}`;
          editor.chain().focus().setImage({ src: imageUrl }).run();
        } else {
          alert('图片上传失败');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('图片上传失败');
      }
    };
    input.click();
  };

  const MenuBar = () => (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 bg-white z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="粗体"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="斜体"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="标题1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="标题2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="标题3"
      >
        H3
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="无序列表"
      >
        • 列表
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="有序列表"
      >
        1. 列表
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => {
          const url = prompt('请输入链接地址:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-[#1A3C8A] text-white' : 'hover:bg-gray-100'}`}
        title="链接"
      >
        🔗
      </button>
      <button
        onClick={handleImageUpload}
        className="px-2 py-1 rounded text-sm hover:bg-gray-100"
        title="插入图片"
      >
        🖼️
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="px-2 py-1 rounded text-sm hover:bg-gray-100"
        title="撤销"
        disabled={!editor.can().undo()}
      >
        ↶
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="px-2 py-1 rounded text-sm hover:bg-gray-100"
        title="重做"
        disabled={!editor.can().redo()}
      >
        ↷
      </button>
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {editable && <MenuBar />}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
      />
      <style jsx global>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TiptapEditor.tsx
git commit -m "feat: add Tiptap rich text editor component"
```

---

## Task 5: 后台新闻列表 API

**Files:**
- Create: `src/app/api/admin/news/route.ts`

- [ ] **Step 1: 创建新闻列表 API**

```typescript
// src/app/api/admin/news/route.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/news/route.ts
git commit -m "feat: add admin news list and create API"
```

---

## Task 6: 后台新闻详情/更新/删除 API

**Files:**
- Create: `src/app/api/admin/news/[id]/route.ts`

- [ ] **Step 1: 创建新闻详情 API**

```typescript
// src/app/api/admin/news/[id]/route.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/news/[id]/route.ts
git commit -m "feat: add admin news detail/update/delete API"
```

---

## Task 7: 后台新闻状态切换 API

**Files:**
- Create: `src/app/api/admin/news/[id]/publish/route.ts`
- Create: `src/app/api/admin/news/[id]/feature/route.ts`
- Create: `src/app/api/admin/news/[id]/homepage/route.ts`

- [ ] **Step 1: 创建发布/下架 API**

```typescript
// src/app/api/admin/news/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
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
      data: { published: body.published },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('[API Error] PATCH /admin/news/[id]/publish:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建置顶 API**

```typescript
// src/app/api/admin/news/[id]/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
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
      data: { featured: body.featured },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('[API Error] PATCH /admin/news/[id]/feature:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
```

- [ ] **Step 3: 创建首页显示 API**

```typescript
// src/app/api/admin/news/[id]/homepage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
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
      data: { showOnHomepage: body.showOnHomepage },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('[API Error] PATCH /admin/news/[id]/homepage:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/news/[id]/publish/route.ts src/app/api/admin/news/[id]/feature/route.ts src/app/api/admin/news/[id]/homepage/route.ts
git commit -m "feat: add admin news status toggle APIs"
```

---

## Task 8: 前台新闻 API

**Files:**
- Create: `src/app/api/news/route.ts`
- Create: `src/app/api/news/[slug]/route.ts`

- [ ] **Step 1: 创建前台新闻列表 API**

```typescript
// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get('homepage') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { published: true };
    if (homepage) where.showOnHomepage = true;
    if (category) where.category = category;

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { date: 'desc' }],
      take: limit,
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('[API Error] GET /news:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建前台新闻详情 API**

```typescript
// src/app/api/news/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug: params.slug },
    });

    if (!article) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 });
    }

    // 浏览量 +1
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: { ...article, views: article.views + 1 } });
  } catch (error) {
    console.error('[API Error] GET /news/[slug]:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/news/route.ts src/app/api/news/[slug]/route.ts
git commit -m "feat: add public news APIs"
```

---

## Task 9: 后台新闻列表管理页

**Files:**
- Create: `src/components/NewsListClient.tsx`
- Create: `src/app/admin/news/page.tsx`

- [ ] **Step 1: 创建新闻列表客户端组件**

```typescript
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
```

- [ ] **Step 2: 创建新闻管理页面**

```typescript
// src/app/admin/news/page.tsx
import { NewsListClient } from '@/components/NewsListClient';

export const dynamic = 'force-dynamic';

export default function NewsManagePage() {
  return (
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
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NewsListClient.tsx src/app/admin/news/page.tsx
git commit -m "feat: add admin news list page"
```

---

## Task 10: 后台新闻编辑页

**Files:**
- Create: `src/components/NewsEditorClient.tsx`
- Create: `src/app/admin/news/new/page.tsx`
- Create: `src/app/admin/news/[id]/edit/page.tsx`

- [ ] **Step 1: 创建新闻编辑表单组件**

```typescript
// src/components/NewsEditorClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TiptapEditor } from '@/components/TiptapEditor';
import { ImageButton } from '@/components/ImageButton';
import { generateUniqueSlug, isValidSlug } from '@/lib/slug';

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
      published: true,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlugFromTitle = async () => {
    if (formData.title && !article) { // 只在新建时自动生成
      const slug = await generateUniqueSlug(formData.title);
      setFormData({ ...formData, slug });
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

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
```

- [ ] **Step 2: 创建新建文章页面**

```typescript
// src/app/admin/news/new/page.tsx
import { NewsEditorClient } from '@/components/NewsEditorClient';

export const dynamic = 'force-dynamic';

export default function NewNewsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NewsEditorClient />
    </div>
  );
}
```

- [ ] **Step 3: 创建编辑文章页面**

```typescript
// src/app/admin/news/[id]/edit/page.tsx
import { NewsEditorClient } from '@/components/NewsEditorClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.newsArticle.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    return <div>文章不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NewsEditorClient
        article={{
          ...article,
          date: article.date.toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsEditorClient.tsx src/app/admin/news/new/page.tsx src/app/admin/news/[id]/edit/page.tsx
git commit -m "feat: add admin news edit pages"
```

---

## Task 11: 前台新闻详情页

**Files:**
- Create: `src/components/NewsDetailClient.tsx`
- Create: `src/app/news/[slug]/page.tsx`

- [ ] **Step 1: 创建新闻详情客户端组件**

```typescript
// src/components/NewsDetailClient.tsx
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
```

- [ ] **Step 2: 创建新闻详情页面**

```typescript
// src/app/news/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NewsDetailClient } from '@/components/NewsDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <NewsDetailClient
          article={{
            ...article,
            date: article.date.toISOString().slice(0, 10),
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NewsDetailClient.tsx src/app/news/[slug]/page.tsx
git commit -m "feat: add public news detail page"
```

---

## Task 12: 更新前台新闻列表页链接

**Files:**
- Modify: `src/app/news/page.tsx`
- Modify: `src/app/news/NewsClient.tsx`

- [ ] **Step 1: 修改新闻列表页服务端组件**

不需要修改，已经正确加载数据。

- [ ] **Step 2: 修改新闻卡片链接**

找到 `src/app/news/NewsClient.tsx` 中所有 `href="#"` 的地方，改为 `href={`/news/${article.slug}`}`：

```typescript
// 修改置顶文章链接
<Link href={`/news/${featuredArticle.slug}`} className="group block mb-10">

// 修改普通文章链接
<Link
  key={article.id}
  href={`/news/${article.slug}`}
  className="group block"
>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/news/NewsClient.tsx
git commit -m "fix: update news card links to detail pages"
```

---

## Task 13: 更新首页新闻链接

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 修改首页新闻卡片链接**

找到首页中新闻卡片的部分，添加点击跳转：

```typescript
// 在 newsItems.map 中的 <article> 标签添加点击事件
<Link href={`/news/${news.slug}`} className="group">
  <article className="bg-[#F5F7FA] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
    {/* 现有内容 */}
  </article>
</Link>
```

确保新闻数据包含 slug 字段。

- [ ] **Step 2: 更新首页数据加载**

确保首页加载新闻时包含 slug 字段。修改 `loadData` 调用或 API 返回。

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "fix: update homepage news links to detail pages"
```

---

## Task 14: 更新后台管理页面

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 合并修改 - 移除案例大保存按钮 + 更新新闻管理入口**

由于两项修改都在同一文件，合并处理：

```typescript
// 1. 修改保存按钮显示逻辑（移除 cases 的保存按钮）
// 找到渲染保存按钮的部分
{activeSection !== "cases" && (
  <button onClick={handleSave} disabled={saving || loading}>
    {saving ? "保存中..." : "保存"}
  </button>
)}

// 2. 修改新闻管理导航项（跳转到独立页面）
// 找到 NAV_ITEMS 点击处理
onClick={() => {
  if (item.key === "news") {
    window.location.href = '/admin/news';
  } else {
    setActiveSection(item.key);
    setSidebarOpen(false);
  }
}}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "refactor: update admin page - hide cases save button, link news to separate page"
```

---

## Task 15: 测试与验证

- [ ] **Step 1: 测试新闻创建流程**
  1. 访问 `/admin/news`
  2. 点击"新建文章"
  3. 填写表单，测试富文本编辑器图片上传
  4. 保存并验证列表显示

- [ ] **Step 2: 测试新闻编辑流程**
  1. 在列表页点击"编辑"
  2. 修改内容并保存
  3. 验证更新成功

- [ ] **Step 3: 测试发布/下架**
  1. 点击"下架"按钮
  2. 验证状态变化
  3. 前台验证下架文章不可访问

- [ ] **Step 4: 测试前台详情页**
  1. 从首页点击新闻卡片
  2. 验证详情页显示正确
  3. 测试分享按钮
  4. 测试上一篇/下一篇导航

- [ ] **Step 5: 测试案例管理**
  1. 访问案例管理页面
  2. 验证顶部保存按钮已隐藏
  3. 测试模态框保存功能正常

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "test: complete news system testing"
```

---

## 完成检查清单

- [ ] 所有依赖安装完成
- [ ] 数据库迁移成功执行
- [ ] 后台 API 全部正常工作
- [ ] 前台 API 全部正常工作
- [ ] 后台管理页面功能完整
- [ ] 前台详情页显示正常
- [ ] 首页和新闻列表页链接正确
- [ ] 案例管理"大保存"按钮已移除
- [ ] 所有测试通过
