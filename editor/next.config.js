/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // NOTE: values listed here are inlined into the bundle at BUILD time, so
  // they can never hold secrets and cannot be changed by the runtime
  // environment. TEST_MODE is here because client components read it; it must
  // therefore be passed as a build arg, not just at runtime. Everything else
  // (NEXTAUTH_*, GOOGLE_*, BACK_URL) is read from process.env in server-only
  // code and so stays out of this block.
  env: {
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
