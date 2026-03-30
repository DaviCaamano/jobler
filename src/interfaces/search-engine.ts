export enum SearchEngine {
    indeed = 'indeed',
    linkedin = 'linkedin',
    ziprecruiter = 'ziprecruiter',
    sandbox = 'dnd-binders',
    none = 'none', // Not a support job search engine
}

export type SupportedEngines =
    | SearchEngine.linkedin
    | SearchEngine.ziprecruiter
    | SearchEngine.indeed;
