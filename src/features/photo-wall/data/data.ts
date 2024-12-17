'use server';

import { fetchPhotosFromBlob } from '@/features/photo-wall/data/blob-storage/data';
import { fetchPhotosFromFS } from '@/features/photo-wall/data/file-system/data';

export async function fetchPhotos(
    source: string = 'blob',
    limit: number = 300
) {
    const photos =
        source === 'blob'
            ? await fetchPhotosFromBlob()
            : await fetchPhotosFromFS();
    return photos.length > limit ? photos.slice(0, limit) : photos;
}
