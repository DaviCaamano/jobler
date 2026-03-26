import { useEffect, useRef } from 'react';

export const useSticky = <T>(value: T, callback: () => void) => {
    const stickyValue = useRef<T>(value);

    // Update the list of filtered items every time the active filter changes.
    useEffect(() => {
        if (stickyValue.current !== value) {
            stickyValue.current = value;
            callback();
        }
    }, [value, callback]);
};
