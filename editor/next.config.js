/** @type {import('next').NextConfig} */
const DEPLOY_URL = process.env.DEPLOY_URL ?? 'http://localhost:3000';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
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
