/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 800, aggregateTimeout: 300
    };
    return config;
  },
  async rewrites() {
    return [{ source: "/next/:path*", destination: "/api/:path*" }];
  },
};

module.exports = nextConfig;
