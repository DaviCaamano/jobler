import React from 'react';
import '@styles/root.css';
import { createRoot } from 'react-dom/client';
import { Menu } from '@/Menu';

const container = document.createElement('div');
container.id = 'jobler-menu-root-container';
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Menu />);
