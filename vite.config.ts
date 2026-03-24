import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
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
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
            input: resolve(__dirname, 'src/contents/content.tsx'),
            output: {
                entryFileNames: 'content.js',
                format: 'iife',
                inlineDynamicImports: true,
            },
        },
        minify: false,
    },
});
