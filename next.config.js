/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any domain (for feed favicons)
  images: {
    unoptimized: true,
  },
  // Suppress punycode deprecation warning from rss-parser
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
