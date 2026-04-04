import '@styles/global.css';
import '@styles/themes/primary.css';
import '@components/crawler/crawler.css';
import { ToastLog } from '@components/crawler/toast/ToastLog';
import { Play } from '@components/play/Play';
import { useEffect, useState } from 'react';
import { SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { CrawlerProgress, EngineCrawlerState } from '@interfaces/crawler/crawler';
import { crawlerStorage } from '@stores/crawler.store';
import { createCrawler, getCrawlerProgress } from '@utils/crawler/crawlerProgress';
import { ChromeMessage } from '@interfaces/tab-messages';

export const Crawler = () => {
    const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
    const [engine] = useState<SupportedEngines>(
        () => getSearchEngine(pageUrl).engine as SupportedEngines
    );

    const [progress, setProgress] = useState<CrawlerProgress | null>(null);

    // initialize crawler & synchronize with state
    useEffect(() => {
        void crawlerStorage.get(engine).then((engineCrawlerState: EngineCrawlerState) => {
            void createCrawler(engineCrawlerState).then(getCrawlerProgress).then(setProgress);
        });
    }, [engine]);

    // Update progress state whenever a progress message is emitted
    useEffect(() => {
        const progressUpdateListener = (message: {
            type?: ChromeMessage;
            data?: { progress: CrawlerProgress };
        }) => {
            if (message.type !== ChromeMessage.crawlerProgress || !message.data) return;
            setProgress(message.data.progress);
        };

        chrome.runtime.onMessage.addListener(progressUpdateListener);

        return () => {
            chrome.runtime.onMessage.removeListener(progressUpdateListener);
        };
    }, []);

    return (
        <div className="crawler_popup">
            <div className="crawler_header">
                <div>
                    <p className="crawler_eyebrow">Crawler Status</p>
                    <h2 className="crawler_title">{progress?.isRunning ? 'Running' : 'Paused'}</h2>
                </div>
            </div>

            <div className="crawler_stats">
                <div className="crawler_stat-card">
                    <p className="crawler_label">Processed</p>
                    <p className="crawler_value">{progress?.processedCount}</p>
                </div>

                <div className="crawler_stat-card">
                    <p className="crawler_label">Skipped</p>
                    <p className="crawler_value">{progress?.skippedCount}</p>
                </div>
            </div>

            <div className="crawler_timing">
                <div className="crawler_timing-row">
                    <span className="crawler_label">Elapsed</span>
                    <span className="crawler_timing-value">{progress?.elapsedTime}</span>
                </div>

                <div className="crawler_timing-row">
                    <span className="crawler_label">Remaining</span>
                    <span className="crawler_timing-value">{progress?.remainingTime}</span>
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
                style={{ left: 'unset', right: '2rem', transform: 'unset' }}
            />
        </div>
    );
};
