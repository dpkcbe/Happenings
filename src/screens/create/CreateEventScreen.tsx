import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Platform, Image, Modal, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, MapPin, Image as ImageIcon, X, Plus, ChevronLeft, Film } from 'lucide-react-native';
import { useEventStore } from '../../store/eventStore';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Button } from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

export default function CreateEventScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Social');
    const [isPublic, setIsPublic] = useState(true);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [locationData, setLocationData] = useState<{ lat: number, long: number, address: string } | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [userCurrentLocation, setUserCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 19.0760,
        longitude: 72.8777,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const mapRef = useRef<MapView>(null);

    const categories = ['Social', 'Music', 'Sports', 'Wellness', 'Education', 'Food'];

    // Get user's current location on mount for readiness
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Get last known for instant readiness
                const lastLocation = await Location.getLastKnownPositionAsync({});
                if (lastLocation) {
                    const lastCoords = {
                        latitude: lastLocation.coords.latitude,
                        longitude: lastLocation.coords.longitude
                    };
                    setMapRegion(prev => ({ ...prev, ...lastCoords }));
                }

                // Get fresh for accuracy
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
                const coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                };
                setUserCurrentLocation(coords);
                setMapRegion(prev => ({
                    ...prev,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }));
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 0.8,
            videoMaxDuration: 60, // 60 seconds max for reels
        });

        if (!result.canceled) {
            setSelectedVideos([...selectedVideos, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const removeVideo = (index: number) => {
        const newVideos = [...selectedVideos];
        newVideos.splice(index, 1);
        setSelectedVideos(newVideos);
    };

    const handleGetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        // Try getting last known position first for instant result
        const lastLocation = await Location.getLastKnownPositionAsync({});
        if (lastLocation) {
            setLocationData({
                lat: lastLocation.coords.latitude,
                long: lastLocation.coords.longitude,
                address: 'Current Location'
            });
        }

        // Fresh position in background
        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
        }).then(location => {
            const { latitude, longitude } = location.coords;
            setLocationData({ lat: latitude, long: longitude, address: 'Current Location' });
        }).catch(err => console.log('Background location error:', err));
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
            image_url: selectedImages.length > 0 ? selectedImages[0] : null,
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

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const onChangeTime = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <ScreenWrapper className="bg-background">
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-surface border border-surface-highlight rounded-full"
                >
                    <ChevronLeft size={22} color="#F8FAFC" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Host Happening</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Media Section */}
                <View className="mt-6">
                    <Text className="text-white text-lg font-bold mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>Visuals</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-32 h-44 bg-surface rounded-3xl items-center justify-center border border-dashed border-surface-highlight mr-4"
                        >
                            <View className="p-3 bg-primary/10 rounded-2xl">
                                <ImageIcon size={24} color="#C084FC" />
                            </View>
                            <Text className="text-xs text-text-secondary mt-2" style={{ fontFamily: 'Outfit_500Medium' }}>Add Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={pickVideo}
                            className="w-32 h-44 bg-surface rounded-3xl items-center justify-center border border-dashed border-surface-highlight mr-4"
                        >
                            <View className="p-3 bg-secondary/10 rounded-2xl">
                                <Film size={24} color="#F472B6" />
                            </View>
                            <Text className="text-xs text-text-secondary mt-2" style={{ fontFamily: 'Outfit_500Medium' }}>Add Reel</Text>
                        </TouchableOpacity>

                        {selectedImages.map((uri, index) => (
                            <View key={`img-${index}`} className="mr-4 relative">
                                <Image source={{ uri }} className="w-32 h-44 rounded-3xl bg-surface" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-error rounded-full p-1 border-4 border-background"
                                >
                                    <X size={12} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {selectedVideos.map((uri, index) => (
                            <View key={`vid-${index}`} className="mr-4 relative">
                                <View className="w-32 h-44 rounded-3xl bg-surface items-center justify-center border border-secondary/30">
                                    <Film size={48} color="#F472B6" />
                                    <Text className="text-secondary text-xs mt-2" style={{ fontFamily: 'Outfit_700Bold' }}>Reel</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeVideo(index)}
                                    className="absolute -top-2 -right-2 bg-error rounded-full p-1 border-4 border-background"
                                >
                                    <X size={12} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Form Fields */}
                <View className="mt-8 space-y-6">
                    {/* Title */}
                    <View>
                        <Text className="text-text-secondary text-sm font-bold mb-2 ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>TITLE</Text>
                        <TextInput
                            className="bg-surface p-5 rounded-2xl border border-surface-highlight text-white text-lg"
                            style={{ fontFamily: 'Outfit_500Medium' }}
                            placeholder="What's the vibe?"
                            placeholderTextColor="#64748B"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Category */}
                    <View>
                        <Text className="text-text-secondary text-sm font-bold mb-3 ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>CATEGORY</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setCategory(cat)}
                                    className={`mr-3 px-6 py-3 rounded-2xl border ${category === cat ? 'bg-primary border-primary' : 'bg-surface border-surface-highlight'}`}
                                >
                                    <Text
                                        className={`font-bold ${category === cat ? 'text-white' : 'text-text-secondary'}`}
                                        style={{ fontFamily: 'Outfit_700Bold' }}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Date & Time */}
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-text-secondary text-sm font-bold mb-2 ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>WHEN</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="bg-surface p-4 rounded-2xl border border-surface-highlight flex-row items-center"
                            >
                                <Calendar size={18} color="#C084FC" />
                                <Text className="ml-3 text-white font-medium" style={{ fontFamily: 'Outfit_500Medium' }}>{date.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 flex justify-end">
                            <TouchableOpacity
                                onPress={() => setShowTimePicker(true)}
                                className="bg-surface p-4 rounded-2xl border border-surface-highlight flex-row items-center"
                            >
                                <Clock size={18} color="#C084FC" />
                                <Text className="ml-3 text-white font-medium" style={{ fontFamily: 'Outfit_500Medium' }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Location Selection */}
                    <View>
                        <Text className="text-text-secondary text-sm font-bold mb-2 ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>LOCATION</Text>

                        {locationData && (
                            <View className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex-row justify-between items-center mb-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="p-2 bg-primary/20 rounded-xl mr-3">
                                        <MapPin size={18} color="#C084FC" />
                                    </View>
                                    <Text numberOfLines={1} className="text-primary font-bold flex-1" style={{ fontFamily: 'Outfit_700Bold' }}>{locationData.address}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setLocationData(null)} className="p-1">
                                    <X size={16} color="#C084FC" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleGetCurrentLocation}
                                className="flex-1 bg-surface p-4 rounded-2xl border border-surface-highlight flex-row items-center justify-center"
                            >
                                <MapPin size={18} color="#94A3B8" />
                                <Text className="ml-2 text-white font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Current</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    setShowMapPicker(true); // Open immediately

                                    let { status } = await Location.requestForegroundPermissionsAsync();
                                    if (status === 'granted') {
                                        // Try last known first
                                        const lastLocation = await Location.getLastKnownPositionAsync({});
                                        if (lastLocation) {
                                            setMapRegion({
                                                latitude: lastLocation.coords.latitude,
                                                longitude: lastLocation.coords.longitude,
                                                latitudeDelta: 0.05,
                                                longitudeDelta: 0.05,
                                            });
                                        }

                                        // Update with fresh if possible
                                        Location.getCurrentPositionAsync({
                                            accuracy: Location.Accuracy.Balanced
                                        }).then(location => {
                                            setMapRegion({
                                                latitude: location.coords.latitude,
                                                longitude: location.coords.longitude,
                                                latitudeDelta: 0.05,
                                                longitudeDelta: 0.05,
                                            });
                                        }).catch(err => console.log('BG Picker Error:', err));
                                    }
                                }}
                                className="flex-1 bg-surface p-4 rounded-2xl border border-surface-highlight flex-row items-center justify-center"
                            >
                                <MapPin size={18} color="#94A3B8" />
                                <Text className="ml-2 text-white font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Pin Map</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text className="text-text-secondary text-sm font-bold mb-2 ml-1" style={{ fontFamily: 'Outfit_700Bold' }}>DETAILS</Text>
                        <TextInput
                            className="bg-surface p-5 rounded-2xl border border-surface-highlight text-white h-32 text-base"
                            style={{ fontFamily: 'Outfit_400Regular' }}
                            placeholder="Tell more about this happening..."
                            placeholderTextColor="#64748B"
                            multiline
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Privacy Toggle */}
                    <View className="flex-row justify-between items-center bg-surface p-5 rounded-2xl border border-surface-highlight">
                        <View>
                            <Text className="text-white font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Public Event</Text>
                            <Text className="text-text-secondary text-[10px]" style={{ fontFamily: 'Outfit_400Regular' }}>Anyone nearby can see and join</Text>
                        </View>
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{ false: "#1E1E3F", true: "#C084FC" }}
                            thumbColor={isPublic ? "#FFF" : "#94A3B8"}
                        />
                    </View>
                </View>

                {/* Submit Action */}
                <View className="mt-12 mb-12">
                    <Button
                        title="Post Happening"
                        onPress={handleCreate}
                        size="lg"
                    />
                </View>

            </ScrollView>

            {/* Map Picker Modal */}
            <Modal
                visible={showMapPicker}
                animationType="slide"
                onRequestClose={() => setShowMapPicker(false)}
            >
                <View className="flex-1 bg-background">
                    {showMapPicker && (
                        <MapView
                            ref={mapRef}
                            style={{ width: width, height: height, flex: 1 }}
                            initialRegion={mapRegion}
                            onRegionChangeComplete={setMapRegion}
                            showsUserLocation
                            showsMyLocationButton={false}
                        >
                            <Marker
                                coordinate={mapRegion}
                            />
                        </MapView>
                    )}

                    {/* Center Pin Overlay */}
                    <View className="absolute top-1/2 left-1/2 -mt-12 -ml-6 pointer-events-none">
                        <MapPin size={48} color="#C084FC" fill="#050511" />
                    </View>

                    {/* Back Button */}
                    <View className="absolute top-14 left-6">
                        <TouchableOpacity
                            onPress={() => setShowMapPicker(false)}
                            className="bg-surface p-3 rounded-full border border-surface-highlight shadow-2xl"
                        >
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer - Confirm */}
                    <View className="absolute bottom-12 left-6 right-6">
                        <Button
                            title="Set Location"
                            onPress={() => {
                                setLocationData({
                                    lat: mapRegion.latitude,
                                    long: mapRegion.longitude,
                                    address: 'Pinned Location'
                                });
                                setShowMapPicker(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Datetime Pickers */}
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
        </ScreenWrapper>
    );
}
