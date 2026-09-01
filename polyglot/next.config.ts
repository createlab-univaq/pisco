import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Cast to 'any' to bypass the strict SizeLimit TypeScript constraint
      bodySizeLimit: (process.env.MAX_UPLOAD_SIZE || '10mb') as any,
    },
  },
};

export default nextConfig;