// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental.appDir as it's no longer needed in newer versions
  images: {
    domains: [],
  },
}

module.exports = nextConfig