import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

export default defineConfig({
    plugins: [react(), crx({ manifest })],
    resolve: {
        alias: {
            '@backgrounds': resolve(__dirname, 'src/backgrounds'),
            '@components': resolve(__dirname, 'src/components'),
            '@constants': resolve(__dirname, 'src/constants'),
            '@contents': resolve(__dirname, 'src/contents'),
            '@hooks': resolve(__dirname, 'src/hooks'),
            '@interfaces': resolve(__dirname, 'src/interfaces'),
            '@stores': resolve(__dirname, 'src/stores'),
            '@styles': resolve(__dirname, 'src/styles'),
            '@utils': resolve(__dirname, 'src/utils'),
            '#icons': resolve(__dirname, 'assets/icons'),
            '#logos': resolve(__dirname, 'assets/logos'),
            '#': resolve(__dirname, 'assets/'),
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        cors: {
            origin: /^chrome-extension:\/\/.*/,
        },
    },
    build: {
        rollupOptions: {
            input: {
                menu: resolve(__dirname, 'menu.html'),
            },
        },
    },
});
