import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            Alert.alert(error.message);
        } else {
            Alert.alert('Check your inbox for email verification!');
        }
        setLoading(false);
    }

    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <Text className="text-3xl font-bold mb-2 text-indigo-600">Join Happenings</Text>
            <Text className="text-gray-500 mb-8">Discover events near you</Text>

            <View className="w-full max-w-sm">
                <TextInput
                    className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-800"
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-800"
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-800"
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="bg-indigo-600 p-4 rounded-lg items-center shadow-lg"
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-6 items-center"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-gray-600">
                        Already have an account? <Text className="text-indigo-600 font-semibold">Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
