import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // もしSVGをReactコンポーネントとして使いたい場合は、以下のwebpack設定を使用
  webpack(config) {
    // SVGファイルをReactコンポーネントとして扱う設定
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
