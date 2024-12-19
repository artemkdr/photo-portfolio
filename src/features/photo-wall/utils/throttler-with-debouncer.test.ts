import { throttleWithDebounce } from '@/features/photo-wall/utils/throttler-with-debouncer';
import { describe, expect, it, vi } from 'vitest';

describe('throttle', () => {
    it('should call the function immediately and called itself after the interval (debounce)', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const throttledFn = throttleWithDebounce(fn, 1000);

        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not call the function if called again within the interval', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const throttledFn = throttleWithDebounce(fn, 1000);

        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);
        // fast-forward time by 990ms
        vi.advanceTimersByTime(990);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call the function again if called after the interval', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const throttledFn = throttleWithDebounce(fn, 1000);

        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);

        // Fast-forward time by 1000ms
        vi.advanceTimersByTime(1000);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(2);

        // Fast-forward time by 900ms
        vi.advanceTimersByTime(900);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(2);

        // Fast-forward time by 50ms - not enough
        vi.advanceTimersByTime(50);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(2);

        // Fast-forward time by 50ms - enough now
        vi.advanceTimersByTime(50);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(3);

        // debouncer call
        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(4);
    });

    it('should pass the correct arguments to the function', () => {
        const fn = vi.fn();
        const throttledFn = throttleWithDebounce(fn, 1000);

        throttledFn(1, 2, 3);
        expect(fn).toHaveBeenCalledWith(1, 2, 3);
    });
});
