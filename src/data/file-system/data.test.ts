import { fetchPhotosFromFS } from '@/data/file-system/data';
import fs, { Dirent, Stats } from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs');

describe('fetchPhotosFromFS', () => {
    const mockFiles = ['photo1.jpg', 'photo2.png', 'document.txt'];
    const mockStats = { ctime: new Date() } as Stats;

    beforeEach(() => {
        vi.spyOn(fs, 'readdirSync').mockReturnValue(
            mockFiles as unknown as Dirent<Buffer<ArrayBuffer>>[]
        );
        vi.spyOn(fs, 'statSync').mockReturnValue(mockStats);
    });

    it('should fetch photos with valid extensions', async () => {
        const photos = await fetchPhotosFromFS();
        expect(photos).toHaveLength(2);
        expect(photos[0]).toEqual({
            src: '/photos/photo1.jpg',
            previewSrc: '/photos/photo1.jpg',
            name: 'photo1.jpg',
            alt: 'photo1.jpg',
            created: mockStats.ctime,
        });
        expect(photos[1]).toEqual({
            src: '/photos/photo2.png',
            previewSrc: '/photos/photo2.png',
            name: 'photo2.png',
            alt: 'photo2.png',
            created: mockStats.ctime,
        });
    });

    it('should ignore files with invalid extensions', async () => {
        const photos = await fetchPhotosFromFS();
        expect(photos).toHaveLength(2);
        expect(
            photos.find((photo) => photo.name === 'document.txt')
        ).toBeUndefined();
    });

    it('should sort photos by creation time', async () => {
        vi.mocked(fs.statSync).mockImplementation((path) => {
            const filePath = path as string;
            if (filePath.endsWith('photo1.jpg'))
                return { ctime: new Date('2023-01-01') } as Stats;
            else if (filePath.endsWith('photo2.png'))
                return { ctime: new Date('2023-01-02') } as Stats;
            else return { ctime: new Date() } as Stats;
        });

        const photos = await fetchPhotosFromFS();
        expect(photos).toHaveLength(2);
        expect(photos[0].name).toBe('photo2.png');
        expect(photos[1].name).toBe('photo1.jpg');
    });
});
