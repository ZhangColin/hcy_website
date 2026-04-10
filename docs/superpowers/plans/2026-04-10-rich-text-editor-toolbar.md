# Rich Text Editor Toolbar Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the TipTap editor with comprehensive toolbar tools (alignment, font size, color, highlight, table, etc.) and fix the sticky toolbar bug.

**Architecture:** Extract the toolbar into its own `EditorToolbar` component. Install new TipTap extension packages. Restructure the editor container to fix sticky positioning. Add table context toolbar.

**Tech Stack:** TipTap v3.21.0, React 19, Next.js 16, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-04-10-rich-text-editor-enhancement-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add TipTap extension deps |
| `src/components/EditorToolbar.tsx` | Create | Extracted toolbar with all new buttons |
| `src/components/TiptapEditor.tsx` | Modify | Add extensions, restructure container, remove inline MenuBar |

---

### Task 1: Install TipTap extension packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

Run:
```bash
npm install @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-highlight @tiptap/extension-superscript @tiptap/extension-subscript @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
```

Expected: All packages install at `^3.21.0` matching existing TipTap packages. `@tiptap/pm` v3.21.0 is already available as a transitive dep.

- [ ] **Step 2: Verify installation — check that all 10 packages appear**

Run: `node -e "const p=require('./package.json'); const exts=['@tiptap/extension-text-align','@tiptap/extension-text-style','@tiptap/extension-color','@tiptap/extension-highlight','@tiptap/extension-superscript','@tiptap/extension-subscript','@tiptap/extension-table','@tiptap/extension-table-row','@tiptap/extension-table-cell','@tiptap/extension-table-header']; exts.forEach(e=>console.log(e, p.dependencies[e]||'MISSING'))"`
Expected: All 10 packages listed with version `^3.21.0`, none say `MISSING`.

- [ ] **Step 3: Verify available exports for font-size and table**

After install, check what's actually exported. This informs the exact import paths for Task 2/3.

Run: `node -e "try{const t=require('@tiptap/extension-text-style'); console.log('text-style keys:', Object.keys(t))}catch(e){console.log('text-style error:', e.message)}"`
Run: `node -e "try{const t=require('@tiptap/extension-table'); console.log('table keys:', Object.keys(t))}catch(e){console.log('table error:', e.message)}"`

Expected: `text-style` should show `TextStyle` and possibly `FontSize`. `table` should show `Table` and possibly `TableKit`. Record exact exports — they determine the import strategy in Tasks 2 and 3.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add TipTap extension packages for enhanced toolbar"
```

---

### Task 2: Create EditorToolbar component

**Files:**
- Create: `src/components/EditorToolbar.tsx`

This is the largest task. The toolbar component receives the editor instance and callbacks, and renders all toolbar buttons organized by group.

**NOTE on font-size API:** The exact commands depend on Task 1 Step 3 findings. If `FontSize` is exported from `@tiptap/extension-text-style`, use `setFontSize`/`unsetFontSize`. Otherwise use `setMark('textStyle', { fontSize: value })` / `unsetMark('textStyle')` — but be aware the latter removes ALL textStyle attributes (including color). Prefer the dedicated `setFontSize`/`unsetFontSize` API if available.

- [ ] **Step 1: Create `src/components/EditorToolbar.tsx`**

Create the file with the full toolbar implementation:

```tsx
"use client";

import { type Editor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { parseVideoUrl } from './video/VideoParser';
import type { ParsedVideo } from './video/VideoParser';

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onVideoInsert: (parsedVideo: ParsedVideo) => void;
}

// Font size options
const FONT_SIZES = [
  { label: '默认', value: '' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
];

// Color palette for text and highlight
const TEXT_COLORS = [
  '#000000', '#4b5563', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fecaca',
  '#fed7aa', '#d1d5db', '#ffffff',
];

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
  variant,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 rounded text-sm ${
        active
          ? 'bg-[#1A3C8A] text-white'
          : variant === 'danger'
            ? 'hover:bg-red-50 text-red-600'
            : 'hover:bg-gray-100 text-gray-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px bg-gray-300 mx-1 self-stretch" />;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, open, onClose]);
}

function FontSizeDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, open, () => setOpen(false));

  // Check if setFontSize command exists (depends on whether FontSize extension is registered)
  const hasFontSizeCommand = typeof editor.commands.setFontSize === 'function';
  const currentSize = editor.getAttributes('textStyle').fontSize || '';

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setOpen(!open)} title="字号">
        <span className="min-w-[3em] inline-block text-center">
          {currentSize ? currentSize.replace('px', '') : '字号'}
        </span>
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 min-w-[80px]">
          {FONT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => {
                if (size.value) {
                  if (hasFontSizeCommand) {
                    editor.chain().focus().setFontSize(size.value).run();
                  } else {
                    editor.chain().focus().setMark('textStyle', { fontSize: size.value }).run();
                  }
                } else {
                  if (hasFontSizeCommand) {
                    editor.chain().focus().unsetFontSize().run();
                  } else {
                    editor.chain().focus().unsetMark('textStyle').run();
                  }
                }
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1 text-sm hover:bg-gray-100 ${
                currentSize === size.value ? 'bg-blue-50 text-[#1A3C8A]' : ''
              }`}
              style={size.value ? { fontSize: size.value } : undefined}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorPicker({
  editor,
  type,
  children,
  title,
}: {
  editor: Editor;
  type: 'text' | 'highlight';
  children: React.ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, open, () => setOpen(false));

  const colors = type === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS;

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setOpen(!open)} title={title}>
        {children}
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 p-2">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  if (type === 'text') {
                    editor.chain().focus().setColor(color).run();
                  } else {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                  setOpen(false);
                }}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (type === 'text') {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().unsetHighlight().run();
              }
              setOpen(false);
            }}
            className="w-full mt-1 text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            清除颜色
          </button>
        </div>
      )}
    </div>
  );
}

function TableToolbar({ editor }: { editor: Editor }) {
  if (!editor.isActive('table')) return null;

  return (
    <>
      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()} title="在上方插入行">
        ↑ 行
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="在下方插入行">
        ↓ 行
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()} title="在左侧插入列">
        ← 列
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="在右侧插入列">
        → 列
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} title="删除行">
        删行
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} title="删除列">
        删列
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().mergeCells().run()} title="合并单元格" disabled={!editor.can().mergeCells()}>
        合并
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().splitCell().run()} title="拆分单元格" disabled={!editor.can().splitCell()}>
        拆分
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="删除表格" variant="danger">
        删表
      </ToolbarButton>
    </>
  );
}

export function EditorToolbar({ editor, onImageUpload, onVideoInsert }: EditorToolbarProps) {
  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 bg-white z-10">
      {/* Text Format */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="粗体">
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="斜体">
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="下划线">
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="删除线">
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="上标">
        x²
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="下标">
        x₂
      </ToolbarButton>

      <Divider />

      {/* Heading */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="标题1">
        H1
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="标题2">
        H2
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="标题3">
        H3
      </ToolbarButton>

      <Divider />

      {/* Font */}
      <FontSizeDropdown editor={editor} />
      <ColorPicker editor={editor} type="text" title="文字颜色">
        <span className="border-b-2 border-red-500">A</span>
      </ColorPicker>
      <ColorPicker editor={editor} type="highlight" title="高亮颜色">
        <span className="bg-yellow-200 px-0.5">A</span>
      </ColorPicker>

      <Divider />

      {/* Alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="左对齐">
        ≡←
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="居中">
        ≡↔
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="右对齐">
        →≡
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="两端对齐">
        ≡≡
      </ToolbarButton>

      <Divider />

      {/* List */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="无序列表">
        • 列表
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="有序列表">
        1. 列表
      </ToolbarButton>

      <Divider />

      {/* Block */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="引用">
        ❝
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="代码块">
        {'</>'}
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="分割线">
        ―
      </ToolbarButton>

      <Divider />

      {/* Insert */}
      <ToolbarButton
        onClick={() => {
          const url = prompt('请输入链接地址:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
        title="链接"
      >
        🔗
      </ToolbarButton>
      <ToolbarButton onClick={onImageUpload} title="插入图片">🖼️</ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const url = prompt('请输入视频链接:');
          if (url) {
            const parsed = parseVideoUrl(url);
            if (parsed) onVideoInsert(parsed);
            else alert('不支持的视频平台或链接格式无效');
          }
        }}
        title="插入视频"
      >
        📹
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="插入表格"
      >
        ⊞
      </ToolbarButton>

      {/* Table context toolbar */}
      <TableToolbar editor={editor} />

      <Divider />

      {/* History */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="撤销">
        ↶
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="重做">
        ↷
      </ToolbarButton>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EditorToolbar.tsx
git commit -m "feat: create EditorToolbar component with all new tools"
```

---

### Task 3: Update TiptapEditor — add extensions and fix sticky

**Files:**
- Modify: `src/components/TiptapEditor.tsx`

- [ ] **Step 1: Update imports**

At the top of `src/components/TiptapEditor.tsx`, replace existing imports with:

```tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useState, useCallback, useEffect } from 'react';
import { VideoExtension } from './extensions/VideoExtension';
import { parseVideoUrl, type ParsedVideo, type VideoSize } from './video/VideoParser';
import { VideoInsertDialog } from './video/VideoInsertDialog';
import { EditorToolbar } from './EditorToolbar';
```

**NOTE:** If Task 1 Step 3 revealed that `FontSize` is a separate export from `@tiptap/extension-text-style`, add it: `import { TextStyle, FontSize } from '@tiptap/extension-text-style'` and include `FontSize` in the extensions array. If `TableKit` bundles all table extensions, simplify to `import { TableKit } from '@tiptap/extension-table'` and use `TableKit` instead of the 4 separate imports.

- [ ] **Step 2: Update extensions array in useEditor**

Replace the `extensions` array in the `useEditor` call with:

```tsx
extensions: [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
    link: false, // disable StarterKit's built-in Link; use separate Link with custom config
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
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  // Add FontSize here if available: FontSize,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Superscript,
  Subscript,
  Table.configure({
    resizable: true,
    HTMLAttributes: { class: 'border-collapse w-full' },
  }),
  TableRow,
  TableCell,
  TableHeader,
  VideoExtension,
],
```

- [ ] **Step 3: Delete inline MenuBar and update JSX return**

Delete the entire `const MenuBar = () => (...)` definition (lines 150-255 in current file).

Replace the return JSX with:

```tsx
return (
  <div className="border border-gray-300 rounded-md">
    {editable && (
      <EditorToolbar
        editor={editor}
        onImageUpload={handleImageUpload}
        onVideoInsert={handleInsertVideo}
      />
    )}
    <div className="max-h-[600px] overflow-y-auto">
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] focus:outline-none"
      />
    </div>

    {/* 视频插入对话框 */}
    {videoDialog.isOpen && videoDialog.parsedVideo && (
      <VideoInsertDialog
        parsedVideo={videoDialog.parsedVideo}
        onClose={closeVideoDialog}
        onInsert={handleVideoInsert}
      />
    )}

    <style jsx global>{`
      /* Tiptap Editor Styles */
      .ProseMirror {
        outline: none;
        font-size: 16px;
        line-height: 1.6;
      }

      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
      }

      .ProseMirror h1 {
        font-size: 2em;
        font-weight: 700;
        margin-top: 1em;
        margin-bottom: 0.5em;
        line-height: 1.2;
      }

      .ProseMirror h2 {
        font-size: 1.5em;
        font-weight: 600;
        margin-top: 0.8em;
        margin-bottom: 0.4em;
        line-height: 1.3;
      }

      .ProseMirror h3 {
        font-size: 1.25em;
        font-weight: 600;
        margin-top: 0.6em;
        margin-bottom: 0.3em;
        line-height: 1.4;
      }

      .ProseMirror p {
        margin-bottom: 1em;
      }

      .ProseMirror ul, .ProseMirror ol {
        padding-left: 1.5em;
        margin-bottom: 1em;
      }

      .ProseMirror ul {
        list-style-type: disc;
      }

      .ProseMirror ol {
        list-style-type: decimal;
      }

      .ProseMirror li {
        margin-bottom: 0.25em;
      }

      .ProseMirror strong {
        font-weight: 700;
      }

      .ProseMirror em {
        font-style: italic;
      }

      .ProseMirror u {
        text-decoration: underline;
      }

      .ProseMirror s {
        text-decoration: line-through;
      }

      .ProseMirror a {
        color: #1A3C8A;
        text-decoration: underline;
      }

      .ProseMirror a:hover {
        color: #2B6CB0;
      }

      .ProseMirror img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1em 0;
      }

      .ProseMirror blockquote {
        border-left: 4px solid #1A3C8A;
        padding-left: 1em;
        margin: 1em 0;
        color: #666;
        font-style: italic;
      }

      .ProseMirror code {
        background: #f3f4f6;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
      }

      .ProseMirror pre {
        background: #1f2937;
        color: #f3f4f6;
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1em 0;
      }

      .ProseMirror pre code {
        background: none;
        padding: 0;
        color: inherit;
      }

      /* Table styles */
      .ProseMirror table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        overflow: hidden;
      }
      .ProseMirror th,
      .ProseMirror td {
        border: 1px solid #d1d5db;
        padding: 0.5em;
        min-width: 80px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
      }
      .ProseMirror th {
        background: #f3f4f6;
        font-weight: 600;
        text-align: left;
      }
      .ProseMirror .selectedCell {
        background: #dbeafe;
      }
      .ProseMirror .tableWrapper {
        overflow-x: auto;
      }
      .ProseMirror .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: #adf;
        pointer-events: none;
      }

      /* Highlight */
      .ProseMirror mark {
        background-color: #fef08a;
        padding: 0.1em 0.2em;
        border-radius: 2px;
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
  </div>
);
```

Key changes from current file:
- Removed `overflow-hidden` from outer `<div>` (was `className="border border-gray-300 rounded-md overflow-hidden"`)
- Added `max-h-[600px] overflow-y-auto` wrapper around `EditorContent` for scrollable content area
- Replaced inline `MenuBar` with `<EditorToolbar>` component
- Added table CSS (table, th, td, selectedCell, tableWrapper, column-resize-handle)
- Added highlight (mark), underline (u), strikethrough (s) CSS
- Kept all existing styles (h1-h3, p, ul, ol, li, strong, em, a, img, blockquote, code, pre, video)

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TiptapEditor.tsx
git commit -m "feat: integrate new editor extensions, extract toolbar, fix sticky positioning"
```

---

### Task 4: Verify and test

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

Expected: Server starts without errors.

- [ ] **Step 2: Manual verification checklist**

Open the news editor page in a browser. Verify:
1. Toolbar shows all new buttons in organized groups
2. Bold, italic, underline, strikethrough, super/subscript work
3. H1/H2/H3 headings work
4. Font size dropdown applies and resets
5. Text color and highlight color pickers work
6. Left/center/right/justify alignment works
7. Bullet list and ordered list work
8. Blockquote, code block, horizontal rule work
9. Link, image, video still work as before
10. Insert table creates a 3x3 table with header
11. Table context toolbar appears when cursor is in table
12. Table add/delete row/column works
13. Merge/split cells works
14. Undo/redo still works
15. Toolbar stays visible when scrolling long content (sticky fix)

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during testing"
```
