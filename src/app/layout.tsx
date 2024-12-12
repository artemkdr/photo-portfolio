import { fetchPhotos } from '@/app/lib/data';
import DirectionProvider from '@/app/lib/providers/direction-provider';
import PhotosProvider from '@/app/lib/providers/photos-provider';
import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
    title: "Artem Kudryavtsev's photos",
    description:
        "Hi, my name is Artem Kudryavtsev, I'm a photographer based in Switzerland.",
};

export default async function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    const photos = await fetchPhotos();

    return (
        <html lang="en">
            <body className={`${robotoCondensed.className} antialiased`}>
                <PhotosProvider value={photos}>
                    <DirectionProvider>
                        {children}
                        {modal}
                    </DirectionProvider>
                </PhotosProvider>
            </body>
        </html>
    );
}
