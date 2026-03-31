// src/components/video/VideoInsertDialog.tsx
"use client";

import { useState } from 'react';
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
            <span className="text-2xl"></span>
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
