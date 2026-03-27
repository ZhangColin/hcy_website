import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Docker 部署必须
};

export default nextConfig;
