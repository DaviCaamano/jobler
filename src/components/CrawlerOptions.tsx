import styles from './CrawlerOptions.module.css';
import { SearchEngine } from '@interfaces/search-engine-type';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface CrawlerOptionsProps {
    engine: SearchEngine
}
export const CrawlerOptions = () => {
    const [paused, setPaused] = useState<boolean>(false);
    const togglePause = () => setPaused(!paused);

    return (
        <div className={styles.optionsContainer}>
            <PlayButton paused={paused} callback={togglePause} />
        </div>
    );
};

interface PlayButtonProps {
    callback?: React.MouseEventHandler<HTMLButtonElement>;
    paused: boolean;
}
const PlayButton = ({ callback, paused }: PlayButtonProps) => {
    return (
        <button className={`${styles.playButton} ${paused ? styles.paused: ''}`} onClick={callback}>
            {paused ? (
                <FontAwesomeIcon icon={faPause} className={styles.playIcon} />
            ) : (
                <FontAwesomeIcon icon={faPlay} className={styles.playIcon} />
            )}
        </button>
    );
};
