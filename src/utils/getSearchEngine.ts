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
    const url = urlOverride ?? window?.location?.href;

    if (!url) {
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE_SEARCH_ENGINE) {
            return {
                engine: import.meta.env.VITE_DEV_MODE_SEARCH_ENGINE as SearchEngine,
                path: '',
            };
        }
        return { engine: SearchEngine.none, path: '' };
    }

    const { domain, pathname } = getDomainPath(url);

    const domainToEngine: Record<string, SearchEngine> = {
        indeed: SearchEngine.indeed,
        linkedin: SearchEngine.linkedin,
        ziprecruiter: SearchEngine.ziprecruiter,
        sandbox: SearchEngine.sandbox,
    };

    const engine = domainToEngine[domain] ?? SearchEngine.none;
    // If in Dev Mode, run the app on every page
    if (
        engine === SearchEngine.none &&
        import.meta.env.DEV &&
        import.meta.env.VITE_DEV_MODE_SEARCH_ENGINE
    ) {
        return {
            engine: import.meta.env.VITE_DEV_MODE_SEARCH_ENGINE as SearchEngine,
            path: '',
        };
    }
    return { engine, path: pathname };
};
