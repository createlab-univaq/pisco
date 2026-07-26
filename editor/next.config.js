/** @type {import('next').NextConfig} */
const DEPLOY_URL = process.env.DEPLOY_URL ?? 'http://localhost:3000';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // NOTE: values listed here are inlined into the bundle at BUILD time, so
  // they can never hold secrets and cannot be changed by the runtime
  // environment. GOOGLE_CLIENT_SECRET / NEXTAUTH_SECRET are deliberately
  // absent: they are read from process.env inside server-only code instead.
  env: {
    DEPLOY_URL: DEPLOY_URL,
    TEST_MODE: process.env.TEST_MODE,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/flows', // TODO: change if needed
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
