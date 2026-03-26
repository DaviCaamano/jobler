import '@components/play/Play.css';
import { faCircleNotch, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useRef, useState } from 'react';

export const Play = () => {
    const [paused, setPaused] = useState<boolean>(false);
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

    const buttonClass =
        `play_play-button ${paused ? 'paused' : ''}` +
        ` ${recentlyClicked ? 'recently-clicked' : ''}`;
    const pausedButtonClass =
        `play_icon ${hovered ? 'hovered' : ''}` + ` ${recentlyClicked ? 'recently-clicked' : ''}`;
    return (
        <button
            className={buttonClass}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {paused ? (
                <>
                    <FontAwesomeIcon icon={faCircleNotch} className={pausedButtonClass} spin />
                    {hovered && !recentlyClicked && (
                        <FontAwesomeIcon icon={faPause} className="pause-icon" />
                    )}
                </>
            ) : (
                <FontAwesomeIcon icon={faPlay} className="play_icon" />
            )}
        </button>
    );
};
