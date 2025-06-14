// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// //   images: {
// //     domains: ['127.0.0.1'],
// //   },
// // };

// // export default nextConfig;

// import type { NextConfig } from "next";

// const localDomains = ['127.0.0.1', 'localhost'];
// const productionDomains = ['etickets.ticket.publicvm.com'];

// const nextConfig: NextConfig = {
//   images: {
//     // Dynamically set domains based on environment
//     domains: process.env.NODE_ENV === 'production' ? productionDomains : localDomains,

//     // (optional) Use remotePatterns for more flexibility, especially with next/image or HTTP
//     // remotePatterns: [
//     //   {
//     //     protocol: 'http',
//     //     hostname: 'etickets.rnt.linkpc.net',
//     //     port: '',
//     //     pathname: '/**',
//     //   },
//     // ],
//   },
// };



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              protocol: 'https' as const,
              hostname: 'ticket-provider-main-vlftr2.laravel.cloud',
              port: '',
              pathname: '/storage/**',
            },
          ]
        : [
            {
              protocol: 'http' as const,
              hostname: 'localhost',
              port: '',
              pathname: '/storage/**',
            },
            {
              protocol: 'http' as const,
              hostname: '127.0.0.1',
              port: '8000', // Use string for port
              pathname: '/storage/**',
            },
          ]),
    ],
  },
};

export default nextConfig;