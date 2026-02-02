import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { clsx } from 'clsx';

interface ScreenWrapperProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    withSafeArea?: boolean;
}

export const ScreenWrapper = ({
    children,
    className,
    withSafeArea = true,
    ...props
}: ScreenWrapperProps) => {
    const Container = withSafeArea ? SafeAreaView : View;

    return (
        <Container
            className={clsx("flex-1 bg-background", className)}
            {...props}
        >
            <StatusBar style="light" />
            {children}
        </Container>
    );
};
