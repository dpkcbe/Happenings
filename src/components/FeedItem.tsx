import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MessageSquare, Share2, Bookmark, MoreHorizontal, Map as MapIcon, Heart, TrendingUp, Users } from 'lucide-react-native';
import { Event, useEventStore } from '../store/eventStore';
import { useSocialStore } from '../store/socialStore';
import AttendeeAvatars from './AttendeeAvatars';

const { width } = Dimensions.get('window');

interface FeedItemProps {
    event: Event;
    onPress: () => void;
    onMapPress: () => void;
}

export default function FeedItem({ event, onPress, onMapPress }: FeedItemProps) {
    const [liked, setLiked] = useState(false);
    const { toggleSaveEvent } = useEventStore();
    const { getFriendsAttending } = useSocialStore();

    // Mock attendees for demo
    const mockAttendees = event.attendees || [
        { user_id: 'friend1', name: 'Sarah Chen', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', is_friend: true },
        { user_id: 'friend2', name: 'Raj Patel', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', is_friend: true },
        { user_id: 'user1', name: 'Alex Kim', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', is_friend: false },
        { user_id: 'user2', name: 'Maria Garcia', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', is_friend: false },
    ];

    const friendsAttending = getFriendsAttending(mockAttendees);
    const capacityPercent = event.max_participants ? (event.attendees_count / event.max_participants) * 100 : 0;
    const isAlmostFull = capacityPercent >= 80;

    return (
        <View className="mb-8 mx-5 bg-surface rounded-[32px] overflow-hidden border border-surface-highlight shadow-xl">
            {/* Header - User Info */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-surface-highlight items-center justify-center overflow-hidden border border-primary/20">
                        {event.host_name ? (
                            <Text className="text-primary font-bold text-base" style={{ fontFamily: 'Outfit_700Bold' }}>
                                {event.host_name.charAt(0)}
                            </Text>
                        ) : null}
                    </View>
                    <View className="ml-3">
                        <Text className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit_700Bold' }}>{event.host_name}</Text>
                        <Text className="text-text-secondary text-xs" style={{ fontFamily: 'Outfit_400Regular' }}>
                            {new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity className="p-2">
                    <MoreHorizontal size={20} color="#94A3B8" />
                </TouchableOpacity>
            </View>

            {/* Image Content */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} className="relative">
                <Image
                    source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' }}
                    style={{ width: '100%', height: width * 1.0 }}
                    resizeMode="cover"
                    className="bg-surface-highlight"
                />

                {/* Badges Overlay */}
                <View className="absolute top-4 left-4 right-4 flex-row justify-between">
                    <View className="flex-row gap-2">
                        {event.is_trending && (
                            <View className="bg-error/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex-row items-center">
                                <TrendingUp size={12} color="#FFF" />
                                <Text className="text-white text-[10px] font-bold uppercase tracking-wider ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    TRENDING
                                </Text>
                            </View>
                        )}
                        {isAlmostFull && (
                            <View className="bg-secondary/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <Text className="text-white text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    ALMOST FULL
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Text className="text-primary text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Outfit_700Bold' }}>
                            {new Date(event.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </Text>
                    </View>
                </View>

                {/* Friends Attending Overlay */}
                {friendsAttending.length > 0 && (
                    <View className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
                        <View className="flex-row items-center">
                            <AttendeeAvatars attendees={friendsAttending} maxShow={2} />
                            <Text className="text-white text-xs font-bold ml-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                                {friendsAttending.length === 1
                                    ? `${friendsAttending[0].name.split(' ')[0]} is going`
                                    : `${friendsAttending.length} friends going`
                                }
                            </Text>
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            {/* Event Details & Actions Footer */}
            <View className="px-5 py-5">
                {/* Title & Description */}
                <View className="mb-5">
                    <Text className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: 'Outfit_700Bold' }}>{event.title}</Text>
                    <View className="flex-row items-center mb-3">
                        <MapIcon size={14} color="#C084FC" />
                        <Text className="text-text-secondary text-xs ml-1 font-medium" style={{ fontFamily: 'Outfit_500Medium' }} numberOfLines={1}>
                            {event.location?.address || 'Location TBD'}
                        </Text>
                    </View>
                    <Text className="text-text-secondary text-sm leading-5" numberOfLines={2} style={{ fontFamily: 'Outfit_400Regular' }}>
                        {event.description}
                    </Text>
                </View>

                {/* Action Row */}
                <View className="flex-row justify-between items-center pt-2 border-t border-surface-highlight">
                    <View className="flex-row space-x-6 items-center">
                        <TouchableOpacity onPress={() => setLiked(!liked)} className="flex-row items-center">
                            <Heart
                                size={24}
                                color={liked ? '#F472B6' : '#F8FAFC'}
                                fill={liked ? '#F472B6' : 'transparent'}
                            />
                            <Text className="text-text-secondary text-xs font-bold ml-1.5" style={{ fontFamily: 'Outfit_700Bold' }}>
                                {event.attendees_count}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center">
                            <MessageSquare size={24} color="#F8FAFC" />
                            <Text className="text-text-secondary text-xs font-bold ml-1.5" style={{ fontFamily: 'Outfit_700Bold' }}>
                                12
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Share2 size={24} color="#F8FAFC" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => toggleSaveEvent(event.id)}
                        className="p-2 bg-surface-highlight rounded-full border border-white/5"
                    >
                        <Bookmark
                            size={20}
                            color={event.is_saved ? '#C084FC' : '#F8FAFC'}
                            fill={event.is_saved ? '#C084FC' : 'transparent'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onMapPress}
                        className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-full"
                    >
                        <Text className="text-primary text-xs font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
