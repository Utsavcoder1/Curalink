/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Curalink',
  assetPrefix: '/Curalink/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
