import { TabType } from '@interfaces/tab-messages';

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    try {
        await chrome.tabs.sendMessage(tab.id, {
            type: TabType.iconClicked,
        });
    } catch {
        console.error('Jobler: No content script in this tab.');
    }
});
