// src/components/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { TableKit } from '@tiptap/extension-table';
import { useState, useCallback, useEffect } from 'react';
import { VideoExtension } from './extensions/VideoExtension';
import { parseVideoUrl, type ParsedVideo, type VideoSize } from './video/VideoParser';
import { VideoInsertDialog } from './video/VideoInsertDialog';
import { EditorToolbar } from './EditorToolbar';

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
  // 视频插入对话框状态
  const [videoDialog, setVideoDialog] = useState<{
    parsedVideo: ParsedVideo | null;
    isOpen: boolean;
  }>({ parsedVideo: null, isOpen: false });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        link: false,
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
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Superscript,
      Subscript,
      TableKit,
      VideoExtension,
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

  // 视频插入处理函数
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

      {videoDialog.isOpen && videoDialog.parsedVideo && (
        <VideoInsertDialog
          parsedVideo={videoDialog.parsedVideo}
          onClose={closeVideoDialog}
          onInsert={handleVideoInsert}
        />
      )}

      <style jsx global>{`
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

        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.1em 0.2em;
          border-radius: 2px;
        }

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
}
