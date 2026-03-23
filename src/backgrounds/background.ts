chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_DATA') {
        sendResponse({ text: 'Hello from background' });
    }
});
