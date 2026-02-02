import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useChatStore, ChatRoom } from '../../store/chatStore';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';

type MessagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MessagesScreen() {
    const navigation = useNavigation<MessagesScreenNavigationProp>();
    const { chats } = useChatStore();

    const renderItem = ({ item }: { item: ChatRoom }) => (
        <TouchableOpacity
            className="flex-row items-center p-5 bg-surface border-b border-surface-highlight/50"
            onPress={() => navigation.navigate('Chat', { chatId: item.id })}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
                    className="w-16 h-16 rounded-full bg-surface-highlight border-2 border-primary/20"
                />
                {item.unread_count > 0 && (
                    <View className="absolute -top-1 -right-1 bg-primary w-6 h-6 rounded-full items-center justify-center border-4 border-surface">
                        <Text className="text-white text-[10px] font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>{item.unread_count}</Text>
                    </View>
                )}
            </View>

            <View className="ml-4 flex-1">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-bold text-white text-lg" style={{ fontFamily: 'Outfit_700Bold' }}>{item.name}</Text>
                    <Text className="text-text-secondary text-[10px] uppercase tracking-wider" style={{ fontFamily: 'Outfit_500Medium' }}>
                        {new Date(item.last_message_time || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text className="text-text-secondary text-sm" numberOfLines={1} style={{ fontFamily: 'Outfit_400Regular' }}>
                    {item.last_message}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper className="bg-background">
            <View className="px-6 py-4">
                <Text className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Messages</Text>
                <Text className="text-text-secondary text-sm" style={{ fontFamily: 'Outfit_400Regular' }}>Connect with your city</Text>
            </View>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20 px-10">
                        <View className="w-20 h-20 bg-surface rounded-full items-center justify-center mb-4 border border-surface-highlight">
                            <Text className="text-4xl">💬</Text>
                        </View>
                        <Text className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>No messages yet</Text>
                        <Text className="text-text-secondary text-center" style={{ fontFamily: 'Outfit_400Regular' }}>Start a conversation by joining happenings nearby.</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
}
