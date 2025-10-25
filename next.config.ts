import type {NextConfig} from 'next';

// Define the Content Security Policy
// This policy allows all the domains you are getting errors for.
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.cookwise.cllupo.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://img.clerk.com i.ibb.co;
    font-src 'self' https://fonts.gstatic.com;
    worker-src 'self' blob:;
    frame-src 'self' https://clerk.cookwise.cllupo.net;
    connect-src 'self' https://clerk.cookwise.cllupo.net https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com;
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
