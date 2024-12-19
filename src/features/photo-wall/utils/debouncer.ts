export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
    let timeoutID: NodeJS.Timeout;
    return function (...args: unknown[]) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
