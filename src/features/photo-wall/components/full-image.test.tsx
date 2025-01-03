import FullImage from '@/features/photo-wall/components/full-image';
import { WindowSizeProvider } from '@/features/photo-wall/contexts/window-size-provider';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('FullImage Component', () => {
    it('renders correctly with given props', () => {
        render(
            <WindowSizeProvider>
                <FullImage src="/test.jpg" alt="Test Image" />
            </WindowSizeProvider>
        );
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toBeInTheDocument();
    });

    it('applies the given className', () => {
        render(
            <WindowSizeProvider>
                <FullImage
                    src="/test.jpg"
                    alt="Test Image"
                    className="custom-class"
                />
            </WindowSizeProvider>
        );
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toHaveClass('custom-class');
    });
});
