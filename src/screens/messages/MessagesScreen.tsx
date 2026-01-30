import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useChatStore, ChatRoom } from '../../store/chatStore';
import { useColorScheme } from 'nativewind';

type MessagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MessagesScreen() {
    const navigation = useNavigation<MessagesScreenNavigationProp>();
    const { chats } = useChatStore();

    const { colorScheme } = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const borderColor = colorScheme === 'dark' ? '#262626' : '#E5E7EB';
    const itemBg = colorScheme === 'dark' ? '#000000' : '#FFFFFF';

    const renderItem = ({ item }: { item: ChatRoom }) => (
        <TouchableOpacity
            className="flex-row items-center p-4 bg-white border-b border-gray-100"
            style={{ backgroundColor: itemBg, borderColor }}
            onPress={() => navigation.navigate('Chat', { chatId: item.id })}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.image_url || 'https://via.placeholder.com/50' }}
                    className="w-14 h-14 rounded-full bg-gray-200"
                />
                {item.unread_count > 0 && (
                    <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white" style={{ borderColor: itemBg }}>
                        <Text className="text-white text-[10px] font-bold">{item.unread_count}</Text>
                    </View>
                )}
            </View>

            <View className="ml-3 flex-1">
                <View className="flex-row justify-between mb-1">
                    <Text className="font-bold text-gray-900 text-base" style={{ color: textColor }}>{item.name}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                        {new Date(item.last_message_time || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                    {item.last_message}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: bgColor }}>
            <View className="px-4 py-3 border-b border-gray-100" style={{ borderColor }}>
                <Text className="text-2xl font-bold text-gray-900" style={{ color: textColor }}>Messages</Text>
            </View>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20">
                        <Text className="text-gray-400">No messages yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
