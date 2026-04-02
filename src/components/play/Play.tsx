import '@components/play/Play.css';
import { useState } from 'react';
import { LoaderCircle, Play as PlayIcon, Pause } from 'lucide-react';
import clsx from 'clsx';
import { ChromeMessage } from '@interfaces/tab-messages';
import { sendMessage } from '@utils/chrome/send-message';

interface PlayProps {
    crawlerActive: boolean;
    style?: React.CSSProperties;
}
export const Play = ({ crawlerActive, style }: PlayProps) => {
    const togglePause = async () => {
        void sendMessage(crawlerActive ? ChromeMessage.stopCrawler : ChromeMessage.startCrawler);
    };

    return (
        <div className="play_options-container" style={style}>
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
