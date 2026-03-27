import '@components/play/Play.css';
import { useState } from 'react';
import { LoaderCircle, Play as PlayIcon, Pause } from 'lucide-react';
import clsx from 'clsx';

export const Play = () => {
    const [paused, setPaused] = useState<boolean>(true);
    const togglePause = () => setPaused(!paused);

    return (
        <div className="play_options-container">
            <PlayButton paused={paused} callback={togglePause} />
        </div>
    );
};

interface PlayButtonProps {
    callback: React.MouseEventHandler<HTMLButtonElement>;
    paused: boolean;
}
const PlayButton = ({ callback, paused }: PlayButtonProps) => {
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
            {paused ? (
                <PlayIcon className="play_icon lucide-solid" />
            ) : (
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
            )}
        </button>
    );
};
