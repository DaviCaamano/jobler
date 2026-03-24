export enum SearchEngine {
    indeed = 'indeed',
    linkedin = 'linkedin',
    ziprecruiter = 'ziprecruiter',
    none = 'none', // Not a support job search engine
}

export const SearchEnginePath: Record<string, { domain: SearchEngine; pathname: string }> = {
    [SearchEngine.indeed]: {
        domain: SearchEngine.indeed,
        pathname: '/jobs/search/',
    },
    [SearchEngine.linkedin]: {
        domain: SearchEngine.linkedin,
        pathname: '/jobs/search/',
    },
    [SearchEngine.ziprecruiter]: {
        domain: SearchEngine.ziprecruiter,
        pathname: '/jobs/search/',
    },
};
