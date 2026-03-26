import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Menu } from '@components/menu/Menu';

const CONTAINER_ID = 'jobler-menu-root-container';
const IFRAME_ID = 'jobler-menu-iframe';

const existingContainer = document.getElementById(CONTAINER_ID);
if (existingContainer) {
    existingContainer.remove();
}

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

container.appendChild(iframe);
document.body.appendChild(container);

let opened = false;
let mounted = false;
let reactRoot: Root | null = null;

const copyStylesToIframe = (iframeDoc: Document) => {
    const parentHead = document.head;
    const iframeHead = iframeDoc.head;

    if (!parentHead || !iframeHead) return;

    const styleNodes = parentHead.querySelectorAll('style, link[rel="stylesheet"]');

    styleNodes.forEach((node) => {
        iframeHead.appendChild(node.cloneNode(true));
    });
};

const mountIntoIframe = () => {
    if (mounted) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
        <!doctype html>
        <html style="font-size: 10px;">
            <head>
                <meta charset="UTF-8" />
                <title>Jobler</title>
                <style>
                    html,
                    body,
                    #root {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 535px;
                        background: transparent;
                    }

                    * {
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>
    `);
    doc.close();

    copyStylesToIframe(doc);

    const rootEl = doc.getElementById('root');
    if (!rootEl) {
        throw new Error('Missing #root in iframe document');
    }

    reactRoot = createRoot(rootEl);
    reactRoot.render(<Menu />);
    mounted = true;
};

iframe.addEventListener('load', mountIntoIframe);
iframe.src = 'about:blank';

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'iconClicked') {
        if (!mounted) {
            mountIntoIframe();
        }

        opened = !opened;
        container.style.display = opened ? 'block' : 'none';
    }
});
