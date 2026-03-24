import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
    manifest_version: 3,
    name: 'jobler',
    version: '0.0.0',
    permissions: ['activeTab', 'scripting'],
    description:
        'Job Crawler that reads your LinkedIn, Ziprecruiter, and Indeed search results, runs them through your filters, and turns what remains into an excel sheet.',
    icons: {
        '16': 'assets/icons/logo/logo 16.png',
        '32': 'assets/icons/logo/logo 32.png',
        '48': 'assets/icons/logo/logo 48.png',
        '128': 'assets/icons/logo/logo 128.png',
    },
    action: {
        default_title: 'Open Menu',
        default_icon: 'assets/icons/logo/logo 16.png',
    },
    background: {
        service_worker: 'src/backgrounds/background.ts',
        type: 'module',
    },
    content_scripts: [
        {
            matches: [
                'https://www.indeed.com/*',
                'https://www.linkedin.com/*',
                'https://www.ziprecruiter.com/*',
            ],
            js: ['src/contents/content.tsx'],
        },
    ],
});
