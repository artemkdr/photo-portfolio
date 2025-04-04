'use client';

import Loader from '@/features/photo-wall/components/loader';
import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import { debounce } from '@/features/photo-wall/utils/debouncer';
import { throttleWithDebounce } from '@/features/photo-wall/utils/throttler-with-debouncer';
import { isBot } from '@/features/photo-wall/utils/user-agent';
import { motion, MotionGlobalConfig } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

interface ThumbnailWallProps {
    turnEffectLabel?: string;
    tileWidth?: number;
    tileHeight?: number;
    distanceMultiplier?: number;
    scaleMultiplier?: number;
    maxScale?: number;
    minScale?: number;
    angleMultiplier?: number;
}

/**
 * ThumbnailWall component
 *
 * @param {string} [turnEffectLabel="Turn {state} the effect"] - the label for the button to turn the effect on/off
 * @param {number} [tileWidth=50] - the width of the thumbnail tile
 * @param {number} [tileHeight=50] - the height of the thumbnail tile
 * @param {number} [distanceMultiplier=0.1] - the distance multiplier for the effect, adjust the distance of the effect
 * @param {number} [scaleMultiplier=4] - the scale multiplier for the effect, adjust the scale of the effect
 * @param {number} [maxScale=1.5] - the maximum scale of the tile for the effect
 * @param {number} [minScale=0.9] - the minimum scale of the tile for the effect
 * @param {number} [angleMultiplier=2] - the angle multiplier for the effect
 *
 * @returns
 */
export const ThumbnailWall = ({
    turnEffectLabel = 'Turn {state} the effect',
    tileWidth = 50,
    tileHeight = 50,
    distanceMultiplier = 0.1,
    scaleMultiplier = 4,
    maxScale = 1.5,
    minScale = 0.9,
    angleMultiplier = 2,
}: ThumbnailWallProps) => {
    const photos = useContext(PhotosContext);

    // a state variable to check if the component is rendered on the client side
    const [mounted, setMounted] = useState(false);

    const [isIntroCompleted, setIsIntroCompleted] = useState(false);
    const [touchMoveEnabled, setTouchMoveEnabled] = useState(false);
    const [isEffectEnabled, setIsEffectEnabled] = useState(true);

    const pathname = usePathname();
    const currentPath = '/';

    const containerRef = useRef<HTMLDivElement>(null);

    const getContainerRect = useCallback(() => {
        const container = containerRef.current;
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
    }, [containerRef]);

    // main effect function: process items on the grid
    const processItems = useCallback(
        (pointX: number, pointY: number) => {
            if (!isEffectEnabled) return;
            const maxDistance = getContainerRect().width;
            containerRef.current?.querySelectorAll(`.item`)?.forEach((item) => {
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
            containerRef,
            getContainerRect,
            scaleMultiplier,
            distanceMultiplier,
            angleMultiplier,
            minScale,
            maxScale,
        ]
    );
    // throttle the processItems function to use it in the event handlers
    const processItemsThrottled = throttleWithDebounce(
        processItems as (...args: (number | string | object)[]) => void,
        100
    );

    // reset items to their original positions
    const resetItems = useCallback(() => {
        containerRef.current?.querySelectorAll(`.item`)?.forEach((item) => {
            const img = item.parentElement;
            if (img != null) img.style.transform = 'none';
        });
    }, [containerRef]);
    // debounce the resetItems function to override the throttleWithDebounce effect
    const resetItemsDebounced = debounce(
        resetItems as (...args: (number | string | object)[]) => void,
        100
    );

    const moveEventHandler = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (isIntroCompleted && pathname === currentPath) {
                processItemsThrottled(
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
        [processItemsThrottled, isIntroCompleted, pathname, currentPath]
    );

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            if (isIntroCompleted && pathname === currentPath) {
                setTouchMoveEnabled(true);
                processItemsThrottled(
                    e.touches[0].clientX,
                    e.touches[0].clientY
                );
            }
        },
        [
            processItemsThrottled,
            setTouchMoveEnabled,
            isIntroCompleted,
            pathname,
            currentPath,
        ]
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
                    processItemsThrottled(
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
            processItemsThrottled,
            touchMoveEnabled,
        ]
    );

    // handler four mouunt/unmount:
    // check if the component is rendered on the client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // turn off animations for the bots
            if (isBot(navigator.userAgent)) {
                MotionGlobalConfig.skipAnimations = true;
            }
            setMounted(true);
        }
    }, []);

    // handler for EVERY render
    useEffect(() => {
        // add event listeners only if the effect is enabled
        if (isEffectEnabled) {
            window.addEventListener('mousemove', moveEventHandler);
            window.addEventListener('touchmove', moveEventHandler);
            window.addEventListener('touchstart', onTouchStart);
            window.addEventListener('touchend', onTouchEnd);
            window.addEventListener('deviceorientation', onDeviceOrientation);
        }
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

    // handlers for isEffectEnabled state update
    // reset items when the effect is disabled
    useEffect(() => {
        if (!isEffectEnabled) resetItemsDebounced();
    }, [isEffectEnabled, resetItemsDebounced]);

    // create a grid of photos and memoize it
    const photosGrid = useMemo(() => {
        return photos?.map((photo, index) => (
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
                    delay: 0.1 + index * 0.01,
                    type: 'spring',
                }}
                onAnimationComplete={() =>
                    index == photos.length - 1 && setIsIntroCompleted(true)
                }
            >
                <Link href={photo.url} className="item" scroll={false}>
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
        ));
    }, [photos, tileWidth, tileHeight, maxScale]);

    return !mounted ? (
        <Loader />
    ) : (
        <>
            <button
                className="p-2 pr-4 pl-4 text-xs rounded-md bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] float-right clear-both"
                style={{
                    transition: 'width 0.5s ease-out',
                }}
                aria-label={turnEffectLabel.replace(
                    '{state}',
                    isEffectEnabled ? 'off' : 'on'
                )}
                aria-pressed={isEffectEnabled}
                onClick={() => setIsEffectEnabled(!isEffectEnabled)}
            >
                {turnEffectLabel.replace(
                    '{state}',
                    isEffectEnabled ? 'off' : 'on'
                )}
            </button>
            <div
                ref={containerRef}
                className="flex flex-wrap clear-both"
                style={{ perspective: '50px' }}
            >
                {photosGrid}
            </div>
        </>
    );
};
