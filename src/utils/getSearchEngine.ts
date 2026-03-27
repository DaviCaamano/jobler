import { SearchEngine } from '@interfaces/search-engine';

function getDomainPath(url: string): { domain: string; pathname: string } {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname
            .replace(/^www\./, '')
            .split('.')[0]
            .toLowerCase();

        return { domain, pathname: urlObj.pathname?.toLowerCase() };
    } catch {
        return { domain: '', pathname: '' };
    }
}

export const getSearchEngine = (urlOverride?: string): { engine: SearchEngine; path: string } => {
    const url = urlOverride ?? window.location.href;

    if (!url) {
        return { engine: SearchEngine.none, path: '' };
    }

    const { domain, pathname } = getDomainPath(url);

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
