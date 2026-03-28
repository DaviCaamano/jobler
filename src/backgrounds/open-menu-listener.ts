import { ChromeMessage } from '@interfaces/tab-messages';

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === ChromeMessage.toggleMenu && sender.tab?.id) {
        void chrome.tabs.sendMessage(sender.tab.id, {
            type: ChromeMessage.toggleMenu,
        });
    }
});
