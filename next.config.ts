import type { NextConfig } from 'next';

// Define the Content Security Policy
// This policy allows all the domains you are getting errors for.
const cspHeader = `
    default-src 'self' * 'unsafe-inline' 'unsafe-eval';
    script-src 'self' * 'unsafe-inline' 'unsafe-eval';
    style-src 'self' * 'unsafe-inline';
    img-src 'self' * blob: data:;
    font-src 'self' * data:;
    worker-src 'self' * blob:;
    frame-src 'self' *;
    connect-src 'self' *;
`;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
