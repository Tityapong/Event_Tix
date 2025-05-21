// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ['127.0.0.1'],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const localDomains = ['127.0.0.1', 'localhost'];
const productionDomains = ['etickets.rnt.linkpc.net'];

const nextConfig: NextConfig = {
  images: {
    // Dynamically set domains based on environment
    domains: process.env.NODE_ENV === 'production' ? productionDomains : localDomains,

    // (optional) Use remotePatterns for more flexibility, especially with next/image or HTTP
    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: 'etickets.rnt.linkpc.net',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;