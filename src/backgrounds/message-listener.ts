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

const bounceMessage =
    (messageType: ChromeMessage) => (message: { type: string }, sender: MessageSender) => {
        if (message.type === messageType && sender.tab?.id) {
            void chrome.tabs.sendMessage(sender.tab.id, {
                type: messageType,
            });
        }
    };

chrome.runtime.onMessage.addListener(bounceMessage(ChromeMessage.toggleMenu));
chrome.runtime.onMessage.addListener(bounceMessage(ChromeMessage.startCrawler));
chrome.runtime.onMessage.addListener(bounceMessage(ChromeMessage.stopCrawler));
chrome.runtime.onMessage.addListener(bounceMessage(ChromeMessage.toast));
