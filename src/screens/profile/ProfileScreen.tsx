import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Settings, MapPin, Calendar, Heart, Shield, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const [ghostMode, setGhostMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    // Mock Data
    const stats = [
        { label: 'Hosted', value: 12 },
        { label: 'Joined', value: 48 },
        { label: 'Followers', value: 256 },
    ];

    const interests = ['Yoga', 'Tech', 'Music', 'Hiking', 'Foodie'];

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 flex-row justify-between items-center bg-white">
                <Text className="text-xl font-bold text-gray-900">Profile</Text>
                <TouchableOpacity>
                    <Settings size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 bg-gray-50">
                {/* User Info */}
                <View className="bg-white p-6 items-center border-b border-gray-100">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                        className="w-24 h-24 rounded-full border-4 border-indigo-50 mb-3"
                    />
                    <Text className="text-2xl font-bold text-gray-900">{user?.user_metadata?.full_name || 'User Name'}</Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={14} color="#6B7280" />
                        <Text className="text-gray-500 ml-1">San Francisco, CA</Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between w-full mt-8 px-8">
                        {stats.map((stat, index) => (
                            <View key={index} className="items-center">
                                <Text className="text-xl font-bold text-indigo-600">{stat.value}</Text>
                                <Text className="text-gray-400 text-xs uppercase tracking-wider mt-1">{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Interests */}
                <View className="p-4 bg-white mt-4 border-y border-gray-100">
                    <View className="flex-row items-center mb-3">
                        <Heart size={18} color="#4F46E5" />
                        <Text className="font-bold text-gray-800 ml-2">Interests</Text>
                    </View>
                    <View className="flex-row flex-wrap">
                        {interests.map((interest) => (
                            <View key={interest} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                                <Text className="text-gray-600 font-medium">{interest}</Text>
                            </View>
                        ))}
                        <TouchableOpacity className="border border-gray-300 border-dashed px-3 py-1 rounded-full mr-2 mb-2">
                            <Text className="text-gray-400 font-medium">+ Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="mt-4 bg-white border-y border-gray-100">
                    <OptionRow
                        icon={<Calendar size={20} color="#374151" />}
                        label="My Events"
                    />
                    <OptionRow
                        icon={<Shield size={20} color="#374151" />}
                        label="Privacy & Security"
                    />
                </View>

                {/* Toggles */}
                <View className="mt-4 bg-white border-y border-gray-100 p-4">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-base font-medium text-gray-900">Ghost Mode</Text>
                            <Text className="text-gray-500 text-xs">Hide your location while using the app</Text>
                        </View>
                        <Switch
                            value={ghostMode}
                            onValueChange={setGhostMode}
                            trackColor={{ false: "#767577", true: "#4F46E5" }}
                        />
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-base font-medium text-gray-900">Notifications</Text>
                            <Text className="text-gray-500 text-xs">Get alerts for nearby events</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: "#767577", true: "#4F46E5" }}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="mx-4 mt-8 mb-10 bg-red-50 p-4 rounded-xl flex-row items-center justify-center"
                    onPress={() => signOut()}
                >
                    <LogOut size={20} color="#DC2626" />
                    <Text className="text-red-600 font-bold ml-2">Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

function OptionRow({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between p-4 border-b border-gray-50"
        >
            <View className="flex-row items-center">
                {icon}
                <Text className="text-gray-700 ml-3 text-base">{label}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
}
