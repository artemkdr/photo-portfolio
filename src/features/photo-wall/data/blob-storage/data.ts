import { list, ListBlobResultBlob } from '@vercel/blob';
import path from 'path';

export async function fetchPhotosFromBlob(photosDir: string = 'photos') {
    let blobs: ListBlobResultBlob[] = [] as ListBlobResultBlob[];
    try {
        blobs = (await list({ prefix: photosDir })).blobs;
    } catch (error) {
        console.error('Failed to fetch photos from blob storage', error);
    }
    const photos = [];
    const extensions = ['.jpg', '.webp', '.jpeg', '.png', 'bmp'];
    for (const blob of blobs) {
        const filename = blob.pathname?.split('/').pop();
        if (
            filename !== undefined &&
            filename.length > 0 &&
            extensions.includes(path.extname(filename)?.toLocaleLowerCase())
        ) {
            photos.push({
                src: blob.url,
                name: encodeURIComponent(filename),
                alt: filename,
                created: blob.uploadedAt,
            });
        }
    }
    photos.sort((a, b) => -1 * (a.created.getTime() - b.created.getTime()));
    return photos;
}
