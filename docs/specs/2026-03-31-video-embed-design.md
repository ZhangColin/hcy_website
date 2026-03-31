# Tiptap 编辑器视频嵌入功能设计

**日期:** 2026-03-31
**状态:** 设计已批准，待实现

## 概述

为现有 Tiptap 富文本编辑器添加视频嵌入功能，支持通过 URL 嵌入主流国内视频平台（B站、腾讯视频、优酷）的内容。

## 需求

### 功能范围
- **仅支持 URL 嵌入** - 不需要本地上传视频文件
- **支持平台** - B站、腾讯视频、优酷
- **预设尺寸** - 小(640×360)、中(854×480)、大(1024×576)
- **预览模式** - 编辑器内显示预览卡片，可编辑和删除
- **智能粘贴** - 用户粘贴视频 URL 时自动识别并提示插入
- **确认流程** - 解析后显示对话框，允许选择尺寸后再插入

### 非需求
- 图片功能保持不变（继续使用现有的本地上传）
- 不支持视频文件上传到服务器

## 架构

### 文件结构

```
src/components/
├── TiptapEditor.tsx          # 现有编辑器（需扩展）
├── extensions/
│   └── VideoExtension.ts     # 自定义视频 Node 扩展
├── video/
│   ├── VideoParser.ts        # 视频平台 URL 解析器
│   ├── VideoInsertDialog.tsx # 插入视频弹窗
│   └── SIZE_PRESETS.ts       # 尺寸配置常量
└── icons/
    └── VideoIcon.tsx         # 视频按钮图标（可选）
```

### 数据模型

#### 编辑器内部格式（HTML）

```html
<video-platform
  platform="bilibili"
  video-id="BV1234567890"
  size="medium">
</video-platform>
```

#### 保存输出格式（HTML）

```html
<iframe
  src="https://player.bilibili.com/player.html?bvid=BV1234567890&high_quality=1"
  width="854"
  height="480"
  scrolling="no"
  border="0"
  frameborder="no"
  framespacing="0"
  allowfullscreen>
</iframe>
```

### 尺寸预设

| 尺寸   | 宽度  | 高度  | 宽高比 | 用途       |
|--------|-------|-------|--------|------------|
| small  | 640   | 360   | 16:9   | 小屏预览   |
| medium | 854   | 480   | 16:9   | 默认/标准  |
| large  | 1024  | 576   | 16:9   | 大屏展示   |

## 平台解析

### URL 解析规则

| 平台     | URL 模式示例                                      | 提取内容  | iframe 模板 |
|----------|---------------------------------------------------|-----------|-------------|
| B站      | `https://www.bilibili.com/video/BVxxx`<br>`https://b23.tv/xxx` | BV 号或短码 | `https://player.bilibili.com/player.html?bvid={id}&high_quality=1` |
| 腾讯视频 | `https://v.qq.com/x/cover/xxx.html`<br>`https://v.qq.com/x/page/xxx.html` | vid 参数  | `https://v.qq.com/txp/iframe/player.html?vid={id}` |
| 优酷     | `https://v.youku.com/v_show/id_XMTAw.html`       | id 参数   | `https://player.youku.com/embed/{id}` |

### 解析器接口

```typescript
interface VideoPlatform {
  name: 'bilibili' | 'tencent' | 'youku';
  patterns: RegExp[];
  parseId: (url: string) => string | null;
  buildIframeSrc: (id: string) => string;
}

interface ParseResult {
  platform: string;
  videoId: string;
}
```

## 用户交互流程

```
用户粘贴 URL
    ↓
解析器识别平台 + 提取视频 ID
    ↓
弹窗显示：
├─ 平台图标和名称
├─ 视频 ID（只读）
├─ 尺寸选择（单选：小/中/大，默认中）
└─ [取消] [插入] 按钮
    ↓
用户选择尺寸并点击"插入"
    ↓
在编辑器光标位置插入视频 Node（预览模式）
```

## UI 设计

### 工具栏

在现有工具栏图片按钮 🖼️ 旁边添加视频按钮：

```
[🔗] [🖼️] [📹] [↶] [↷]
 链接  图片  视频
```

### 视频预览卡片（编辑器内）

```
┌─────────────────────────────────────┐
│  📹 B站视频 - medium        [编辑] [删除]  │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [平台 logo]              │    │
│  │                             │    │
│  │   BV1234567890              │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 插入视频弹窗

```
┌─────────────────────────────────────┐
│  插入视频                      ×    │
├─────────────────────────────────────┤
│  平台：[B站图标] B站                   │
│  视频：BV1234567890                   │
│                                      │
│  尺寸：                               │
│  ○ 小 (640×360)                      │
│  ● 中 (854×480)  ← 默认               │
│  ○ 大 (1024×576)                     │
│                                      │
│       [取消]  [插入]                  │
└─────────────────────────────────────┘
```

## 技术实现

### VideoExtension 核心结构

```typescript
// src/components/extensions/VideoExtension.ts
import { Node } from '@tiptap/core';

export const VideoExtension = Node.create({
  name: 'videoPlatform',

  group: 'block',
  inline: false,
  atom: true,  // 不可分割的单元

  addAttributes() {
    return {
      platform: { default: null },
      videoId: { default: null },
      size: { default: 'medium' },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['video-platform', HTMLAttributes];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      // 渲染预览模式 UI
      const { platform, videoId, size } = node.attrs;
      // ... 渲染逻辑
      return { dom, contentDOM: null };
    };
  },
});
```

### 粘贴事件监听

```typescript
// 在 TiptapEditor.tsx 中添加
useEffect(() => {
  if (!editor) return;

  const handlePaste = (event: ClipboardEvent) => {
    const pastedText = event.clipboardData?.getData('text');
    if (!pastedText) return;

    const parsed = VideoParser.parse(pastedText);
    if (parsed) {
      event.preventDefault();
      showVideoInsertDialog(parsed);
    }
  };

  editor.view.dom.addEventListener('paste', handlePaste);
  return () => editor.view.dom.removeEventListener('paste', handlePaste);
}, [editor]);
```

### HTML 转换（保存时）

```typescript
// 将 <video-platform> 转换为 <iframe>
const getCleanHTML = (editor: Editor) => {
  const html = editor.getHTML();
  return html.replace(
    /<video-platform[^>]*>/g,
    (match) => {
      // 解析属性并生成 iframe
      // ...
    }
  );
};
```

## 错误处理

| 场景               | 处理方式                       |
|--------------------|--------------------------------|
| 无法识别的 URL     | Toast 提示"不支持的视频平台"   |
| URL 格式无效       | Toast 提示"视频链接格式无效"   |
| 解析失败（无 ID）  | Toast 提示"无法提取视频 ID"    |
| 网络请求失败       | 不影响编辑器，仅提示           |

## 测试要点

- [ ] B站 URL 正确解析（完整链接和短链接）
- [ ] 腾讯视频 URL 正确解析
- [ ] 优酷 URL 正确解析
- [ ] 无效 URL 有正确提示
- [ ] 尺寸切换正常工作
- [ ] 编辑功能正常
- [ ] 删除功能正常
- [ ] 保存的 HTML 可在前端正确渲染
- [ ] 粘贴自动识别触发正确

## 实现文件清单

| 文件                                           | 新建/修改 | 说明                     |
|------------------------------------------------|----------|--------------------------|
| `src/components/extensions/VideoExtension.ts`  | 新建     | Tiptap 视频 Node 扩展   |
| `src/components/video/VideoParser.ts`          | 新建     | 平台解析器              |
| `src/components/video/VideoInsertDialog.tsx`   | 新建     | 插入视频弹窗            |
| `src/components/video/SIZE_PRESETS.ts`         | 新建     | 尺寸配置                |
| `src/components/TiptapEditor.tsx`              | 修改     | 集成视频功能、粘贴监听  |
