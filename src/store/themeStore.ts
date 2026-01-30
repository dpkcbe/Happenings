import { create } from 'zustand';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { ColorSchemeSystem } from 'nativewind/dist/style-sheet/color-scheme';

interface ThemeState {
    colorScheme: 'light' | 'dark' | 'system';
    setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
}

const secureStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await SecureStore.getItemAsync(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await SecureStore.deleteItemAsync(name);
    },
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            colorScheme: 'system',
            setColorScheme: (scheme) => set({ colorScheme: scheme }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => secureStorage),
        }
    )
);

export function useThemeSync() {
    const { colorScheme } = useThemeStore();
    const { setColorScheme: setNativeWindColorScheme } = useColorScheme();

    useEffect(() => {
        // NativeWind's setColorScheme expects 'light' | 'dark' | 'system'
        // which matches our store type exactly.
        setNativeWindColorScheme(colorScheme as ColorSchemeSystem);
    }, [colorScheme, setNativeWindColorScheme]);
}
