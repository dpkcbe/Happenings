import React from 'react';
import { View, Image, Text } from 'react-native';
import { Attendee } from '../store/socialStore';

interface AttendeeAvatarsProps {
    attendees: Attendee[];
    maxShow?: number;
}

export default function AttendeeAvatars({ attendees, maxShow = 3 }: AttendeeAvatarsProps) {
    const displayAttendees = attendees.slice(0, maxShow);
    const remainingCount = Math.max(0, attendees.length - maxShow);

    if (attendees.length === 0) return null;

    return (
        <View className="flex-row items-center">
            <View className="flex-row -space-x-2">
                {displayAttendees.map((attendee, index) => (
                    <View
                        key={attendee.user_id}
                        className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden bg-surface-highlight"
                        style={{ zIndex: maxShow - index }}
                    >
                        <Image
                            source={{ uri: attendee.avatar_url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </View>
            {remainingCount > 0 && (
                <View className="ml-2">
                    <Text className="text-text-secondary text-xs font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                        +{remainingCount}
                    </Text>
                </View>
            )}
        </View>
    );
}
