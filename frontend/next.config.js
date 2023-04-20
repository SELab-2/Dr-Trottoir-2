/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 800, aggregateTimeout: 300
    };
    return config;
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  },
  async rewrites() {
    return [{ source: "/next/:path*", destination: "/api/:path*" }];
  },
};

module.exports = nextConfig;
