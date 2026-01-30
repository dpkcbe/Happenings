import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Users, Calendar } from 'lucide-react-native';
import { Event } from '../store/eventStore';
import { useColorScheme } from 'nativewind';

interface EventCardProps {
    event: Event;
    onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
    const cardBg = colorScheme === 'dark' ? '#111827' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
    const borderColor = colorScheme === 'dark' ? '#1F2937' : '#F3F4F6';

    const formattedDate = new Date(event.start_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const formattedTime = new Date(event.start_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="bg-white dark:bg-gray-900 rounded-2xl mb-4 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800"
            style={{ backgroundColor: cardBg, borderColor: borderColor }}
        >
            <View className="h-48 w-full bg-gray-200 dark:bg-gray-800">
                {event.image_url ? (
                    <Image
                        source={{ uri: event.image_url }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-200 dark:bg-gray-800" style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#E5E7EB' }}>
                        <Text className="text-gray-400">No Image</Text>
                    </View>
                )}
                <View className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}>
                    <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{event.category}</Text>
                </View>
            </View>

            <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 mr-2" style={{ color: textColor }}>{event.title}</Text>
                    <View className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                        <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 relative top-[1px]">{event.distance?.toFixed(1)} km</Text>
                    </View>
                </View>

                <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">Hosted by {event.host_name}</Text>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <Calendar size={14} color={iconColor} />
                        <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 mr-3">
                            {formattedDate} • {formattedTime}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Users size={14} color={iconColor} />
                        <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
                            {event.attendees_count}/{event.max_participants || '∞'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
