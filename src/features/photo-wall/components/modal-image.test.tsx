import ModalImage from '@/features/photo-wall/components/modal-image';
import { DirectionContext } from '@/features/photo-wall/contexts/direction-provider';
import { PhotosContext } from '@/features/photo-wall/contexts/photos-provider';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { useRouter, mockedRouterPush } = vi.hoisted(() => {
    const mockedRouterPush = vi.fn();
    return {
        useRouter: () => ({ push: mockedRouterPush }),
        mockedRouterPush,
    };
});

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual('next/navigation');
    return {
        ...actual,
        useRouter,
    };
});

window.scrollTo = vi.fn();

const mockPhotos = [
    {
        name: 'photo1',
        src: '/images/photo1.jpg',
        alt: 'Photo 1',
        url: '/photo1',
    },
    {
        name: 'photo2',
        src: '/images/photo2.jpg',
        alt: 'Photo 2',
        url: '/photo2',
    },
];

const mockSetDirection = vi.fn();

// use eval here because of compiler error as PointerEventMock is not PointerEvent
eval('global.window.PointerEvent = Event');

describe('ModalImage', () => {
    it('renders the image correctly', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo1" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        expect(screen.getByAltText('Photo 1')).toBeInTheDocument();
    });

    it('shows "Image not found" if the image does not exist', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo3" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });

    it('navigates to the next image on right arrow key press', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo1" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        fireEvent.keyDown(window, { key: 'ArrowRight' });
        expect(mockSetDirection).toHaveBeenCalledWith(1);
        expect(mockedRouterPush).toHaveBeenCalledWith('/photo2');
    });

    it('navigates to the previous image on left arrow key press', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo2" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        expect(mockSetDirection).toHaveBeenCalledWith(-1);
        expect(mockedRouterPush).toHaveBeenCalledWith('/photo1');
    });

    it('navigates to the next image on tap to the right side', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo1" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        fireEvent.click(screen.getByAltText('Photo 1'), {
            clientX: window.innerWidth - 10,
        });
        expect(mockSetDirection).toHaveBeenCalledWith(1);
        expect(mockedRouterPush).toHaveBeenCalledWith('/photo2');
    });

    it('navigates to the previous image on tap to the left side', () => {
        render(
            <PhotosContext.Provider value={mockPhotos}>
                <DirectionContext.Provider value={[-1, mockSetDirection]}>
                    <ModalImage id="photo2" />
                </DirectionContext.Provider>
            </PhotosContext.Provider>
        );

        fireEvent.click(screen.getByAltText('Photo 2'), { clientX: 10 });
        expect(mockSetDirection).toHaveBeenCalledWith(-1);
        expect(mockedRouterPush).toHaveBeenCalledWith('/photo1');
    });
});
