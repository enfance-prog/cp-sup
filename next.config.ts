import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackは開発時に `npm run dev` で自動的に使用されます
  // SVGローダーなどの設定が必要な場合は、webpack設定で行います
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
