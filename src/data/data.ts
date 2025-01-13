'use server';

import { appConfig } from '@/app.config';
import { fetchPhotosFromBlob } from '@/data/blob-storage/data';
import { fetchDummyPhotos } from '@/data/dummy/data';
import { fetchPhotosFromFS } from '@/data/file-system/data';
import { Photo } from '@/features/photo-wall/types/photo';

export async function fetchPhotos(
    source: string = 'blob',
    limit: number = 300
) {
    let rslt =
        source === 'blob'
            ? await fetchPhotosFromBlob(appConfig.photosDir)
            : source === 'fs'
              ? await fetchPhotosFromFS(appConfig.photosDir)
              : fetchDummyPhotos();

    // fallback to dummy photos if no photos are found
    if (rslt == null || !(rslt instanceof Array) || rslt.length === 0) {
        rslt = fetchDummyPhotos();
    }
    const photos = [] as Photo[];
    if (rslt instanceof Array && rslt.length > 0) {
        for (const photo of rslt) {
            if (photos.length >= limit) {
                break;
            }
            photos.push({
                src: photo.src,
                url: `/${appConfig.photosPath}/${encodeURIComponent(photo.name)}`,
                alt: photo.alt,
                name: photo.name,
            });
        }
    }
    return photos;
}
