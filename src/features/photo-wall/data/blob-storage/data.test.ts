import { fetchPhotosFromBlob } from '@/features/photo-wall/data/blob-storage/data';
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
        expect(photos).toHaveLength(2);
        expect(photos[0]).toEqual({
            src: '/photos/photo2.png',
            name: 'photo2.png',
            alt: 'photo2.png',
            created: blobs[1].uploadedAt,
        });
        expect(photos[1]).toEqual({
            src: '/photos/photo1.webp',
            name: 'photo1.webp',
            alt: 'photo1.webp',
            created: blobs[0].uploadedAt,
        });
    });

    it('should ignore files with invalid extensions', async () => {
        const photos = await fetchPhotosFromBlob();
        expect(photos).toHaveLength(2);
        expect(
            photos.find((photo) => photo.name === 'document.txt')
        ).toBeUndefined();
    });
});
