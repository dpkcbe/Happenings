import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useColorScheme } from 'nativewind';
import { Settings, MapPin, Calendar, Heart, Shield, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const { colorScheme, setColorScheme } = useThemeStore();
    const { colorScheme: activeColorScheme } = useColorScheme();
    const [ghostMode, setGhostMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const iconColor = activeColorScheme === 'dark' ? '#9CA3AF' : '#374151';

    // Mock Data
    const stats = [
        { label: 'Hosted', value: 12 },
        { label: 'Joined', value: 48 },
        { label: 'Followers', value: 256 },
    ];

    const interests = ['Yoga', 'Tech', 'Music', 'Hiking', 'Foodie'];

    const textColor = colorScheme === 'dark' ? 'white' : '#111827';
    const subTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    const secondaryBgColor = colorScheme === 'dark' ? '#111827' : '#FFFFFF';
    const borderColor = colorScheme === 'dark' ? '#1F2937' : '#F3F4F6';

    return (
        <SafeAreaView
            className="flex-1 bg-white dark:bg-black"
            edges={['top']}
            style={{ backgroundColor: bgColor }}
        >
            {/* Header */}
            <View
                className="px-4 py-3 flex-row justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                style={{ backgroundColor: secondaryBgColor, borderColor: borderColor }}
            >
                <Text className="text-xl font-bold text-gray-900 dark:text-white" style={{ color: textColor }}>Profile</Text>
                <TouchableOpacity>
                    <Settings size={24} color={iconColor} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 bg-gray-50 dark:bg-black"
                style={{ backgroundColor: colorScheme === 'dark' ? '#000000' : '#F9FAFB' }}
            >
                {/* User Info */}
                <View
                    className="bg-white dark:bg-gray-900 p-6 items-center border-b border-gray-100 dark:border-gray-800"
                    style={{ backgroundColor: secondaryBgColor, borderColor: borderColor }}
                >
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                        className="w-24 h-24 rounded-full border-4 border-indigo-50 dark:border-indigo-900 mb-3"
                    />
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white" style={{ color: textColor }}>{user?.user_metadata?.full_name || 'User Name'}</Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={14} color="#6B7280" />
                        <Text className="text-gray-500 dark:text-gray-400 ml-1" style={{ color: subTextColor }}>San Francisco, CA</Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between w-full mt-8 px-8">
                        {stats.map((stat, index) => (
                            <View key={index} className="items-center">
                                <Text className="text-xl font-bold text-gray-900 dark:text-white" style={{ color: textColor }}>{stat.value}</Text>
                                <Text className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mt-1">{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Interests */}
                <View
                    className="p-4 bg-white dark:bg-gray-900 mt-4 border-y border-gray-100 dark:border-gray-800"
                    style={{ backgroundColor: secondaryBgColor, borderColor: borderColor }}
                >
                    <View className="flex-row items-center mb-3">
                        <Heart size={18} color="#4F46E5" />
                        <Text className="font-bold text-gray-800 dark:text-gray-200 ml-2" style={{ color: textColor }}>Interests</Text>
                    </View>
                    <View className="flex-row flex-wrap">
                        {interests.map((interest) => (
                            <View key={interest} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mr-2 mb-2" style={{ backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6' }}>
                                <Text className="text-gray-600 dark:text-gray-300 font-medium" style={{ color: subTextColor }}>{interest}</Text>
                            </View>
                        ))}
                        <TouchableOpacity className="border border-gray-300 dark:border-gray-700 border-dashed px-3 py-1 rounded-full mr-2 mb-2">
                            <Text className="text-gray-400 dark:text-gray-500 font-medium">+ Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View
                    className="mt-4 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800"
                    style={{ backgroundColor: secondaryBgColor, borderColor: borderColor }}
                >
                    <OptionRow
                        icon={<Calendar size={20} color={iconColor} />}
                        label="My Events"
                        textColor={textColor}
                    />
                    <OptionRow
                        icon={<Shield size={20} color={iconColor} />}
                        label="Privacy & Security"
                        textColor={textColor}
                    />
                </View>

                {/* Appearance */}
                <View
                    className="mt-4 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 p-4"
                    style={{ backgroundColor: secondaryBgColor, borderColor: borderColor }}
                >
                    <View className="mb-4">
                        <Text className="text-base font-medium text-gray-900 dark:text-white mb-2" style={{ color: textColor }}>Appearance</Text>
                        <View className="flex-row bg-gray-100 dark:bg-gray-800 p-1 rounded-lg" style={{ backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6' }}>
                            {(['light', 'dark', 'system'] as const).map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setColorScheme(mode)}
                                    className={`flex-1 py-2 items-center rounded-md ${colorScheme === mode ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                                    style={{ backgroundColor: colorScheme === mode ? (colorScheme === 'dark' ? '#4B5563' : '#FFFFFF') : 'transparent' }}
                                >
                                    <Text className={`capitalize font-medium ${colorScheme === mode ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {mode}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-base font-medium text-gray-900 dark:text-white" style={{ color: textColor }}>Ghost Mode</Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">Hide your location while using the app</Text>
                        </View>
                        <Switch
                            value={ghostMode}
                            onValueChange={setGhostMode}
                            trackColor={{ false: "#767577", true: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}
                        />
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-base font-medium text-gray-900 dark:text-white" style={{ color: textColor }}>Notifications</Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">Get alerts for nearby events</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: "#767577", true: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="mx-4 mt-8 mb-10 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex-row items-center justify-center"
                    onPress={() => signOut()}
                >
                    <LogOut size={20} color="#DC2626" />
                    <Text className="text-red-600 font-bold ml-2">Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView >
    );
}

function OptionRow({ icon, label, onPress, textColor }: { icon: React.ReactNode, label: string, onPress?: () => void, textColor?: string }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800"
            style={{ borderColor: textColor === 'white' ? '#1F2937' : '#F9FAFB' }}
        >
            <View className="flex-row items-center">
                {icon}
                <Text className="text-gray-700 dark:text-gray-200 ml-3 text-base" style={{ color: textColor }}>{label}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
}
