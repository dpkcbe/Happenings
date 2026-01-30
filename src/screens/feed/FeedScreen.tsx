import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventStore } from '../../store/eventStore';
import EventCard from '../../components/EventCard';
import * as Location from 'expo-location';
import { MapPin, Filter } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export default function FeedScreen() {
    const { events, loading, fetchEvents } = useEventStore();
    const [refreshing, setRefreshing] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const { colorScheme } = useColorScheme();

    const navigation = useNavigation();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationError('Permission to access location was denied');
            return;
        }

        // Default to SF for dev if real location fails
        await fetchEvents(37.7749, -122.4194);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const iconColor = colorScheme === 'dark' ? '#9CA3AF' : '#374151';

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black" edges={['top']}>
            <View className="flex-row justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <View className="flex-row items-center">
                    <MapPin color="#4F46E5" size={20} />
                    <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">San Francisco, CA</Text>
                </View>
                <TouchableOpacity className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Filter size={20} color={iconColor} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onPress={() => console.log('Event pressed', item.id)}
                    />
                )}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor="#4F46E5" />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-500 dark:text-gray-400">No happenings found nearby.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
