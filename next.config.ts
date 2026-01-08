import { appConfig } from '@/app.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

if (appConfig.blobDomain !== undefined) {
    nextConfig.images = {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: appConfig.blobDomain,
                pathname: `/${appConfig.photosDir}/**`,
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: `/**`,
            },
        ],
    };
}

export default nextConfig;
