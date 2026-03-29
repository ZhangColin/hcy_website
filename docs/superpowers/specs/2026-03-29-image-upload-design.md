# 图片上传系统设计文档

**日期**: 2026-03-29
**作者**: Claude
**状态**: 设计中

## 1. 概述

为海创元官网添加统一的图片上传功能，使用腾讯云对象存储（COS）作为存储后端。此功能将首先应用于首页核心亮点的图片展示，后续可复用于新闻封面、轮播图等场景。

### 1.1 背景

- 当前首页"核心亮点"区域使用渐变占位符（显示 01、02 等编号）
- 管理后台已有完整的内容编辑功能，但缺少图片上传能力
- 需要一个可复用的上传服务，供项目各处使用

### 1.2 目标

1. 实现服务端图片上传 API
2. 创建可复用的上传按钮组件
3. 首页核心亮点支持图片展示
4. 为后续功能（新闻、轮播等）预留扩展能力

## 2. 技术选型

| 项目 | 方案 | 理由 |
|-----|------|-----|
| 上传方式 | 服务端中转 | 管理员使用频率低，实现简单，便于验证和处理 |
| 凭证管理 | 环境变量 | 安全、灵活，支持多环境配置 |
| 存储结构 | 按类型分目录 | 便于管理和查找，如 `/highlights/`, `/news/` |
| 数据存储 | 相对路径 | 存储如 `/highlights/xxx.jpg`，前端拼接完整 URL |
| 上传组件 | 文本框 + 上传按钮 | 保持现有界面风格，改动最小 |

## 3. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        管理后台前端                           │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │ 文本框(image) │ ◄────│ 上传按钮组件  │                     │
│  └──────────────┘      └──────┬───────┘                     │
└────────────────────────────────┼─────────────────────────────┘
                                 │ POST /api/upload
                                 │ (file, type: "highlights")
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      API 路由层                              │
│  POST /app/api/upload/route.ts                              │
│  - 验证管理员权限                                             │
│  - 验证文件类型、大小                                          │
│  - 调用 COS 服务上传                                          │
│  - 返回相对路径                                               │
└────────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    COS 服务封装                              │
│  src/lib/cos.ts                                              │
│  - 初始化腾讯云 COS 客户端                                     │
│  - uploadFile(file, type) 方法                               │
│  - 返回相对路径                                               │
└────────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    腾讯云 COS                                 │
│  Bucket: hcy-website-1415442236                              │
│  Region: ap-beijing                                          │
│  Domain: image.website.aieducenter.com                       │
└─────────────────────────────────────────────────────────────┘
```

## 4. 核心组件设计

### 4.1 文件结构

```
src/
├── app/
│   └── api/
│       └── upload/
│           └── route.ts          # 上传 API 路由
├── lib/
│   └── cos.ts                    # COS 服务封装
├── components/
│   └── ImageButton.tsx           # 上传按钮组件
└── types/
    └── upload.ts                 # 上传相关类型定义
```

### 4.2 COS 服务封装 (`src/lib/cos.ts`)

```typescript
import { COS } from 'cos-nodejs-sdk';

// COS 客户端配置
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

// 配置
const COS_CONFIG = {
  bucket: process.env.COS_BUCKET || 'hcy-website-1415442236',
  region: process.env.COS_REGION || 'ap-beijing',
  domain: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
};

// 上传文件
export async function uploadFile(
  file: File,
  type: string
): Promise<{ path: string; url: string }> {
  // 生成文件名: {type}/{YYYYMMDD}-{uuid}.ext
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const ext = file.name.split('.').pop();
  const filename = `${date}-${crypto.randomUUID()}.${ext}`;
  const key = `${type}/${filename}`;

  // 上传到 COS
  await cos.putObject({
    Bucket: COS_CONFIG.bucket,
    Region: COS_CONFIG.region,
    Key: key,
    Body: file,
  });

  return {
    path: `/${key}`,
    url: `${COS_CONFIG.domain}/${key}`,
  };
}
```

### 4.3 上传 API (`src/app/api/upload/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cos';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_TYPES_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// 验证管理员权限
function verifyAuth(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  // 与现有的 /api/admin/auth 验证逻辑保持一致
  return token === sessionStorage.getItem('admin_token');
}

export async function POST(request: NextRequest) {
  // 1. 验证权限
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  // 2. 解析表单数据
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string; // 如 "highlights", "news"

  // 3. 验证文件
  if (!file || !type) {
    return NextResponse.json({ error: '缺少文件或类型参数' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `不支持的文件类型: ${file.type}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // 4. 上传到 COS
  try {
    const result = await uploadFile(file, type);
    return NextResponse.json(result);
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { error: '上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

### 4.4 上传按钮组件 (`src/components/ImageButton.tsx`)

```typescript
"use client";

import { useState } from "react";

interface ImageButtonProps {
  value: string;
  onChange: (value: string) => void;
  type?: string; // 图片类型目录，如 "highlights", "news"
  label?: string;
}

export function ImageButton({
  value,
  onChange,
  type = "uploads",
  label = "图片URL",
}: ImageButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        const error = await res.json();
        alert(error.error || '上传失败');
        return;
      }

      const result = await res.json();
      onChange(result.path);
      setPreview(result.path);
    } catch (error) {
      alert('上传失败，请检查网络');
    } finally {
      setUploading(false);
    }
  };

  const imageUrl = preview
    ? (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '') + preview
    : '';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/highlights/xxx.jpg"
        />
        <label className="px-4 py-2 bg-[#1A3C8A] text-white text-sm rounded-md hover:bg-[#15306e] cursor-pointer disabled:opacity-50">
          {uploading ? '上传中...' : '上传'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="预览"
            className="h-20 rounded border border-gray-200 object-cover"
          />
        </div>
      )}
    </div>
  );
}
```

### 4.5 首页高亮数据结构调整

**调整前：**
```json
{
  "title": "AI课程入校",
  "text": "1+N综合解决方案，覆盖小初高全学段"
}
```

**调整后：**
```json
{
  "title": "AI课程入校",
  "text": "1+N综合解决方案，覆盖小初高全学段",
  "image": "/highlights/20260329-xxx.jpg"
}
```

### 4.6 首页高亮展示组件调整

在 `src/app/page.tsx` 中，将占位符 div 替换为图片组件：

```typescript
// 调整前
<div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-gradient-to-br ...">
  <span className="text-white/80 text-6xl font-bold opacity-30">
    {String(i + 1).padStart(2, "0")}
  </span>
</div>

// 调整后
{item.image ? (
  <img
    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image}`}
    alt={item.title}
    className="w-full md:w-1/2 aspect-[16/10] rounded-2xl object-cover"
  />
) : (
  <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-gradient-to-br ...">
    <span className="text-white/80 text-6xl font-bold opacity-30">
      {String(i + 1).padStart(2, "0")}
    </span>
  </div>
)}
```

## 5. 环境配置

### 5.1 环境变量

```bash
# .env（不要提交到 git）
COS_SECRET_ID=AKID7KMBnCOPEwb5Mdu57xc8c1FMUWM0RfgX
COS_SECRET_KEY=hDCzax74nJcjeOwHRPFvSp0zmbLVZjuw
COS_BUCKET=hcy-website-1415442236
COS_REGION=ap-beijing
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.website.aieducenter.com
```

### 5.2 .gitignore 确保

确保 `.env` 文件不被提交：

```
.env
.env.local
.env.*.local
```

### 5.3 依赖安装

```bash
npm install cos-nodejs-sdk
npm install --save-dev @types/cos-nodejs-sdk
```

## 6. 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 未授权 | 返回 401，前端提示重新登录 |
| 文件类型不支持 | 返回 400，提示支持的类型 |
| 文件过大 | 返回 400，提示最大 50MB |
| COS 上传失败 | 返回 500，提示稍后重试 |
| 网络错误 | 前端捕获，提示检查网络 |

## 7. 安全考虑

1. **权限验证**：上传 API 需要验证管理员 token
2. **文件类型验证**：服务端严格验证 MIME 类型
3. **文件大小限制**：防止大文件攻击
4. **密钥安全**：使用环境变量，不提交到 git
5. **子账号隔离**：建议使用只拥有 COS 权限的子账号

## 8. 扩展性设计

### 8.1 可复用性

- `ImageButton` 组件接受 `type` 参数，可指定存储目录
- 同一组件可用于：
  - 首页亮点 (`type="highlights"`)
  - 新闻封面 (`type="news"`)
  - 轮播图 (`type="hero"`)
  - 合作伙伴 logo (`type="partners"`)

### 8.2 未来扩展

如需支持富文本编辑器，可复用 `/api/upload` API：

```typescript
// 富文本编辑器集成示例
editor.on('imageUpload', async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'editor');

  const res = await fetch('/api/upload', { /* ... */ });
  const result = await res.json();
  editor.insertImage(result.url);
});
```

## 9. 实施计划

1. 安装依赖 (`cos-nodejs-sdk`)
2. 配置环境变量
3. 实现 COS 服务封装
4. 实现上传 API
5. 实现上传按钮组件
6. 更新首页高亮编辑器
7. 更新首页高亮展示组件
8. 测试上传功能
