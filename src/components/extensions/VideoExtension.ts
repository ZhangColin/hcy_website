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
