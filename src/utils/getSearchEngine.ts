import { SearchEngine } from '@interfaces/search-engine';

function getDomainPath(url: string): { domain: string; pathname: string } {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname
            .replace(/^www\./, '') // remove "www."
            .split('.')[0]
            .toLowerCase();
        return { domain, pathname: urlObj.pathname?.toLowerCase() };
    } catch {
        return { domain: '', pathname: '' };
    }
}

export const getSearchEngine = (): { engine: SearchEngine; path: string } => {
    const url = window.location.href;
    console.log('url', url);
    if (!url) {
        return { engine: SearchEngine.none, path: '' };
    }

    const { domain, pathname } = getDomainPath(url);
    console.log(domain);
    if (domain === SearchEngine.indeed) {
        return { engine: SearchEngine.indeed, path: pathname };
    }
    if (domain === SearchEngine.linkedin) {
        return { engine: SearchEngine.linkedin, path: pathname };
    }
    if (domain === SearchEngine.ziprecruiter) {
        return { engine: SearchEngine.ziprecruiter, path: pathname };
    }
    if (domain === SearchEngine.sandbox) {
        return { engine: SearchEngine.sandbox, path: pathname };
    }
    return { engine: SearchEngine.none, path: pathname };
};
