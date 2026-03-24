import '@components/play/Play.css';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export const Play = () => {
    const [paused, setPaused] = useState<boolean>(false);
    const togglePause = () => setPaused(!paused);

    return (
        <div className="__jobler__play_options-container">
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
        <button
            className={`__jobler__play_play-button ${paused ? 'paused' : ''}`}
            onClick={callback}
        >
            <FontAwesomeIcon icon={paused ? faPause : faPlay} className="__jobler__play_icon" />
        </button>
    );
};
