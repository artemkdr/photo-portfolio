'use server';

import fs from 'fs';
import path from 'path';

export async function fetchPhotos() {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    const filenames = fs.readdirSync(photosDir);
    const photos = filenames.map((filename) => {
        const filePath = path.join(photosDir, filename);
        const stats = fs.statSync(filePath); // Get file stats
        return {
            src: `/photos/${filename}`,
            url: `/photo/${filename}`,
            name: filename,
            alt: filename,
            created: stats.ctime,
        };
    });
    photos.sort((a, b) => a.created.getTime() - b.created.getTime());

    return photos;
}
