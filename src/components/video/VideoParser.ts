// src/components/video/VideoParser.ts

import type { VideoSize } from './SIZE_PRESETS';

export type VideoPlatform = 'bilibili' | 'tencent' | 'youku';

export interface VideoPlatformConfig {
  name: VideoPlatform;
  displayName: string;
  patterns: RegExp[];
  parseId: (url: string) => string | null;
  buildIframeSrc: (id: string) => string;
}

export interface ParsedVideo {
  platform: VideoPlatform;
  videoId: string;
  displayName: string;
}

// B站配置
const bilibiliConfig: VideoPlatformConfig = {
  name: 'bilibili',
  displayName: 'B站',
  patterns: [
    /bilibili\.com\/video\/(BV[\w]+)(?:\/|\?|$)/,
    /b23\.tv\/([a-zA-Z0-9]+)/,
  ],
  parseId: (url: string) => {
    // 完整链接
    const bvMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
    if (bvMatch) return bvMatch[1];

    // 短链接 - 需要展开或直接使用（这里简化处理，返回短码）
    const shortMatch = url.match(/b23\.tv\/([a-zA-Z0-9]+)/);
    if (shortMatch) {
      // 短链接需要重定向获取真实 URL，这里先返回短码
      // 实际使用时可能需要后端支持
      return shortMatch[1];
    }

    return null;
  },
  buildIframeSrc: (id: string) => {
    return `https://player.bilibili.com/player.html?bvid=${id}&high_quality=1&autoplay=0`;
  },
};

// 腾讯视频配置
const tencentConfig: VideoPlatformConfig = {
  name: 'tencent',
  displayName: '腾讯视频',
  patterns: [
    /v\.qq\.com\/x\/cover\/[^\/]+\/([a-zA-Z0-9_]+)\.html/,
    /v\.qq\.com\/x\/page\/([a-zA-Z0-9_]+)\.html/,
    /vid=([a-zA-Z0-9_]+)/,
  ],
  parseId: (url: string) => {
    const match = url.match(/vid=([a-zA-Z0-9_]+)/) ||
                 url.match(/v\.qq\.com\/x\/(?:cover\/[^\/]+\/|page\/)([a-zA-Z0-9_]+)\.html/);
    return match ? match[1] : null;
  },
  buildIframeSrc: (id: string) => {
    return `https://v.qq.com/txp/iframe/player.html?vid=${id}`;
  },
};

// 优酷配置
const youkuConfig: VideoPlatformConfig = {
  name: 'youku',
  displayName: '优酷',
  patterns: [
    /youku\.com\/v_show\/id_([a-zA-Z0-9_]+)\.html/,
  ],
  parseId: (url: string) => {
    const match = url.match(/youku\.com\/v_show\/id_([a-zA-Z0-9_]+)\.html/);
    return match ? match[1] : null;
  },
  buildIframeSrc: (id: string) => {
    return `https://player.youku.com/embed/${id}`;
  },
};

// 平台配置列表
const PLATFORMS: VideoPlatformConfig[] = [
  bilibiliConfig,
  tencentConfig,
  youkuConfig,
];

/**
 * 解析视频 URL
 * @param url 视频 URL
 * @returns 解析结果或 null
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // 去除前后空格
  const trimmedUrl = url.trim();

  // 遍历所有平台配置
  for (const platform of PLATFORMS) {
    // 检查是否匹配该平台的任意模式
    const matchesAnyPattern = platform.patterns.some(pattern =>
      pattern.test(trimmedUrl)
    );

    if (matchesAnyPattern) {
      const videoId = platform.parseId(trimmedUrl);
      if (videoId) {
        return {
          platform: platform.name,
          videoId,
          displayName: platform.displayName,
        };
      }
    }
  }

  return null;
}

/**
 * 构建 iframe HTML
 * @param platform 平台名称
 * @param videoId 视频 ID
 * @param size 尺寸
 * @returns iframe HTML 字符串
 */
export function buildIframeHtml(
  platform: VideoPlatform,
  videoId: string,
  size: VideoSize
): string {
  const config = PLATFORMS.find(p => p.name === platform);
  if (!config) return '';

  const { SIZE_PRESETS } = require('./SIZE_PRESETS');
  const preset = SIZE_PRESETS[size];
  const src = config.buildIframeSrc(videoId);

  return `<iframe src="${src}" width="${preset.width}" height="${preset.height}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 1em 0;"></iframe>`;
}

// Re-export VideoSize for convenience
export type { VideoSize };
