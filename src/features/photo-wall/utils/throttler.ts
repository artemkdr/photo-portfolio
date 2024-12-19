export const throttle = (
    fn: (...args: unknown[]) => void,
    interval: number
) => {
    let lastExecutedAt = 0;
    return function (...args: unknown[]) {
        if (Date.now() - lastExecutedAt < interval) return;
        lastExecutedAt = Date.now();
        fn(...args);
    };
};
