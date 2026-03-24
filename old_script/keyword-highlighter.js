// ==UserScript==
// @name         Job Application Keyword Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Highlights "react" (but not "react native") in yellow, and highlights specified keywords in purple (bold+italic).
// @match        *://*.linkedin.com/*
// @match        *://*.ziprecruiter.com/*
// @match        *://*.indeed.com/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    let active = true;
    const MORE_INFO_BUTTON_SELECTOR = '[data-testid="expandable-text-button"]';
    const HIGHLIGHTER_CLASS = '__keyword_highlighter_davi_caamano_15315_mark';
    const MISSING_BG_COLOR = 'pink';
    const BOLD_ITALIC = {
        bold: true,
        italic: false,
    };
    // High Lighter Styles
    const ORANGE_KEYWORD_STYLE = {
        background: '#ff8863', // purple-ish; change to "purple" if you want very strong contrast
        ...BOLD_ITALIC,
    };
    const ORANGE_KEYWORDS_EDGE_BG = 'rgb(229 92 92)';

    const YELLOW_KEYWORD_STYLE = {
        background: 'yellow',
        ...BOLD_ITALIC,
    };
    const YELLOW_KEYWORDS_EDGE_BG = '#ffd27e';

    const RED_KEYWORD_STYLE = {
        background: '#860505',
        color: 'white',
        fontSize: '2rem',
        ...BOLD_ITALIC,
    };
    const RED_KEYWORDS_EDGE_BG = '#da2929';

    const GREEN_KEYWORD_STYLE = {
        background: '#aeffae',
        ...BOLD_ITALIC,
    };
    const GREEN_KEYWORDS_EDGE_BG = '#8fd68f';

    const GRAY_KEYWORD_STYLE = {
        background: 'lightgray',
        ...BOLD_ITALIC,
    };
    const GRAY_KEYWORDS_EDGE_BG = 'gray';

    const POTENTIALLY_DISQUALIFYING_APPLICATION = [
        'Applied',
        'Hybrid',
        'onsite',
        'on site',
        'on-site',
        'intern',
        'call for referral',
        'word press',
        'wordpress',
        'Clearance',
        'Shopify',
        'web3',
        'webflow',
        'Ecommerce',
    ];
    const COMPANIES_TO_AVOID = [
        'Rithum',
        'Base44',
        'hypergiant',
        'crossing hurdles',
        'helixrecruit',
        'underdog.io',
        'Roblox',
        'bitpay',
        'imentor',
        'Bright Vision Technologies',
        'servicecore',
        'service core',
        'Trapp Technology',
        'Trust & Will',
        'SERHANT',
        'Workweek Media',
        'affinitiv',
        'swarm',
        'IXL Learning',
        'Cherry Hill Programs',
        'Service Now',
        'Ambrook',
    ];

    const BAD_TECH_LIST = [
        'c#',
        'c++',
        'golang',
        'go',
        'ruby',
        'ruby on rails',
        '.net',
        'java',
        'Django',
        'Vue.js',
        'PHP',
        'Kotlin',
        'Groovy',
        'Spring Boot',
        'Spring-Boot',
        'SpringBoot',
        'Flutter',
        'Rust',
        'GraphQL',
        'Graph QL',
        'Graph-QL',
        'ElasticSearch',
        'Vibe Code',
        'Vibe Coder',
        'Vibe-Code',
        'vibe-coder',
        'vibecoder',
        'exlixir',
    ];

    const POSITIVE_JOB_QUALITIES = ['remote'];

    const GOOD_TECH_LIST = [
        'Next.Js',
        'NextJs',
        'Node',
        'Node.Js',
        'Nodejs',
        'Nest',
        'Nest.Js',
        'Nestjs',
        'Typescript',
        'TS',
        'javascript',
        'Postgres',
        'Postgresql',
        'prisma',
        'sequalize',
        'tailwind',
        'tw',
        'material',
        'material ui',
        'chakra',
        'chakra ui',
        'lambda',
    ];

    const MEH_TECH_LIST = [
        'React-native',
        'ReactNative',
        'React_native',
        'Angular',
        'Angular.Js',
        'Angularjs',
        'python',
        'fastapi',
    ];

    const WORDS_OF_INTEREST = ['years'];

    const YELLOW_KEYWORDS = [
        //Saving this for just "react" for now. Regex for this is below.
    ].map((i) => i.toLowerCase());

    const PURPLE_KEYWORDS = [...BAD_TECH_LIST].map((i) => i.toLowerCase());

    const RED_KEYWORDS = [...COMPANIES_TO_AVOID, ...POTENTIALLY_DISQUALIFYING_APPLICATION].map(
        (i) => i.toLowerCase()
    );

    const GREEN_KEYWORDS = [...GOOD_TECH_LIST].map((i) => i.toLowerCase());

    const GRAY_KEYWORDS = [...MEH_TECH_LIST, ...WORDS_OF_INTEREST].map((i) => i.toLowerCase());

    const isTabFocused = () => {
        return document.visibilityState === 'visible';
    };

    const getKeywordRegex = (words) => {
        if (!words?.length) {
            return undefined;
        }
        // Turn keywords into alternation parts with appropriate boundaries.
        // For phrases with spaces, we enforce word boundaries at both ends and allow flexible whitespace between words.
        // For tokens containing non-word chars (c#, .net, underdog.io), we use custom boundaries.
        const keywordToPattern = (k) => {
            const escapeRegexLiteral = (s) => {
                return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            };

            const lower = k.toLowerCase();

            // Special cases
            if (lower === '.net') {
                // Match ".net" not as part of something else.
                // left boundary: not a word char
                // right boundary: not a word char
                return `(?<!\\w)\\.net(?!\\w)`;
            }
            if (lower === 'c#') {
                return `(?<!\\w)c#(?!\\w)`;
            }
            if (lower === 'underdog.io') {
                return `(?<!\\w)underdog\\.io(?!\\w)`;
            }

            // Phrases (contains space)
            if (lower.includes(' ')) {
                // Allow any whitespace between words, but keep whole-phrase boundaries
                const words = lower.split(/\s+/).map(escapeRegexLiteral);
                const inner = words.join('\\s+');
                return `\\b${inner}\\b`;
            }

            // Normal word
            return `\\b${escapeRegexLiteral(lower)}\\b`;
        };
        return new RegExp(`(?:${words.map(keywordToPattern).join('|')})`, 'gi');
    };

    const YELLOW_KEYWORDS_RE = [
        /\breact\b(?!\s+native\b)/gi,
        getKeywordRegex(YELLOW_KEYWORDS),
    ].filter(Boolean);
    const PURPLE_KEYWORDS_RE = [getKeywordRegex(PURPLE_KEYWORDS)].filter(Boolean);
    const RED_KEYWORDS_RE = [getKeywordRegex(RED_KEYWORDS)].filter(Boolean);
    const GREEN_KEYWORDS_RE = [getKeywordRegex(GREEN_KEYWORDS)].filter(Boolean);
    const GRAY_KEYWORDS_RE = [getKeywordRegex(GRAY_KEYWORDS)].filter(Boolean);

    const COLORED_KEYWORDS = [
        {
            keywords: YELLOW_KEYWORDS_RE,
            style: YELLOW_KEYWORD_STYLE,
            edgeBg: YELLOW_KEYWORDS_EDGE_BG,
        },
        {
            keywords: PURPLE_KEYWORDS_RE,
            style: ORANGE_KEYWORD_STYLE,
            edgeBg: ORANGE_KEYWORDS_EDGE_BG,
        },
        { keywords: RED_KEYWORDS_RE, style: RED_KEYWORD_STYLE, edgeBg: RED_KEYWORDS_EDGE_BG },
        { keywords: GREEN_KEYWORDS_RE, style: GREEN_KEYWORD_STYLE, edgeBg: GREEN_KEYWORDS_EDGE_BG },
        { keywords: GRAY_KEYWORDS_RE, style: GRAY_KEYWORD_STYLE, edgeBg: GRAY_KEYWORDS_EDGE_BG },
    ];

    // --- Highlighters ---
    const applySpanStyle = (span, style) => {
        //defaults
        span.style.background = style.background || MISSING_BG_COLOR;
        span.style.fontWeight = style.fontWeight || '700';
        if (style.fontSize) {
            span.style.fontSize = style.fontSize;
        }
        span.style.fontStyle = style.fontStyle || 'italic';
        span.style.padding = style.padding || '0 4px';
        span.style.borderRadius = style.borderRadius || '10px%';
        span.style.color = style.color || span.style.color;
    };

    // Highlights matches for a regex by wrapping only the matched substrings in spans
    const highlightMatchesInTextNode = (textNode, regex, style, edgeBg) => {
        if (textNode?.classList?.contains?.(HIGHLIGHTER_CLASS)) {
            return 0;
        }
        const text = textNode.nodeValue;
        regex.lastIndex = 0;

        let match;
        let lastIdx = 0;
        let didReplace = false;
        const frag = document.createDocumentFragment();

        while ((match = regex.exec(text)) !== null) {
            didReplace = true;
            const start = match.index;
            const end = start + match[0].length;

            if (start > lastIdx) {
                frag.appendChild(document.createTextNode(text.slice(lastIdx, start)));
            }

            const mark = document.createElement('span');
            const edge = document.createElement('span');
            mark.classList.add(HIGHLIGHTER_CLASS);
            edge.classList.add(HIGHLIGHTER_CLASS);
            mark.textContent = text.slice(start, end);
            applySpanStyle(mark, style);
            applySpanStyle(edge, {
                ...style,
                background: edgeBg,
                padding: '0px 6px',
                borderRadius: '3px',
            });

            edge.appendChild(mark);
            frag.appendChild(edge);
            lastIdx = end;
        }

        if (!didReplace) return 0;

        if (lastIdx < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIdx)));
        }

        textNode.parentNode?.replaceChild?.(frag, textNode);
        return 1; // indicates we replaced this node
    };

    // Runs both highlighters over the page.
    // IMPORTANT: We do keyword highlighting first, then react highlighting,
    // so we don't end up matching inside the "react" spans we create (and vice versa).
    const runHighlighters = (root = document.body) => {
        if (!root || !active) return { keywordHits: 0 };

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

                    const p = node.parentElement;
                    if (!p) return NodeFilter.FILTER_REJECT;

                    const tag = p.tagName;
                    if (
                        tag === 'SCRIPT' ||
                        tag === 'STYLE' ||
                        tag === 'NOSCRIPT' ||
                        tag === 'TEXTAREA' ||
                        tag === 'INPUT'
                    )
                        return NodeFilter.FILTER_REJECT;

                    // Don't re-process nodes we've already wrapped
                    if (p.closest && p.closest(`span.${HIGHLIGHTER_CLASS}`))
                        return NodeFilter.FILTER_REJECT;

                    // Quick checks: if neither regex matches, skip
                    const v = node.nodeValue?.toLowerCase();
                    for (const { keywords } of COLORED_KEYWORDS) {
                        //keyword.lastIndex = 0;
                        for (const keyword of keywords) {
                            if (keyword.test(v)) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                    }
                    return NodeFilter.FILTER_REJECT;
                },
            },
            false
        );

        const textNodes = [];
        let n;
        while ((n = walker.nextNode())) textNodes.push(n);

        let keywordHits = 0;

        // Keyword pass (purple + bold + italic)
        for (const tn of textNodes) {
            for (const { keywords, style, edgeBg } of COLORED_KEYWORDS) {
                for (const keyword of keywords) {
                    // Wrap created spans with a class so we can avoid re-processing
                    const replaced = highlightMatchesInTextNode(tn, keyword, style, edgeBg);

                    if (replaced) {
                        keywordHits += 1;
                        // Mark any spans we created in this parent subtree
                        // (cheap heuristic: add class to all spans with background plum under the parent)
                        const parent = tn.parentElement;
                        if (parent) {
                            parent.querySelectorAll('span[style*="background"]').forEach((s) => {
                                if (s.style.background) s.classList.add(HIGHLIGHTER_CLASS);
                            });
                        }
                    }
                }
            }
        }

        return { keywordHits };
    };

    let iter = 0;
    const MAX_ITER = 30;
    let startUpInterval;
    const handleKeyPress = (event) => {
        if (event.altKey) {
            if (event.key.toLowerCase() === '~') {
                active = false;
            } else if (event.key.toLowerCase() === '`') {
                active = true;
                runHighlighters();
            }
        }
    };

    const expandLinkedInJobApplicationInfo = () => {
        if (
            window.location.origin === 'https://www.linkedin.com' &&
            window.location.pathname.startsWith('/jobs/view/')
        ) {
            document.querySelectorAll(MORE_INFO_BUTTON_SELECTOR).forEach((element) => {
                element?.click();
            });
        }
    };

    const startUp = () => {
        if (iter++ < MAX_ITER && active) {
            if (isTabFocused()) {
                runHighlighters();
                expandLinkedInJobApplicationInfo();
            }
        } else {
            clearInterval(startUpInterval);
        }
    };

    document.addEventListener('keydown', handleKeyPress, false);

    // Run once shortly after load
    startUpInterval = setTimeout(() => setInterval(startUp, 500), 1000);
})();
