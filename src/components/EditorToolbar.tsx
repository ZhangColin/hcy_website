"use client";

import { type Editor } from '@tiptap/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { parseVideoUrl } from './video/VideoParser';
import type { ParsedVideo } from './video/VideoParser';

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onVideoInsert: (parsedVideo: ParsedVideo) => void;
}

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
                  editor.chain().focus().setFontSize(size.value).run();
                } else {
                  editor.chain().focus().unsetFontSize().run();
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
