'use client';

import { Photo } from '@/features/photo-wall/types/photo';
import { createContext } from 'react';

export const PhotosContext = createContext<Photo[]>([] as Photo[]);
export default function PhotosProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: Photo[];
}) {
    return (
        <PhotosContext.Provider value={value}>
            {children}
        </PhotosContext.Provider>
    );
}
