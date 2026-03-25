import '@components/menu/JobTable.css';
import { PropsWithChildren } from 'react';

export const JobTable = ({ children }: PropsWithChildren) => {
    return (
        <div id={'__jobler__job-list_container'}>
            <div id={'__jobler__job-list_job-table'}>{children}</div>
        </div>
    );
};
