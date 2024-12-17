export const getAbsolutePosition = (
    element: HTMLElement | null
): { x: number; y: number } => {
    let x = 0;
    let y = 0;
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        x += rect.left + window.scrollX;
        y += rect.top + window.scrollY;

        // Check if the current element has absolute positioning
        const computedStyle = window.getComputedStyle(currentElement);
        if (
            computedStyle.position === 'absolute' ||
            computedStyle.position === 'fixed'
        ) {
            // If absolute, we've reached the point where coordinates are relative to
            // the viewport, so we can stop traversing up the hierarchy.
            break;
        }

        currentElement = currentElement.parentElement;
    }

    return { x, y };
};
