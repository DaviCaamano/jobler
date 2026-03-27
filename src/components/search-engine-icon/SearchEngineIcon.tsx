import '@components/search-engine-icon/SearchEngineIcon.css';
import { SearchEngine } from '@interfaces/search-engine';
import linkedinLogo from '#icons/search-engines/linkedin.svg';
import ziprecruiterLogo from '#icons/search-engines/ziprecruiter.svg';
import indeedLogo from '#icons/search-engines/indeed.svg';

interface SearchEngineIconProps {
    searchEngine: SearchEngine;
}
export const SearchEngineIcon = ({ searchEngine }: SearchEngineIconProps) => {
    if (searchEngine === SearchEngine.indeed) {
        return (
            <div className="search-engine-icon_icon indeed-logo-container">
                <img src={indeedLogo} alt="indeed" className="indeed" />
            </div>
        );
    }
    if (searchEngine === SearchEngine.linkedin) {
        return (
            <div className="search-engine-icon_icon linkedin-logo-container">
                <img src={linkedinLogo} alt="linkedin" className="linkedin" />
            </div>
        );
    }
    if (searchEngine === SearchEngine.ziprecruiter) {
        return (
            <div className="search-engine-icon_icon ziprecruiter-logo-container">
                <img src={ziprecruiterLogo} alt="ziprecruiter" className="ziprecruiter" />
            </div>
        );
    }
    return null;
};
