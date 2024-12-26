'use client';

import FullImage from '@/features/photo-wall/components/full-image';
import FullImagePreload from '@/features/photo-wall/components/full-image-preload';
import Modal from '@/features/photo-wall/components/modal';
import { DirectionContext } from '@/features/photo-wall/contexts/direction-provider';
import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import { WindowSizeProvider } from '@/features/photo-wall/contexts/window-size-provider';
import { Photo } from '@/features/photo-wall/types/photo';
import { getAbsolutePosition } from '@/features/photo-wall/utils/position';
import { throttleWithDebounce } from '@/features/photo-wall/utils/throttler-with-debouncer';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
    MouseEvent as ReactMouseEvent,
    TouchEvent as ReactTouchEvent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

interface ModalImageProps {
    id: string;
    footer?: React.ReactNode;
    placeholder?: React.ReactNode;
}

export default function ModalImage({
    id,
    footer,
    placeholder = null,
}: ModalImageProps) {
    const router = useRouter();
    const images = useContext(PhotosContext);
    const image = images.find((p) => p.name === id) as Photo;
    const [direction, setDirection] = useContext(DirectionContext);
    const [showArrow, setShowArrow] = useState(false);
    const [nextImage, setNextImage] = useState<Photo | null>(null);
    const [prevImage, setPrevImage] = useState<Photo | null>(null);
    const arrow = useRef<HTMLDivElement>(null);

    // a state variable to check if the component is rendered on the client side
    const [mounted, setMounted] = useState(false);

    const openNextImage = useCallback(() => {
        if (nextImage != null) {
            setDirection(1);
            router.push(nextImage.url, { scroll: false });
        } else {
            router.push('/');
        }
    }, [nextImage, router, setDirection]);

    const openPrevImage = useCallback(() => {
        if (prevImage != null) {
            setDirection(-1);
            router.push(prevImage.url, { scroll: false });
        } else {
            router.push('/');
        }
    }, [prevImage, router, setDirection]);

    // try to open next/prev image on pressing arrow keys
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') openNextImage();
            if (e.key === 'ArrowLeft') openPrevImage();
        },
        [openNextImage, openPrevImage]
    );

    // handle tap event (from Modal component) to go to next/prev image
    const onTap = useCallback(
        (e: ReactMouseEvent | ReactTouchEvent) => {
            if (
                e.target instanceof HTMLElement &&
                (e.target.classList.contains('modal-overlay') ||
                    e.target.classList.contains('full-image') ||
                    e.target.classList.contains('arrow-svg') ||
                    e.target.classList.contains('modal-wrapper'))
            ) {
                const clientX =
                    e.nativeEvent instanceof TouchEvent
                        ? e.nativeEvent?.touches[0]?.clientX
                        : e.nativeEvent instanceof PointerEvent
                          ? e.nativeEvent?.clientX
                          : 0;
                if (clientX > window.innerWidth / 2) {
                    openNextImage();
                } else {
                    openPrevImage();
                }
            }
        },
        [openNextImage, openPrevImage]
    );

    const processCursor = useCallback(
        (x: number, y: number) => {
            if (arrow.current != null && arrow.current.parentElement != null) {
                const p = getAbsolutePosition(arrow.current.parentElement);
                const rect = arrow.current.getBoundingClientRect();
                if (x > window.innerWidth / 2) {
                    arrow.current.style.transform = 'rotateY(0deg)';
                    arrow.current.style.top =
                        y - p.y - 0.2 * rect.height + 'px';
                    arrow.current.style.left = x - p.x - rect.width + 'px';
                } else {
                    arrow.current.style.transform = 'rotateY(180deg)';
                    arrow.current.style.top =
                        y - p.y - 0.2 * rect.height + 'px';
                    arrow.current.style.left = x - p.x + 'px';
                }
                arrow.current.style.opacity = '1';
                arrow.current.style.transition =
                    'top 0.2s ease-out, left 0.2s ease-out, transform 0.5s ease-out, opacity 1s ease-out';
            }
        },
        [arrow]
    );

    const processCursorThrottled = throttleWithDebounce(
        processCursor as (...args: (number | string | object)[]) => void,
        100
    );

    // handle mousemove event to show an arrow indicating that we can go to next/prev image
    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            // hide arrow if mouse is over close button
            // not the best solution as it supposes that the close button has smth like "close" in its className
            if (
                e.target instanceof HTMLElement &&
                e.target.className?.includes('close')
            ) {
                setShowArrow(false);
                return;
            }
            processCursorThrottled(e.clientX, e.clientY);
            setShowArrow(true);
        },
        [setShowArrow, arrow]
    );

    // handler four mouunt/unmount:
    // check if the component is rendered on the client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        const index = images.findIndex((p) => p.name === id);
        setNextImage(index < images.length - 1 ? images[index + 1] : null);
        setPrevImage(index > 0 ? images[index - 1] : null);
    }, [id, images]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [onKeyDown, onMouseMove]);

    return !mounted ? (
        <Modal footer={null}>{placeholder ?? <div>...</div>}</Modal>
    ) : (
        <WindowSizeProvider>
            <Modal onTap={onTap} footer={footer}>
                {image != null ? (
                    <>
                        <motion.div
                            key={image.src}
                            initial={{ opacity: 0, x: direction * 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <FullImage
                                src={image.src}
                                alt={image.alt}
                                className="full-image"
                            />
                            {/* preload prev and next image in background */}
                            {nextImage && (
                                <FullImagePreload
                                    src={nextImage!.src}
                                    alt={'next-' + nextImage!.alt}
                                />
                            )}
                            {prevImage && (
                                <FullImagePreload
                                    src={prevImage!.src}
                                    alt={'prev-' + prevImage!.alt}
                                />
                            )}
                        </motion.div>
                    </>
                ) : (
                    <div>Image not found</div>
                )}
                {showArrow && (
                    <div
                        ref={arrow}
                        className="arrow-svg absolute z-10 top-20 left-0 w-14 h-14 bg-no-repeat opacity-0"
                        style={{
                            backgroundSize: '60%',
                        }}
                    />
                )}
            </Modal>
        </WindowSizeProvider>
    );
}
