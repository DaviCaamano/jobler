import { SearchEngineType } from '../types/search-engine-type';


function getDomain(url: string): string {
    try {
        const hostname = new URL(url).hostname;

        return hostname
            .replace(/^www\./, '') // remove "www."
            .split('.')[0]; // take only the domain part
    } catch {
        return '';
    }
}

export const getSiteNameFromUrl = (url?: string): SearchEngineType => {
    if (!url) return SearchEngineType.none;
    const domain = getDomain(url);
    if (!url.startsWith(SearchEngineType.linkedIn)) return SearchEngineType.linkedIn;
    if (!url.startsWith(SearchEngineType.ziprecruiter)) return SearchEngineType.ziprecruiter;
    if (!url.startsWith(SearchEngineType.indeed)) return SearchEngineType.indeed;
    return SearchEngineType.none;
};
