'use client';

import { Photo } from '@/app/lib/definitions';
import { DirectionContext } from '@/app/lib/providers/direction-provider';
import { PhotosContext } from '@/app/lib/providers/photos-provider';
import FullImage from '@/app/ui/components/full-image';
import Modal from '@/app/ui/components/modal';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
    MouseEvent as ReactMouseEvent,
    TouchEvent as ReactTouchEvent,
    useCallback,
    useContext,
    useEffect,
} from 'react';

export default function ModalImage({ id }: { id: string }) {
    const router = useRouter();
    const photos = useContext(PhotosContext);
    const photo = photos.find((p) => p.name === id) as Photo;
    const [direction, setDirection] = useContext(DirectionContext);

    const onNext = useCallback(() => {
        const index = photos.findIndex((p) => p.name === id);
        if (index < photos.length - 1) {
            setDirection(1);
            router.push(photos[index + 1].url);
        } else {
            router.push('/');
        }
    }, [photos, id, router, setDirection]);

    const onPrev = useCallback(() => {
        const index = photos.findIndex((p) => p.name === id);
        if (index > 0) {
            setDirection(-1);
            router.push(photos[index - 1].url);
        } else {
            router.push('/');
        }
    }, [photos, id, router, setDirection]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        },
        [onNext, onPrev]
    );

    const onTap = useCallback(
        (e: ReactMouseEvent | ReactTouchEvent) => {
            const clientX =
                e.nativeEvent instanceof TouchEvent
                    ? e.nativeEvent?.touches[0]?.clientX
                    : e.nativeEvent instanceof PointerEvent
                      ? e.nativeEvent?.clientX
                      : 0;
            if (clientX > window.innerWidth / 2) {
                onNext();
            } else {
                onPrev();
            }
        },
        [onNext, onPrev]
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <Modal
            onTap={onTap}
            footer={
                <div className="bg-black/80 p-2 text-nowrap absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-400 z-10 font-thin">
                    Do not hesitate to{' '}
                    <a href="mailto:artem.kdr@gmail.com" className="font-bold">
                        contact me
                    </a>{' '}
                    for a better quality photo.
                </div>
            }
        >
            {photo != null ? (
                <>
                    <motion.div
                        key={photo.src}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <FullImage src={photo.src} alt={photo.alt} />
                    </motion.div>
                </>
            ) : (
                <div>Photo not found</div>
            )}
        </Modal>
    );
}
