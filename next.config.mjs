/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    reactCompiler: true,
  },
  webpack: (config) => {
    config.externals.push("encoding");
    return config;
  },
};

export default nextConfig;
