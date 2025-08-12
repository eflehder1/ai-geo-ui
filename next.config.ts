import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // ? This makes Next.js ignore ESLint errors during build
        ignoreDuringBuilds: true,
    },
    /* other config options here */
};

export default nextConfig;
