import { storage } from '@utils/chrome/storage';
import { Stores } from '@interfaces/store';
import { FilterGroupSettings, Settings, SettingsOptions, Tabs } from '@interfaces/settings';

type GetSettings = {
    (): Promise<Settings>;
    (store: SettingsOptions.filters): Promise<FilterGroupSettings>;
    (store: SettingsOptions.tabs): Promise<Tabs>;
};

type UpdateSettings = {
    (store: SettingsOptions.filters, value: FilterGroupSettings): Promise<Settings>;
    (store: SettingsOptions.tabs, value: Tabs): Promise<Settings>;
};

interface SettingStore {
    get: GetSettings;
    update: UpdateSettings;
}

async function getSettings(): Promise<Settings>;
async function getSettings(store: SettingsOptions.filters): Promise<FilterGroupSettings>;
async function getSettings(store: SettingsOptions.tabs): Promise<Tabs>;
async function getSettings(
    store?: SettingsOptions
): Promise<Settings | FilterGroupSettings | Tabs> {
    const settings = await storage.get(Stores.settings);

    if (store === undefined) {
        return settings as Settings;
    }

    if (store === SettingsOptions.filters) {
        return settings[SettingsOptions.filters] as FilterGroupSettings;
    }

    if (store === SettingsOptions.tabs) {
        return settings[SettingsOptions.tabs] as Tabs;
    }

    throw new Error(`Unsupported settings key: ${store}`);
}

async function updateSettings(
    store: SettingsOptions.filters,
    value: FilterGroupSettings
): Promise<Settings>;
async function updateSettings(store: SettingsOptions.tabs, value: Tabs): Promise<Settings>;
async function updateSettings(
    store: SettingsOptions.filters | SettingsOptions.tabs,
    value: FilterGroupSettings | Tabs
): Promise<Settings> {
    return storage.patch(Stores.settings, (currentSettings) => {
        switch (store) {
            case SettingsOptions.filters:
                return {
                    ...currentSettings,
                    [SettingsOptions.filters]: {
                        ...currentSettings[SettingsOptions.filters],
                        ...(value as FilterGroupSettings),
                    },
                };

            case SettingsOptions.tabs:
                return {
                    ...currentSettings,
                    [SettingsOptions.tabs]: value as Tabs,
                };

            default:
                return currentSettings;
        }
    });
}

export const settingsStore: SettingStore = {
    get: getSettings,
    update: updateSettings,
};
