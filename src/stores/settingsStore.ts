import { storage } from '@utils/chrome/storage';
import { Stores } from '@interfaces/store';
import { FilterGroupSettings, SettingsOptions } from '@interfaces/settings';

export type SettingsValueMap = {
    [SettingsOptions.filters]: FilterGroupSettings;
};

export const settingsStore = {
    async getSettings(store?: SettingsOptions) {
        const settings = await storage.get(Stores.settings);
        if (!store) {
            return settings;
        }
        return settings[store];
    },

    async update<K extends SettingsOptions>(store: K, value: SettingsValueMap[K]) {
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

                default:
                    return currentSettings;
            }
        });
    },
};
