'use client';

import { useRouter } from 'next/navigation';
import React, {
    MouseEvent,
    MouseEventHandler,
    TouchEvent,
    TouchEventHandler,
    useCallback,
    useEffect,
    useRef,
} from 'react';

export default function Modal({
    children,
    footer,
    onTap = null,
}: {
    children: React.ReactNode;
    footer: React.ReactNode;
    onTap?: ((e: MouseEvent | TouchEvent) => void) | null;
}) {
    const overlay = useRef(null);
    const wrapper = useRef(null);
    const closeButton = useRef(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.push('/');
    }, [router]);

    const onClick: MouseEventHandler = useCallback(
        (e) => {
            if (
                e.target === overlay.current ||
                e.target === wrapper.current ||
                e.target === closeButton.current
            ) {
                onDismiss();
            } else if (onTap != null) {
                onTap(e);
            }
        },
        [onDismiss, onTap]
    );

    const onTouch: TouchEventHandler = useCallback(
        (e) => {
            if (e.target === overlay.current || e.target === wrapper.current) {
                onDismiss();
            } else if (onTap != null) {
                onTap(e);
            }
        },
        [onDismiss, onTap]
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss();
        },
        [onDismiss]
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);

    return (
        <div
            ref={overlay}
            className={`fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80`}
            onClick={onClick}
            onTouchStart={onTouch}
        >
            <button
                ref={closeButton}
                onClick={() => onDismiss()}
                className="close-button absolute top-0 right-0 z-10"
            />

            <div
                ref={wrapper}
                className="w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:p-12 p-4"
            >
                {children}
            </div>
            {footer}
        </div>
    );
}
