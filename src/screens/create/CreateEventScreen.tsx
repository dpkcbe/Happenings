import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Platform, Image, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, MapPin, Image as ImageIcon, X, Plus } from 'lucide-react-native';
import { useEventStore } from '../../store/eventStore';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useColorScheme } from 'nativewind';

const { width, height } = Dimensions.get('window');

export default function CreateEventScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Social');
    const [isPublic, setIsPublic] = useState(true);
    // const [maxParticipants, setMaxParticipants] = useState(''); // Unused for now

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Media
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // Location
    const [locationData, setLocationData] = useState<{ lat: number, long: number, address: string } | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 19.0760,
        longitude: 72.8777,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const mapRef = useRef<MapView>(null);

    // Simple category selection for now
    const categories = ['Social', 'Music', 'Sports', 'Wellness', 'Education', 'Food'];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Photos or Videos? User said photos or reels. Let's allowing All if possible or just Images for now to be safe.
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const handleGetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        // In real app, reverse geocode here
        setLocationData({ lat: latitude, long: longitude, address: 'Current Location' });
    };

    const handleCreate = async () => {
        if (!title || !description) {
            Alert.alert('Please fill in all required fields');
            return;
        }

        if (!locationData) {
            Alert.alert('Please select a location');
            return;
        }

        useEventStore.getState().addEvent({
            title,
            description,
            category,
            start_time: date.toISOString(),
            image_url: selectedImages.length > 0 ? selectedImages[0] : null, // Use first image as main
            location: {
                latitude: locationData.lat,
                longitude: locationData.long,
                address: locationData.address
            },
            is_public: isPublic,
        });

        Alert.alert('Event Created!', 'Your event is now live on the map.');
        navigation.navigate('Feed' as never);
    };

    // ... date handlers same ...

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
                <TouchableOpacity onPress={() => navigation.navigate('Feed' as never)}>
                    <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Media Section */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-3" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Add Photos or Reels</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-24 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 mr-3"
                        >
                            <Plus size={24} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                            <Text className="text-xs text-gray-500 mt-1">Add</Text>
                        </TouchableOpacity>

                        {selectedImages.map((uri, index) => (
                            <View key={index} className="mr-3 relative">
                                <Image source={{ uri }} className="w-24 h-32 rounded-xl bg-gray-200" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                >
                                    <X size={12} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

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

                {/* Location */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2" style={{ color: colorScheme === 'dark' ? '#9CA3AF' : '#374151' }}>Location</Text>

                    {locationData ? (
                        <View className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex-row justify-between items-center mb-3" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(79, 70, 229, 0.1)' : '#EEF2FF', borderColor: '#4F46E5' }}>
                            <View className="flex-row items-center flex-1">
                                <MapPin size={20} color="#4F46E5" />
                                <Text numberOfLines={1} className="ml-2 text-indigo-700 font-medium flex-1">{locationData.address}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setLocationData(null)}>
                                <X size={16} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleGetCurrentLocation}
                            className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
                            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
                        >
                            <MapPin size={18} color={colorScheme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                            <Text className="ml-2 font-medium" style={{ color: textColor }}>Current Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowMapPicker(true)}
                            className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
                            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
                        >
                            <MapPin size={18} color={colorScheme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                            <Text className="ml-2 font-medium" style={{ color: textColor }}>Pin on Map</Text>
                        </TouchableOpacity>
                    </View>
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

            {/* Map Picker Modal */}
            <Modal
                visible={showMapPicker}
                animationType="slide"
                onRequestClose={() => setShowMapPicker(false)}
            >
                <View className="flex-1 bg-white">
                    <MapView
                        ref={mapRef}
                        style={{ width: width, height: height, flex: 1 }}
                        initialRegion={mapRegion}
                        onRegionChangeComplete={setMapRegion}
                        showsUserLocation
                        showsMyLocationButton
                    >
                        <Marker
                            coordinate={mapRegion}
                            title="Selected Location"
                            description="Move map to pin location"
                        />
                        {/* We can make a fixed center pin overlay instead of a marker that moves with region, 
                             or sticky marker. For simplicity, let's assume the center of the map is the selection. 
                             Actually, let's use a center view overlay. */}
                    </MapView>

                    {/* Center Pin Overlay */}
                    <View className="absolute top-1/2 left-1/2 -mt-9 -ml-4 pointer-events-none" style={{ marginTop: -36, marginLeft: -16 }}>
                        <MapPin size={48} color="#4F46E5" fill="white" />
                    </View>

                    {/* Header */}
                    <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => setShowMapPicker(false)}
                            className="bg-white p-3 rounded-full shadow-lg"
                        >
                            <X size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer - Confirm */}
                    <View className="absolute bottom-10 left-6 right-6">
                        <TouchableOpacity
                            className="bg-indigo-600 p-4 rounded-xl items-center shadow-lg"
                            onPress={() => {
                                setLocationData({
                                    lat: mapRegion.latitude,
                                    long: mapRegion.longitude,
                                    address: 'Pinned Location' // Placeholder
                                });
                                setShowMapPicker(false);
                            }}
                        >
                            <Text className="text-white font-bold text-lg">Confirm Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
