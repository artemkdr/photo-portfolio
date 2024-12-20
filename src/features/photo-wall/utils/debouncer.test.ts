import { debounce } from '@/features/photo-wall/utils/debouncer';
import { describe, expect, it, vi } from 'vitest';

describe('debounce', () => {
    it('should call the function after the specified delay', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 1000);

        debouncedFn();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledOnce();
    });

    it('should call the function only once if called multiple times within the delay', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 1000);

        debouncedFn();
        debouncedFn();
        debouncedFn();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call the function with the correct arguments', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 1000);
        const argO = {};
        debouncedFn('arg1', 'arg2', 3, argO);
        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenNthCalledWith(1, 'arg1', 'arg2', 3, argO);
    });

    it('should reset the delay if called again within the delay period', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 1000);

        debouncedFn();
        vi.advanceTimersByTime(500);
        debouncedFn();
        vi.advanceTimersByTime(500);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledOnce();
    });
});
