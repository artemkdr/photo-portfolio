'use client';

import { Photo } from '@/app/lib/definitions';
import { PhotosContext } from '@/app/lib/providers/photos-provider';
import FullImage from '@/app/ui/full-image';
import Modal from '@/app/ui/modal';
import { motion } from 'framer-motion';
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

    const onNext = useCallback(() => {
        const index = photos.findIndex((p) => p.name === id);
        if (index < photos.length - 1) {
            router.push(photos[index + 1].url);
        } else {
            router.push('/');
        }
    }, [photos]);

    const onPrev = useCallback(() => {
        const index = photos.findIndex((p) => p.name === id);
        if (index > 0) {
            router.push(photos[index - 1].url);
        } else {
            router.push('/');
        }
    }, [photos]);

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
        <Modal onTap={onTap}>
            {photo != null ? (
                <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <article>
                        <FullImage src={photo.src} alt={photo.alt} />
                    </article>
                </motion.div>
            ) : (
                <div>Photo not found</div>
            )}
        </Modal>
    );
}
