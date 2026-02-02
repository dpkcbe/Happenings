import * as Calendar from 'expo-calendar';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Event } from '../store/eventStore';

/**
 * Request calendar permissions
 */
export const requestCalendarPermissions = async (): Promise<boolean> => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
};

/**
 * Generate .ics file content
 */
const generateICSContent = (event: Event): string => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeText = (text: string) => {
        return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Happenings//Event//EN
BEGIN:VEVENT
UID:${event.id}@happenings.app
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${formatDate(event.start_time)}
DTEND:${formatDate(event.end_time)}
SUMMARY:${escapeText(event.title)}
DESCRIPTION:${escapeText(event.description)}
LOCATION:${event.location?.address || 'TBD'}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};

/**
 * Export event to device calendar
 */
export const addToDeviceCalendar = async (event: Event): Promise<boolean> => {
    try {
        const hasPermission = await requestCalendarPermissions();
        if (!hasPermission) {
            console.warn('Calendar permissions not granted');
            return false;
        }

        // Get default calendar
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

        if (!defaultCalendar) {
            console.warn('No writable calendar found');
            return false;
        }

        // Create event
        await Calendar.createEventAsync(defaultCalendar.id, {
            title: event.title,
            startDate: new Date(event.start_time),
            endDate: new Date(event.end_time),
            location: event.location?.address,
            notes: event.description,
            timeZone: 'Asia/Kolkata', // Adjust based on user location
            alarms: [
                { relativeOffset: -60 }, // 1 hour before
                { relativeOffset: -1440 }, // 1 day before
            ],
        });

        return true;
    } catch (error) {
        console.error('Failed to add to calendar:', error);
        return false;
    }
};

/**
 * Export event as .ics file and share
 */
export const exportAndShareICS = async (event: Event): Promise<boolean> => {
    try {
        const icsContent = generateICSContent(event);
        const fileName = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        // Write file
        await FileSystem.writeAsStringAsync(filePath, icsContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        // Share
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath, {
                mimeType: 'text/calendar',
                dialogTitle: 'Add to Calendar',
            });
            return true;
        } else {
            console.warn('Sharing not available on this platform');
            return false;
        }
    } catch (error) {
        console.error('Failed to export ICS:', error);
        return false;
    }
};

/**
 * Batch export multiple events
 */
export const exportMultipleEvents = async (events: Event[]): Promise<boolean> => {
    try {
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Happenings//Events//EN
`;

        events.forEach(event => {
            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            const escapeText = (text: string) => {
                return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
            };

            icsContent += `BEGIN:VEVENT
UID:${event.id}@happenings.app
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${formatDate(event.start_time)}
DTEND:${formatDate(event.end_time)}
SUMMARY:${escapeText(event.title)}
DESCRIPTION:${escapeText(event.description)}
LOCATION:${event.location?.address || 'TBD'}
STATUS:CONFIRMED
END:VEVENT
`;
        });

        icsContent += 'END:VCALENDAR';

        const fileName = `Happenings_Events_${new Date().getTime()}.ics`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, icsContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath, {
                mimeType: 'text/calendar',
                dialogTitle: 'Export Events',
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Failed to export multiple events:', error);
        return false;
    }
};
