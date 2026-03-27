import '@styles/themes/primary.css';
import '@styles/global.css';
import '@components/menu/Menu.css';
import { useEffect, useRef, useState } from 'react';
import { SearchEngine } from '@interfaces/search-engine';
import { JobTableList } from '@interfaces/job-list';
import { JobList } from '@components/job-list/JobList';
import { Play } from '@components/play/Play';
import { SearchEngineIcon } from '@components/search-engine-icon/SearchEngineIcon';
import { Filters } from '@components/filters/Filters';
import { Toggle } from '@components/shared/toggle/Toggle';
import { getSearchEngine } from '@utils/getSearchEngine';
import { getAssetUrl } from '@utils/getAssetUrl';
import titleLogo from '#logos/title.png';
import { jobStorage } from '@stores/job-summary.store';
import { JobSummary } from '@interfaces/job-list';

export const Menu = () => {
    const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
    const engine = useRef<SearchEngine>(getSearchEngine(pageUrl).engine).current;

    const [jobTable, setJobTable] = useState<JobTableList>(JobTableList.jobList);
    const [crawlerActive, setCrawlerActive] = useState<boolean>(false);
    const [jobList, setJobList] = useState<JobSummary[]>([]);

    useEffect(() => {
        void jobStorage.getAll().then(setJobList);
    }, []);

    if (engine === SearchEngine.none) {
        return null;
    }

    return (
        <div id="menu_menu">
            <div className="menu_title">
                <img src={getAssetUrl(titleLogo)} alt="jobler title" className="menu_logo" />
                <SearchEngineIcon searchEngine={engine} />
            </div>

            {jobTable === JobTableList.jobList ? (
                <JobList jobList={jobList} crawlerActive={crawlerActive} />
            ) : (
                <Filters />
            )}

            <div className="menu_toggle-container">
                <Toggle
                    setValue={setJobTable}
                    values={{ on: JobTableList.filters, off: JobTableList.jobList }}
                    defaultValue={JobTableList.jobList}
                    labels={{ on: 'Filters', off: 'Job List' }}
                />
            </div>

            <Play crawlerActive={crawlerActive} setCrawlerActive={setCrawlerActive} />
        </div>
    );
};
