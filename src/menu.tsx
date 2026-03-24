import styles from '@/menu.module.css';
import { useEffect, useRef, useState } from 'react';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { SearchEngineIcon } from '@components/SearchEngineIcon';
import { TabType } from '@interfaces/tab-messages';
import { SearchEngine } from '@interfaces/search-engine-type';
import { getSearchEngine } from '@utils/getSearchEngine';

export const Menu = () => {
    const [opened, setOpened] = useState(false);
    const engine = useRef<SearchEngine>(getSearchEngine()).current;

    useEffect(() => {
        const listener = (message: any) => {
            if (message.type === TabType.iconClicked) {
                setOpened((prev) => !prev);
            }
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    if (!opened || engine === SearchEngine.none) {
        return null;
    }
    return (
        <div id="jobler-menu" className={styles.menu}>
            <div className={styles.title}>
                Jobler <SearchEngineIcon searchEngine={engine} />
            </div>
            <Play />
            <JobList />
        </div>
    );
};
