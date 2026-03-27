import '@components/play/Play.css';
import { useState } from 'react';
import { LoaderCircle, Play as PlayIcon, Pause } from 'lucide-react';
import clsx from 'clsx';
import { Setter } from '@interfaces/react-state';

interface PlayProps {
    crawlerActive: boolean;
    setCrawlerActive: Setter<boolean>;
}
export const Play = ({ crawlerActive, setCrawlerActive }: PlayProps) => {
    const togglePause = () => setCrawlerActive(!crawlerActive);

    return (
        <div className="play_options-container">
            <PlayButton crawlerActive={crawlerActive} callback={togglePause} />
        </div>
    );
};

interface PlayButtonProps {
    callback: React.MouseEventHandler<HTMLButtonElement>;
    crawlerActive: boolean;
}
const PlayButton = ({ callback, crawlerActive }: PlayButtonProps) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const [recentlyClicked, setRecentlyClicked] = useState<boolean>(false);
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setRecentlyClicked(true);
        callback(event);
    };

    const onMouseLeave = () => {
        setHovered(false);
        if (recentlyClicked) {
            setRecentlyClicked(false);
        }
    };

    return (
        <button
            className="play_play-button button-lighting"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {crawlerActive ? (
                <>
                    <LoaderCircle
                        className={clsx(
                            `play_load-icon spin`,
                            { hovered },
                            recentlyClicked && 'recently-clicked'
                        )}
                        strokeWidth={2}
                    />
                    {hovered && !recentlyClicked && (
                        <Pause className="play_pause-icon lucide-solid" />
                    )}
                </>
            ) : (
                <PlayIcon className="play_icon lucide-solid" />
            )}
        </button>
    );
};
