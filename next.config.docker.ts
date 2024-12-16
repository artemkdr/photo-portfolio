import { appConfig } from '@/app/app.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
};

if (appConfig.blobDomain !== undefined) {
    nextConfig.images = {
        domains: [appConfig.blobDomain],
    };
}

export default nextConfig;
