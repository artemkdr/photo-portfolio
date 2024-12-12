'use server';

import fs from 'fs';
import path from 'path';

export async function fetchPhotos() {
    const photosDir = 'photos';
    const publicDir = 'public';
    const photosPath = path.join(process.cwd(), publicDir, photosDir);
    const filenames = fs.readdirSync(photosPath);
    const photos = filenames.map((filename) => {
        const filePath = path.join(photosPath, filename);
        const stats = fs.statSync(filePath); // Get file stats
        return {
            src: `/${photosDir}/${encodeURIComponent(filename)}`,
            url: `/photo/${encodeURIComponent(filename)}`,
            name: encodeURIComponent(filename),
            alt: filename,
            created: stats.ctime,
        };
    });
    photos.sort((a, b) => a.created.getTime() - b.created.getTime());

    return photos;
}
