import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone -- a server bundled with only the modules it imports,
  // so the runtime image carries no node_modules tree.
  output: 'standalone',
  experimental: {
    serverActions: {
      // Cast to 'any' to bypass the strict SizeLimit TypeScript constraint
      bodySizeLimit: (process.env.MAX_UPLOAD_SIZE || '10mb') as any,
    },
  },
};

export default nextConfig;