import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Settings, MapPin, Calendar, Heart, Shield, LogOut, ChevronRight, Bell, Moon } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const [ghostMode, setGhostMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const stats = [
        { label: 'Hosted', value: 12 },
        { label: 'Joined', value: 48 },
        { label: 'Followers', value: 256 },
    ];

    const interests = ['Yoga', 'Tech', 'Music', 'Hiking', 'Foodie'];

    return (
        <ScreenWrapper className="bg-background">
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Profile</Text>
                <TouchableOpacity className="p-2 bg-surface border border-surface-highlight rounded-full">
                    <Settings size={22} color="#F8FAFC" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* User Info Card */}
                <View className="bg-surface border border-surface-highlight p-6 rounded-[32px] items-center mt-4">
                    <View className="relative">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                            className="w-24 h-24 rounded-full border-4 border-primary/20"
                        />
                        <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-surface" />
                    </View>
                    <Text className="text-2xl font-bold text-white mt-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                        {user?.user_metadata?.full_name || 'Happenings User'}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={14} color="#94A3B8" />
                        <Text className="text-text-secondary ml-1" style={{ fontFamily: 'Outfit_400Regular' }}>San Francisco, CA</Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between w-full mt-8 px-4">
                        {stats.map((stat, index) => (
                            <View key={index} className="items-center">
                                <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>{stat.value}</Text>
                                <Text className="text-text-secondary text-[10px] uppercase tracking-widest mt-1" style={{ fontFamily: 'Outfit_500Medium' }}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Gamification Section */}
                <View className="mt-6 bg-surface border border-surface-highlight p-6 rounded-[32px]">
                    <Text className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                        Your Progress
                    </Text>

                    {/* XP & Level */}
                    <View className="mb-5">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-text-secondary text-sm" style={{ fontFamily: 'Outfit_500Medium' }}>
                                Level 3
                            </Text>
                            <Text className="text-text-secondary text-sm" style={{ fontFamily: 'Outfit_500Medium' }}>
                                1,250 / 1,500 XP
                            </Text>
                        </View>
                        <View className="h-2 bg-surface-highlight rounded-full overflow-hidden">
                            <View className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '83%', backgroundColor: '#C084FC' }} />
                        </View>
                    </View>

                    {/* Streak */}
                    <View className="flex-row items-center justify-center bg-surface-highlight rounded-2xl p-4 mb-5 border border-white/5">
                        <Text className="text-4xl mr-2">🔥</Text>
                        <View>
                            <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                                7 Days
                            </Text>
                            <Text className="text-text-secondary text-xs" style={{ fontFamily: 'Outfit_400Regular' }}>
                                Current Streak
                            </Text>
                        </View>
                    </View>

                    {/* Badges Grid */}
                    <View>
                        <Text className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Outfit_700Bold' }}>
                            Badges Earned
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                            <View className="bg-surface-highlight p-4 rounded-2xl border border-primary/30 items-center" style={{ width: '30%' }}>
                                <Text className="text-3xl mb-1">🦋</Text>
                                <Text className="text-white text-xs font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    Social
                                </Text>
                            </View>
                            <View className="bg-surface-highlight p-4 rounded-2xl border border-primary/30 items-center" style={{ width: '30%' }}>
                                <Text className="text-3xl mb-1">🔥</Text>
                                <Text className="text-white text-xs font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    Streak
                                </Text>
                            </View>
                            <View className="bg-surface-highlight p-4 rounded-2xl border border-white/5 items-center opacity-50" style={{ width: '30%' }}>
                                <Text className="text-3xl mb-1">🗺️</Text>
                                <Text className="text-text-secondary text-xs font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                                    Explorer
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Interests */}
                <View className="mt-8">
                    <Text className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>Interests</Text>
                    <View className="flex-row flex-wrap">
                        {interests.map((interest) => (
                            <View key={interest} className="bg-surface-highlight px-4 py-2 rounded-2xl mr-2 mb-2 border border-white/5">
                                <Text className="text-text-primary text-sm font-medium" style={{ fontFamily: 'Outfit_500Medium' }}>{interest}</Text>
                            </View>
                        ))}
                        <TouchableOpacity className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-2xl mr-2 mb-2">
                            <Text className="text-primary text-sm font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>+ Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Groups */}
                <View className="mt-8 space-y-4">
                    <View className="bg-surface border border-surface-highlight rounded-[24px] overflow-hidden">
                        <OptionRow
                            icon={<Calendar size={20} color="#C084FC" />}
                            label="My Events"
                        />
                        <OptionRow
                            icon={<Heart size={20} color="#F472B6" />}
                            label="Favorite Happenings"
                        />
                        <OptionRow
                            icon={<Shield size={20} color="#F8FAFC" />}
                            label="Security & Privacy"
                            isLast
                        />
                    </View>

                    <View className="bg-surface border border-surface-highlight rounded-[24px] p-5 space-y-6">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <View className="p-2 bg-background rounded-xl mr-3">
                                    <Moon size={20} color="#F8FAFC" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Ghost Mode</Text>
                                    <Text className="text-text-secondary text-[10px]" style={{ fontFamily: 'Outfit_400Regular' }}>Hide location on map</Text>
                                </View>
                            </View>
                            <Switch
                                value={ghostMode}
                                onValueChange={setGhostMode}
                                trackColor={{ false: "#1E1E3F", true: "#C084FC" }}
                                thumbColor={ghostMode ? "#FFF" : "#94A3B8"}
                            />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <View className="p-2 bg-background rounded-xl mr-3">
                                    <Bell size={20} color="#F8FAFC" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Notifications</Text>
                                    <Text className="text-text-secondary text-[10px]" style={{ fontFamily: 'Outfit_400Regular' }}>Alerts for nearby events</Text>
                                </View>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: "#1E1E3F", true: "#C084FC" }}
                                thumbColor={notifications ? "#FFF" : "#94A3B8"}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="mt-8 mb-12 flex-row items-center justify-center py-4 rounded-2xl bg-error/10 border border-error/30"
                    onPress={() => signOut()}
                >
                    <LogOut size={20} color="#F87171" />
                    <Text className="text-error font-bold ml-2" style={{ fontFamily: 'Outfit_700Bold' }}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenWrapper>
    );
}

function OptionRow({ icon, label, onPress, isLast }: { icon: React.ReactNode, label: string, onPress?: () => void, isLast?: boolean }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-surface-highlight' : ''}`}
        >
            <View className="flex-row items-center">
                <View className="p-2 bg-background rounded-xl mr-3">
                    {icon}
                </View>
                <Text className="text-white font-bold text-base" style={{ fontFamily: 'Outfit_700Bold' }}>{label}</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
    );
}
