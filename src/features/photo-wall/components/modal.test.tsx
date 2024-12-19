import Modal, { ModalProps } from '@/features/photo-wall/components/modal';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

describe('Modal Component', () => {
    const defaultProps: ModalProps = {
        children: <div>Modal Content</div>,
        footer: <div>Footer Content</div>,
        onTap: null,
    };

    it('renders children and footer', () => {
        render(<Modal {...defaultProps} />);
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('calls onDismiss when close button is clicked', () => {
        render(<Modal {...defaultProps} />);
        const closeButton = screen.getByLabelText('Close button');
        fireEvent.click(closeButton);
        expect(mockedRouterPush).toHaveBeenCalledWith('/');
    });

    it('calls onTap when overlay is clicked', async () => {
        const onTap = vi.fn();
        render(<Modal {...defaultProps} onTap={onTap} />);
        const overlay = await screen.findByTestId('overlay');
        fireEvent.click(overlay);
        expect(onTap).toHaveBeenCalled();
    });

    it('calls onDismiss when Escape key is pressed', () => {
        render(<Modal {...defaultProps} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockedRouterPush).toHaveBeenCalledWith('/');
    });

    it('adds and removes modal-mode class on body', async () => {
        render(<Modal {...defaultProps} />);
        expect(document.body.classList.contains('modal-mode')).toBe(true);
        await fireEvent.keyDown(document, { key: 'Escape' });
        waitFor(() => {
            expect(document.body.classList.contains('modal-mode')).toBe(false);
        });
    });
});
