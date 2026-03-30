// ==UserScript==
// @name         Ziprecruiter Crawler
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Crawls Ziprecruiter and collects data on all jobs.
// @match        *://*.ziprecruiter.com/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // Vars needed for Options
    const REMOTE_STATUS_SELECTOR = '[data-testid="job-details-scroll-container"] h2 + a + div > p';
    const ALREADY_APPLIED_BUTTON_SELECTOR =
        '[data-testid="job-details-scroll-container"] [aria-label="Applied"]';
    const TITLE_BLACK_LIST = [
        'backend',
        'back end',
        'back-end',
        'lead',
        'manager',
        'architect',
        'president',
        'vp',
        'python',
        'go',
        'java',
        'AI',
        'Artificial Intelligence',
        'rust',
        'ruby',
        'rails',
        'devops',
        'devsecops',
        'contract',
        '.net',
        'c#',
        'integration',
        'android',
        'native',
        'infrastructure',
        'angular',
        'ios',
        'windows',
        'kotlin',
        'c++',
        'llm',
        'coinbase',
        'head',
        'director',
        'sales',
        'mobile',
        'servicenow',
        'php',
        'laravel',
        'principal',
        'hybrid',
        'forward',
        'storyblok',
        'designer',
        'consultant',
        'analyst',
        'temporary',
        'salesforce',
        'vue',
        'vue.js',
        'nurse',
        'elixir',
        'specialist',
        'sharepoint',
        'supabase',
        'electron',
        'field',
        'solar',
        'filenet',
        'systems',
        'elasticsearch',
        'platform',
        'onsite',
        'web3',
        'wordpress',
        'word press',
        'hybird',
        'security',
        'clearance',
        'shopify',
        'golang',
        'talent pool',
    ];

    const BANNED_WORDS = ['Call For Referral', 'web3', 'word press', 'wordpress'];

    const COMPANY_NAME_BLACKLIST = [
        'underdog.io',
        'Crossing Hurdles',
        'HelixRecruit',
        'Base44',
        'Affinitiv',
        'hypergiant',
        'Roblox',
        'bitpay',
        'imentor',
        'servicecore',
        'service core',
        'Trapp Technology',
        'Trust & Will',
        'SERHANT',
        'Workweek Media',
        'Swarm',
        'IXL Learning',
        'Cherry Hill Programs',
        'Bright Vision Technologies',
        'Ambrook',
        'Bluefish AI',
        'Johnson Health Tech North America Inc',
        'First American',
        'Good Inside',
        'MIT Human Resources',
        'ServiceNow',
        'Aquent',
        'Ambrook',
        'Autodesk',
        'Satsuma',
        'Alkami Technology',
        'System Automation Corporation',
        'Abbott',
    ];

    const blackListFilter = (blackList) => (text) => {
        const foundBlackListedWords = [];
        const pass = blackList.every((bannedWord) => {
            const regex =
                bannedWord instanceof RegExp
                    ? bannedWord
                    : new RegExp(
                          `\\b${bannedWord.toLowerCase().replace(/[*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
                          'im'
                      );
            const passes = !regex.test(text);
            if (!passes) {
                foundBlackListedWords.push(bannedWord);
            }
            return passes;
        });
        return [
            pass,
            foundBlackListedWords.length
                ? ` <div style="display: inline-block; text-alight: right;">${foundBlackListedWords.join('</div><div style="display: inline-block; text-alight: right;">')}</div>`
                : '',
        ];
    };

    // OPTIONS
    const options = {
        // textFilters and preFilters are arrays that expect JSONs which have two properties
        // filter:
        //     call back function which determines whether a job should be omitted from the crawler's results
        //     textFilters, titleFilters, and companyFilters receive a single argument representing the job's text, title, and company name respectively
        //     call back must return a 2 element array: [pass, reasonArg?]
        //     pass: boolean
        //         If True the job's data is added to the output
        //         If False the job's data is discarded from the output
        //     reasonArg: (OPTIONAL) string passed to your reason callback.
        //         If the reason property for this filter is a callback that expects an argument, pass that argument as the second argument of this array
        // reason:
        //     A string representing the reason the job is being filtered
        //     or a call back function that takes a single string argument
        //     filter function must return the reasonArg element in the returned array to pass this call back its argument
        textFilters: [
            // Filter to remove any job that is for a react developer
            {
                filter: (text) => [/^(?!.*URL:.*\breact\b).*?\breact\b.*$/im.test(text)],
                reason: 'Not a React position',
            },
            {
                filter: blackListFilter(BANNED_WORDS),
                reason: (blackListedWords) =>
                    `<div style="font-weight: bold;">Blacklisted Word:</div>${blackListedWords}`,
            },
        ],
        // Filters that run before the job data is collected. If your filter does not require reading the text,
        // Adding your filter here makes the crawler faster
        preFilters: [
            // Filter to remove any job that is not remote
            {
                filter: () => [
                    document
                        .querySelector(REMOTE_STATUS_SELECTOR)
                        ?.textContent.trim()
                        .toLowerCase()
                        ?.includes('remote'),
                ],
                reason: 'Not Remote',
            },
            // Filter to remove any job that you have already applied to
            {
                filter: () => [!document.querySelector(ALREADY_APPLIED_BUTTON_SELECTOR)],
                reason: 'Already Applied',
            },
        ],
        titleFilters: [
            // Filter to remove any jobs with a title in the title black list
            {
                filter: blackListFilter(TITLE_BLACK_LIST),
                reason: (blackListedWords) =>
                    `<div style="font-weight: bold;">Blacklisted Title:</div>${blackListedWords}`,
            },
        ],
        companyFilters: [
            {
                filter: blackListFilter(COMPANY_NAME_BLACKLIST),
                reason: (blackListedWords) =>
                    `<div style="font-weight: bold;">Blacklisted Company:</div>${blackListedWords}`,
            },
        ],
    };

    const checkFilters = (filterArray, arg) => {
        let allPass = true;
        const reasons = [];
        for (const { filter, reason } of filterArray) {
            const [pass, reasonArg] = filter(arg);
            if (!pass) {
                allPass = false;
                if (typeof reason === 'function') {
                    if (reasonArg) {
                        reasons.push(reason(reasonArg));
                    } else {
                        reasons.push(reason());
                    }
                } else {
                    reasons.push(reason);
                }
            }
        }
        return { pass: allPass, reasons };
    };

    // Constants
    const LOCAL_STORAGE_KEY = 'tamper-monkey-ziprecruiter-job-data';
    const LOCAL_DATA_DEFAULT = {
        jobData: '',
        jobSummaries: [],
        exixtingJobIds: new Set(),
    };
    const STOP_FUNC_DEFAULT = {
        flag: false,
        resolve: undefined,
        firstRun: false,
        stoppedAt: 0,
    };
    // Flags used to quit a crawl early.
    let stopFunc = { ...STOP_FUNC_DEFAULT, firstRun: true };
    // Flag for in progress crawl operation.
    let crawlerInProgress = false;
    let startTime;
    const JOB_ITEM_SELECTOR = 'section.job_results_two_pane > div.job_result_two_pane_v2';
    const TITLE_SELECTOR =
        'article:first-of-type > section:first-of-type > div:nth-of-type(2)' +
        ' > div:first-of-type > button:first-of-type > div:first-of-type > div:first-of-type > h2';
    const COMPANY_NAME_SELECTOR = '[data-testid="job-card-company"]';
    const JOB_ID_SELECTOR = 'article:first-of-type';
    const JOB_DESCRIPTION_SELECTOR = '.text-primary.whitespace-pre-line.wrap-anywhere';
    const JOB_TTL_AMT_SELECTOR = '#serp_content_skip > p';

    //article:first-of-type > section:first-of-type > div:nth-of-type(2)'
    //+ ' > div:first-of-type > div:first-of-type >
    const JOB_SALARY_SELECTOR = 'div.break-all > p';

    const NEXT_PAGE_BUTTON_SELECTOR = '[title="Next Page"]';

    const JOB_DIVIDER_TEXT = '\n=-=-=-=-=\n';
    const MAX_JOB_PROCESS_ATTEMPTS = 10;
    const ONE_SECOND = 1000;
    const ONE_MINUTE_IN_SECONDS = 60;
    const ONE_HOUR = 3600000;
    const REPLACE_IN_URL = [
        'refine_by_location_type=&',
        'refine_by_apply_type=&',
        'refine_by_experience_level=&',
    ];

    let localData = GM_getValue(LOCAL_STORAGE_KEY, LOCAL_DATA_DEFAULT);
    let jobData = localData.jobData || '';
    let jobSummaries = localData.jobSummaries || [];
    let exixtingJobIds = localData.exixtingJobIds || new Set();

    let page = 0;
    let jobs_per_page = 0;

    let toastElement;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // .click() is stopped by LinkedIn security.
    const click = (element) => {
        element.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            })
        );
    };

    let toastNumber = 0;
    // Raise a on-screen message (toast)
    const toast = (msg, ms = 10000) => {
        const currentToastNum = ++toastNumber;
        toastElement?.remove();
        toastElement = document.createElement('div');
        toastElement.innerHTML = msg;
        Object.assign(toastElement.style, {
            position: 'fixed',
            top: '200px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px 24px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            fontSize: '36px',
            zIndex: 999999,
            maxWidth: '40vw',
            lineHeight: '1.3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        });
        document.body.appendChild(toastElement);
        setTimeout(() => {
            // If currentToastNum !== toastNumber, then this call's toast element has already been removed.
            // Do not remove the current element
            if (currentToastNum === toastNumber) {
                toastElement.remove();
            }
        }, ms);
    };

    // Retrieve the text from the job description.
    const getJobText = (rootEl) => {
        // Clone so we can safely modify without affecting the page
        const el = rootEl.cloneNode(true);

        // Remove noisy / non-content elements
        const REMOVE_TAGS = [
            'script',
            'style',
            'svg',
            'img',
            'button',
            'nav',
            'footer',
            'noscript',
        ];
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

    const getJobTitle = (jobElement) => {
        const title = jobElement.querySelector(TITLE_SELECTOR)?.textContent.trim();
        const titleText = title ? `\nTITLE: ${title}\n` : '';
        return { title, titleText };
    };

    const getJobSalary = (jobElement) => {
        const jobInfoButtons = jobElement.querySelector(JOB_SALARY_SELECTOR);
        const salary = jobInfoButtons?.innerText || jobInfoButtons?.textContent || '';
        const salaryText = salary ? `\nSALARY: ${salary}\n` : '';
        return { salary, salaryText };
    };

    const getJobCompanyName = (jobElement) => {
        const companyNameElement = jobElement.querySelector(COMPANY_NAME_SELECTOR);
        const companyName = (
            companyNameElement?.innerText ||
            companyNameElement?.textContent ||
            ''
        ).trim();
        const companyNameText = companyName ? `\nCompany_Name: ${companyName}\n` : '';
        return { companyName, companyNameText };
    };

    const getJobId = (jobElement) => {
        const id = jobElement.querySelector(JOB_ID_SELECTOR)?.id?.replace('job-card-', '');
        if (!id) {
            return { jobId: '', idText: '' };
        }
        return { jobId: id, jobIdText: id ? `\nJob_ID: ZR-${id}\n` : '' };
    };

    const getJobTtlAmt = () => {
        const jobTtlAmtSpan = document.querySelector(JOB_TTL_AMT_SELECTOR);
        return (
            jobTtlAmtSpan.innerText ||
            jobTtlAmtSpan.textContent ||
            jobTtlAmtSpan.innerHtml ||
            ''
        ).replace(/\D/g, '');
    };

    const toastJobUpdate = (jobNo, skipped = 0) => {
        if (!startTime) {
            alert('Error: toastJobUpdate called with unset start time');
            return;
        }

        const pad2 = (n) => String(Math.floor(n)).padStart(2, '0');

        const timeInSeconds = parseFloat((performance.now() - startTime) / ONE_SECOND); // number
        const hours = Math.floor(timeInSeconds / ONE_HOUR);

        let remaining_time = timeInSeconds - hours * ONE_HOUR;
        const minutes = Math.floor(remaining_time / ONE_MINUTE_IN_SECONDS);
        const seconds = Math.floor(remaining_time % ONE_MINUTE_IN_SECONDS);

        // Always show mm:ss, and if hours exist show hh:mm:ss (with leading zeros)
        const timeStr = `${hours > 0 ? pad2(hours) + ':' : ''}${pad2(minutes)}:${pad2(seconds)}`;

        let jobTtlAmtText = getJobTtlAmt();
        jobTtlAmtText = jobTtlAmtText ? ` / ${jobTtlAmtText}` : '';

        const skippedJobsText = skipped ? `<br /> ${skipped} Skipped` : '';

        toast(`Job: ${jobNo}${jobTtlAmtText} <br/> ${timeStr}${skippedJobsText}`);
    };

    const cleanJobData = () => {
        jobData = jobData
            .replace(/(\s*\n){3,}/g, '\n\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
    };

    const copyJobDataToClipboard = () => {
        try {
            cleanJobData();
            GM_setClipboard(jobData);
            toast(`Copied ${jobData.match(/=-=-=-=-=/g)?.length || 0} Jobs to Clipboard`);
        } catch (err) {
            console.error('GM_setClipboard failed:', err);
            alert('Clipboard copy failed.');
        }
    };

    const copyJobSummariesToClipboard = (omitHeaders = false) => {
        return new Promise((resolve) => {
            try {
                const headers = omitHeaders ? '' : 'company-name,title,apply-here,url,jobId,,count';
                GM_setClipboard(headers + jobSummaries.join(''));
                toast(`Copied ${jobSummaries.length} job summaries to clipboard as a CSV.`);
            } catch (err) {
                console.error('GM_setClipboard failed:', err);
                alert('Clipboard copy failed.');
            }
        });
    };

    const copyJob = (jobElement) => {
        const jobDescription = document.querySelector(JOB_DESCRIPTION_SELECTOR);
        if (!jobDescription) {
            toast('Could not find the job description.');
            return '';
        }
        const text = getJobText(jobDescription);
        const { title, titleText } = getJobTitle(jobElement);
        const { salary, salaryText } = getJobSalary(jobElement);
        const { companyName, companyNameText } = getJobCompanyName(jobElement);
        const { jobId, jobIdText } = getJobId(jobElement);
        if (!jobId) {
            return '';
        }
        const url = `https://www.ziprecruiter.com/jobseeker/home?lk=${jobId}`;
        const urlText = `\n${url}\n`;
        return {
            companyName,
            jobId,
            summary: `\n"${[companyName, title, '=HYPERLINK(INDIRECT(ADDRESS(ROW(),COLUMN()-1)),"APPLY HERE")', url, jobId, , '=COUNTA(F:F)'].join('","')}"`,
            text:
                JOB_DIVIDER_TEXT +
                titleText +
                urlText +
                companyNameText +
                salaryText +
                jobIdText +
                '\n' +
                text,
            title,
        };
    };

    const jobCollector = async () => {
        startTime = performance.now();
        crawlerInProgress = true;
        let jobList, maxJobs;
        let jobsSkipped = 0;

        // Returns elements needed for iterating through list of jobs.
        const getJobListElements = () => {
            jobList = Array.from(document.querySelectorAll(JOB_ITEM_SELECTOR));
            jobs_per_page = jobList.length;
            maxJobs = jobs_per_page - 1;
        };

        // Moves to next page or terminates the crawl if finished.
        const next = async () => {
            // BOOKMARK._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*+._.+*
            GM_setValue(LOCAL_STORAGE_KEY, {
                jobData,
                jobSummaries,
                exixtingJobIds,
            });
            page += 1;
            // Move to next page or finish crawl
            const button = document.querySelector(NEXT_PAGE_BUTTON_SELECTOR);
            if (!button || button.disabled) {
                copyJobDataToClipboard();
                alert('Crawl Complete, press alt-2 to copy results to clipboard');
            } else {
                click(button);
                toast('Moving to next page...');
                await sleep(4000);
                stopFunc.stoppedAt = 0;
                processJob(0);
            }
        };

        const reattempt = async (iter, attempt, { job }) => {
            if (attempt > MAX_JOB_PROCESS_ATTEMPTS) {
                toast(`Unable to load Job #${iter + 1} on list, Skipping...`);
                processJob(iter + 1);
            } else {
                await sleep(500 * (attempt + 1));
                processJob(iter, attempt + 1);
            }
        };

        const filterJob = (reasons, iter) => {
            jobsSkipped++;
            toast(`<div><div>Skipping job: ${iter + 1}</div>${reasons.join('<br />')}</div>`);
        };

        // Process an individual job before moving to next.
        async function processJob(iter = stopFunc.stoppedAt, attempt = 0) {
            // If reset flag is set, stop operation.
            if (stopFunc.flag) {
                stopFunc.resolve(Math.max(iter - 1, 0));
                GM_setValue(LOCAL_STORAGE_KEY, {
                    jobData,
                    jobSummaries,
                    exixtingJobIds,
                });
                return;
            }

            getJobListElements();

            const job = jobList[iter];

            const clickableTitle = job?.querySelector(TITLE_SELECTOR);
            if (clickableTitle) {
                const jobNo = page * jobs_per_page + iter + 1;
                clickableTitle.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
                click(clickableTitle);
                toastJobUpdate(jobNo, jobsSkipped);

                // Wait to avoid Code 429 before copying code
                await sleep(1000);

                // Run preFilters, collect data, and run textFilters
                // submit data to jobData var if filers pass
                const preFilter = checkFilters(options.preFilters);
                if (preFilter.pass) {
                    const {
                        companyName,
                        jobId,
                        summary,
                        text: jobText,
                        title,
                    } = await copyJob(job);

                    // Skip job if jobId has already been recorded.
                    if (exixtingJobIds.has(jobId)) {
                        filterJob(['Job ID Already Recorded']);
                    } else {
                        const textFilter = checkFilters(options.textFilters, jobText);
                        const titleFilter = checkFilters(options.titleFilters, title);
                        const companyFilter = checkFilters(options.companyFilters, companyName);
                        if (textFilter.pass && titleFilter.pass && companyFilter.pass) {
                            jobData += jobText;
                            jobSummaries.push(summary);
                            exixtingJobIds.add(jobId);
                        } else {
                            filterJob(
                                [
                                    ...textFilter.reasons,
                                    ...titleFilter.reasons,
                                    ...companyFilter.reasons,
                                ],
                                iter
                            );
                        }
                    }
                } else {
                    filterJob(preFilter.reasons, iter);
                }

                // Crawl Next Job on List
                if (iter < maxJobs) {
                    await sleep(2000);
                    processJob(iter + 1);
                } else {
                    next();
                }
                // Handle issue with page load.
            } else {
                reattempt(iter, attempt, { job });
            }
        }
        processJob();
    };

    const reset = (hard) => {
        return new Promise((resolve) => {
            if (hard) {
                jobData = '';
                jobSummaries = [];
                exixtingJobIds = new Set();
            }
            GM_setValue(LOCAL_STORAGE_KEY, LOCAL_DATA_DEFAULT);
            if (stopFunc.firstRun) {
                stopFunc = STOP_FUNC_DEFAULT;
                resolve();
            } else {
                // Flag for STOP
                stopFunc = {
                    flag: true,
                    resolve: (stoppedAt = 0) => {
                        stopFunc = { ...STOP_FUNC_DEFAULT, stoppedAt };
                        crawlerInProgress = false;
                        resolve();
                    },
                    firstRun: false,
                    stoppedAt: stopFunc.stoppedAt || 0,
                };
                // Reset Manually if enough time has passed.
                setTimeout(() => {
                    if (stopFunc.flag) {
                        stopFunc.resolve();
                    }
                }, 20000);
            }
        });
    };

    const hotKeys = {
        0: 'Help',
        1: 'Start crawler from begining',
        2: 'Copy job data to clipboard',
        3: 'Copy job summaries CSV to clipboard',
        'shift-3': 'Copy job summaries CSV to clipboard (without headers)',
        4: 'Resume a stopped crawl',
        5: 'Stop a crawl',
    };

    const describeHotKeys = () => {
        let description = 'Short Cuts:<br />';
        let first = true;
        for (let key in hotKeys) {
            if (first) {
                first = false;
            }
            description += `${key}: ${hotKeys[key]}<br />`;
        }
        return description;
    };

    const handleKeyPress = async (event) => {
        const altKey = event.altKey;
        const key = event.key.toLowerCase();
        if (altKey) {
            if (key === '1') {
                toast('Starting...');
                await reset(true);
                jobCollector();
            } else if (key === '2') {
                copyJobDataToClipboard();
            } else if (key === '3') {
                copyJobSummariesToClipboard();
            }
            // Shift 3 omits headers on CSV copied to clipboard
            else if (key === '#') {
                copyJobSummariesToClipboard(true);
            } else if (key === '4') {
                toast(`Resuming Crawl from Job: ${jobData.match(/=-=-=-=-=/g)?.length || 0}`);
                jobCollector();
            } else if (key === '5') {
                toast('Stopping Crawl...');
                await reset();
                toast('Crawl Terminated');
            } else if (key === '0') {
                toast(describeHotKeys(), 10000);
            }
        }
    };

    document.addEventListener('keydown', handleKeyPress, false);
})();
