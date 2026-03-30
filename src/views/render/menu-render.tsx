import React from 'react';
import { createRoot } from 'react-dom/client';
import { Menu } from '@components/menu/Menu';

const root = document.getElementById('__jobler__menu-root');

if (!root) {
    throw new Error('Missing #root in menu.html');
}

createRoot(root).render(<Menu />);
