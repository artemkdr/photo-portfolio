import { appConfig } from '@/app.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

if (appConfig.blobDomain !== undefined) {
    nextConfig.images = {
        domains: [appConfig.blobDomain],
    };
}

export default nextConfig;
