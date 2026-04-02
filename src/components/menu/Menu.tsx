import '@styles/themes/primary.css';
import '@styles/global.css';
import '@components/menu/Menu.css';
import { useEffect, useRef, useState } from 'react';
import { SearchEngine } from '@interfaces/search-engine';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { Filters } from '@components/filters/Filters';
import { Toggle } from '@components/shared/toggle/Toggle';
import { getSearchEngine } from '@utils/getSearchEngine';
import { jobStorage } from '@stores/job-summary.store';
import { JobSummary } from '@interfaces/job-list';
import { useSettingStorage } from '@hooks/useStorage';
import { Settings, SettingsOptions, Tabs } from '@interfaces/settings';
import { storage } from '@stores/storage';
import { Stores } from '@interfaces/store';
import { Header } from '@components/header/Header';
import { ChromeMessage } from '@interfaces/tab-messages';

export const Menu = () => {
    const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
    const engine = useRef<SearchEngine>(getSearchEngine(pageUrl).engine).current;

    const [tab, setTab] = useState<Tabs>(Tabs.jobList);
    const [crawlerActive, setCrawlerActive] = useState<boolean>(false);
    const [jobList, setJobList] = useState<JobSummary[]>([]);

    useEffect(() => {
        void jobStorage.getAll().then(setJobList);
    }, []);

    useSettingStorage(SettingsOptions.tabs, async (changes: Partial<Settings>) => {
        const changedTab = changes?.[SettingsOptions.tabs];
        if (changedTab) {
            setTab(changedTab);
        }
    });

    useEffect(() => {
        const handleCrawlerEvents = (event: { type: ChromeMessage }) => {
            if (event?.type === ChromeMessage.stopCrawler) {
                setCrawlerActive(false);
            } else if (event?.type === ChromeMessage.startCrawler) {
                setCrawlerActive(true);
            }
        };

        chrome.runtime.onMessage.addListener(handleCrawlerEvents);

        return () => {
            chrome.runtime.onMessage.removeListener(handleCrawlerEvents);
        };
    }, []);

    const onTabChange = (newTab: Tabs) => {
        storage.patch(Stores.settings, (currentValue: Settings) => {
            return {
                ...currentValue,
                [SettingsOptions.tabs]: newTab,
            };
        });
    };

    if (engine === SearchEngine.none) {
        return null;
    }

    return (
        <div id="menu_menu">
            <Header engine={engine} />
            <JobList jobList={jobList} show={tab === Tabs.jobList} crawlerActive={crawlerActive} />
            <Filters show={tab === Tabs.filters} />
            <div className="menu_toggle-container">
                <Toggle
                    setValue={onTabChange}
                    values={{ on: Tabs.filters, off: Tabs.jobList }}
                    value={tab}
                    labels={{ on: 'Filters', off: 'Job List' }}
                />
            </div>
            <Play crawlerActive={crawlerActive} />
        </div>
    );
};
