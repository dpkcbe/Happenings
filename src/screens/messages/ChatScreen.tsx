import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useChatStore, Message } from '../../store/chatStore';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId } = route.params;
    const { messages, chats, sendMessage } = useChatStore();
    const [inputText, setInputText] = useState('');

    const flatListRef = useRef<FlatList>(null);

    const chatMessages = messages[chatId] || [];
    const chatDetails = chats.find(c => c.id === chatId);

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(chatId, inputText, 'me'); // 'me' is current user ID
        setInputText('');
    };

    useEffect(() => {
        // Scroll to bottom on new message
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [chatMessages.length]);

    const { colorScheme } = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const borderColor = colorScheme === 'dark' ? '#262626' : '#E5E7EB';
    const inputBg = colorScheme === 'dark' ? '#262626' : '#F3F4F6';
    const otherMsgBg = colorScheme === 'dark' ? '#262626' : '#F3F4F6';

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender_id === 'me';
        return (
            <View className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                    <View className="w-8 h-8 rounded-full bg-gray-200 mr-2 items-center justify-center">
                        <Text className="text-xs font-bold text-gray-600">{item.sender_name?.charAt(0)}</Text>
                    </View>
                )}
                <View
                    className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-indigo-600 rounded-tr-sm' : 'bg-gray-100 rounded-tl-sm'
                        }`}
                    style={{ backgroundColor: isMe ? '#4F46E5' : otherMsgBg }}
                >
                    {!isMe && <Text className="text-xs text-gray-500 mb-1">{item.sender_name}</Text>}
                    <Text className={`${isMe ? 'text-white' : 'text-gray-800'}`} style={{ color: isMe ? 'white' : textColor }}>{item.content}</Text>
                    <Text className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']} style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-100" style={{ borderColor }}>
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Image
                    source={{ uri: chatDetails?.image_url || 'https://via.placeholder.com/50' }}
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
                <View className="ml-3">
                    <Text className="font-bold text-gray-900 text-lg" style={{ color: textColor }}>{chatDetails?.name || 'Chat'}</Text>
                    <Text className="text-gray-500 text-xs">Online</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={chatMessages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                className="flex-1 bg-gray-50"
                style={{ backgroundColor: bgColor }}
            />

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View className="p-4 bg-white border-t border-gray-100 flex-row items-center" style={{ backgroundColor: bgColor, borderColor }}>
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-full px-5 py-3 mr-3 text-gray-800 max-h-24"
                        placeholder="Type a message..."
                        placeholderTextColor="#9CA3AF"
                        style={{ backgroundColor: inputBg, color: textColor }}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        className={`w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Send color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
