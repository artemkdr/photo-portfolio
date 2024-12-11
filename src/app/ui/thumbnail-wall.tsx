'use client';

import { Photo } from '@/app/lib/definitions';
import { PhotosContext } from '@/app/lib/providers/photos-provider';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface ThumbnailWallProps {
    photos?: Photo[] | null;
    minScale?: number;
    maxScale?: number;
    tileWidth?: number;
    tileHeight?: number;
    scaleMultiplier?: number;
    distanceMultiplier?: number;
    angleMultiplier?: number;
    processCondition?: (() => boolean) | null;
}

export const ThumbnailWall = ({
    photos,
    distanceMultiplier = 0.1,
    scaleMultiplier = 4,
    maxScale = 1.5,
    minScale = 0.9,
    angleMultiplier = 2,
    tileWidth = 50,
    tileHeight = 50,
    processCondition = () => document.location.pathname === '/',
}: ThumbnailWallProps) => {
    if (photos == null) {
        photos = useContext(PhotosContext);
    }

    const [isSSR, setIsSSR] = useState(true);
    const [containerId] = useState(
        `wall-${new Date().getTime()}-${Math.round(Math.random() * 1000)}`
    );

    const processItems = (pointX: number, pointY: number) => {
        const container = document.querySelector(
            '#' + containerId
        ) as HTMLElement;
        if (container == null) {
            return;
        }
        const gridRect = container.getBoundingClientRect() ?? {
            left: 0,
            top: 0,
            width: 1,
            height: 1,
        };
        const maxDistance = gridRect.width;

        const items = container.querySelectorAll('.item');

        items?.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;

            const distanceX = itemCenterX - pointX;
            const distanceY = itemCenterY - pointY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            const scaleFactor = Math.max(
                0,
                1 - (scaleMultiplier * distance) / maxDistance
            );
            const scale = minScale + (maxScale - minScale) * scaleFactor;

            const distanceFactor =
                Math.max(0, 1 - (distance / maxDistance) ** 2) *
                distanceMultiplier;

            const rotateYAngle = (angleMultiplier * distanceX) / maxDistance;
            const rotateXAngle = (-angleMultiplier * distanceY) / maxDistance;

            const img = item.parentElement;
            if (img != null) {
                img.style.transition = 'transform 0.5s ease-out';
                img.style.transform = `scale(${scale}) \
                    translate(${distanceX * distanceFactor}px, ${distanceY * distanceFactor}px) \
                    rotateX(${rotateXAngle}deg) rotateY(${rotateYAngle}deg)`;
                img.style.zIndex = Math.round(
                    maxDistance - distance
                ).toString();
            }
        });
    };

    const mouseEventHandler = useCallback(
        (e: MouseEvent) => {
            if (processCondition == null || processCondition()) {
                processItems(e.clientX, e.clientY);
            }
        },
        [processCondition, processItems]
    );

    useEffect(() => {
        setIsSSR(false);

        window.addEventListener('mousemove', mouseEventHandler);

        return () => {
            window.removeEventListener('mousemove', mouseEventHandler);
        };
    }, []);

    return isSSR ? (
        <div className="flex justify-center items-center text-center min-h-20">
            loading...
        </div>
    ) : (
        <div
            id={containerId}
            className="flex flex-wrap"
            style={{ perspective: '50px' }}
        >
            {photos?.map((photo, index) => (
                <motion.div
                    key={photo.src}
                    initial={{
                        opacity: 0,
                        x: -500 + Math.random() * 500,
                        y: -200 + Math.random() * 400,
                        rotateY: -20 + Math.random() * 40,
                        rotateZ: -10 + Math.random() * 20,
                        scaleX: 2,
                        scaleY: 2,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotateY: 0,
                        rotateZ: 0,
                        scaleX: 1,
                        scaleY: 1,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5 + index * 0.01,
                        type: 'spring',
                    }}
                >
                    <Link href={photo.url} className="item">
                        <Image
                            className={`object-cover`}
                            src={photo.src}
                            alt={photo.alt}
                            width={tileWidth}
                            height={tileHeight}
                            style={{ width: tileWidth, height: tileHeight }}
                            quality={50}
                        />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};
