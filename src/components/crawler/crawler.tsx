import '@styles/global.css';
import '@styles/themes/primary.css';
import '@components/crawler/crawler.css';
import { ToastLog } from '@components/crawler/toast/ToastLog';
import { Play } from '@components/play/Play';
import { useStorage } from '@hooks/useStorage';
import { Stores } from '@interfaces/store';
import { Crawler as ICrawler, CrawlerProgress } from '@interfaces/crawler/crawler';
import { useState } from 'react';
import { crawlerProgressDefaults } from '@utils/chrome/storage';
import { SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';

export const Crawler = () => {
    const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
    const [engine] = useState<SupportedEngines>(
        () => getSearchEngine(pageUrl).engine as SupportedEngines
    );

    const [crawler, setCrawler] = useState<CrawlerProgress>(crawlerProgressDefaults);

    useStorage(Stores.crawler, (changes: Partial<ICrawler>) => {
        if (engine && changes[engine]) {
            setCrawler((prevState) => ({
                ...prevState,
                ...changes[engine],
            }));
        }
    });
    return (
        <div className="crawler_popup">
            <div className="crawler_header">
                <div>
                    <p className="crawler_eyebrow">Crawler Status</p>
                    <h2 className="crawler_title">{crawler.isRunning ? 'Running' : 'Paused'}</h2>
                </div>
            </div>

            <div className="crawler_current">
                <p className="crawler_label">Current Post</p>
                <p className="crawler_job-title">{crawler.currentTitle}</p>
                <p className="crawler_company">{crawler.currentCompany}</p>
            </div>

            <div className="crawler_stats">
                <div className="crawler_stat-card">
                    <p className="crawler_label">Processed</p>
                    <p className="crawler_value">{crawler.processedCount}</p>
                </div>

                <div className="crawler_stat-card">
                    <p className="crawler_label">Skipped</p>
                    <p className="crawler_value">{crawler.skippedCount}</p>
                </div>
            </div>

            <div className="crawler_timing">
                <div className="crawler_timing-row">
                    <span className="crawler_label">Elapsed</span>
                    <span className="crawler_timing-value">{crawler.elapsedTime}</span>
                </div>

                <div className="crawler_timing-row">
                    <span className="crawler_label">Remaining</span>
                    <span className="crawler_timing-value">{crawler.remainingTime}</span>
                </div>
            </div>

            <div className="crawler_progress">
                <div className="crawler_progress-bar">
                    <div className="crawler_progress-fill" />
                </div>
            </div>

            <ToastLog />

            <Play
                crawlerActive={true}
                setCrawlerActive={() => {}}
                style={{ left: 'unset', right: '2rem', transform: 'unset' }}
            />
        </div>
    );
};
