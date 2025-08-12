import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    output: "export",           // writes to ./out on build
    images: { unoptimized: true } // avoids server image pipeline
};
export default nextConfig;
