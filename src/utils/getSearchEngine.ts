import { SearchEnginePath, SearchEngine } from '@interfaces/search-engine-type';

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

export const getSearchEngine = (): SearchEngine => {
    const url = window.location.href;
    if (!url) return SearchEngine.none;

    const { domain, pathname } = getDomainPath(url);
    if (
        domain === SearchEnginePath.indeed.domain &&
        pathname === SearchEnginePath.indeed.pathname
    ) {
        return SearchEngine.indeed;
    }
    if (
        domain === SearchEnginePath.linkedin.domain &&
        pathname === SearchEnginePath.linkedin.pathname
    ) {
        return SearchEngine.linkedin;
    }
    if (
        domain === SearchEnginePath.ziprecruiter.domain &&
        pathname === SearchEnginePath.ziprecruiter.pathname
    ) {
        return SearchEngine.ziprecruiter;
    }
    return SearchEngine.none;
};
