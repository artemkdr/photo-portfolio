export const throttleWithDebounce = (
    fn: (...args: (number | string | object)[]) => void,
    interval: number
) => {
    let lastExecutedAt = 0;
    let timeoutID: NodeJS.Timeout;
    return function (...args: (number | string | object)[]) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            lastExecutedAt = Date.now();
            fn(...args);
        }, interval);
        if (Date.now() - lastExecutedAt < interval) return;
        lastExecutedAt = Date.now();
        fn(...args);
    };
};
