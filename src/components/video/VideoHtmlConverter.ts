// src/components/video/VideoHtmlConverter.ts
import type { VideoSize } from './SIZE_PRESETS';
import { SIZE_PRESETS } from './SIZE_PRESETS';

const PLATFORM_IFRAME_TEMPLATES: Record<string, (id: string, size: VideoSize) => string> = {
  bilibili: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://player.bilibili.com/player.html?bvid=${id}&high_quality=1&autoplay=0" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
  tencent: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://v.qq.com/txp/iframe/player.html?vid=${id}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
  youku: (id, size) => {
    const preset = SIZE_PRESETS[size];
    return `<iframe src="https://player.youku.com/embed/${id}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
  },
};

/**
 * 将编辑器内的 video-platform 标签转换为 iframe
 * @param html 编辑器 HTML
 * @returns 转换后的 HTML
 */
export function convertVideoTagsToIframe(html: string): string {
  return html.replace(
    /<video-platform\s+data-platform="([^"]+)"\s+data-video-id="([^"]+)"\s+data-size="([^"]+)"\s*\/?>/g,
    (match, platform, videoId, size) => {
      const template = PLATFORM_IFRAME_TEMPLATES[platform];
      if (template) {
        return template(videoId, size as VideoSize);
      }
      return match; // 保持原样如果无法识别
    }
  );
}
