import '@components/menu/JobTable.css';
import { CSSProperties, PropsWithChildren } from 'react';

interface JobTableProps extends PropsWithChildren {
    style?: CSSProperties;
}
export const JobTable = ({ children, style }: JobTableProps) => {
    return (
        <div id={'job-list_container'} style={style}>
            <div id={'job-list_job-table'}>{children}</div>
        </div>
    );
};
