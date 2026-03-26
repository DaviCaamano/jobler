import '@components/play/Play.css';
import { SearchEngine } from '@interfaces/search-engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import ziprecruiterLogo from '#icons/search-engines/ziprecruiter.svg';
import indeedLogo from '#icons/search-engines/indeed.svg';

interface SearchEngineIconProps {
    searchEngine: SearchEngine;
}
export const SearchEngineIcon = ({ searchEngine }: SearchEngineIconProps) => {
    if (searchEngine === SearchEngine.indeed) {
        return (
            <div className="play_icon indeed-logo-container">
                <img src={indeedLogo} alt="indeed" className="indeed" />
            </div>
        );
    }
    if (searchEngine === SearchEngine.linkedin) {
        return (
            <div className="play_icon linkedin-logo-container">
                <FontAwesomeIcon icon={faLinkedin} className="linkedin" />
            </div>
        );
    }
    if (searchEngine === SearchEngine.ziprecruiter) {
        return (
            <div className="play_icon ziprecruiter-logo-container">
                <img src={ziprecruiterLogo} alt="ziprecruiter" className="ziprecruiter" />
            </div>
        );
    }
    return null;
};
