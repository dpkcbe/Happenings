import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <Text className="text-3xl font-bold mb-8 text-indigo-600">Happenings</Text>

            <View className="w-full max-w-sm">
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
                    onPress={signInWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-6 items-center"
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text className="text-gray-600">
                        Don't have an account? <Text className="text-indigo-600 font-semibold">Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
