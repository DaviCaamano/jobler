import '@components/menu/menu.css';
import '@styles/themes/primary.css';
import { useRef, useState } from 'react';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { SearchEngineIcon } from '@components/SearchEngineIcon';
import { SearchEngine } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { JobTableList } from '@interfaces/job-list';
import titleLogo from '#logos/title.png';
import { getAssetUrl } from '@utils/getAssetUrl';
import { JobListOptions } from '@components/job-list/JobListOptions';
import { useToggleMenu } from '@components/menu/useToggleMenu';
import { JobTable } from '@components/menu/JobTable';
import { Filters } from '@components/filters/Filters';
import { Toggle } from '@components/shared/toggle/Toggle';
import { JobSummary } from '@utils/stores';

const exampleJobs = [
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
const exampleJobList: JobSummary[] = [
    ...exampleJobs,
    ...exampleJobs,
    ...exampleJobs,
    ...exampleJobs,
];

export const Menu = () => {
    const opened = useToggleMenu();
    const engine = useRef<SearchEngine>(getSearchEngine()).current;
    const [jobList, setJobList] = useState<JobTableList>(JobTableList.jobList);

    if (!opened || engine === SearchEngine.none) {
        return null;
    }

    return (
        <div id="__jobler__menu_menu">
            <div className="__jobler__menu_title">
                <img
                    src={getAssetUrl(titleLogo)}
                    alt="jobler title"
                    className="__jobler__menu_logo"
                />
                <SearchEngineIcon searchEngine={engine} />
            </div>
            {jobList === JobTableList.jobList ? <JobList jobList={exampleJobList} /> : <Filters />}
            <div className="__jobler__menu_toggle-container">
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
