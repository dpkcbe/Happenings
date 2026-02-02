import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SlidersHorizontal, MapPin } from 'lucide-react-native';
import { useEventStore } from '../../store/eventStore';
import FeedItem from '../../components/FeedItem';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import SearchBar from '../../components/SearchBar';
import FilterSheet, { FilterOptions } from '../../components/FilterSheet';
import { getForYouEvents } from '../../services/recommendationService';

export default function FeedScreen() {
    const { events, loading, fetchEvents } = useEventStore();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'foryou' | 'all'>('foryou');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [userCity, setUserCity] = useState('Mumbai'); // Default
    const [filters, setFilters] = useState<FilterOptions>({
        categories: [],
        maxDistance: 50,
        priceFilter: 'all',
        vibes: [],
        accessibility: []
    });

    // @ts-ignore
    const navigation = useNavigation<any>();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                // Reverse geocode to get city name
                const addresses = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });

                if (addresses && addresses.length > 0) {
                    const address = addresses[0];
                    // Use city, subregion, or region as fallback
                    const city = address.city || address.subregion || address.region || 'Your Location';
                    setUserCity(city);
                }

                // Fetch events with user's location
                await fetchEvents(latitude, longitude);
            } catch (error) {
                console.error('Location error:', error);
                // Fallback to default location
                await fetchEvents(19.0760, 72.8777);
            }
        } else {
            // Permission denied, use default
            await fetchEvents(19.0760, 72.8777);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Filter and search events
    const getFilteredEvents = () => {
        let filtered = events;

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.categories.length > 0) {
            filtered = filtered.filter(event => filters.categories.includes(event.category));
        }

        // Apply distance filter
        filtered = filtered.filter(event =>
            !event.distance || event.distance <= filters.maxDistance
        );

        return filtered;
    };

    const displayEvents = activeTab === 'foryou'
        ? getForYouEvents(getFilteredEvents(), 'mock-user', 10)
        : getFilteredEvents();

    return (
        <ScreenWrapper className="bg-background">
            {/* Header */}
            <View className="px-6 py-4">
                <Text className="text-text-secondary text-sm font-medium mb-1" style={{ fontFamily: 'Outfit_500Medium' }}>
                    Discover events in
                </Text>
                <View className="flex-row items-center">
                    <MapPin color="#C084FC" size={18} />
                    <Text className="text-xl font-bold ml-1 text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                        {userCity}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-6">
                <SearchBar onSearch={setSearchQuery} placeholder="Search events..." />
            </View>

            {/* Tabs & Filter */}
            <View className="px-6 flex-row items-center justify-between mb-4">
                <View className="flex-row bg-surface rounded-2xl p-1 border border-surface-highlight">
                    <TouchableOpacity
                        onPress={() => setActiveTab('foryou')}
                        className={`px-6 py-2 rounded-xl ${activeTab === 'foryou' ? 'bg-primary' : ''}`}
                    >
                        <Text
                            className={`font-bold ${activeTab === 'foryou' ? 'text-white' : 'text-text-secondary'}`}
                            style={{ fontFamily: 'Outfit_700Bold' }}
                        >
                            For You
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-xl ${activeTab === 'all' ? 'bg-primary' : ''}`}
                    >
                        <Text
                            className={`font-bold ${activeTab === 'all' ? 'text-white' : 'text-text-secondary'}`}
                            style={{ fontFamily: 'Outfit_700Bold' }}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => setShowFilters(true)}
                    className="p-3 bg-surface rounded-2xl border border-surface-highlight"
                >
                    <SlidersHorizontal size={20} color="#F8FAFC" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FeedItem
                        event={item}
                        onPress={() => console.log('Event pressed', item.id)}
                        onMapPress={() => {
                            navigation.navigate('Map', { focusEvent: item });
                        }}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || loading}
                        onRefresh={onRefresh}
                        tintColor="#C084FC"
                        colors={["#C084FC"]}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-20 px-10">
                            <Text className="text-text-secondary text-center text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>
                                {searchQuery || filters.categories.length > 0
                                    ? 'No events match your filters'
                                    : 'Looks like things are quiet right now. Check back soon!'}
                            </Text>
                        </View>
                    ) : null
                }
            />

            {/* Filter Modal */}
            <FilterSheet
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={(newFilters) => setFilters(newFilters)}
                currentFilters={filters}
            />
        </ScreenWrapper>
    );
}
