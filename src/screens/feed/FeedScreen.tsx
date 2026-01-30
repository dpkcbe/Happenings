import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventStore } from '../../store/eventStore';
import EventCard from '../../components/EventCard';
import FeedItem from '../../components/FeedItem';
import * as Location from 'expo-location';
import { MapPin, Filter } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export default function FeedScreen() {
    const { events, loading, fetchEvents } = useEventStore();
    const [refreshing, setRefreshing] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const { colorScheme } = useColorScheme();

    // @ts-ignore - Temporarily ignore type check until param list is updated
    const navigation = useNavigation<any>();

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
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
    const borderColor = colorScheme === 'dark' ? '#1F2937' : '#F3F4F6';
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';

    return (
        <SafeAreaView
            className="flex-1 bg-gray-50 dark:bg-black"
            edges={['top']}
            style={{ backgroundColor: colorScheme === 'dark' ? '#000000' : '#f4f4f5' }} // zinc-100 for light mode
        >
            <View
                className="flex-row justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                style={{ backgroundColor: bgColor, borderColor: borderColor }}
            >
                <View className="flex-row items-center">
                    <MapPin color={textColor} size={20} />
                    <Text className="text-lg font-bold ml-2" style={{ color: textColor }}>Mumbai, IN</Text>
                </View>
                <TouchableOpacity className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full" style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6' }}>
                    <Filter size={20} color={iconColor} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FeedItem
                        event={item}
                        onPress={() => console.log('Event pressed', item.id)}
                        onMapPress={() => {
                            // Navigate to Map Tab with params
                            navigation.navigate('Map', {
                                focusEvent: item
                            });
                        }}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={colorScheme === 'dark' ? '#FFF' : '#000'} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-20">
                            <Text style={{ color: textColor }}>No happenings found.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
