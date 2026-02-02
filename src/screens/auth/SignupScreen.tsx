import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, User as UserIcon } from 'lucide-react-native';

type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        if (!email || !password || !fullName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
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
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Check your inbox for email verification!');
        }
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
                    <View className="flex-1 justify-center py-12">
                        <View className="mb-12">
                            <Text className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Create Account
                            </Text>
                            <Text className="text-text-secondary text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>
                                Start discovering amazing events.
                            </Text>
                        </View>

                        <View className="space-y-6">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={fullName}
                                onChangeText={setFullName}
                                icon={<UserIcon size={20} color="#94A3B8" />}
                            />

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
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<Lock size={20} color="#94A3B8" />}
                            />

                            <View className="pt-4">
                                <Button
                                    title="Sign Up"
                                    onPress={signUpWithEmail}
                                    loading={loading}
                                    size="lg"
                                />
                            </View>

                            <View className="flex-row justify-center mt-8">
                                <Text className="text-text-secondary" style={{ fontFamily: 'Outfit_400Regular' }}>
                                    Already have an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Text className="text-primary font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                                        Sign In
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
