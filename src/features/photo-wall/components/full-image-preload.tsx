'use client';

import { FullImageProps } from '@/features/photo-wall/components/full-image';
import { useWindowSize } from '@/features/photo-wall/contexts/window-size-provider';
import Image from 'next/image';

export default function FullImagePreload({ src, alt }: FullImageProps) {
    const windowSize = useWindowSize();
    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={0.9 * windowSize.width}
                height={0}
                className="h-auto"
                loading="eager"
                hidden={true}
                priority={false}
            />
        </>
    );
}
