import FullImage from '@/features/photo-wall/components/full-image';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('FullImage Component', () => {
    it('renders correctly with given props', () => {
        render(<FullImage src="/test.jpg" alt="Test Image" />);
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toBeInTheDocument();
    });

    it('applies the given className', () => {
        render(
            <FullImage
                src="/test.jpg"
                alt="Test Image"
                className="custom-class"
            />
        );
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toHaveClass('custom-class');
    });

    it('updates window size on resize', async () => {
        render(<FullImage src="/test.jpg" alt="Test Image" />);
        const imgElement = await screen.findByAltText('Test Image');

        // Mock window resize
        global.innerWidth = 800;
        global.innerHeight = 600;
        act(() => {
            global.dispatchEvent(new Event('resize'));
        });
        expect(
            parseFloat(imgElement?.getAttribute('width') as string) < 800
        ).toBeTruthy();
        expect(
            parseFloat(imgElement?.getAttribute('height') as string) < 600
        ).toBeTruthy();
    });

    it('removes event listener on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = render(
            <FullImage src="/test.jpg" alt="Test Image" />
        );
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );
    });
});
