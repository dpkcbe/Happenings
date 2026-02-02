import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock } from 'lucide-react-native';

type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    }

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    className="px-6"
                >
                    <View className="flex-1 justify-center">
                        <View className="mb-12">
                            <Text className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Happenings
                            </Text>
                            <Text className="text-text-secondary text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>
                                Experience the pulse of your city.
                            </Text>
                        </View>

                        <View className="space-y-6">
                            <Input
                                label="Email Address"
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                icon={<Mail size={20} color="#94A3B8" />}
                            />

                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<Lock size={20} color="#94A3B8" />}
                            />

                            <View className="pt-4">
                                <Button
                                    title="Sign In"
                                    onPress={signInWithEmail}
                                    loading={loading}
                                    size="lg"
                                />
                            </View>

                            <View className="flex-row justify-center mt-8">
                                <Text className="text-text-secondary" style={{ fontFamily: 'Outfit_400Regular' }}>
                                    Don't have an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text className="text-primary font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}
