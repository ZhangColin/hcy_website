import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 仅在 Docker 构建时启用 standalone 模式
  // 本地构建时禁用以避免 lightningcss 原生模块问题
  ...(process.env.STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.website.aieducenter.com',
      },
    ],
  },
};

export default nextConfig;
