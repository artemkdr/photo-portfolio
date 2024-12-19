export const appConfig: {
    blobDomain: string | undefined;
    dataSource: string | undefined;
    photosDir: string;
    photosPath: string;
    photosLimit: number;
} = {
    blobDomain: '26rwtwzj5lztj5sb.public.blob.vercel-storage.com',
    dataSource: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'fs',
    photosDir: 'photos',
    photosPath: 'photo',
    photosLimit: 300,
};
