import { describe, expect, it, vi } from 'vitest';
import { getAbsolutePosition } from './position';

describe('getAbsolutePosition', () => {
    it('should return { x: 0, y: 0 } for a null element', () => {
        const result = getAbsolutePosition(null);
        expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should calculate the correct position for an element', () => {
        const parentElement = document.createElement('div');
        const childElement = document.createElement('div');
        parentElement.appendChild(childElement);
        document.body.appendChild(parentElement);

        vi.spyOn(parentElement, 'getBoundingClientRect').mockReturnValue({
            left: 50,
            top: 50,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(childElement, 'getBoundingClientRect').mockReturnValue({
            left: 100,
            top: 200,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
            return { position: 'static' } as CSSStyleDeclaration;
        });

        const result = getAbsolutePosition(childElement);
        expect(result).toEqual({
            x: 150 + window.scrollX,
            y: 250 + window.scrollY,
        });

        document.body.removeChild(parentElement);
    });

    it('calculates correctly when in the middle of DOM structure there is an element with absolute position', () => {
        const rootElement = document.createElement('div');
        const parentElement = document.createElement('div');
        const childElement = document.createElement('div');
        parentElement.appendChild(childElement);
        rootElement.appendChild(parentElement);
        document.body.appendChild(rootElement);

        vi.spyOn(rootElement, 'getBoundingClientRect').mockReturnValue({
            left: 1000,
            top: 2000,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(parentElement, 'getBoundingClientRect').mockReturnValue({
            left: 50,
            top: 50,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(childElement, 'getBoundingClientRect').mockReturnValue({
            left: 100,
            top: 200,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
            if (element === parentElement) {
                return { position: 'absolute' } as CSSStyleDeclaration;
            }
            return { position: 'static' } as CSSStyleDeclaration;
        });

        const result = getAbsolutePosition(childElement);
        expect(result).toEqual({
            x: 150 + window.scrollX,
            y: 250 + window.scrollY,
        });

        document.body.removeChild(rootElement);
    });
});
