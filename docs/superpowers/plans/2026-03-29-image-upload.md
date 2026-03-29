# 图片上传系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为海创元官网添加基于腾讯云 COS 的统一图片上传功能，首先应用于首页核心亮点区域。

**Architecture:** 服务端中转上传模式 - 前端上传到 API 路由，路由验证后调用腾讯云 COS SDK 上传，返回相对路径供前端拼接使用。

**Tech Stack:** Next.js 16 App Router, Tencent COS SDK (`cos-nodejs-sdk`), TypeScript, Tailwind CSS

---

## 文件结构

```
src/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # 上传 API 路由 (新建)
│   ├── admin/
│   │   └── page.tsx              # 管理后台页面 (修改 - 添加 ImageButton)
│   └── page.tsx                  # 首页 (修改 - 显示图片)
├── lib/
│   ├── auth.ts                   # 认证工具函数 (新建)
│   └── cos.ts                    # COS 服务封装 (新建)
└── components/
    └── ImageButton.tsx           # 上传按钮组件 (新建)
```

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装腾讯云 COS SDK**

```bash
npm install cos-nodejs-sdk
```

Expected: package.json updated, node_modules 包含新依赖

- [ ] **Step 2: 验证安装**

```bash
grep cos-nodejs-sdk package.json
```

Expected: 看到 `"cos-nodejs-sdk":` 在 dependencies 中

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "deps: add cos-nodejs-sdk for image upload"
```

---

## Task 2: 创建认证工具函数

**说明:** 现有的 admin API 路由没有实现服务端 token 验证，这是一个安全缺口。我们创建一个共享的认证工具，供上传 API 使用。

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: 创建认证工具文件**

```typescript
// src/lib/auth.ts
import { prisma } from "./prisma";

/**
 * 从 base64 token 中解析用户 ID
 * Token 格式: base64(userId + ":" + timestamp + ":" + randomBytes(16))
 */
export function parseAuthToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;
    return parts[0]; // userId
  } catch {
    return null;
  }
}

/**
 * 验证管理员 token 是否有效
 * 检查 token 格式和对应的用户是否存在
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;

  const userId = parseAuthToken(token);
  if (!userId) return false;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });
    return !!user;
  } catch {
    return false;
  }
}

/**
 * 从 NextRequest 中提取并验证 Bearer token
 */
export async function authenticateRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  return verifyAdminToken(token);
}
```

- [ ] **Step 2: 验证文件创建成功**

```bash
cat src/lib/auth.ts
```

Expected: 文件内容正确显示

- [ ] **Step 3: 提交**

```bash
git add src/lib/auth.ts
git commit -m "feat: add admin token verification utilities"
```

---

## Task 3: 创建 COS 服务封装

**Files:**
- Create: `src/lib/cos.ts`

- [ ] **Step 1: 创建 COS 服务封装**

```typescript
// src/lib/cos.ts
import { COS } from 'cos-nodejs-sdk';

// COS 客户端配置
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

// 配置常量
export const COS_CONFIG = {
  bucket: process.env.COS_BUCKET || 'hcy-website-1415442236',
  region: process.env.COS_REGION || 'ap-beijing',
  domain: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '',
};

/**
 * 上传文件到腾讯云 COS
 * @param file - 要上传的文件 (Buffer 或 File)
 * @param type - 文件类型目录，如 "highlights", "news"
 * @returns 上传结果，包含相对路径和完整 URL
 */
export async function uploadFile(
  file: Buffer | File,
  type: string,
  filename?: string
): Promise<{ path: string; url: string }> {
  // 生成文件名: {type}/{YYYYMMDD}-{uuid}.ext
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // 从原始文件名或参数获取扩展名
  let ext = 'jpg'; // 默认扩展名
  if (filename) {
    const parts = filename.split('.');
    ext = parts[parts.length - 1]?.toLowerCase() || 'jpg';
  }

  // 生成唯一文件名
  const randomId = crypto.randomUUID();
  const key = `${type}/${date}-${randomId}.${ext}`;

  // 上传到 COS
  await new Promise<void>((resolve, reject) => {
    cos.putObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: key,
      Body: file,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // 返回相对路径和完整 URL
  return {
    path: `/${key}`,
    url: `${COS_CONFIG.domain}/${key}`,
  };
}

/**
 * 删除 COS 中的文件
 * @param path - 文件相对路径，如 "/highlights/xxx.jpg"
 */
export async function deleteFile(path: string): Promise<void> {
  const key = path.startsWith('/') ? path.slice(1) : path;

  await new Promise<void>((resolve, reject) => {
    cos.deleteObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: key,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
```

- [ ] **Step 2: 验证文件创建成功**

```bash
cat src/lib/cos.ts
```

Expected: 文件内容正确显示

- [ ] **Step 3: 提交**

```bash
git add src/lib/cos.ts
git commit -m "feat: add Tencent Cloud COS service wrapper"
```

---

## Task 4: 创建上传 API 路由

**Files:**
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: 创建上传 API 路由**

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { uploadFile } from '@/lib/cos';

// 文件验证配置
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// 允许的图片类型目录
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'hero', 'partners', 'uploads'];

export async function POST(request: NextRequest) {
  // 1. 验证权限
  const isAuthenticated = await authenticateRequest(request);
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: '未授权，请先登录' },
      { status: 401 }
    );
  }

  // 2. 解析表单数据
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: '无效的表单数据' },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  // 3. 验证参数
  if (!file) {
    return NextResponse.json(
      { error: '缺少文件参数' },
      { status: 400 }
    );
  }

  if (!type || !ALLOWED_TYPES_DIRS.includes(type)) {
    return NextResponse.json(
      { error: `无效的类型参数，允许的值: ${ALLOWED_TYPES_DIRS.join(', ')}` },
      { status: 400 }
    );
  }

  // 4. 验证文件类型
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `不支持的文件类型: ${file.type}，仅支持: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  // 5. 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // 6. 验证文件扩展名
  const filename = file.name;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `不支持的文件扩展名: .${ext}` },
      { status: 400 }
    );
  }

  // 7. 转换 File 为 Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 8. 上传到 COS
  try {
    const result = await uploadFile(buffer, type, filename);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    return NextResponse.json(
      { error: '上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 验证文件创建成功**

```bash
cat src/app/api/upload/route.ts
```

Expected: 文件内容正确显示

- [ ] **Step 3: 提交**

```bash
git add src/app/api/upload/route.ts
git add src/lib/auth.ts
git commit -m "feat: add image upload API endpoint"
```

---

## Task 5: 创建上传按钮组件

**Files:**
- Create: `src/components/ImageButton.tsx`

- [ ] **Step 1: 创建上传按钮组件**

```typescript
// src/components/ImageButton.tsx
"use client";

import { useState } from "react";

interface ImageButtonProps {
  value: string;
  onChange: (value: string) => void;
  type?: string; // 图片类型目录，如 "highlights", "news"
  label?: string;
  accept?: string; // 接受的文件类型
}

export function ImageButton({
  value,
  onChange,
  type = "uploads",
  label = "图片URL",
  accept = "image/jpeg,image/png,image/webp",
}: ImageButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 清除之前的错误
    setError(null);

    // 客户端验证文件大小
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError(`文件过大，最大支持 50MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || '上传失败');
        return;
      }

      const result = await res.json();
      onChange(result.path);
      setPreview(result.path);
    } catch (err) {
      console.error('Upload error:', err);
      setError('上传失败，请检查网络');
    } finally {
      setUploading(false);
    }
  };

  // 构建图片 URL
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
  const imageUrl = preview
    ? (preview.startsWith('http') ? preview : `${imageBaseUrl}${preview}`)
    : '';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
            setError(null);
          }}
          placeholder="/highlights/xxx.jpg"
        />
        <label className={`px-4 py-2 text-white text-sm rounded-md cursor-pointer transition-colors ${
          uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#1A3C8A] hover:bg-[#15306e]'
        }`}>
          {uploading ? '上传中...' : '上传'}
          <input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {imageUrl && !error && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="预览"
            className="h-24 rounded border border-gray-200 object-cover"
            onError={() => setError('图片加载失败')}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 验证文件创建成功**

```bash
cat src/components/ImageButton.tsx
```

Expected: 文件内容正确显示

- [ ] **Step 3: 提交**

```bash
git add src/components/ImageButton.tsx
git commit -m "feat: add reusable image upload button component"
```

---

## Task 6: 更新管理后台 - 首页亮点编辑器

**说明:** 在首页亮点的编辑器中添加图片上传功能。

**Files:**
- Modify: `src/app/admin/page.tsx:183-196`

- [ ] **Step 1: 导入 ImageButton 组件**

在文件顶部添加导入：

```typescript
import { ImageButton } from "@/components/ImageButton";
```

找到这一行（约第 3 行）：
```typescript
import { useState, useEffect, useCallback, ReactNode } from "react";
```

在它下面添加：
```typescript
import { ImageButton } from "@/components/ImageButton";
```

- [ ] **Step 2: 更新 HomeEditor 的 highlights 编辑部分**

找到 `HomeEditor` 函数中的 `SectionCard title="亮点"` 部分（约第 183-196 行），替换整个 `renderItem` 的内容：

原代码：
```typescript
          renderItem={(item, _i, update) => (
            <>
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="描述" value={item.text} onChange={(v) => update("text", v)} multiline />
            </>
          )}
```

替换为：
```typescript
          renderItem={(item, _i, update) => (
            <>
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="描述" value={item.text} onChange={(v) => update("text", v)} multiline />
              <ImageButton
                label="图片"
                value={(item.image as string) || ""}
                onChange={(v) => update("image", v)}
                type="highlights"
              />
            </>
          )}
```

- [ ] **Step 3: 更新 highlights 的 createItem 函数**

在同一 `ListEditor` 中找到 `createItem` prop（约第 188 行），更新为：

原代码：
```typescript
          createItem={() => ({ title: "", text: "" })}
```

替换为：
```typescript
          createItem={() => ({ title: "", text: "", image: "" })}
```

- [ ] **Step 4: 验证修改**

```bash
grep -A 5 "SectionCard title=\"亮点\"" src/app/admin/page.tsx | head -20
```

Expected: 看到 ImageButton 组件被使用

- [ ] **Step 5: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add image upload to highlights editor"
```

---

## Task 7: 更新首页 - 显示图片

**说明:** 更新首页核心亮点区域，显示上传的图片或回退到占位符。

**Files:**
- Modify: `src/app/page.tsx:192-218`

- [ ] **Step 1: 更新 highlights 类型定义**

在文件顶部找到 highlights 的使用（约第 92 行），需要更新类型处理。

找到这一行：
```typescript
const highlights = homeData.highlights;
```

在它上面添加类型断言帮助：
```typescript
// highlights 现在包含可选的 image 字段
interface HighlightItem {
  title: string;
  text: string;
  image?: string;
}
```

- [ ] **Step 2: 更新 highlights 渲染部分**

找到 highlights 的渲染代码（约第 192-218 行），替换整个图片占位符部分：

原代码：
```typescript
                  {/* Placeholder image */}
                  <div
                    className={`w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-gradient-to-br ${highlightGradients[i] || highlightGradients[0]} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white/80 text-6xl font-bold opacity-30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
```

替换为：
```typescript
                  {/* Image or placeholder */}
                  {item.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image}`}
                      alt={item.title}
                      className="w-full md:w-1/2 aspect-[16/10] rounded-2xl object-cover shadow-lg"
                    />
                  ) : (
                    <div
                      className={`w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-gradient-to-br ${highlightGradients[i] || highlightGradients[0]} flex items-center justify-center shrink-0`}
                    >
                      <span className="text-white/80 text-6xl font-bold opacity-30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
```

- [ ] **Step 3: 验证修改**

```bash
grep -A 10 "Placeholder image\|Image or placeholder" src/app/page.tsx | head -15
```

Expected: 看到条件渲染代码（item.image ? img : div）

- [ ] **Step 4: 提交**

```bash
git add src/app/page.tsx
git commit -m "feat: display uploaded images in highlights section"
```

---

## Task 8: 配置环境变量

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: 更新 .env 文件**

在 `.env` 文件中添加（如果不存在）：

```bash
# 腾讯云 COS 配置
COS_SECRET_ID=AKID7KMBnCOPEwb5Mdu57xc8c1FMUWM0RfgX
COS_SECRET_KEY=hDCzax74nJcjeOwHRPFvSp0zmbLVZjuw
COS_BUCKET=hcy-website-1415442236
COS_REGION=ap-beijing

# 图片基础 URL (前端使用)
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.website.aieducenter.com
```

- [ ] **Step 2: 更新 .env.example 文件**

在 `.env.example` 中添加模板（不包含真实密钥）：

```bash
# 腾讯云 COS 配置
COS_SECRET_ID=your_secret_id_here
COS_SECRET_KEY=your_secret_key_here
COS_BUCKET=hcy-website-1415442236
COS_REGION=ap-beijing

# 图片基础 URL (前端使用)
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.website.aieducenter.com
```

- [ ] **Step 3: 验证 .gitignore 包含 .env**

```bash
grep "^\.env$" .gitignore
```

Expected: 输出 `.env` 或 `.env*` 模式

如果没有输出，添加到 .gitignore：

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

- [ ] **Step 4: 提交 .env.example 和 .gitignore**

```bash
git add .env.example .gitignore
git commit -m "chore: add COS environment variables template"
```

**注意:** `.env` 文件本身不应该被提交到 git

---

## Task 9: 测试上传功能

**说明:** 手动测试完整的上传流程。

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

Expected: 服务器在 http://localhost:3000 启动

- [ ] **Step 2: 访问管理后台**

打开浏览器访问: http://localhost:3000/admin

Expected: 显示登录页面

- [ ] **Step 3: 登录后台**

输入管理员密码登录

Expected: 成功进入管理后台

- [ ] **Step 4: 进入首页内容编辑**

点击左侧菜单 "首页内容"

Expected: 显示首页内容编辑表单

- [ ] **Step 5: 测试亮点图片上传**

1. 找到 "亮点" 部分
2. 点击某个亮点的 "上传" 按钮
3. 选择一张图片（jpg/png/webp，小于 50MB）
4. 等待上传完成

Expected:
- 上传过程中按钮显示 "上传中..."
- 上传成功后图片预览显示
- 文本框填充相对路径如 `/highlights/20260329-xxx.jpg`

- [ ] **Step 6: 保存更改**

点击页面右上角 "保存" 按钮

Expected: 显示 "已保存" 提示

- [ ] **Step 7: 验证首页显示**

打开 http://localhost:3000

Expected: 核心亮点区域显示上传的图片，而不是占位符

- [ ] **Step 8: 测试错误处理**

1. 尝试上传非图片文件（如 .txt）
2. 尝试上传超大文件（如 100MB）

Expected: 显示相应的错误提示

---

## Task 10: 可选 - 为新闻编辑器添加图片上传

**说明:** 新闻编辑器已有 `image` 字段，可以复用 ImageButton 组件。

**Files:**
- Modify: `src/app/admin/page.tsx:254-275`

- [ ] **Step 1: 更新 NewsEditor 的图片字段**

找到 `NewsEditor` 中的图片 URL 输入框（约第 271 行），替换为 ImageButton：

原代码：
```typescript
              <FieldEditor label="图片URL" value={item.image} onChange={(v) => update("image", v)} />
```

替换为：
```typescript
              <ImageButton
                label="封面图片"
                value={item.image}
                onChange={(v) => update("image", v)}
                type="news"
              />
```

需要先在文件顶部确认 ImageButton 已导入（Task 6 已完成）。

- [ ] **Step 2: 验证修改**

```bash
grep -B 2 -A 2 "封面图片" src/app/admin/page.tsx
```

Expected: 看到 ImageButton 组件

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add image upload to news editor"
```

---

## 完成检查清单

- [ ] 所有依赖已安装
- [ ] 环境变量已正确配置
- [ ] 认证工具函数已创建
- [ ] COS 服务封装已创建
- [ ] 上传 API 路由已创建
- [ ] ImageButton 组件已创建
- [ ] 管理后台亮点编辑器已更新
- [ ] 首页亮点显示已更新
- [ ] 手动测试通过
- [ ] (可选) 新闻编辑器图片上传已添加

---

## 故障排查

| 问题 | 可能原因 | 解决方案 |
|-----|---------|---------|
| 上传返回 401 | Token 验证失败 | 检查是否已登录，sessionStorage 中是否有 admin_token |
| 上传返回 500 | COS 凭证错误 | 检查 .env 中的 COS_SECRET_ID 和 COS_SECRET_KEY |
| 图片无法显示 | URL 拼接错误 | 检查 NEXT_PUBLIC_IMAGE_BASE_URL 是否正确 |
| 文件类型不支持 | MIME 类型验证 | 确保上传的是 jpg/png/webp 格式 |
| 图片预览失败 | CORS 问题 | 检查 COS 存储桶 CORS 配置 |

---

## 下一步扩展

完成后可以考虑：

1. **添加图片删除功能** - 在 ImageButton 中添加删除按钮，调用 COS deleteFile API
2. **添加图片压缩** - 使用 sharp 库在上传前压缩图片
3. **添加多尺寸生成** - 自动生成缩略图和中等尺寸图片
4. **添加富文本编辑器** - 集成 TipTap 或 TinyMCE 支持图文混排
