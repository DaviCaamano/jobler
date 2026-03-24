// src/utils/getAssetUrl.ts
export const getAssetUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return chrome.runtime.getURL(normalizedPath);
};
