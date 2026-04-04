import { ChromeMessage } from '@interfaces/tab-messages';
import MessageSender = chrome.runtime.MessageSender;

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    try {
        await chrome.tabs.sendMessage(tab.id, {
            type: ChromeMessage.toggleMenu,
        });
    } catch {
        console.error('Jobler: No content script in this tab.');
    }
});

type ChromeMessagePayload = Record<string, unknown> & { type: string };
const bounceMessage =
    (messageType: ChromeMessage) => (message: ChromeMessagePayload, sender: MessageSender) => {
        if (message.type === messageType && sender.tab?.id) {
            void chrome.tabs.sendMessage(sender.tab.id, {
                ...message,
            });
        }
    };

for (const message of Object.values(ChromeMessage)) {
    chrome.runtime.onMessage.addListener(bounceMessage(message));
}
