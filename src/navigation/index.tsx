import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { ActivityIndicator, View } from 'react-native';
import { Home, Map, PlusSquare, MessageSquare, User, Film } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import FeedScreen from '../screens/feed/FeedScreen';
import ReelsScreen from '../screens/reels/ReelsScreen';
import MapScreen from '../screens/map/MapScreen';
import CreateEventScreen from '../screens/create/CreateEventScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChatScreen from '../screens/messages/ChatScreen';

import { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
        </AuthStack.Navigator>
    );
}

function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#C084FC',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#1E1E3F',
                    backgroundColor: '#050511',
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 65,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontFamily: 'Outfit_500Medium',
                }
            }}
        >
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    title: 'Happenings'
                }}
            />
            <Tab.Screen
                name="Reels"
                component={ReelsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Film color={color} size={size} />,
                    title: 'Reels'
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
                    title: 'Map'
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateEventScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <PlusSquare color={color} size={size} />,
                    title: 'Host'
                }}
            />
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
                    title: 'Chats'
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    title: 'Profile'
                }}
            />
        </Tab.Navigator>
    );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { session, loading, initialize } = useAuthStore();
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        initialize();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }



    return (
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {session ? (
                    <>
                        <RootStack.Screen name="Main" component={MainNavigator} />
                        <RootStack.Screen name="Chat" component={ChatScreen} />
                    </>
                ) : (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
