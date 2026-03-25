import { useEffect, useState } from 'react';
import { TabType } from '@interfaces/tab-messages';

export const useToggleMenu = () => {
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        const listener = (message: any) => {
            if (message.type === TabType.iconClicked) {
                setOpened((prev) => !prev);
            }
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    return opened;
};
