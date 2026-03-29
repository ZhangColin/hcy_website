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
