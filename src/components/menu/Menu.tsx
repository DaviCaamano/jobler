import '@styles/themes/primary.css';
import '@styles/global.css';
import '@components/menu/Menu.css';
import { useRef, useState } from 'react';
import { SearchEngine } from '@interfaces/search-engine';
import { JobTableList } from '@interfaces/job-list';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { SearchEngineIcon } from '@components/search-engine-icon/SearchEngineIcon';
import { Filters } from '@components/filters/Filters';
import { Toggle } from '@components/shared/toggle/Toggle';
import { getSearchEngine } from '@utils/getSearchEngine';
import { getAssetUrl } from '@utils/getAssetUrl';
import { JobSummary } from '@utils/stores';
import titleLogo from '#logos/title.png';

const exampleJobs = [
    {
        applied: false,
        companyName: "Bob's Burgers",
        jobId: '3tgsgaghw',
        title: 'Frycook',
        url: 'https://bobs.burgers.com',
        source: SearchEngine.indeed,
    },
    {
        applied: true,
        companyName: "Lana Cain's Spy Agency",
        jobId: 'gdgdagaw',
        title: 'front-end developer',
        url: 'https://lana-cains.burgers.com',
        source: SearchEngine.linkedin,
    },
    {
        applied: false,
        companyName: "Patty's Pub",
        jobId: '32652632w',
        title: 'Charlie Worker',
        url: 'https://dicktowel.com',
        source: SearchEngine.ziprecruiter,
    },
];

const exampleJobList: JobSummary[] = [
    ...exampleJobs,
    ...exampleJobs,
    ...exampleJobs,
    ...exampleJobs,
];

export const Menu = () => {
    const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
    const engine = useRef<SearchEngine>(getSearchEngine(pageUrl).engine).current;
    const [jobList, setJobList] = useState<JobTableList>(JobTableList.jobList);

    if (engine === SearchEngine.none) {
        return null;
    }

    return (
        <div id="menu_menu">
            <div className="menu_title">
                <img src={getAssetUrl(titleLogo)} alt="jobler title" className="menu_logo" />
                <SearchEngineIcon searchEngine={engine} />
            </div>

            {jobList === JobTableList.jobList ? <JobList jobList={exampleJobList} /> : <Filters />}

            <div className="menu_toggle-container">
                <Toggle
                    setValue={setJobList}
                    values={{ on: JobTableList.filters, off: JobTableList.jobList }}
                    defaultValue={JobTableList.jobList}
                    labels={{ on: 'Filters', off: 'Job List' }}
                />
            </div>

            <Play />
        </div>
    );
};
