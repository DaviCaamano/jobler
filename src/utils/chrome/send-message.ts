import { ChromeMessage } from '@interfaces/tab-messages';

export const sendMessage = async (
    messageType: ChromeMessage,
    message?: Record<string, any>
): Promise<void> => {
    try {
        return chrome.runtime.sendMessage({
            type: messageType,
            ...message,
        });
    } catch (error) {
        const msg = `sendMessage failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(msg);
        throw new Error(msg, { cause: error });
    }
};
