import '@components/menu/JobTable.css';
import { CSSProperties, PropsWithChildren } from 'react';

interface JobTableProps extends PropsWithChildren {
    style?: CSSProperties;
}
export const JobTable = ({ children, style }: JobTableProps) => {
    return (
        <div id={'__jobler__job-list_container'} style={style}>
            <div id={'__jobler__job-list_job-table'}>{children}</div>
        </div>
    );
};
