import { ChromeMessage } from '@interfaces/tab-messages';

export const toast = async (message: string) => {
    if (chrome.tabs?.query) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab?.id) {
            await chrome.tabs.sendMessage(tab.id, {
                type: ChromeMessage.toast,
                message,
            });
        }

        return;
    }

    await chrome.runtime.sendMessage({
        type: ChromeMessage.toast,
        message,
    });
};
