'use client';

import { useWindowSize } from '@/features/photo-wall/contexts/window-size-provider';
import Image from 'next/image';

export interface FullImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function FullImage({
    src,
    alt,
    className = '',
}: FullImageProps) {
    const windowSize = useWindowSize();
    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={0.9 * windowSize.width}
                height={0.9 * windowSize.height}
                className={`object-contain w-auto h-auto max-w-[95vw] max-h-[95vh] min-h-[90vh] ${className}`}
                placeholder="blur"
                loading="eager"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
        </>
    );
}
