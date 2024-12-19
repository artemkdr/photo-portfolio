import { appConfig } from '@/app.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

if (appConfig.blobDomain !== undefined) {
    nextConfig.images = {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: appConfig.blobDomain,
                pathname: `/${appConfig.photosDir}/**`,
            },
        ],
    };
}

export default nextConfig;
