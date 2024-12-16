import { Content } from '@/app/content/content';
import { fetchPhotos } from '@/app/lib/data/data';
import DirectionProvider from '@/app/lib/providers/direction-provider';
import PhotosProvider from '@/app/lib/providers/photos-provider';
import ThemeProvider from '@/app/lib/providers/theme-provider';
import ThemeButton from '@/app/ui/components/theme-button';
import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
    title: Content.Common.Title,
    description: Content.Common.Description,
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
                <ThemeProvider>
                    <PhotosProvider value={photos}>
                        <DirectionProvider>
                            {<ThemeButton />}
                            {children}
                            {modal}
                        </DirectionProvider>
                    </PhotosProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
