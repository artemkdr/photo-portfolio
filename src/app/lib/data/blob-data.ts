import { list } from '@vercel/blob';

export async function fetchPhotosFromBlob() {
    const photosDir = 'photos/';
    const photoPathDir = '/photo/';
    const { blobs } = await list({ prefix: photosDir });
    const photos = [];
    for (const blob of blobs) {
        const filename = blob.pathname?.split('/').pop();
        if (filename !== undefined && filename.length > 0) {
            photos.push({
                src: blob.url,
                url: `${photoPathDir}${filename}`,
                name: encodeURIComponent(filename),
                alt: filename,
                created: blob.uploadedAt,
            });
        }
    }
    return photos;
}
