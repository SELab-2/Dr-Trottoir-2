/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    };
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
  async rewrites() {
    return [{ source: "/next/:path*", destination: "/api/:path*" }];
  },
  images: {
    domains: ["127.0.0.1"],
  },
};

module.exports = nextConfig;
