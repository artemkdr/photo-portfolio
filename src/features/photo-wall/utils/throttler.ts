export const throttle = (
    fn: (...args: (number | string | object)[]) => void,
    interval: number
) => {
    let lastExecutedAt = 0;
    return function (...args: (number | string | object)[]) {
        if (Date.now() - lastExecutedAt < interval) return;
        lastExecutedAt = Date.now();
        fn(...args);
    };
};
