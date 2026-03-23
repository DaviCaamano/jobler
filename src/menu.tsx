import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchEngineType } from './types/search-engine-type';
import { getSiteNameFromUrl } from './shared/utils/getSearchEngine';

function App() {
    const [siteName, setSiteName] = useState<SearchEngineType>(SearchEngineType.none);

    useEffect(() => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const detectedSite = getSiteNameFromUrl(activeTab?.url);
            setSiteName(detectedSite);
        });
    }, []);

    return (
        <main>
            <h1>Jobler</h1>
            {siteName && <p>{siteName}</p>}
        </main>
    );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
