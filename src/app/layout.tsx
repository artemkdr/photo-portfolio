import { appConfig } from '@/app.config';
import { Content } from '@/content/content';
import DirectionProvider from '@/features/photo-wall/contexts/direction-provider';
import PhotosProvider from '@/features/photo-wall/contexts/photos-provider';
import { fetchPhotos } from '@/features/photo-wall/data/data';
import ThemeButton from '@/features/theme-switcher/components/theme-button';
import ThemeProvider from '@/features/theme-switcher/contexts/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    const photos = await fetchPhotos(
        appConfig.dataSource,
        appConfig.photosLimit
    );
    return (
        <html lang="en">
            <body className={`${robotoCondensed.className} antialiased`}>
                <ThemeProvider>
                    <PhotosProvider value={photos}>
                        <DirectionProvider>
                            {<ThemeButton />}
                            {children}
                            {modal}
                            <Analytics />
                            <SpeedInsights />
                        </DirectionProvider>
                    </PhotosProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
