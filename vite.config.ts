import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

export default defineConfig({
    plugins: [react(), crx({ manifest })],
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'src/components'),
            '@backgrounds': resolve(__dirname, 'src/backgrounds'),
            '@constants': resolve(__dirname, 'src/constants'),
            '@contents': resolve(__dirname, 'src/contents'),
            '@hooks': resolve(__dirname, 'src/hooks'),
            '@interfaces': resolve(__dirname, 'src/interfaces'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@': resolve(__dirname, 'src'),
            '#icons': resolve(__dirname, 'assets/icons'),
        },
    },
    server: {
        cors: {
            origin: /^chrome-extension:\/\/.*/,
        },
    },
});
