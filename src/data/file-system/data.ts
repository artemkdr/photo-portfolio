'use server';

import fs from 'fs';
import path from 'path';

export async function fetchPhotosFromFS(photosDir: string = 'photos') {
    const photosPath = path.join(process.cwd(), 'public', photosDir);
    let filenames: string[] = [];
    try {
        filenames = fs.readdirSync(photosPath);
    } catch (error) {
        console.error('Failed to fetch photos from file system', error);
    }
    const extensions = ['.jpg', '.webp', '.jpeg', '.png', 'bmp'];
    const photos = filenames
        .filter(
            (filename) =>
                extensions.indexOf(
                    path.extname(filename)?.toLocaleLowerCase()
                ) >= 0
        )
        .map((filename) => {
            const filePath = path.join(photosPath, filename);
            const stats = fs.statSync(filePath); // Get file stats
            return {
                src: `/${photosDir}/${encodeURIComponent(filename)}`,
                name: encodeURIComponent(filename),
                alt: filename,
                created: stats.ctime,
            };
        });
    photos.sort((a, b) => -1 * (a.created.getTime() - b.created.getTime()));
    return photos;
}
