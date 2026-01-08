import { appConfig } from '@/app.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
};

if (appConfig.blobDomain !== undefined) {
    nextConfig.images = {
        unoptimized: true,
        domains: [appConfig.blobDomain],
    };
}

export default nextConfig;
