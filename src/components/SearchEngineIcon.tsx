import styles from '@components/CrawlerOptions.module.css';

import { SearchEngine } from '@interfaces/search-engine-type';
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
            <div className={`${styles.icon} ${styles.indeedLogoContainer}`}>
                <img src={indeedLogo} alt="indeed" className={styles.indeed} />
            </div>
        );
    }
    if (searchEngine === SearchEngine.linkedin) {
        return (
            <div className={`${styles.icon} ${styles.linkedinLogoContainer}`}>
                <FontAwesomeIcon icon={faLinkedin} className={styles.linkedin} />
            </div>
        );
    }
    if (searchEngine === SearchEngine.ziprecruiter) {
        return (
            <div className={`${styles.icon} ${styles.ziprecruiterLogoContainer}`}>
                <img src={ziprecruiterLogo} alt="ziprecruiter" className={styles.ziprecruiter} />
            </div>
        );
    }
    return null;
};
