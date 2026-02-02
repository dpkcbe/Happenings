import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { BookmarkX } from 'lucide-react-native';
import { useEventStore, Event } from '../store/eventStore';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import FeedItem from '../components/FeedItem';

export default function SavedEventsScreen() {
    const { events, savedEventIds } = useEventStore();

    const savedEvents = events.filter(event => savedEventIds.includes(event.id));

    return (
        <ScreenWrapper className="bg-background">
            <View className="px-6 py-4">
                <Text className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                    Saved Events
                </Text>
                <Text className="text-text-secondary text-sm" style={{ fontFamily: 'Outfit_400Regular' }}>
                    Your bookmarked happenings
                </Text>
            </View>

            <FlatList
                data={savedEvents}
                renderItem={({ item }) => (
                    <FeedItem
                        event={item}
                        onPress={() => { }}
                        onMapPress={() => { }}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20 px-10">
                        <View className="w-24 h-24 bg-surface rounded-full items-center justify-center mb-4 border border-surface-highlight">
                            <BookmarkX size={48} color="#94A3B8" />
                        </View>
                        <Text className="text-white text-xl font-bold mb-2 text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                            No saved events yet
                        </Text>
                        <Text className="text-text-secondary text-center" style={{ fontFamily: 'Outfit_400Regular' }}>
                            Tap the bookmark icon on events to save them for later.
                        </Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
}
