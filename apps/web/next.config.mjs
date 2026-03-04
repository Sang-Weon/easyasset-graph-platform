/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack (Next.js 16 기본) — Node.js 전용 모듈 클라이언트 번들링 방지
  turbopack: {
    resolveAlias: {
      net: { browser: "./empty-module.js" },
      tls: { browser: "./empty-module.js" },
      fs: { browser: "./empty-module.js" },
    },
  },
};

export default nextConfig;
