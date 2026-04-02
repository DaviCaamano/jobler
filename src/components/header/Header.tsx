import '@components/header/Header.css';
import { SearchEngineIcon } from '@components/search-engine-icon/SearchEngineIcon';
import { SearchEngine } from '@interfaces/search-engine';
import titleLogo from '#logos/title.png';
import { getAssetUrl } from '@utils/getAssetUrl';
import { CircleX } from 'lucide-react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ChromeMessage } from '@interfaces/tab-messages';
import { sendMessage } from '@utils/chrome/send-message';

interface HeaderProps {
    engine: SearchEngine;
}
export const Header = ({ engine }: HeaderProps) => {
    return (
        <div className="header_header">
            <div className="header_left-side-container">
                <img src={getAssetUrl(titleLogo)} alt="jobler title" className="header_logo" />
            </div>
            <div className="header_right-side-container">
                <SearchEngineIcon searchEngine={engine} />
                <HeaderIcons />
            </div>
        </div>
    );
};

const HeaderIcons = () => {
    const [hovered, setHovered] = useState<boolean>(true);

    const onClose = async () => {
        try {
            void sendMessage(ChromeMessage.toggleMenu);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    return (
        <div className="header_icon-container">
            <div
                onMouseLeave={() => setHovered(false)}
                onMouseEnter={() => setHovered(true)}
                onClick={onClose}
            >
                {hovered ? (
                    <CircleX className="header_close-button circle-x" />
                ) : (
                    <X className="header_close-button x" strokeWidth={3} />
                )}
            </div>
        </div>
    );
};
