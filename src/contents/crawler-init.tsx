import { ChromeMessage } from '@interfaces/tab-messages';

const CONTAINER_ID = 'jobler-crawler-root-container';
const IFRAME_ID = 'jobler-crawler-iframe';

document.getElementById(CONTAINER_ID)?.remove();

const container = document.createElement('div');
container.id = CONTAINER_ID;

Object.assign(container.style, {
    position: 'fixed',
    top: '130px',
    left: '50%',
    transform: 'translateX(-50%)',
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
iframe.src = `${chrome.runtime.getURL('src/views/crawler.html')}?pageUrl=${pageUrl}`;

container.appendChild(iframe);
document.body.appendChild(container);

chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message in crawler-init:', message);
    if (message.type === ChromeMessage.startCrawler) {
        // Starting crawler
        container.style.display = 'block';
    }
    if (message.type === ChromeMessage.stopCrawler) {
        // Stopping crawler
        container.style.display = 'none';
    }
});
