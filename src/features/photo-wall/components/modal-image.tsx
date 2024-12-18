'use client';

import FullImage from '@/features/photo-wall/components/full-image';
import Modal from '@/features/photo-wall/components/modal';
import { DirectionContext } from '@/features/photo-wall/contexts/direction-provider';
import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import { Photo } from '@/features/photo-wall/types/photo';
import { getAbsolutePosition } from '@/features/photo-wall/utils/position';
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
}

export default function ModalImage({ id, footer }: ModalImageProps) {
    const router = useRouter();
    const images = useContext(PhotosContext);
    const image = images.find((p) => p.name === id) as Photo;
    const [direction, setDirection] = useContext(DirectionContext);
    const [showArrow, setShowArrow] = useState(false);
    const arrow = useRef<HTMLDivElement>(null);

    const nextImage = useCallback(() => {
        const index = images.findIndex((p) => p.name === id);
        if (index < images.length - 1) {
            setDirection(1);
            router.push(images[index + 1].url);
        } else {
            router.push('/');
        }
    }, [images, id, router, setDirection]);

    const prevImage = useCallback(() => {
        const index = images.findIndex((p) => p.name === id);
        if (index > 0) {
            setDirection(-1);
            router.push(images[index - 1].url);
        } else {
            router.push('/');
        }
    }, [images, id, router, setDirection]);

    // try to open next/prev image on pressing arrow keys
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        },
        [nextImage, prevImage]
    );

    // handle tap event (from Modal component) to go to next/prev image
    const onTap = useCallback(
        (e: ReactMouseEvent | ReactTouchEvent) => {
            if (
                e.target instanceof HTMLElement &&
                (e.target.classList.contains('modal-overlay') ||
                    e.target.classList.contains('full-image') ||
                    e.target.classList.contains('modal-wrapper'))
            ) {
                const clientX =
                    e.nativeEvent instanceof TouchEvent
                        ? e.nativeEvent?.touches[0]?.clientX
                        : e.nativeEvent instanceof PointerEvent
                          ? e.nativeEvent?.clientX
                          : 0;
                if (clientX > window.innerWidth / 2) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        },
        [nextImage, prevImage]
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
            if (arrow.current != null && arrow.current.parentElement != null) {
                const p = getAbsolutePosition(arrow.current.parentElement);
                const rect = arrow.current.getBoundingClientRect();
                if (e.clientX > window.innerWidth / 2) {
                    arrow.current.style.transform = 'rotateY(0deg)';
                    arrow.current.style.top =
                        e.clientY - p.y - 0.2 * rect.height + 'px';
                    arrow.current.style.left =
                        e.clientX - p.x - rect.width + 'px';
                } else {
                    arrow.current.style.transform = 'rotateY(180deg)';
                    arrow.current.style.top =
                        e.clientY - p.y - 0.2 * rect.height + 'px';
                    arrow.current.style.left = e.clientX - p.x + 'px';
                }
                arrow.current.style.opacity = '1';
                arrow.current.style.transition =
                    'top 0.1s ease-out, left 0.1s ease-out, transform 0.5s ease-out, opacity 1s ease-out';
            }
            setShowArrow(true);
        },
        [setShowArrow, arrow]
    );

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [onKeyDown, onMouseMove]);

    return (
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
    );
}
