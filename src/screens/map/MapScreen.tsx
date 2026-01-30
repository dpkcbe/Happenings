import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useEventStore, Event } from '../../store/eventStore';
import * as Location from 'expo-location';
import { Locate, List, Filter, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabParamList } from '../../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useColorScheme } from 'nativewind';

// Haversine formula to calculate distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Mock User Interests (ideally from AuthStore)
const USER_INTERESTS = ['Tech', 'Music', 'Food', 'Dance', 'Health'];

type MapScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Map'>;

export default function MapScreen() {
    const { colorScheme } = useColorScheme();
    const mapRef = useRef<MapView>(null);
    const { events, fetchEvents } = useEventStore();
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [filterMode, setFilterMode] = useState<'nearby' | 'global' | null>('nearby');
    const [showFilterModal, setShowFilterModal] = useState(false); // Disable auto-show, rely on toggle
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
                // If focusing on a specific event, we should probably allow 'global' mode or just ignore filter temporarily?
                // For now, let's auto-switch to global if the event is far, or just ensure it's visible. 
                // Simplest is to strict filter but if user comes from feed, they want to see THAT event.
                // Let's set filterMode to 'global' to ensure it's not hidden by 'nearby' if it's far.

                // Only change if not set or if we need to? Let's just override to global to be safe.
                // setFilterMode('global'); 

                if (event.location && mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: event.location.latitude,
                        longitude: event.location.longitude,
                        latitudeDelta: 0.005, // Zoom in closer (approx 500m)
                        longitudeDelta: 0.005,
                    }, 1000);
                }
            } else {
                // If normal tab switch without specific event focus, maybe show modal if mode is unset?
                if (!filterMode) {
                    setShowFilterModal(true);
                }
            }
        });

        return unsubscribe;
    }, [navigation, route.params, filterMode]);

    const filteredEvents = useMemo(() => {
        if (!filterMode) return events; // Or return [] if we want to force choice? Let's return all.

        return events.filter(event => {
            if (!event.location) return false;

            if (filterMode === 'nearby') {
                if (!userLocation) return true; // Fallback or wait?
                const dist = getDistance(
                    userLocation.latitude, userLocation.longitude,
                    event.location.latitude, event.location.longitude
                );
                return dist <= 15; // 15km radius
            } else {
                // Global: Filter by interests
                // For mock, simple category match
                return USER_INTERESTS.some(interest =>
                    event.category.toLowerCase().includes(interest.toLowerCase()) ||
                    interest.toLowerCase().includes(event.category.toLowerCase())
                );
            }
        });
    }, [events, filterMode, userLocation]);

    const handleFilterSelect = (mode: 'nearby' | 'global') => {
        setFilterMode(mode);
        setShowFilterModal(false);

        if (mode === 'nearby' && userLocation && mapRef.current) {
            // Zoom to user
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.15, // Roughly 15km view
                longitudeDelta: 0.15,
            }, 1000);
        } else if (mode === 'global' && mapRef.current) {
            // Zoom out to world/country? 
            // For now, keep current or zoom out a bit.
            mapRef.current.animateToRegion({
                latitude: 20.5937, // India Center
                longitude: 78.9629,
                latitudeDelta: 20,
                longitudeDelta: 20,
            }, 1000);
        }
    };

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
                onLongPress={() => setShowFilterModal(true)}
            >
                {filteredEvents.filter(e => e.location?.latitude && e.location?.longitude).map((event) => (
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

            {/* Top Toggle Overlay (Instagram Style) */}
            <View className="absolute top-14 left-0 right-0 flex-row justify-center items-center z-10">
                <TouchableOpacity
                    onPress={() => handleFilterSelect('nearby')}
                    className="px-4 py-2"
                >
                    <Text
                        className={`text-lg font-bold ${filterMode === 'nearby' ? 'text-white' : 'text-gray-300'}`}
                        style={{
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: { width: -1, height: 1 },
                            textShadowRadius: 10
                        }}
                    >
                        Nearby
                    </Text>
                </TouchableOpacity>
                <View className="w-[1px] h-4 bg-gray-300 opacity-50 mx-2" />
                <TouchableOpacity
                    onPress={() => handleFilterSelect('global')}
                    className="px-4 py-2"
                >
                    <Text
                        className={`text-lg font-bold ${filterMode === 'global' ? 'text-white' : 'text-gray-300'}`}
                        style={{
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: { width: -1, height: 1 },
                            textShadowRadius: 10
                        }}
                    >
                        Global
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            <Modal
                transparent={true}
                visible={showFilterModal}
                animationType="fade"
                onRequestClose={() => {
                    // Optional: don't allow close without selection?
                    // setFilterMode('global'); // default?
                    setShowFilterModal(false);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-4">
                    <View className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                        <Text className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                            What would you like to explore?
                        </Text>

                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl items-center border border-gray-200 dark:border-gray-700 active:bg-gray-200"
                                onPress={() => handleFilterSelect('nearby')}
                            >
                                <Locate size={32} color={colorScheme === 'dark' ? '#FFF' : '#000'} className="mb-2" />
                                <Text className="font-bold text-center text-gray-900 dark:text-white mb-1">Events near you</Text>
                                <Text className="text-xs text-center text-gray-500">~15km radius</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl items-center border border-gray-200 dark:border-gray-700 active:bg-gray-200"
                                onPress={() => handleFilterSelect('global')}
                            >
                                <View className="mb-2 w-8 h-8 rounded-full border-2 border-gray-900 dark:border-white items-center justify-center">
                                    <View className="w-full h-[1px] bg-gray-900 dark:bg-white absolute" />
                                    <View className="h-full w-[1px] bg-gray-900 dark:bg-white absolute" />
                                </View>
                                {/* <List size={32} color={colorScheme === 'dark' ? '#FFF' : '#000'} className="mb-2" /> */}
                                <Text className="font-bold text-center text-gray-900 dark:text-white mb-1">Around the world</Text>
                                <Text className="text-xs text-center text-gray-500">Based on interests</Text>
                            </TouchableOpacity>
                        </View>

                        {filterMode && (
                            <TouchableOpacity
                                className="mt-6 self-center"
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Text className="text-gray-500">Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            <View className="absolute bottom-6 right-6 gap-4">
                <TouchableOpacity
                    className="bg-white dark:bg-black p-3 rounded-full shadow-lg items-center justify-center border border-gray-200 dark:border-gray-800"
                    onPress={() => setShowFilterModal(true)}
                >
                    <Filter size={24} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                </TouchableOpacity>

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
