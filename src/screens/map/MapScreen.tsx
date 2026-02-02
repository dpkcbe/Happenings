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
    const [locationLoading, setLocationLoading] = useState(true);
    const [filterMode, setFilterMode] = useState<'nearby' | 'global' | null>('nearby');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const navigation = useNavigation<MapScreenNavigationProp>();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Fallback to default location if permission denied
                setUserLocation({
                    latitude: 19.0760,
                    longitude: 72.8777
                });
                fetchEvents(19.0760, 72.8777);
                setLocationLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const userCoords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setUserLocation(userCoords);
            setLocationLoading(false);

            // Fetch events based on user's actual location
            fetchEvents(userCoords.latitude, userCoords.longitude);
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
            {locationLoading || !userLocation ? (
                <View className="flex-1 items-center justify-center bg-background">
                    <Text className="text-white text-lg" style={{ fontFamily: 'Outfit_700Bold' }}>
                        Loading map...
                    </Text>
                </View>
            ) : (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.15,
                        longitudeDelta: 0.15,
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
            )}

            {/* Top Toggle Overlay (Instagram Style) */}
            <View className="absolute top-14 left-0 right-0 flex-row justify-center items-center z-10 px-6">
                <View className="flex-row bg-background/80 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-2xl">
                    <TouchableOpacity
                        onPress={() => handleFilterSelect('nearby')}
                        className={`px-6 py-2 rounded-full ${filterMode === 'nearby' ? 'bg-primary' : ''}`}
                    >
                        <Text
                            className={`text-sm font-bold ${filterMode === 'nearby' ? 'text-white' : 'text-text-secondary'}`}
                            style={{ fontFamily: 'Outfit_700Bold' }}
                        >
                            Nearby
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleFilterSelect('global')}
                        className={`px-6 py-2 rounded-full ${filterMode === 'global' ? 'bg-primary' : ''}`}
                    >
                        <Text
                            className={`text-sm font-bold ${filterMode === 'global' ? 'text-white' : 'text-text-secondary'}`}
                            style={{ fontFamily: 'Outfit_700Bold' }}
                        >
                            Global
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Modal */}
            <Modal
                transparent={true}
                visible={showFilterModal}
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => filterMode && setShowFilterModal(false)}>
                    <View className="flex-1 justify-center items-center bg-background/60 backdrop-blur-md px-6">
                        <View className="bg-surface border border-surface-highlight p-8 rounded-[40px] w-full max-w-sm shadow-2xl">
                            <Text className="text-2xl font-bold text-center mb-2 text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Explore City
                            </Text>
                            <Text className="text-text-secondary text-center mb-8 text-sm" style={{ fontFamily: 'Outfit_400Regular' }}>
                                Choose how you want to discover happenings
                            </Text>

                            <View className="space-y-4">
                                <TouchableOpacity
                                    className="flex-row bg-surface-highlight p-5 rounded-3xl items-center border border-white/5 active:bg-primary/10"
                                    onPress={() => handleFilterSelect('nearby')}
                                >
                                    <View className="w-12 h-12 bg-primary/20 rounded-2xl items-center justify-center mr-4">
                                        <Locate size={24} color="#C084FC" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-white text-base" style={{ fontFamily: 'Outfit_700Bold' }}>Near Me</Text>
                                        <Text className="text-xs text-text-secondary" style={{ fontFamily: 'Outfit_400Regular' }}>Within 15km radius</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row bg-surface-highlight p-5 rounded-3xl items-center border border-white/5 active:bg-primary/10"
                                    onPress={() => handleFilterSelect('global')}
                                >
                                    <View className="w-12 h-12 bg-secondary/20 rounded-2xl items-center justify-center mr-4">
                                        <List size={24} color="#F472B6" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-white text-base" style={{ fontFamily: 'Outfit_700Bold' }}>Interested In</Text>
                                        <Text className="text-xs text-text-secondary" style={{ fontFamily: 'Outfit_400Regular' }}>Based on your profile</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {filterMode && (
                                <TouchableOpacity
                                    className="mt-8 self-center"
                                    onPress={() => setShowFilterModal(false)}
                                >
                                    <Text className="text-text-secondary font-medium" style={{ fontFamily: 'Outfit_500Medium' }}>Close</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View className="absolute bottom-10 right-6 gap-4">
                <TouchableOpacity
                    className="bg-surface border border-surface-highlight p-4 rounded-3xl shadow-2xl items-center justify-center"
                    onPress={focusOnUser}
                >
                    <Locate size={24} color="#F8FAFC" />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-primary p-4 rounded-3xl shadow-2xl items-center justify-center"
                    onPress={() => navigation.navigate('Feed')}
                >
                    <List size={24} color="#FFF" />
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
