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
    immediatelyRender: false, // Fix SSR hydration issue
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
        className="p-4 min-h-[300px] focus:outline-none"
      />
      <style jsx global>{`
        /* Tiptap Editor Styles */
        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        /* Typography styles for editor content */
        .ProseMirror {
          font-size: 16px;
          line-height: 1.6;
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
      `}</style>
    </div>
  );
}
