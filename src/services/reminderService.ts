import { scheduleLocalNotification, NotificationTemplates } from './notificationService';
import { Event } from '../store/eventStore';

/**
 * Calculate travel time to event (mock implementation)
 * In production, use Google Maps Distance Matrix API or similar
 */
const estimateTravelTime = async (
    userLat: number,
    userLong: number,
    eventLat: number,
    eventLong: number
): Promise<number> => {
    // Mock: Simple distance calculation
    const distance = Math.sqrt(
        Math.pow(eventLat - userLat, 2) + Math.pow(eventLong - userLong, 2)
    ) * 111; // Convert to km (rough approximation)

    // Estimate: 30 km/h average speed in city
    const travelTimeHours = distance / 30;
    return travelTimeHours * 60; // Return minutes
};

/**
 * Schedule smart reminders for an event including "leave now" notification
 */
export const scheduleSmartReminders = async (
    event: Event,
    userLocation: { latitude: number; longitude: number }
): Promise<void> => {
    const eventTime = new Date(event.start_time);
    const now = new Date();
    const timeUntilEvent = eventTime.getTime() - now.getTime();

    // Calculate travel time
    let travelTimeMinutes = 15; // Default
    if (event.location) {
        travelTimeMinutes = await estimateTravelTime(
            userLocation.latitude,
            userLocation.longitude,
            event.location.latitude,
            event.location.longitude
        );
    }

    // Add buffer time (15 minutes)
    const leaveTime = travelTimeMinutes + 15;

    // Schedule "Leave Now" notification
    if (timeUntilEvent > leaveTime * 60 * 1000) {
        await scheduleLocalNotification({
            title: '🚗 Time to Leave!',
            body: `Leave now to reach ${event.title} on time (${Math.round(travelTimeMinutes)} min travel)`,
            data: { type: 'leave_now', eventId: event.id },
            trigger: Math.floor((timeUntilEvent - leaveTime * 60 * 1000) / 1000),
        });
    }

    // Schedule 1 hour before
    if (timeUntilEvent > 60 * 60 * 1000) {
        await scheduleLocalNotification({
            ...NotificationTemplates.eventStartingSoon(event.title, 60),
            trigger: Math.floor((timeUntilEvent - 60 * 60 * 1000) / 1000),
        });
    }

    // Schedule 1 day before
    if (timeUntilEvent > 24 * 60 * 60 * 1000) {
        await scheduleLocalNotification({
            ...NotificationTemplates.savedEventTomorrow(event.title),
            trigger: Math.floor((timeUntilEvent - 24 * 60 * 60 * 1000) / 1000),
        });
    }
};

/**
 * Cancel reminders for a specific event
 */
export const cancelEventReminders = async (eventId: string): Promise<void> => {
    // In production, store notification IDs mapped to event IDs
    // For now, this is a placeholder
    console.log(`Cancelling reminders for event ${eventId}`);
};
