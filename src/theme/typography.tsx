import {
    useFonts,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
} from '@expo-google-fonts/outfit';

export const useAppFonts = () => {
    const [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_700Bold,
    });

    return fontsLoaded;
};
