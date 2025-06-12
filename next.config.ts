// next.config.js
import type { NextConfig } from "next";

const localDomains = ["127.0.0.1", "localhost"];
const productionDomains = [
      
  "etickets.ticket.publicvm.com",      // the publicvm.com host that your images actually live on
];

const nextConfig: NextConfig = {
  images: {
    // in dev use localDomains, in prod allow both of yours
    domains:
      process.env.NODE_ENV === "production"
        ? productionDomains
        : localDomains,

    // —–– or, instead of `domains`, you can use remotePatterns:
    //
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "etickets.rnt.linkpc.net",
    //     port: "",
    //     pathname: "/**",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "etickets.ticket.publicvm.com",
    //     port: "",
    //     // only the folder(s) you need
    //     pathname: "/storage/events/**",
    //   },
    // ],
  },
};

export default nextConfig;
