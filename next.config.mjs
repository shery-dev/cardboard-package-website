/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverComponentsExternalPackages: ["better-sqlite3"],
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
        ],
    },
    webpack: (config, { dev }) => {
        if (dev) {
            config.cache = { type: 'memory' };
        }
        return config;
    },
};

export default nextConfig;
