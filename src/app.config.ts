export const appConfig: {
    blobDomain: string | undefined;
    dataSource: string | undefined;
    photosDir: string;
    photosPath: string;
    photosLimit: number;
    googlePhotos?: {
        apiKey?: string;
        albumId?: string;
        publicAlbumUrl?: string;
    };
} = {
    blobDomain: '26rwtwzj5lztj5sb.public.blob.vercel-storage.com',
    dataSource: 'google-photos', //process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'fs',
    photosDir: 'photos',
    photosPath: 'photo',
    photosLimit: 300,
    googlePhotos: {
        // Add your Google Photos configuration here
        // apiKey: 'your-google-photos-api-key',
        // albumId: 'your-album-id',
        // OR
        publicAlbumUrl:
            'https://photos.google.com/share/AF1QipOP-sOjKxg6NIQvtK893Lt6XgnHdowP0oa1ZsvYvQaPac0iio0DcsU4en09JXt3ZA?key=RGI0VWVwemZ4WkRCanJkbk1JYmxmVzN2Wm1SVzhR',
    },
};
