import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { clsx } from 'clsx';
import { useColorScheme } from 'nativewind';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
    containerClassName?: string;
    icon?: React.ReactNode;
}

export const Input = ({
    label,
    error,
    className,
    containerClassName,
    icon,
    ...props
}: InputProps) => {
    const { colorScheme } = useColorScheme();
    const isDark = true; // Force dark mode look for now based on 'Midnight' theme

    return (
        <View className={clsx("w-full space-y-2", containerClassName)}>
            {label && (
                <Text className="text-text-secondary text-sm font-medium ml-1">
                    {label}
                </Text>
            )}
            <View className={clsx(
                "flex-row items-center w-full px-4 py-3.5 rounded-2xl border transition-all",
                "bg-surface border-surface-highlight focus:border-primary",
                error ? "border-error" : "",
                className
            )}>
                {icon && <View className="mr-3 text-text-secondary">{icon}</View>}
                <TextInput
                    placeholderTextColor="#94A3B8"
                    style={{ fontFamily: 'Outfit_400Regular' }}
                    className="flex-1 text-white text-base"
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-error text-xs ml-1">{error}</Text>
            )}
        </View>
    );
};
