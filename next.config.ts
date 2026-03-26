import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["http://192.168.18.194"],
    turbopack: {},
    webpack: (config, { dev, isServer }) => {
        if (dev && !isServer) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
};

export default nextConfig;
