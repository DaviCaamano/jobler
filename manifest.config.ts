import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
    manifest_version: 3,
    name: 'jobler',
    version: '0.0.0',
    permissions: ['activeTab', 'scripting', 'storage', 'unlimitedStorage'],
    description:
        'Job Crawler that reads your LinkedIn, ZipRecruiter, and Indeed search results, runs them through your filters, and turns what remains into an excel sheet.',
    icons: {
        '16': 'assets/icons/logos/logo 16.png',
        '32': 'assets/icons/logos/logo 32.png',
        '48': 'assets/icons/logos/logo 48.png',
        '128': 'assets/icons/logos/logo 128.png',
    },
    action: {
        default_title: 'Open Menu',
        default_icon: 'assets/icons/logos/logo 16.png',
    },
    background: {
        service_worker: 'src/backgrounds/message-listener.ts',
        type: 'module',
    },
    content_scripts: [
        {
            matches: [
                'https://www.indeed.com/*',
                'https://www.linkedin.com/*',
                'https://www.ziprecruiter.com/*',
                'https://dnd-binders.vercel.app/*',
            ],
            js: [
                'src/contents/menu-init.tsx',
                'src/contents/crawler-init.tsx',
                'src/contents/scripts/run-crawler',
            ],
        },
    ],
    web_accessible_resources: [
        {
            resources: ['src/views/menu.html', 'src/views/crawler.html', 'assets/*', 'assets/**/*'],
            matches: ['<all_urls>'],
        },
    ],
});
