import type { NextConfig } from "next";

// No Tailwind build: app/royal.css is the reference site's compiled stylesheet, used as-is.
const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
