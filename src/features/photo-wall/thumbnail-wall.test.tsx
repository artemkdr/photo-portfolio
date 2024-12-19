import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import { ThumbnailWall } from '@/features/photo-wall/thumbnail-wall';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ThumbnailWall', () => {
    const mockPhotos = [
        { name: 'Photo 1', url: '/photo1', src: '/photo1.jpg', alt: 'Photo 1' },
        { name: 'Photo 2', url: '/photo2', src: '/photo2.jpg', alt: 'Photo 2' },
    ];

    it('renders photos after mounting', async () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <ThumbnailWall />
            </PhotosContext.Provider>
        );
        expect(screen.getByAltText('Photo 1')).toBeInTheDocument();
        expect(screen.getByAltText('Photo 2')).toBeInTheDocument();
    });

    it('toggles effect on button click', async () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <ThumbnailWall />
            </PhotosContext.Provider>
        );
        const pressedButton = await screen.findByRole('button', {
            name: /turn/i,
            pressed: true,
        });
        expect(pressedButton).toHaveTextContent(/off/i);
        fireEvent.click(pressedButton);
        const notPressedButton = await screen.findByRole('button', {
            name: /turn/i,
            pressed: false,
        });
        expect(notPressedButton).toHaveTextContent(/on/i);
    });
});
