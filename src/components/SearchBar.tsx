import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search events...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'Yoga', 'Tech meetups', 'Live music', 'Food'
    ]);
    const [showRecent, setShowRecent] = useState(false);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.length > 0) {
            setTimeout(() => onSearch(text), 300); // Debounce
        } else {
            onSearch('');
        }
    };

    const selectRecent = (search: string) => {
        setQuery(search);
        onSearch(search);
        setShowRecent(false);
    };

    return (
        <View className="mb-4">
            <View className="relative">
                <View className="flex-row items-center bg-surface border border-surface-highlight rounded-2xl px-4 py-3">
                    <Search size={20} color="#94A3B8" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-base"
                        style={{ fontFamily: 'Outfit_400Regular' }}
                        placeholder={placeholder}
                        placeholderTextColor="#64748B"
                        value={query}
                        onChangeText={handleSearch}
                        onFocus={() => setShowRecent(true)}
                        onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <X size={18} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>

                {showRecent && recentSearches.length > 0 && (
                    <View className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface-highlight rounded-2xl overflow-hidden z-50">
                        {recentSearches.map((search, index) => (
                            <TouchableOpacity
                                key={index}
                                className="px-4 py-3 border-b border-surface-highlight/50"
                                onPress={() => selectRecent(search)}
                            >
                                <Text className="text-white" style={{ fontFamily: 'Outfit_400Regular' }}>
                                    {search}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}
