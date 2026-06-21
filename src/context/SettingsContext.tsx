import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteCookie, getCookie } from '@/lib/cookies';
import { persistentStorage, sessionSecureStorage } from '@/lib/browserStorage';

export type GeneticsType =
    | 'Auto'
    | 'Feminizada'
    | 'Tomato'
    | 'Pepper'
    | 'Aloe'
    | 'Papaya'
    | 'Mango'
    | 'Basil'
    | 'Mint'
    | 'Lavender'
    | 'Rosemary'
    | 'Lemon'
    | 'Strawberry'
    | 'Potato'
    | 'Lettuce'
    | 'Cucumber'
    | 'Zucchini'
    | 'Watermelon'
    | 'Onion'
    | 'Garlic'
    | 'SweetPotato'
    | 'Parsley'
    | 'PepperCommon'
    | 'PepperItalian'
    | 'PepperPadron';

export const ALERT_THRESHOLDS_BY_PLANT: Record<GeneticsType, {
    wind: number;
    maxTemp: number;
    minTemp: number;
    uv: number;
    rain: number;
}> = {
    Auto:       { wind: 45, maxTemp: 33, minTemp: 11, uv: 8,  rain: 12 },
    Feminizada: { wind: 50, maxTemp: 34, minTemp: 10, uv: 9,  rain: 14 },
    Tomato:     { wind: 45, maxTemp: 32, minTemp: 10, uv: 9,  rain: 16 },
    Pepper:     { wind: 40, maxTemp: 33, minTemp: 13, uv: 9,  rain: 14 },
    Aloe:       { wind: 60, maxTemp: 38, minTemp: 6,  uv: 11, rain: 24 },
    Papaya:     { wind: 35, maxTemp: 34, minTemp: 16, uv: 9,  rain: 18 },
    Mango:      { wind: 40, maxTemp: 36, minTemp: 12, uv: 10, rain: 20 },
    Basil:      { wind: 35, maxTemp: 31, minTemp: 12, uv: 8,  rain: 12 },
    Mint:       { wind: 40, maxTemp: 30, minTemp: 8,  uv: 8,  rain: 14 },
    Lavender:   { wind: 55, maxTemp: 35, minTemp: 5,  uv: 10, rain: 22 },
    Rosemary:   { wind: 55, maxTemp: 35, minTemp: 4,  uv: 10, rain: 20 },
    Lemon:      { wind: 40, maxTemp: 34, minTemp: 4,  uv: 10, rain: 18 },
    Strawberry: { wind: 35, maxTemp: 30, minTemp: 6,  uv: 8,  rain: 12 },
    Potato:     { wind: 45, maxTemp: 29, minTemp: 4,  uv: 8,  rain: 18 },
    Lettuce:    { wind: 35, maxTemp: 27, minTemp: 5,  uv: 7,  rain: 12 },
    Cucumber:     { wind: 40, maxTemp: 32, minTemp: 12, uv: 9,  rain: 18 },
    Zucchini:     { wind: 45, maxTemp: 33, minTemp: 10, uv: 9,  rain: 20 },
    Watermelon:   { wind: 40, maxTemp: 35, minTemp: 15, uv: 10, rain: 15 },
    Onion:        { wind: 50, maxTemp: 30, minTemp: 5,  uv: 9,  rain: 12 },
    Garlic:       { wind: 50, maxTemp: 28, minTemp: 3,  uv: 8,  rain: 10 },
    SweetPotato:  { wind: 45, maxTemp: 35, minTemp: 15, uv: 9,  rain: 20 },
    Parsley:      { wind: 35, maxTemp: 28, minTemp: 5,  uv: 8,  rain: 14 },
    PepperCommon: { wind: 40, maxTemp: 33, minTemp: 13, uv: 9,  rain: 14 },
    PepperItalian:{ wind: 40, maxTemp: 33, minTemp: 13, uv: 9,  rain: 14 },
    PepperPadron: { wind: 40, maxTemp: 33, minTemp: 13, uv: 9,  rain: 12 },
};

interface SettingsState {
    genetics: GeneticsType;
    sowDate: string | null;
    telegramChatId: string;
    latitude: number;
    longitude: number;
    locationName: string;
    alertWindThreshold: number;
    alertMaxTempThreshold: number;
    alertMinTempThreshold: number;
    alertUvThreshold: number;
    alertRainThreshold: number;
    timezone: string;
}

interface PersistedSettings {
    genetics: GeneticsType;
    sowDate: string | null;
    latitude: number;
    longitude: number;
    locationName: string;
    alertWindThreshold: number;
    alertMaxTempThreshold: number;
    alertMinTempThreshold: number;
    alertUvThreshold: number;
    alertRainThreshold: number;
    timezone: string;
}

interface TelegramSessionConfig {
    telegramToken?: string;
    telegramChatId: string;
}

interface SettingsContextType extends SettingsState {
    setGenetics: (genetics: GeneticsType) => void;
    setSowDate: (date: string | null) => void;
    setTelegramChatId: (chatId: string) => void;
    setLocation: (lat: number, lng: number, name: string) => void;
    setAlertThresholds: (wind: number, maxTemp: number, minTemp: number, uv: number, rain: number) => void;
    setTimezone: (timezone: string) => void;
}

const SETTINGS_STORAGE_KEY = 'magec-grow-settings-v2';
const TELEGRAM_SESSION_KEY = 'magec-grow-telegram-v1';
const LEGACY_SETTINGS_KEY = 'lanzaroteGrowerSettings';

const defaultState: SettingsState = {
    genetics: 'Feminizada',
    sowDate: null,
    telegramChatId: '',
    latitude: 28.96348,
    longitude: -13.55181,
    locationName: 'Arrecife',
    alertWindThreshold: 60,
    alertMaxTempThreshold: 37,
    alertMinTempThreshold: 5,
    alertUvThreshold: 10,
    alertRainThreshold: 15,
    timezone: 'Atlantic/Canary',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const toPersistedSettings = (settings: SettingsState): PersistedSettings => ({
    genetics: settings.genetics,
    sowDate: settings.sowDate,
    latitude: settings.latitude,
    longitude: settings.longitude,
    locationName: settings.locationName,
    alertWindThreshold: settings.alertWindThreshold,
    alertMaxTempThreshold: settings.alertMaxTempThreshold,
    alertMinTempThreshold: settings.alertMinTempThreshold,
    alertUvThreshold: settings.alertUvThreshold,
    alertRainThreshold: settings.alertRainThreshold,
    timezone: settings.timezone,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(defaultState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const persisted = persistentStorage.getJSON<PersistedSettings>(SETTINGS_STORAGE_KEY);
            const telegramSession = sessionSecureStorage.getJSON<TelegramSessionConfig>(TELEGRAM_SESSION_KEY);

            if (persisted) {
                setSettings((prev) => ({ ...prev, ...persisted }));
            } else {
                const legacyCookie = getCookie(LEGACY_SETTINGS_KEY);
                const legacyLocal = persistentStorage.getJSON<Partial<SettingsState>>(LEGACY_SETTINGS_KEY);
                const legacyData = legacyCookie ? JSON.parse(legacyCookie) as Partial<SettingsState> : legacyLocal;

                if (legacyData) {
                    const migrated = { ...defaultState, ...legacyData };
                    if (!Object.prototype.hasOwnProperty.call(ALERT_THRESHOLDS_BY_PLANT, migrated.genetics)) {
                        migrated.genetics = defaultState.genetics;
                    }
                    setSettings((prev) => ({ ...prev, ...toPersistedSettings(migrated) }));
                    persistentStorage.setJSON(SETTINGS_STORAGE_KEY, toPersistedSettings(migrated));
                }

                deleteCookie(LEGACY_SETTINGS_KEY);
                persistentStorage.remove(LEGACY_SETTINGS_KEY);
            }

            if (telegramSession?.telegramChatId) {
                setSettings((prev) => ({ ...prev, telegramChatId: telegramSession.telegramChatId }));
            }
        } catch (e) {
            console.error('Failed to load settings', e);
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            persistentStorage.setJSON(SETTINGS_STORAGE_KEY, toPersistedSettings(settings));
        }
    }, [settings, isLoaded]);

    const value: SettingsContextType = {
        ...settings,
        setGenetics: (genetics) => {
            const thresholds = ALERT_THRESHOLDS_BY_PLANT[genetics];
            setSettings((s) => ({
                ...s,
                genetics,
                alertWindThreshold: thresholds.wind,
                alertMaxTempThreshold: thresholds.maxTemp,
                alertMinTempThreshold: thresholds.minTemp,
                alertUvThreshold: thresholds.uv,
                alertRainThreshold: thresholds.rain,
            }));
        },
        setSowDate: (sowDate) => setSettings((s) => ({ ...s, sowDate })),
        setTelegramChatId: (telegramChatId) => {
            sessionSecureStorage.setJSON(TELEGRAM_SESSION_KEY, { telegramChatId });
            setSettings((s) => ({ ...s, telegramChatId }));
        },
        setLocation: (latitude, longitude, locationName) =>
            setSettings((s) => ({ ...s, latitude, longitude, locationName })),
        setAlertThresholds: (alertWindThreshold, alertMaxTempThreshold, alertMinTempThreshold, alertUvThreshold, alertRainThreshold) =>
            setSettings((s) => ({ ...s, alertWindThreshold, alertMaxTempThreshold, alertMinTempThreshold, alertUvThreshold, alertRainThreshold })),
        setTimezone: (timezone) => setSettings((s) => ({ ...s, timezone })),
    };

    if (!isLoaded) return null;

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
