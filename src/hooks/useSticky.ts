import { useEffect, useRef } from 'react';

export const useSticky = <T>(value: T, callback: () => void) => {
    const previousValue = useRef(value);

    useEffect(() => {
        if (!Object.is(previousValue.current, value)) {
            previousValue.current = value;
            callback();
        }
    }, [value, callback]);
};
