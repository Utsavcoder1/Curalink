// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // for static export
  images: { unoptimized: true }, // since GitHub Pages doesn't support next/image optimization
  basePath: '/Curalink',
  assetPrefix: '/Curalink/',
};

export default nextConfig;
