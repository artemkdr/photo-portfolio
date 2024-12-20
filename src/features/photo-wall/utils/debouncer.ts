export const debounce = (
    fn: (...args: (number | string | object)[]) => void,
    delay: number
) => {
    let timeoutID: NodeJS.Timeout;
    return function (...args: (number | string | object)[]) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
