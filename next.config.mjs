/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  eslint: { ignoreDuringBuilds: true },
    output: "standalone",
};
export default nextConfig;
