import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, MapPin, Image as ImageIcon } from 'lucide-react-native';
import { useEventStore } from '../../store/eventStore';
import * as Location from 'expo-location';
import { useColorScheme } from 'nativewind';

export default function CreateEventScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Social');
    const [isPublic, setIsPublic] = useState(true);
    const [maxParticipants, setMaxParticipants] = useState('');

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Simple category selection for now
    const categories = ['Social', 'Music', 'Sports', 'Wellness', 'Education', 'Food'];

    const handleCreate = async () => {
        if (!title || !description) {
            Alert.alert('Please fill in all required fields');
            return;
        }

        // Mock creation - in real app, we'd get location from map picker
        let { status } = await Location.requestForegroundPermissionsAsync();
        let location = { coords: { latitude: 37.7749, longitude: -122.4194 } }; // Default

        if (status === 'granted') {
            location = await Location.getCurrentPositionAsync({});
        }

        useEventStore.getState().addEvent({
            title,
            description,
            category,
            start_time: date.toISOString(),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            is_public: isPublic,
        });

        Alert.alert('Event Created!', 'Your event is now live on the map.');
        navigation.goBack();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const onChangeTime = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const { colorScheme } = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
    const borderColor = colorScheme === 'dark' ? '#1F2937' : '#E5E7EB';
    const inputBg = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB';
    const inputBorder = colorScheme === 'dark' ? '#374151' : '#E5E7EB';

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: bgColor }}>
            <View className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center" style={{ borderColor }}>
                <Text className="text-xl font-bold text-gray-900" style={{ color: textColor }}>Host an Event</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Title */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Event Title</Text>
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-lg"
                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
                        placeholder="e.g. Sunset Yoga"
                        placeholderTextColor="#9CA3AF"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Description</Text>
                    <TextInput
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-32 text-base"
                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
                        placeholder="What's happening? details..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Categories */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-3" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                className={`mr-3 px-4 py-2 rounded-full border ${category === cat ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                                style={{
                                    backgroundColor: category === cat ? '#4F46E5' : (colorScheme === 'dark' ? '#111827' : '#FFFFFF'),
                                    borderColor: category === cat ? '#4F46E5' : inputBorder
                                }}
                            >
                                <Text className={category === cat ? 'text-white font-semibold' : 'text-gray-600'} style={{ color: category === cat ? 'white' : (colorScheme === 'dark' ? '#D1D5DB' : '#4B5563') }}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Date & Time */}
                <View className="mb-6 flex-row gap-4">
                    <View className="flex-1">
                        <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex-row items-center"
                            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
                        >
                            <Calendar size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                            <Text className="ml-2 text-gray-800" style={{ color: textColor }}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Time</Text>
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex-row items-center"
                            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
                        >
                            <Clock size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                            <Text className="ml-2 text-gray-800" style={{ color: textColor }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}

                {/* Location - Simplified for now */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Location</Text>
                    <TouchableOpacity
                        className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex-row items-center justify-center border-dashed border-2"
                        style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(79, 70, 229, 0.1)' : '#EEF2FF', borderColor: colorScheme === 'dark' ? 'rgba(79, 70, 229, 0.3)' : '#E0E7FF' }}
                    >
                        <MapPin size={24} color="#4F46E5" />
                        <Text className="ml-2 text-indigo-600 font-semibold">Use Current Location</Text>
                    </TouchableOpacity>
                </View>

                {/* Privacy Toggle */}
                <View className="mb-8 flex-row justify-between items-center bg-gray-50 p-4 rounded-xl" style={{ backgroundColor: inputBg }}>
                    <View>
                        <Text className="font-semibold text-gray-800" style={{ color: textColor }}>Public Event</Text>
                        <Text className="text-gray-500 text-xs">Visible to everyone nearby</Text>
                    </View>
                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ false: "#767577", true: "#4F46E5" }}
                    />
                </View>

                <TouchableOpacity
                    className="bg-indigo-600 p-4 rounded-xl items-center shadow-lg mb-10"
                    onPress={handleCreate}
                >
                    <Text className="text-white font-bold text-lg">Create Happenings</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
