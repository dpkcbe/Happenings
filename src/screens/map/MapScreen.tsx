import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useEventStore, Event } from '../../store/eventStore';
import * as Location from 'expo-location';
import { Locate, List } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabParamList } from '../../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useColorScheme } from 'nativewind';

type MapScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Map'>;

export default function MapScreen() {
    const { colorScheme } = useColorScheme();
    const mapRef = useRef<MapView>(null);
    const { events, fetchEvents } = useEventStore();
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const navigation = useNavigation<MapScreenNavigationProp>();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            // Initial refetch if needed, though store might already have data from Feed
            if (events.length === 0) {
                fetchEvents(location.coords.latitude, location.coords.longitude);
            }
        })();
    }, []);

    const route = useRoute<any>(); // Using any for quick access to params

    // Listen for tab focus to handle params reliably
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const params = route.params;
            if (params?.focusEvent) {
                const event = params.focusEvent;
                if (event.location && mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: event.location.latitude,
                        longitude: event.location.longitude,
                        latitudeDelta: 0.005, // Zoom in closer (approx 500m)
                        longitudeDelta: 0.005,
                    }, 1000);
                }
            }
        });

        return unsubscribe;
    }, [navigation, route.params]);

    const focusOnUser = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    };

    return (
        <View className="flex-1 bg-white">
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 19.0760,
                    longitude: 72.8777,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {events.filter(e => e.location?.latitude && e.location?.longitude).map((event) => (
                    <Marker
                        key={event.id}
                        coordinate={{ latitude: event.location!.latitude, longitude: event.location!.longitude }}
                        title={event.title}
                        description={event.description}
                    >
                        <View className="bg-black dark:bg-white p-2 rounded-full border-2 border-white dark:border-black shadow-lg">
                            <Text className="text-white dark:text-black text-xs font-bold w-full text-center">
                                {event.category.substring(0, 2).toUpperCase()}
                            </Text>
                        </View>
                        <Callout tooltip>
                            <View className="bg-white p-3 rounded-lg shadow-xl w-60 border border-gray-100">
                                <Text className="font-bold text-gray-900 mb-1">{event.title}</Text>
                                <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>{event.description}</Text>
                                <Text className="text-xs font-semibold text-black">Tap for details</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View className="absolute bottom-6 right-6 gap-4">
                <TouchableOpacity
                    className="bg-white dark:bg-black p-3 rounded-full shadow-lg items-center justify-center border border-gray-200 dark:border-gray-800"
                    onPress={focusOnUser}
                >
                    <Locate size={24} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                </TouchableOpacity>

                {/* Floating button to switch to list view quickly */}
                <TouchableOpacity
                    className="bg-black dark:bg-white p-3 rounded-full shadow-lg items-center justify-center"
                    onPress={() => navigation.navigate('Feed')}
                >
                    <List size={24} color={colorScheme === 'dark' ? '#000' : '#FFF'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
