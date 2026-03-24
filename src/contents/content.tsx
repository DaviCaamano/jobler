import React from 'react';
import styles from '@/menu.module.css';
import { createRoot } from 'react-dom/client';
import { Menu } from '@/menu';

const container = document.createElement('div');
container.id = 'jobler-menu-root-container';
container.className = styles.menuContainer;
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Menu />);
