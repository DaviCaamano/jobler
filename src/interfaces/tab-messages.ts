export enum ChromeMessage {
    crawlerFinished = 'crawlerFinished',
    crawlerProgress = 'crawlerProgress',
    startCrawler = 'startCrawler',
    runCrawler = 'runCrawler',
    stopCrawler = 'stopCrawler',
    toggleMenu = 'toggleMenu',
    toast = 'toast',
}

export type ChromeMessagePayload = Record<string, unknown> & { type: ChromeMessage };
