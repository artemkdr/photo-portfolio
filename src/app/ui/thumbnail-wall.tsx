'use client';

import { PhotosContext } from '@/app/lib/providers/photos-provider';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export const ThumbnailWall = () => {
    const photos = useContext(PhotosContext);

    const [isSSR, setIsSSR] = useState(true);
    const [isIntroCompleted, setIsIntroCompleted] = useState(false);
    const pathname = usePathname();
    const tileWidth = 50;
    const tileHeight = 50;

    const [containerId] = useState(
        `wall-${new Date().getTime()}-${Math.round(Math.random() * 1000)}`
    );

    useEffect(() => {
        setIsSSR(false);
    }, []);

    useEffect(() => {
        const distanceMultiplier = 0.1;
        const scaleMultiplier = 4;
        const maxScale = 1.5;
        const minScale = 0.9;
        const angleMultiplier = 2;

        const getContainerRect = () => {
            const container = document.querySelector(
                '#' + containerId
            ) as HTMLElement;
            const gridRect = container?.getBoundingClientRect() ?? {
                left: 0,
                top: 0,
                width: 1,
                height: 1,
            };
            return {
                width: gridRect.width,
                height: gridRect.height,
            };
        };

        const processItems = (pointX: number, pointY: number) => {
            const maxDistance = getContainerRect().width;
            document
                .querySelectorAll(`#${containerId} .item`)
                ?.forEach((item) => {
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
                    const scale =
                        minScale + (maxScale - minScale) * scaleFactor;

                    const distanceFactor =
                        Math.max(0, 1 - (distance / maxDistance) ** 2) *
                        distanceMultiplier;

                    const rotateYAngle =
                        (angleMultiplier * distanceX) / maxDistance;
                    const rotateXAngle =
                        (-angleMultiplier * distanceY) / maxDistance;

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

        const moveEventHandler = (e: MouseEvent | TouchEvent) => {
            if (isIntroCompleted && pathname === '/') {
                processItems(
                    e instanceof MouseEvent
                        ? e.clientX
                        : e instanceof TouchEvent
                          ? e.touches[0].clientX
                          : 0,
                    e instanceof MouseEvent
                        ? e.clientY
                        : e instanceof TouchEvent
                          ? e.touches[0].clientY
                          : 0
                );
            }
        };

        let moveProcessing = false;

        const touchStartEventHandler = () => {
            moveProcessing = true;
        };

        const touchEndEventHandler = () => {
            moveProcessing = false;
        };

        const deviceOrientationHandler = (e: DeviceOrientationEvent) => {
            if (moveProcessing) return;
            const isPortrait = screen.orientation?.type?.includes('portait');
            const leftRightAngle = isPortrait ? e.gamma : e.beta;
            const forwardBackwardAngle = isPortrait ? e.beta : e.gamma;
            if (leftRightAngle != null && forwardBackwardAngle != null) {
                if (isIntroCompleted && pathname === '/') {
                    const rect = getContainerRect();
                    processItems(
                        ((-leftRightAngle + 45) * rect.width) / 90,
                        ((-forwardBackwardAngle + 90) * rect.height) / 180
                    );
                }
            }
        };

        window.addEventListener('mousemove', moveEventHandler);
        window.addEventListener('touchmove', moveEventHandler);
        window.addEventListener('touchstart', touchStartEventHandler);
        window.addEventListener('touchend', touchEndEventHandler);
        window.addEventListener('deviceorientation', deviceOrientationHandler);
        return () => {
            window.removeEventListener('mousemove', moveEventHandler);
            window.removeEventListener('touchmove', moveEventHandler);
            window.removeEventListener(
                'deviceorientation',
                deviceOrientationHandler
            );
            window.removeEventListener('touchstart', touchStartEventHandler);
            window.removeEventListener('touchend', touchEndEventHandler);
        };
    }, [isIntroCompleted, pathname, containerId]);

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
                    onAnimationComplete={() =>
                        setIsIntroCompleted(index == photos.length - 1)
                    }
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
