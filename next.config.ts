import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/guide", destination: "/hero", permanent: false },
      { source: "/builder", destination: "/hero", permanent: false },
      { source: "/templates", destination: "/hero", permanent: false },
      { source: "/walkthroughs", destination: "/", permanent: false },
      { source: "/walkthroughs/hero-card-from-photo", destination: "/hero", permanent: false },
      { source: "/walkthroughs/group-scene", destination: "/custom", permanent: false },
      { source: "/walkthroughs/hero-card-no-photo", destination: "/unique", permanent: false },
    ];
  },
};

export default nextConfig;
