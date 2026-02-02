import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
    textClassName?: string;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    className,
    textClassName,
}: ButtonProps) => {
    const baseStyles = "flex-row items-center justify-center rounded-full active:opacity-90 transition-all";

    const sizeStyles = {
        sm: "px-4 py-2",
        md: "px-6 py-3.5",
        lg: "px-8 py-4",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    const variantStyles = {
        primary: "", // Handled by LinearGradient
        secondary: "bg-surface border border-surface-highlight shadow-sm",
        ghost: "bg-transparent",
        outline: "bg-transparent border border-primary/50",
    };

    const textStyles = {
        primary: "text-white font-bold",
        secondary: "text-text-primary font-medium",
        ghost: "text-text-secondary font-medium hover:text-primary",
        outline: "text-primary font-bold",
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#C084FC'} className="mr-2" />
            ) : icon ? (
                <View className="mr-2">{icon}</View>
            ) : null}
            <Text className={clsx(textSizes[size], textStyles[variant], textClassName)}>
                {title}
            </Text>
        </>
    );

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                className={clsx(baseStyles, "overflow-hidden shadow-lg shadow-primary/30", className)}
            >
                <LinearGradient
                    colors={['#C084FC', '#F472B6']} // Purple 400 to Pink 400
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className={clsx(sizeStyles[size], "flex-row items-center justify-center w-full")}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        >
            {content}
        </TouchableOpacity>
    );
};
