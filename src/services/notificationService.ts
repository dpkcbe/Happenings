import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export interface NotificationConfig {
    title: string;
    body: string;
    data?: any;
    trigger?: 'immediate' | number; // seconds or immediate
}

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
    }

    // Get push token for remote notifications (requires EAS)
    if (Platform.OS !== 'web') {
        try {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Push token:', token);
            // TODO: Send token to backend
        } catch (error) {
            console.warn('Failed to get push token:', error);
        }
    }

    return true;
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
    config: NotificationConfig
): Promise<string | null> => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return null;

        const trigger = config.trigger === 'immediate'
            ? null
            : { seconds: config.trigger || 5 };

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: config.title,
                body: config.body,
                data: config.data || {},
            },
            trigger,
        });

        return id;
    } catch (error) {
        console.error('Failed to schedule notification:', error);
        return null;
    }
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Event-specific notification helpers
 */
export const NotificationTemplates = {
    eventStartingSoon: (eventTitle: string, minutesUntil: number) => ({
        title: '🎉 Event Starting Soon!',
        body: `${eventTitle} starts in ${minutesUntil} minutes`,
        data: { type: 'event_reminder' },
    }),

    friendJoinedEvent: (friendName: string, eventTitle: string) => ({
        title: '👋 Friend Joined!',
        body: `${friendName} is going to ${eventTitle}`,
        data: { type: 'friend_activity' },
    }),

    newRecommendation: (eventTitle: string) => ({
        title: '✨ New Event For You',
        body: `Check out ${eventTitle} - we think you\'ll love it!`,
        data: { type: 'recommendation' },
    }),

    streakReminder: (streakDays: number) => ({
        title: '🔥 Keep Your Streak!',
        body: `You're on a ${streakDays}-day streak. Find an event today!`,
        data: { type: 'streak_reminder' },
    }),

    savedEventTomorrow: (eventTitle: string) => ({
        title: '📅 Event Tomorrow',
        body: `Don't forget: ${eventTitle} is tomorrow!`,
        data: { type: 'saved_event_reminder' },
    }),
};

/**
 * Schedule reminder for an event
 */
export const scheduleEventReminders = async (
    eventId: string,
    eventTitle: string,
    eventTime: Date
): Promise<void> => {
    const now = new Date();
    const timeUntilEvent = eventTime.getTime() - now.getTime();

    // 1 day before
    if (timeUntilEvent > 24 * 60 * 60 * 1000) {
        await scheduleLocalNotification({
            ...NotificationTemplates.savedEventTomorrow(eventTitle),
            trigger: Math.floor((timeUntilEvent - 24 * 60 * 60 * 1000) / 1000),
        });
    }

    // 1 hour before
    if (timeUntilEvent > 60 * 60 * 1000) {
        await scheduleLocalNotification({
            ...NotificationTemplates.eventStartingSoon(eventTitle, 60),
            trigger: Math.floor((timeUntilEvent - 60 * 60 * 1000) / 1000),
        });
    }

    // 30 minutes before
    if (timeUntilEvent > 30 * 60 * 1000) {
        await scheduleLocalNotification({
            ...NotificationTemplates.eventStartingSoon(eventTitle, 30),
            trigger: Math.floor((timeUntilEvent - 30 * 60 * 1000) / 1000),
        });
    }
};
