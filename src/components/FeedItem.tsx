import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-react-native';
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
        <View className="mb-4 bg-white dark:bg-black" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-3 py-3">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 items-center justify-center overflow-hidden">
                        <Text className="font-bold text-xs" style={{ color: textColor }}>{event.host_name.charAt(0)}</Text>
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-sm" style={{ color: textColor }}>{event.host_name}</Text>
                        <Text className="text-xs" style={{ color: secondaryText }}>{event.location?.address || 'Unknown Location'}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MoreHorizontal size={20} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* Image */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                <Image
                    source={{ uri: event.image_url || 'https://via.placeholder.com/800' }}
                    style={{ width: width, height: width * 1.1 }} // 4:5 Aspect Ratio typically
                    resizeMode="cover"
                    className="bg-gray-200"
                />
            </TouchableOpacity>

            {/* Actions */}
            <View className="flex-row justify-between items-center px-3 py-3">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => setLiked(!liked)}>
                        <Heart
                            size={24}
                            color={liked ? '#EF4444' : iconColor}
                            fill={liked ? '#EF4444' : 'transparent'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MessageCircle size={24} color={iconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Send size={24} color={iconColor} />
                    </TouchableOpacity>
                </View>
                {/* View on Map Button */}
                <TouchableOpacity onPress={onMapPress}>
                    {/* Using the onPress prop which we will wire to Map navigation, 
                         or we could add a specific onMapPress prop. 
                         Let's use a specific icon for Map. */}
                    <MapPin size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* Content info */}
            <View className="px-3 pb-4">
                <Text className="font-bold mb-1" style={{ color: textColor }}>{event.attendees_count} likes</Text>
                <Text numberOfLines={2} style={{ color: textColor }}>
                    <Text className="font-bold mr-2">{event.host_name}</Text>
                    {' '}{event.title} — {event.description}
                </Text>

                <TouchableOpacity className="mt-1">
                    <Text className="text-gray-500 text-sm">View all {Math.floor(Math.random() * 20)} comments</Text>
                </TouchableOpacity>

                <Text className="text-xs text-gray-400 mt-1 uppercase">
                    {new Date(event.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
}
