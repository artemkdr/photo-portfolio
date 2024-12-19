'use client';

import { Content } from '@/content/content';
import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import { isBot } from '@/features/photo-wall/utils/user-agent';
import { motion, MotionGlobalConfig } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';

export const ThumbnailWall = () => {
    const photos = useContext(PhotosContext);

    // a state variable to check if the component is rendered on the client side
    const [mounted, setMounted] = useState(false);
    const [isIntroCompleted, setIsIntroCompleted] = useState(false);
    const [touchMoveEnabled, setTouchMoveEnabled] = useState(false);
    const [isEffectEnabled, setIsEffectEnabled] = useState(true);

    const pathname = usePathname();
    const tileWidth = 50;
    const tileHeight = 50;
    const distanceMultiplier = 0.1;
    const scaleMultiplier = 4;
    const maxScale = 1.5;
    const minScale = 0.9;
    const angleMultiplier = 2;

    const [containerId] = useState(
        `wall-${new Date().getTime()}-${Math.round(Math.random() * 1000)}`
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // turn off animations for the bots
            if (isBot(navigator.userAgent)) {
                MotionGlobalConfig.skipAnimations = true;
            }
            setMounted(true);
        }
    }, []);

    const getContainerRect = useCallback(() => {
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
    }, [containerId]);
    const processItems = useCallback(
        (pointX: number, pointY: number) => {
            if (!isEffectEnabled) return;

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
        },
        [
            isEffectEnabled,
            containerId,
            getContainerRect,
            scaleMultiplier,
            distanceMultiplier,
            angleMultiplier,
            minScale,
            maxScale,
        ]
    );

    const moveEventHandler = useCallback(
        (e: MouseEvent | TouchEvent) => {
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
        },
        [processItems, isIntroCompleted, pathname]
    );

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            setTouchMoveEnabled(true);
            processItems(e.touches[0].clientX, e.touches[0].clientY);
        },
        [processItems, setTouchMoveEnabled]
    );

    const onTouchEnd = useCallback(() => {
        setTouchMoveEnabled(false);
    }, [setTouchMoveEnabled]);

    const onDeviceOrientation = useCallback(
        (e: DeviceOrientationEvent) => {
            if (touchMoveEnabled) return;
            const isLandscape = screen.orientation?.type?.includes('landscape');
            const leftRightAngle = isLandscape ? e.beta : e.gamma;
            const forwardBackwardAngle = isLandscape ? e.gamma : e.beta;
            if (leftRightAngle != null && forwardBackwardAngle != null) {
                if (isIntroCompleted && pathname === '/') {
                    const rect = getContainerRect();
                    processItems(
                        ((-leftRightAngle + 45) * rect.width) / 90,
                        ((-forwardBackwardAngle + 90) * rect.height) / 180
                    );
                }
            }
        },
        [
            isIntroCompleted,
            pathname,
            getContainerRect,
            processItems,
            touchMoveEnabled,
        ]
    );

    useEffect(() => {
        window.addEventListener('mousemove', moveEventHandler);
        window.addEventListener('touchmove', moveEventHandler);
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('deviceorientation', onDeviceOrientation);
        return () => {
            window.removeEventListener('mousemove', moveEventHandler);
            window.removeEventListener('touchmove', moveEventHandler);
            window.removeEventListener(
                'deviceorientation',
                onDeviceOrientation
            );
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    });

    return !mounted ? (
        <div className="flex justify-center items-center text-center min-h-20">
            {Content.Common.Loading}
        </div>
    ) : (
        <>
            <button
                className="p-2 pr-4 pl-4 text-xs rounded-md bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] float-right clear-both"
                style={{
                    transition: 'width 0.5s ease-out',
                }}
                aria-label={Content.Gallery.TurnEffect.replace(
                    '{state}',
                    isEffectEnabled ? 'off' : 'on'
                )}
                aria-pressed={isEffectEnabled}
                onClick={() => setIsEffectEnabled(!isEffectEnabled)}
            >
                {Content.Gallery.TurnEffect.replace(
                    '{state}',
                    isEffectEnabled ? 'off' : 'on'
                )}
            </button>
            <div
                id={containerId}
                className="flex flex-wrap clear-both"
                style={{ perspective: '50px' }}
            >
                {photos?.map((photo, index) => (
                    <motion.div
                        key={`${photo.name}-${index}`}
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
                                width={tileWidth * maxScale}
                                height={tileHeight * maxScale}
                                style={{ width: tileWidth, height: tileHeight }}
                                quality={50}
                            />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </>
    );
};
