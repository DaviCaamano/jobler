import React from 'react';
import { createRoot } from 'react-dom/client';
import { Crawler } from '@components/crawler/crawler';

const root = document.getElementById('__jobler__crawler-root');

if (!root) {
    throw new Error('Missing #root in menu.html');
}

createRoot(root).render(<Crawler />);
