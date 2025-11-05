/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out', // ensures build output goes into /out for GitHub Pages
  images: {
    unoptimized: true, // disable Next image optimization for static export
  },
  basePath: '/Curalink', // 👈 use your GitHub repo name here (case-sensitive)
  assetPrefix: '/Curalink/',
};

module.exports = nextConfig;
