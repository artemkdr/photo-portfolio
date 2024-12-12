'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FullImage({ src, alt }: { src: string; alt: string }) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const getWindowSize = () => {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        };

        // Set size at the first client-side load
        setWindowSize(getWindowSize());

        // update size on resize
        window.addEventListener('resize', () => setWindowSize(getWindowSize()));

        // Call cleanup function
        return () =>
            window.removeEventListener('resize', () =>
                setWindowSize(getWindowSize())
            );
    }, []);

    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={0.9 * windowSize.width}
                height={0.9 * windowSize.height}
                className="object-contain w-auto h-auto max-w-[95vw] max-h-[95vh]"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
        </>
    );
}
