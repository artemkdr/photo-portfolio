'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface FullImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function FullImage({
    src,
    alt,
    className = '',
}: FullImageProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const getWindowSize = useCallback(() => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }, []);

    const onWindowResize = useCallback(() => {
        setWindowSize(getWindowSize());
    }, [getWindowSize]);

    useEffect(() => {
        // Set size at the first client-side load
        setWindowSize(getWindowSize());

        // update size on resize
        window.addEventListener('resize', onWindowResize);

        // Call cleanup function
        return () => window.removeEventListener('resize', onWindowResize);
    }, [getWindowSize, onWindowResize]);

    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={0.9 * windowSize.width}
                height={0.9 * windowSize.height}
                className={`object-contain w-auto h-auto max-w-[95vw] max-h-[95vh] min-h-[90vh] ${className}`}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
        </>
    );
}
