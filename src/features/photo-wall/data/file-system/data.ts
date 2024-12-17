'use server';

import fs from 'fs';
import path from 'path';

export async function fetchPhotosFromFS() {
    const photosDir = 'photos';
    const photoPathDir = 'photo';
    const publicDir = 'public';
    const photosPath = path.join(process.cwd(), publicDir, photosDir);
    const filenames = fs.readdirSync(photosPath);
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
                url: `/${photoPathDir}/${encodeURIComponent(filename)}`,
                name: encodeURIComponent(filename),
                alt: filename,
                created: stats.ctime,
            };
        });
    photos.sort((a, b) => a.created.getTime() - b.created.getTime());
    return photos;
}
