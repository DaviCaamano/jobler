export const click = (element: HTMLElement) => {
    element.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        })
    );
};
