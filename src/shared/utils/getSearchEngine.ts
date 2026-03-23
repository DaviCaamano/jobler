import { SearchEngineType } from '../../types/search-engine-type';

export const getSiteNameFromUrl = (url?: string): SearchEngineType => {
    if (!url) return SearchEngineType.none;
    switch (url) {
        case 'linkedin':
            return SearchEngineType.linkedIn;
        case 'ziprecruiter':
            return SearchEngineType.ziprecruiter;
        case 'indeed':
            return SearchEngineType.indeed;
    }
    return SearchEngineType.none;
};
