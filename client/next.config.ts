import type { NextConfig } from "next";

// Import the custom server file to increase max listeners
require('./src/server');

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
