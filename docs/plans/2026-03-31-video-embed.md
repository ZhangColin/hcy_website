# Tiptap 编辑器视频嵌入功能实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Tiptap 富文本编辑器添加视频嵌入功能，支持通过 URL 嵌入 B站、腾讯视频、优酷的内容

**Architecture:** 创建自定义 Tiptap Node 扩展处理视频，使用 React 组件实现预览卡片和插入对话框，通过粘贴事件监听实现智能识别

**Tech Stack:** Tiptap v3.21, React 19, TypeScript

---

## 文件结构

```
src/components/
├── TiptapEditor.tsx              # 修改 - 集成视频功能
├── extensions/
│   └── VideoExtension.ts         # 新建 - Tiptap 视频 Node 扩展
└── video/
    ├── VideoParser.ts            # 新建 - 视频平台 URL 解析器
    ├── VideoInsertDialog.tsx     # 新建 - 插入视频弹窗组件
    └── SIZE_PRESETS.ts           # 新建 - 尺寸配置常量
```

---

## Task 1: 创建尺寸配置常量

**Files:**
- Create: `src/components/video/SIZE_PRESETS.ts`

- [ ] **Step 1: 创建尺寸配置文件**

```typescript
// src/components/video/SIZE_PRESETS.ts

export type VideoSize = 'small' | 'medium' | 'large';

export interface SizePreset {
  width: number;
  height: number;
  label: string;
}

export const SIZE_PRESETS: Record<VideoSize, SizePreset> = {
  small: {
    width: 640,
    height: 360,
    label: '小 (640×360)',
  },
  medium: {
    width: 854,
    height: 480,
    label: '中 (854×480)',
  },
  large: {
    width: 1024,
    height: 576,
    label: '大 (1024×576)',
  },
};

export const DEFAULT_SIZE: VideoSize = 'medium';
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/video/SIZE_PRESETS.ts
git commit -m "feat: add video size presets configuration"
```

---

## Task 2: 创建视频平台 URL 解析器

**Files:**
- Create: `src/components/video/VideoParser.ts`

- [ ] **Step 1: 创建解析器类型定义和实现**

```typescript
// src/components/video/VideoParser.ts

export type VideoPlatform = 'bilibili' | 'tencent' | 'youku';

export interface VideoPlatformConfig {
  name: VideoPlatform;
  displayName: string;
  patterns: RegExp[];
  parseId: (url: string) => string | null;
  buildIframeSrc: (id: string) => string;
}

export interface ParsedVideo {
  platform: VideoPlatform;
  videoId: string;
  displayName: string;
}

// B站配置
const bilibiliConfig: VideoPlatformConfig = {
  name: 'bilibili',
  displayName: 'B站',
  patterns: [
    /bilibili\.com\/video\/(BV[\w]+)(?:\?|$)/,
    /b23\.tv\/([a-zA-Z0-9]+)/,
  ],
  parseId: (url: string) => {
    // 完整链接
    const bvMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
    if (bvMatch) return bvMatch[1];

    // 短链接 - 需要展开或直接使用（这里简化处理，返回短码）
    const shortMatch = url.match(/b23\.tv\/([a-zA-Z0-9]+)/);
    if (shortMatch) {
      // 短链接需要重定向获取真实 URL，这里先返回短码
      // 实际使用时可能需要后端支持
      return shortMatch[1];
    }

    return null;
  },
  buildIframeSrc: (id: string) => {
    return `https://player.bilibili.com/player.html?bvid=${id}&high_quality=1&autoplay=0`;
  },
};

// 腾讯视频配置
const tencentConfig: VideoPlatformConfig = {
  name: 'tencent',
  displayName: '腾讯视频',
  patterns: [
    /v\.qq\.com\/x\/cover\/[^\/]+\/([a-zA-Z0-9_]+)\.html/,
    /v\.qq\.com\/x\/page\/([a-zA-Z0-9_]+)\.html/,
    /vid=([a-zA-Z0-9_]+)/,
  ],
  parseId: (url: string) => {
    const match = url.match(/vid=([a-zA-Z0-9_]+)/) ||
                 url.match(/v\.qq\.com\/x\/(?:cover\/[^\/]+\/|page\/)([a-zA-Z0-9_]+)\.html/);
    return match ? match[1] : null;
  },
  buildIframeSrc: (id: string) => {
    return `https://v.qq.com/txp/iframe/player.html?vid=${id}`;
  },
};

// 优酷配置
const youkuConfig: VideoPlatformConfig = {
  name: 'youku',
  displayName: '优酷',
  patterns: [
    /youku\.com\/v_show\/id_([a-zA-Z0-9_]+)\.html/,
  ],
  parseId: (url: string) => {
    const match = url.match(/youku\.com\/v_show\/id_([a-zA-Z0-9_]+)\.html/);
    return match ? match[1] : null;
  },
  buildIframeSrc: (id: string) => {
    return `https://player.youku.com/embed/${id}`;
  },
};

// 平台配置列表
const PLATFORMS: VideoPlatformConfig[] = [
  bilibiliConfig,
  tencentConfig,
  youkuConfig,
];

/**
 * 解析视频 URL
 * @param url 视频 URL
 * @returns 解析结果或 null
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // 去除前后空格
  const trimmedUrl = url.trim();

  // 遍历所有平台配置
  for (const platform of PLATFORMS) {
    // 检查是否匹配该平台的任意模式
    const matchesAnyPattern = platform.patterns.some(pattern =>
      pattern.test(trimmedUrl)
    );

    if (matchesAnyPattern) {
      const videoId = platform.parseId(trimmedUrl);
      if (videoId) {
        return {
          platform: platform.name,
          videoId,
          displayName: platform.displayName,
        };
      }
    }
  }

  return null;
}

/**
 * 构建 iframe HTML
 * @param platform 平台名称
 * @param videoId 视频 ID
 * @param size 尺寸
 * @returns iframe HTML 字符串
 */
export function buildIframeHtml(
  platform: VideoPlatform,
  videoId: string,
  size: VideoSize
): string {
  const config = PLATFORMS.find(p => p.name === platform);
  if (!config) return '';

  const { SIZE_PRESETS } = require('./SIZE_PRESETS');
  const preset = SIZE_PRESETS[size];
  const src = config.buildIframeSrc(videoId);

  return `<iframe src="${src}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
}

// 重新导出类型
export type { VideoSize } from './SIZE_PRESETS';
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/video/VideoParser.ts
git commit -m "feat: add video platform URL parser"
```

---

## Task 3: 创建视频插入对话框组件

**Files:**
- Create: `src/components/video/VideoInsertDialog.tsx`

- [ ] **Step 1: 创建对话框组件**

```tsx
// src/components/video/VideoInsertDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import type { ParsedVideo, VideoSize } from './VideoParser';
import { SIZE_PRESETS, DEFAULT_SIZE } from './SIZE_PRESETS';

interface VideoInsertDialogProps {
  parsedVideo: ParsedVideo | null;
  onClose: () => void;
  onInsert: (size: VideoSize) => void;
}

export function VideoInsertDialog({
  parsedVideo,
  onClose,
  onInsert,
}: VideoInsertDialogProps) {
  const [selectedSize, setSelectedSize] = useState<VideoSize>(DEFAULT_SIZE);

  if (!parsedVideo) return null;

  const handleInsert = () => {
    onInsert(selectedSize);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">插入视频</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* 平台信息 */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <span className="text-2xl">📹</span>
            <div>
              <div className="font-medium">{parsedVideo.displayName}</div>
              <div className="text-sm text-gray-500">{parsedVideo.videoId}</div>
            </div>
          </div>

          {/* 尺寸选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              尺寸：
            </label>
            <div className="space-y-2">
              {(Object.keys(SIZE_PRESETS) as VideoSize[]).map((size) => {
                const preset = SIZE_PRESETS[size];
                return (
                  <label
                    key={size}
                    className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="video-size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="text-[#1A3C8A]"
                    />
                    <span>{preset.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleInsert}
              className="flex-1 px-4 py-2 bg-[#1A3C8A] text-white rounded hover:bg-[#2B6CB0]"
            >
              插入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/video/VideoInsertDialog.tsx
git commit -m "feat: add video insert dialog component"
```

---

## Task 4: 创建 Tiptap 视频扩展

**Files:**
- Create: `src/components/extensions/VideoExtension.ts`

- [ ] **Step 1: 创建 VideoExtension**

```typescript
// src/components/extensions/VideoExtension.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VideoNodeView } from '../video/VideoNodeView';
import type { VideoSize } from '../video/SIZE_PRESETS';

export interface VideoAttributes {
  platform: string;
  videoId: string;
  size: VideoSize;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoPlatform: {
      insertVideo: (attributes: VideoAttributes) => ReturnType;
      updateVideo: (attributes: VideoAttributes) => ReturnType;
      deleteVideo: () => ReturnType;
    };
  }
}

export const VideoExtension = Node.create({
  name: 'videoPlatform',

  group: 'block',
  inline: false,
  atom: true,

  addAttributes() {
    return {
      platform: {
        default: null,
        parseHTML: element => element.getAttribute('data-platform'),
        renderHTML: attributes => {
          if (!attributes.platform) {
            return {};
          }
          return {
            'data-platform': attributes.platform,
          };
        },
      },
      videoId: {
        default: null,
        parseHTML: element => element.getAttribute('data-video-id'),
        renderHTML: attributes => {
          if (!attributes.videoId) {
            return {};
          }
          return {
            'data-video-id': attributes.videoId,
          };
        },
      },
      size: {
        default: 'medium',
        parseHTML: element => element.getAttribute('data-size') || 'medium',
        renderHTML: attributes => {
          return {
            'data-size': attributes.size,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video-platform[data-platform][data-video-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video-platform', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      insertVideo:
        (attributes: VideoAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
      updateVideo:
        (attributes: VideoAttributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
      deleteVideo:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView, {
      contentDOMElementTag: 'div',
    });
  },
});
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors（注意：VideoNodeView 还未创建，会有错误，这是预期的）

- [ ] **Step 3: 暂存文件（不提交，等 Task 5 完成后一起提交）**

```bash
git add src/components/extensions/VideoExtension.ts
```

---

## Task 5: 创建视频 Node 视图组件

**Files:**
- Create: `src/components/video/VideoNodeView.tsx`

- [ ] **Step 1: 创建 VideoNodeView 组件**

```tsx
// src/components/video/VideoNodeView.tsx
"use client";

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import type { VideoSize, ParsedVideo } from './VideoParser';
import { SIZE_PRESETS } from './SIZE_PRESETS';
import { VideoInsertDialog } from './VideoInsertDialog';

const PLATFORM_NAMES: Record<string, string> = {
  bilibili: 'B站',
  tencent: '腾讯视频',
  youku: '优酷',
};

export function VideoNodeView(props: NodeViewProps) {
  const { node, updateAttributes, deleteNode } = props;
  const { platform, videoId, size } = node.attrs;

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteNode();
  };

  const handleSizeChange = (newSize: VideoSize) => {
    updateAttributes({ size: newSize });
  };

  const displayName = PLATFORM_NAMES[platform] || platform;
  const sizeLabel = SIZE_PRESETS[size as VideoSize]?.label || size;

  return (
    <NodeViewWrapper className="video-node-wrapper my-4">
      <div
        className="relative group border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#1A3C8A] transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 控制按钮 */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="编辑"
            >
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-xs bg-white border border-red-300 text-red-600 rounded hover:bg-red-50"
              title="删除"
            >
              删除
            </button>
          </div>
        )}

        {/* 预览内容 */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">📹</span>
          <div>
            <div className="font-medium text-gray-800">
              {displayName} 视频
            </div>
            <div className="text-sm text-gray-500">{videoId}</div>
            <div className="text-xs text-gray-400 mt-1">{sizeLabel}</div>
          </div>
        </div>

        {/* 编辑对话框 */}
        {isEditing && (
          <VideoInsertDialog
            parsedVideo={{
              platform: platform as ParsedVideo['platform'],
              videoId,
              displayName,
            }}
            onClose={() => setIsEditing(false)}
            onInsert={handleSizeChange}
          />
        )}
      </div>

      <style jsx>{`
        .video-node-wrapper :global(.video-node-wrapper) {
          margin: 1em 0;
        }
      `}</style>
    </NodeViewWrapper>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit（与 Task 4 一起提交）**

```bash
git add src/components/video/VideoNodeView.tsx
git commit -m "feat: add Tiptap video extension with node view"
```

---

## Task 6: 修改 TiptapEditor 集成视频功能

**Files:**
- Modify: `src/components/TiptapEditor.tsx`

- [ ] **Step 1: 添加视频相关的导入和状态**

在文件顶部添加导入（约第 9 行后）：

```typescript
import { useState, useCallback } from 'react';
import { VideoExtension } from './extensions/VideoExtension';
import { parseVideoUrl, type ParsedVideo, type VideoSize } from './video/VideoParser';
import { VideoInsertDialog } from './video/VideoInsertDialog';
```

- [ ] **Step 2: 在 TiptapEditor 组件中添加视频对话框状态**

在 `TiptapEditor` 函数组件内，`useEditor` 之前添加（约第 23 行后）：

```typescript
  // 视频插入对话框状态
  const [videoDialog, setVideoDialog] = useState<{
    parsedVideo: ParsedVideo | null;
    isOpen: boolean;
  }>({ parsedVideo: null, isOpen: false });
```

- [ ] **Step 3: 添加视频插入处理函数**

在 `handleImageUpload` 函数之后添加（约第 96 行后）：

```typescript
  const handleInsertVideo = useCallback((parsedVideo: ParsedVideo) => {
    setVideoDialog({ parsedVideo, isOpen: true });
  }, []);

  const handleVideoInsert = useCallback((size: VideoSize) => {
    if (videoDialog.parsedVideo && editor) {
      editor.commands.insertVideo({
        platform: videoDialog.parsedVideo.platform,
        videoId: videoDialog.parsedVideo.videoId,
        size,
      });
    }
  }, [videoDialog.parsedVideo, editor]);

  const closeVideoDialog = useCallback(() => {
    setVideoDialog({ parsedVideo: null, isOpen: false });
  }, []);
```

- [ ] **Step 4: 添加粘贴事件监听**

在现有的 `useEffect`（同步 content 的）之后添加（约第 59 行后）：

```typescript
  // 粘贴事件监听 - 检测视频 URL
  useEffect(() => {
    if (!editor || !editable) return;

    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData('text');
      if (!pastedText) return;

      const parsed = parseVideoUrl(pastedText);
      if (parsed) {
        event.preventDefault();
        handleInsertVideo(parsed);
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener('paste', handlePaste);

    return () => {
      dom.removeEventListener('paste', handlePaste);
    };
  }, [editor, editable, handleInsertVideo]);
```

- [ ] **Step 5: 在 extensions 中添加 VideoExtension**

修改 `useEditor` 的 extensions 数组（约第 25-45 行）：

```typescript
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
      VideoExtension,  // 添加这一行
    ],
    // ... 其余配置保持不变
```

- [ ] **Step 6: 在工具栏添加视频按钮**

在 `handleImageUpload` 按钮之后添加视频按钮（约第 167 行后）：

```typescript
      <button
        onClick={() => {
          const url = prompt('请输入视频链接:');
          if (url) {
            const parsed = parseVideoUrl(url);
            if (parsed) {
              handleInsertVideo(parsed);
            } else {
              alert('不支持的视频平台或链接格式无效');
            }
          }
        }}
        className="px-2 py-1 rounded text-sm hover:bg-gray-100"
        title="插入视频"
      >
        📹
      </button>
```

- [ ] **Step 7: 在返回的 JSX 中添加视频对话框**

在组件返回的 `<div>` 最外层内添加（约第 189 行后）：

```typescript
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {editable && <MenuBar />}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] focus:outline-none"
      />

      {/* 视频插入对话框 */}
      {videoDialog.isOpen && videoDialog.parsedVideo && (
        <VideoInsertDialog
          parsedVideo={videoDialog.parsedVideo}
          onClose={closeVideoDialog}
          onInsert={handleVideoInsert}
        />
      )}

      <style jsx global>{`
```

- [ ] **Step 8: 添加视频节点样式**

在 `<style jsx global>` 块内添加（约第 313 行，`pre code` 规则之后）：

```typescript
        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        /* 视频节点样式 */
        .ProseMirror .video-node-wrapper {
          margin: 1em 0;
        }

        .ProseMirror iframe {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }
      `}</style>
```

- [ ] **Step 9: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 10: 验证开发服务器运行**

Run: `npm run dev`
Expected: Dev server starts without errors

- [ ] **Step 11: Commit**

```bash
git add src/components/TiptapEditor.tsx
git commit -m "feat: integrate video embed into Tiptap editor"
```

---

## Task 7: 添加 HTML 转换工具函数

**Files:**
- Create: `src/components/video/VideoHtmlConverter.ts`

- [ ] **Step 1: 创建 HTML 转换工具**

```typescript
// src/components/video/VideoHtmlConverter.ts
import type { VideoSize } from './SIZE_PRESETS';
import { SIZE_PRESETS } from './SIZE_PRESETS';

const PLATFORM_IFRAME_TEMPLATES: Record<string, (id: string, size: VideoSize) => string> = {
  bilibili: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://player.bilibili.com/player.html?bvid=${id}&high_quality=1&autoplay=0" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
  tencent: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://v.qq.com/txp/iframe/player.html?vid=${id}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
  youku: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://player.youku.com/embed/${id}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
};

/**
 * 将编辑器内的 video-platform 标签转换为 iframe
 * @param html 编辑器 HTML
 * @returns 转换后的 HTML
 */
export function convertVideoTagsToIframe(html: string): string {
  return html.replace(
    /<video-platform\s+data-platform="([^"]+)"\s+data-video-id="([^"]+)"\s+data-size="([^"]+)"\s*\/?>/g,
    (match, platform, videoId, size) => {
      const template = PLATFORM_IFRAME_TEMPLATES[platform];
      if (template) {
        return template(videoId, size as VideoSize);
      }
      return match; // 保持原样如果无法识别
    }
  );
}
```

- [ ] **Step 2: 在使用编辑器的地方应用转换**

**注意：** 这一步需要在使用 TiptapEditor 的组件中添加转换逻辑。根据你的项目结构，这可能在 `NewsEditorClient.tsx` 或其他地方。

找到编辑器保存内容的地方，在保存前应用转换：

```typescript
import { convertVideoTagsToIframe } from '@/components/video/VideoHtmlConverter';

// 在保存函数中
const handleSave = async () => {
  // 将 video-platform 标签转换为 iframe
  const cleanHtml = convertVideoTagsToIframe(editor.getHTML());

  // 保存 cleanHtml 而不是原始 HTML
  await saveContent(cleanHtml);
};
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/video/VideoHtmlConverter.ts
git add [修改的编辑器使用组件]
git commit -m "feat: add HTML converter for video tags to iframe"
```

---

## 测试检查清单

完成所有任务后，进行以下测试：

- [ ] **B站 URL 解析测试**
  - 粘贴 `https://www.bilibili.com/video/BV1xx411c7mD`
  - 应弹出对话框显示"B站"和视频 ID
  - 选择尺寸后插入成功

- [ ] **腾讯视频 URL 解析测试**
  - 粘贴 `https://v.qq.com/x/page/xxxxx.html`
  - 应弹出对话框显示"腾讯视频"和视频 ID

- [ ] **优酷 URL 解析测试**
  - 粘贴 `https://v.youku.com/v_show/id_xxxxx.html`
  - 应弹出对话框显示"优酷"和视频 ID

- [ ] **无效 URL 处理**
  - 粘贴不支持的 URL
  - 应不触发对话框或显示错误提示

- [ ] **尺寸切换测试**
  - 插入视频后点击"编辑"
  - 选择不同尺寸
  - 确认尺寸更新

- [ ] **删除功能测试**
  - 插入视频后点击"删除"
  - 确认视频被移除

- [ ] **工具栏按钮测试**
  - 点击工具栏 📹 按钮
  - 输入 URL 后正确解析

- [ ] **保存输出测试**
  - 插入视频后保存
  - 检查保存的 HTML 是否包含正确的 iframe 标签

---

## 完成确认

- [ ] 所有 TypeScript 编译无错误
- [ ] 开发服务器正常启动
- [ ] 测试检查清单全部通过
- [ ] 代码已提交到 git

---

## 参考资料

- [Tiptap 官方文档 - Custom Node](https://tiptap.dev/docs/editor/extensions/functionality/custom-node)
- [Tiptap 官方文档 - Node Views](https://tiptap.dev/docs/editor/extensions/functionality/node-views)
- 设计规范: `docs/specs/2026-03-31-video-embed-design.md`
