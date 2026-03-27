import React from 'react';
import { createRoot } from 'react-dom/client';
import { Menu } from '@components/menu/Menu';

const rootEl = document.getElementById('root');

if (!rootEl) {
    throw new Error('Missing #root in menu.html');
}

createRoot(rootEl).render(<Menu />);
