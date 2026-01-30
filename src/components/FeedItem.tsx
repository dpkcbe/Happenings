import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Star, MessageSquareText, Share2, Bookmark, MoreHorizontal, Map } from 'lucide-react-native';
import { Event } from '../store/eventStore';
import { useColorScheme } from 'nativewind';

const { width } = Dimensions.get('window');

interface FeedItemProps {
    event: Event;
    onPress: () => void;
    onMapPress: () => void;
}

export default function FeedItem({ event, onPress, onMapPress }: FeedItemProps) {
    const { colorScheme } = useColorScheme();
    const [liked, setLiked] = useState(false);

    // High Contrast Colors
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const secondaryText = colorScheme === 'dark' ? '#D1D5DB' : '#6B7280'; // Gray-300 : Gray-500
    const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <View
            className="mb-6 mx-4 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm"
            style={{
                backgroundColor: bgColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5
            }}
        >
            {/* Header - User Info */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800" style={{ borderColor: colorScheme === 'dark' ? '#27272a' : '#f3f4f6' }}>
                <View className="flex-row items-center">
                    <View className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Text className="font-bold text-sm" style={{ color: textColor }}>{event.host_name.charAt(0)}</Text>
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-sm" style={{ color: textColor }}>{event.host_name}</Text>
                        <Text className="text-xs text-gray-400">{new Date(event.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MoreHorizontal size={20} color={secondaryText} />
                </TouchableOpacity>
            </View>

            {/* Image Content */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
                <Image
                    source={{ uri: event.image_url || 'https://via.placeholder.com/800' }}
                    style={{ width: '100%', height: width * 1.0 }} // Square-ish or 4:5
                    resizeMode="cover"
                    className="bg-gray-100"
                />
            </TouchableOpacity>

            {/* Event Details & Actions Footer */}
            <View className="px-4 py-4">
                {/* Title & Description */}
                <View className="mb-4">
                    <Text className="text-xl font-extrabold mb-1" style={{ color: textColor }}>{event.title}</Text>
                    <Text className="text-sm font-medium mb-2" style={{ color: secondaryText }}>
                        {event.location?.address || 'Location TBD'}
                    </Text>
                    <Text className="text-sm leading-5" numberOfLines={2} style={{ color: textColor }}>
                        {event.description}
                    </Text>
                </View>

                {/* Action Row - Redesigned */}
                <View className="flex-row justify-between items-center pt-2">
                    <View className="flex-row gap-6">
                        <TouchableOpacity onPress={() => setLiked(!liked)} className="items-center">
                            {/* icon: Star instead of Heart */}
                            <Star
                                size={26}
                                color={liked ? '#eab308' : iconColor} // Yellow-500 for star
                                fill={liked ? '#eab308' : 'transparent'}
                                strokeWidth={2}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            {/* icon: MessageSquareText instead of MessageCircle */}
                            <MessageSquareText size={26} color={iconColor} strokeWidth={2} />
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            {/* icon: Share2 instead of Send */}
                            <Share2 size={26} color={iconColor} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={onMapPress}
                        className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full"
                        style={{ backgroundColor: colorScheme === 'dark' ? '#27272a' : '#f3f4f6' }}
                    >
                        <Map size={18} color={iconColor} />
                        <Text className="text-xs font-bold ml-2" style={{ color: textColor }}>View Map</Text>
                    </TouchableOpacity>
                </View>

                {/* Likes count small text */}
                <Text className="text-xs font-bold mt-4 text-gray-400">
                    {event.attendees_count} interested · {Math.floor(Math.random() * 20)} comments
                </Text>
            </View>
        </View>
    );
}
