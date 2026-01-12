import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { ActivityIndicator, View } from 'react-native';
import { Home, Map, PlusSquare, MessageSquare, User } from 'lucide-react-native';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import FeedScreen from '../screens/feed/FeedScreen';
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
                tabBarActiveTintColor: '#4F46E5', // Indigo-600
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    backgroundColor: 'white',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
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
        <NavigationContainer>
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
