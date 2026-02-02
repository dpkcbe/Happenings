import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';

export interface FilterOptions {
    categories: string[];
    maxDistance: number;
    priceFilter: 'all' | 'free' | 'paid';
    vibes: string[];
    accessibility: string[];
}

interface FilterSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

const CATEGORIES = ['Social', 'Music', 'Sports', 'Wellness', 'Education', 'Food', 'Tech', 'Art'];
const VIBES = ['Chill', 'Energetic', 'Romantic', 'Professional', 'Casual'];
const ACCESSIBILITY = ['Wheelchair Accessible', 'Quiet Space', 'ASL Interpreter'];

export default function FilterSheet({ visible, onClose, onApply, currentFilters }: FilterSheetProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);

    const toggleCategory = (category: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const toggleVibe = (vibe: string) => {
        setFilters(prev => ({
            ...prev,
            vibes: prev.vibes.includes(vibe)
                ? prev.vibes.filter(v => v !== vibe)
                : [...prev.vibes, vibe]
        }));
    };

    const toggleAccessibility = (feature: string) => {
        setFilters(prev => ({
            ...prev,
            accessibility: prev.accessibility.includes(feature)
                ? prev.accessibility.filter(a => a !== feature)
                : [...prev.accessibility, feature]
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            categories: [],
            maxDistance: 50,
            priceFilter: 'all',
            vibes: [],
            accessibility: []
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-background rounded-t-[32px] max-h-[85%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 py-5 border-b border-surface-highlight">
                        <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                            Filters
                        </Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={24} color="#F8FAFC" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
                        {/* Categories */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Categories
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        onPress={() => toggleCategory(category)}
                                        className={`px-5 py-3 rounded-2xl border ${filters.categories.includes(category)
                                                ? 'bg-primary border-primary'
                                                : 'bg-surface border-surface-highlight'
                                            }`}
                                    >
                                        <Text
                                            className={filters.categories.includes(category) ? 'text-white font-bold' : 'text-text-secondary'}
                                            style={{ fontFamily: 'Outfit_700Bold' }}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Distance */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Distance: {filters.maxDistance}km
                            </Text>
                            <View className="bg-surface rounded-2xl p-4">
                                <Text className="text-text-secondary text-sm" style={{ fontFamily: 'Outfit_400Regular' }}>
                                    Distance slider would be here
                                </Text>
                            </View>
                        </View>

                        {/* Price */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Price
                            </Text>
                            <View className="flex-row gap-3">
                                {(['all', 'free', 'paid'] as const).map((price) => (
                                    <TouchableOpacity
                                        key={price}
                                        onPress={() => setFilters(prev => ({ ...prev, priceFilter: price }))}
                                        className={`flex-1 px-5 py-3 rounded-2xl border ${filters.priceFilter === price
                                                ? 'bg-primary border-primary'
                                                : 'bg-surface border-surface-highlight'
                                            }`}
                                    >
                                        <Text
                                            className={filters.priceFilter === price ? 'text-white font-bold text-center' : 'text-text-secondary text-center'}
                                            style={{ fontFamily: 'Outfit_700Bold' }}
                                        >
                                            {price.charAt(0).toUpperCase() + price.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Vibes */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Vibe
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {VIBES.map((vibe) => (
                                    <TouchableOpacity
                                        key={vibe}
                                        onPress={() => toggleVibe(vibe)}
                                        className={`px-5 py-3 rounded-2xl border ${filters.vibes.includes(vibe)
                                                ? 'bg-primary border-primary'
                                                : 'bg-surface border-surface-highlight'
                                            }`}
                                    >
                                        <Text
                                            className={filters.vibes.includes(vibe) ? 'text-white font-bold' : 'text-text-secondary'}
                                            style={{ fontFamily: 'Outfit_700Bold' }}
                                        >
                                            {vibe}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Accessibility */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Accessibility
                            </Text>
                            {ACCESSIBILITY.map((feature) => (
                                <View
                                    key={feature}
                                    className="flex-row justify-between items-center bg-surface p-4 rounded-2xl mb-3 border border-surface-highlight"
                                >
                                    <Text className="text-white" style={{ fontFamily: 'Outfit_400Regular' }}>
                                        {feature}
                                    </Text>
                                    <Switch
                                        value={filters.accessibility.includes(feature)}
                                        onValueChange={() => toggleAccessibility(feature)}
                                        trackColor={{ false: '#1E1E3F', true: '#C084FC' }}
                                        thumbColor={filters.accessibility.includes(feature) ? '#FFF' : '#94A3B8'}
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View className="px-6 py-5 border-t border-surface-highlight flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleReset}
                            className="flex-1 bg-surface border border-surface-highlight py-4 rounded-2xl"
                        >
                            <Text className="text-white font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Reset
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleApply}
                            className="flex-1 bg-primary py-4 rounded-2xl"
                        >
                            <Text className="text-white font-bold text-center" style={{ fontFamily: 'Outfit_700Bold' }}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
