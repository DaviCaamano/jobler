const sendMessage = async (message: unknown) => {
    const tabs = await chrome.tabs.query({});

    await Promise.all(
        tabs
            .filter((tab) => typeof tab.id === 'number')
            .map(
                (tab) =>
                    new Promise<void>((resolve) => {
                        chrome.tabs.sendMessage(tab.id!, message, () => {
                            resolve();
                        });
                    })
            )
    );
};
