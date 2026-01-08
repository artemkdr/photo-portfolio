import { fetchPhotosFromBlob } from '@/data/blob-storage/data';
import { list, ListBlobResult } from '@vercel/blob';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@vercel/blob');

describe('fetchPhotosFromBlob', () => {
    const blobs = [
        {
            pathname: 'photos/photo1.webp',
            url: '/photos/photo1.webp',
            uploadedAt: new Date(2023, 1, 1),
        },
        {
            pathname: 'photos/photo2.png',
            url: '/photos/photo2.png',
            uploadedAt: new Date(2023, 2, 1),
        },
        {
            pathname: 'photos/photo%203.png',
            url: '/photos/photo%203.png',
            uploadedAt: new Date(2022, 12, 1),
        },
        {
            pathname: 'photos/фото 4.png',
            url: '/photos/фото 4.png',
            uploadedAt: new Date(2022, 11, 1),
        },
        {
            pathname: 'photos/document.txt',
            url: '/photos/document.txt',
            uploadedAt: new Date(2023, 1, 1),
        },
    ];
    vi.mocked(list).mockReturnValue(
        new Promise<ListBlobResult>((resolve) =>
            resolve({ blobs: blobs } as ListBlobResult)
        )
    );

    it('should fetch photos with valid extensions sorted by upload time', async () => {
        const photos = await fetchPhotosFromBlob();
        expect(photos).toHaveLength(4);
        expect(photos[0]).toEqual({
            src: '/photos/photo2.png',
            previewSrc: '/photos/photo2.png',
            name: 'photo2.png',
            alt: 'photo2.png',
            created: blobs[1].uploadedAt,
        });
        expect(photos[1]).toEqual({
            src: '/photos/photo1.webp',
            previewSrc: '/photos/photo1.webp',
            name: 'photo1.webp',
            alt: 'photo1.webp',
            created: blobs[0].uploadedAt,
        });
    });

    it('should ignore files with invalid extensions', async () => {
        const photos = await fetchPhotosFromBlob();
        expect(photos).toHaveLength(4);
        expect(
            photos.find((photo) => photo.name === 'document.txt')
        ).toBeUndefined();
    });

    it('should correctly encode file names', async () => {
        const photos = await fetchPhotosFromBlob();
        expect(
            photos.find((photo) => photo.name === 'photo%203.png') // originally 'photo%203.png'
        ).toBeDefined();
        expect(
            photos.find(
                (photo) => photo.name === '%D1%84%D0%BE%D1%82%D0%BE%204.png'
            ) // originally 'фото 4.png'
        ).toBeDefined();
    });
});
