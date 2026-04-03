// Retrieve the text from the job description.
import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import {
    IN_JOB_ITEM_SELECTOR,
    LI_JOB_ITEM_SELECTOR,
    ZR_JOB_ITEM_SELECTOR,
} from '@constants/crawler/crawler';
import { EngineCrawler } from '@interfaces/crawler/crawler';

export const getJobText = (rootEl: HTMLElement) => {
    // Clone so we can safely modify without affecting the page
    const el = rootEl.cloneNode(true) as HTMLElement;

    // Remove noisy / non-content elements
    const REMOVE_TAGS = ['script', 'style', 'svg', 'img', 'button', 'nav', 'footer', 'noscript'];
    REMOVE_TAGS.forEach((tag) => el.querySelectorAll(tag).forEach((n) => n.remove()));

    el.querySelectorAll(
        '[aria-hidden="true"], .visually-hidden, .a11y-text, [role="presentation"]'
    ).forEach((n) => n.remove());

    // Add bullets
    el.querySelectorAll('li').forEach((li) => {
        if (!li.textContent.trim().startsWith('•')) li.prepend('• ');
    });

    // Convert <br> to newline
    el.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));

    // Add newlines after blocky elements
    const BLOCKS = ['p', 'div', 'section', 'article', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'];
    BLOCKS.forEach((tag) => {
        el.querySelectorAll(tag).forEach((n) => n.append('\n'));
    });

    const text = el.innerText || el.textContent || '';
    return text
        .replace(/(\s*\n){3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
};

export const getJobListElements = (engine: SupportedEngines): HTMLElement[] =>
    Array.from(
        document.querySelectorAll(
            engine === SearchEngine.linkedin
                ? LI_JOB_ITEM_SELECTOR
                : engine === SearchEngine.ziprecruiter
                  ? ZR_JOB_ITEM_SELECTOR
                  : engine === SearchEngine.indeed
                    ? IN_JOB_ITEM_SELECTOR
                    : ''
        )
    );

export const isCrawlerTerminated = (crawler: EngineCrawler | null) =>
    crawler === null || !crawler.isRunning;
