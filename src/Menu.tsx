import '@/Menu.css';
import { useEffect, useRef, useState } from 'react';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { SearchEngineIcon } from '@components/SearchEngineIcon';
import { TabType } from '@interfaces/tab-messages';
import { SearchEngine } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { JobSummary } from '@interfaces/job-list';

const exampleJobList: JobSummary[] = [
    {
        companyName: "Bob's Burgers",
        url: 'https://bobs.burgers.com',
        title: 'Frycook',
    },
    {
        companyName: "Lana Cain's Spy Agency",
        url: 'https://lana-cains.burgers.com',
        title: 'front-end developer',
    },
    {
        companyName: "Patty's Pub",
        url: 'https://dicktowel.com',
        title: 'Charlie Worker',
    },
    {
        companyName: "Bob's Burgers",
        url: 'https://bobs.burgers.com',
        title: 'Frycook',
    },
    {
        companyName: "Lana Cain's Spy Agency",
        url: 'https://lana-cains.burgers.com',
        title: 'front-end developer',
    },
    {
        companyName: "Patty's Pub",
        url: 'https://dicktowel.com',
        title: 'Charlie Worker',
    },
    {
        companyName: "Bob's Burgers",
        url: 'https://bobs.burgers.com',
        title: 'Frycook',
    },
    {
        companyName: "Lana Cain's Spy Agency",
        url: 'https://lana-cains.burgers.com',
        title: 'front-end developer',
    },
    {
        companyName: "Patty's Pub",
        url: 'https://dicktowel.com',
        title: 'Charlie Worker',
    },
    {
        companyName: "Bob's Burgers",
        url: 'https://bobs.burgers.com',
        title: 'Frycook',
    },
    {
        companyName: "Lana Cain's Spy Agency",
        url: 'https://lana-cains.burgers.com',
        title: 'front-end developer',
    },
    {
        companyName: "Patty's Pub",
        url: 'https://dicktowel.com',
        title: 'Charlie Worker',
    },
];
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
        <div id="__jobler__menu_menu">
            <div className="__jobler__menu_title">
                Jobler <SearchEngineIcon searchEngine={engine} />
            </div>
            <JobList jobList={exampleJobList} />
            <Play />
        </div>
    );
};
