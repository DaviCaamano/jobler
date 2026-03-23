import { useEffect, useState } from 'react';
import { SearchEngineType } from '../types/search-engine-type';
import { getSiteNameFromUrl } from '../utils/getSearchEngine';



export function useSearchEngine() {

    const [siteName, setSiteName] = useState<SearchEngineType>(SearchEngineType.none);

    useEffect(() => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            console.log('tabs', tabs);
            setSiteName(getSiteNameFromUrl(tabs?.[0]?.url));
        });
    }, []);

    return siteName;
}
