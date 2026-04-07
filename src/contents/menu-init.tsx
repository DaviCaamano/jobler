import { ChromeMessage, ChromeMessagePayload } from '@interfaces/tab-messages';

const CONTAINER_ID = 'jobler-menu-root-container';
const IFRAME_ID = 'jobler-menu-iframe';

document.getElementById(CONTAINER_ID)?.remove();

const container = document.createElement('div');
container.id = CONTAINER_ID;

Object.assign(container.style, {
    position: 'fixed',
    top: '130px',
    right: '20px',
    width: '400px',
    height: '600px',
    zIndex: '1000000',
    display: 'none',
});

const iframe = document.createElement('iframe');
iframe.id = IFRAME_ID;

Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: '0',
    background: 'transparent',
});

const pageUrl = encodeURIComponent(window.location.href);
iframe.src = `${chrome.runtime.getURL('src/views/menu.html')}?pageUrl=${pageUrl}`;

container.appendChild(iframe);
document.body.appendChild(container);

let opened = false;

chrome.runtime.onMessage.addListener((message: ChromeMessagePayload) => {
    if (message.type === ChromeMessage.toggleMenu) {
        opened = !opened;
        container.style.display = opened ? 'block' : 'none';
    }
    if (message.type === ChromeMessage.startCrawler) {
        opened = false;
        container.style.display = 'none';
    }
    if (
        message.type === ChromeMessage.stopCrawler ||
        message.type === ChromeMessage.crawlerFinished
    ) {
        opened = true;
        container.style.display = 'block';
    }
});
