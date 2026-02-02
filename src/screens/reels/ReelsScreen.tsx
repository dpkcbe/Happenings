import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Play } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';

const { width, height } = Dimensions.get('window');

interface Reel {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    videoUrl: string;
    thumbnail: string;
    caption: string;
    likes: number;
    comments: number;
    eventId?: string;
    eventTitle?: string;
}

// Mock reels data
const MOCK_REELS: Reel[] = [
    {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        videoUrl: '',
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        caption: 'Amazing vibes at Mumbai Tech Meetup! 🔥',
        likes: 2341,
        comments: 89,
        eventId: '1',
        eventTitle: 'Mumbai Tech Meetup'
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Raj Patel',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        videoUrl: '',
        thumbnail: 'https://images.unsplash.com/photo-1545959863-7150c2fa973b?w=800&q=80',
        caption: 'Dance workshop energy ⚡',
        likes: 1890,
        comments: 45,
        eventId: '2',
        eventTitle: 'Bollywood Dance Workshop'
    },
    {
        id: '3',
        userId: 'user3',
        userName: 'Emma Wilson',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        videoUrl: '',
        thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
        caption: 'Street food heaven! Must try 🌮',
        likes: 3420,
        comments: 156,
        eventId: '3',
        eventTitle: 'Street Food Walk'
    }
];

export default function ReelsScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
    const flatListRef = useRef<FlatList>(null);

    const toggleLike = (reelId: string) => {
        setLikedReels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reelId)) {
                newSet.delete(reelId);
            } else {
                newSet.add(reelId);
            }
            return newSet;
        });
    };

    const renderReel = ({ item }: { item: Reel }) => {
        const isLiked = likedReels.has(item.id);

        return (
            <View style={{ width, height: height - 100 }} className="relative">
                {/* Video/Thumbnail */}
                <Image
                    source={{ uri: item.thumbnail }}
                    style={{ width, height: height - 100 }}
                    resizeMode="cover"
                />

                {/* Play button overlay */}
                <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-black/30 w-16 h-16 rounded-full items-center justify-center">
                        <Play size={32} color="#FFF" fill="#FFF" />
                    </View>
                </View>

                {/* Gradient overlay */}
                <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Top user info */}
                <View className="absolute top-4 left-4 right-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: item.userAvatar }}
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                        <Text className="text-white font-bold ml-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                            {item.userName}
                        </Text>
                    </View>
                    <TouchableOpacity className="p-2">
                        <MoreVertical size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Right side actions */}
                <View className="absolute right-4 bottom-24 gap-6">
                    <TouchableOpacity
                        className="items-center"
                        onPress={() => toggleLike(item.id)}
                    >
                        <Heart
                            size={32}
                            color="#FFF"
                            fill={isLiked ? '#F472B6' : 'transparent'}
                        />
                        <Text className="text-white text-xs mt-1 font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                            {isLiked ? item.likes + 1 : item.likes}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center">
                        <MessageCircle size={32} color="#FFF" />
                        <Text className="text-white text-xs mt-1 font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                            {item.comments}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center">
                        <Share2 size={28} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center">
                        <Bookmark size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Bottom caption */}
                <View className="absolute bottom-4 left-4 right-20">
                    <Text className="text-white font-bold text-base mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                        {item.caption}
                    </Text>
                    {item.eventTitle && (
                        <TouchableOpacity className="flex-row items-center mt-2">
                            <View className="bg-primary/80 px-3 py-1.5 rounded-full border border-white/20">
                                <Text className="text-white text-xs font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    📍 {item.eventTitle}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScreenWrapper className="bg-black">
            <FlatList
                ref={flatListRef}
                data={MOCK_REELS}
                renderItem={renderReel}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                decelerationRate="fast"
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.y / (height - 100));
                    setCurrentIndex(index);
                }}
                ListEmptyComponent={
                    <View style={{ height: height - 100 }} className="items-center justify-center px-10">
                        <Text className="text-white text-xl font-bold mb-2 text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                            No Reels Yet
                        </Text>
                        <Text className="text-text-secondary text-center" style={{ fontFamily: 'Outfit_400Regular' }}>
                            Be the first to share your event moments!
                        </Text>
                    </View>
                }
            />

            {/* Top header */}
            <View className="absolute top-12 left-0 right-0 px-6">
                <Text className="text-white text-2xl font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                    Reels
                </Text>
            </View>
        </ScreenWrapper>
    );
}
