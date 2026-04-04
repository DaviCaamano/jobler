import { ChromeMessage } from '@interfaces/tab-messages';
import { sendMessage } from '@utils/chrome/send-message';

export const toast = async (message: string) => {
    return sendMessage(ChromeMessage.toast, { message });
};
