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
