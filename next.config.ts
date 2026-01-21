import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Docker standalone output
  output: 'standalone',
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Optimize production builds
  reactStrictMode: true,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverActions: {
      bodySizeLimit: '25mb',
    },
    // Increase proxy client body size limit
    proxyClientMaxBodySize: '25mb',
  },

  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Multi-domain support for production
  // MinIO images are proxied via API route: /api/minio-proxy/[...path]
};

export default nextConfig;
