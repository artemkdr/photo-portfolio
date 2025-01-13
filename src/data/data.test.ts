import * as dataBlob from '@/data/blob-storage/data';
import { fetchPhotos } from '@/data/data';
import * as dataDummy from '@/data/dummy/data';
import * as dataFS from '@/data/file-system/data';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/data/blob-storage/data');
vi.mock('@/data/file-system/data');

describe('fetchPhotos', () => {
    it("should call fetchPhotosFromBlob when source is 'blob'", async () => {
        const fetchPhotosFromBlobSpy = vi.spyOn(
            dataBlob,
            'fetchPhotosFromBlob'
        );
        fetchPhotos('blob');
        expect(fetchPhotosFromBlobSpy).toHaveBeenCalled();
    });

    it("should call fetchPhotosFromFS when source is 'fs'", async () => {
        const fetchPhotosFromFSSpy = vi.spyOn(dataFS, 'fetchPhotosFromFS');
        fetchPhotos('fs');
        expect(fetchPhotosFromFSSpy).toHaveBeenCalled();
    });

    it('should call fetchDummyPhotos when source not blob or fs', async () => {
        const fetchDummyPhotosSpy = vi.spyOn(dataDummy, 'fetchDummyPhotos');
        const fetchPhotosFromFSSpy = vi.spyOn(dataFS, 'fetchPhotosFromFS');
        const fetchPhotosFromBlobSpy = vi.spyOn(
            dataBlob,
            'fetchPhotosFromBlob'
        );
        fetchPhotos('dummy');
        expect(fetchDummyPhotosSpy).toHaveBeenCalled();
        expect(fetchPhotosFromFSSpy).not.toHaveBeenCalled();
        expect(fetchPhotosFromBlobSpy).not.toHaveBeenCalled();
    });

    it('should limit the result', async () => {
        vi.mocked(dataFS.fetchPhotosFromFS).mockReturnValue(
            new Promise((resolve) =>
                resolve([
                    {
                        src: '/photos/photo1.webp',
                        name: 'photo1.webp',
                        alt: 'photo1.webp',
                        created: new Date(2023, 1, 1),
                    },
                    {
                        src: '/photos/photo2.png',
                        name: 'photo2.png',
                        alt: 'photo2.png',
                        created: new Date(2023, 2, 1),
                    },
                    {
                        src: '/photos/photo3.jpg',
                        name: 'photo3.jpg',
                        alt: 'photo3.jpg',
                        created: new Date(2023, 3, 1),
                    },
                ])
            )
        );
        const photos = await fetchPhotos('fs', 2);
        expect(photos?.length <= 2);
    });
});
