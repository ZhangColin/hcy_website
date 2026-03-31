// src/components/video/VideoNodeView.tsx
"use client";

import { NodeViewWrapper } from '@tiptap/react';
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
