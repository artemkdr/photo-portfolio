'use server';

import { appConfig } from '@/app/app.config';
import { fetchPhotosFromBlob } from '@/app/lib/data/blob-data';
import { fetchPhotosFromFS } from '@/app/lib/data/fs-data';

export async function fetchPhotos() {
    const photos =
        appConfig.dataSource === 'blob'
            ? await fetchPhotosFromBlob()
            : await fetchPhotosFromFS();
    return photos.length > appConfig.photosLimit
        ? photos.slice(0, appConfig.photosLimit)
        : photos;
}
