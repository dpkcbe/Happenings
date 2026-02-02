import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Attendee } from './socialStore';

export interface Event {
    id: string;
    title: string;
    description: string;
    host_id: string;
    host_name: string;
    image_url: string | null;
    category: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    start_time: string;
    end_time: string;
    created_at: string;
    is_public: boolean;
    max_participants: number | null;
    attendees_count: number;
    distance?: number; // Calculated field
    attendees?: Attendee[]; // Detailed attendee list
    is_trending?: boolean;
    is_saved?: boolean;
}

interface EventState {
    events: Event[];
    savedEventIds: string[];
    loading: boolean;
    fetchEvents: (lat: number, long: number) => Promise<void>;
    addEvent: (event: Partial<Event>) => Promise<void>;
    toggleSaveEvent: (eventId: string) => void;
    isSaved: (eventId: string) => boolean;
    attendEvent: (eventId: string, userId: string, userName: string, avatarUrl: string) => void;
}

// Mock data for initial UI development
const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Mumbai Tech Meetup',
        description: 'Join us for an evening of networking and tech talks with industry leaders.',
        host_id: 'host1',
        host_name: 'Tech Mumbai',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        category: 'Tech',
        location: {
            latitude: 19.0760,
            longitude: 72.8777,
            address: 'BKC, Mumbai',
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // +2 days
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 27).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        is_public: true,
        max_participants: 100,
        attendees_count: 45,
        distance: 2.5
    },
    {
        id: '2',
        title: 'Bollywood Dance Workshop',
        description: 'Learn the latest Bollywood moves in this fun, energetic workshop!',
        host_id: 'host2',
        host_name: 'Dance with Me',
        image_url: 'https://images.unsplash.com/photo-1545959863-7150c2fa973b?w=800&q=80',
        category: 'Dance',
        location: {
            latitude: 19.0596,
            longitude: 72.8295,
            address: 'Bandra West, Mumbai',
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        is_public: true,
        max_participants: 30,
        attendees_count: 12,
        distance: 5.1
    },
    {
        id: '3',
        title: 'Street Food Walk',
        description: 'Explore the famous street food of Mumbai. Vada Pav, Pav Bhaji and more!',
        host_id: 'host3',
        host_name: 'Mumbai Foodies',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
        category: 'Food',
        location: {
            latitude: 18.9220,
            longitude: 72.8347,
            address: 'Fort, Mumbai',
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 27).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        is_public: true,
        max_participants: 20,
        attendees_count: 18,
        distance: 12.0
    },
    {
        id: '4',
        title: 'Bangalore Startup Pitch',
        description: 'Pitch your startup idea to top VCs in Bangalore.',
        host_id: 'host4',
        host_name: 'Startup Grid',
        image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        category: 'Business',
        location: {
            latitude: 12.9716,
            longitude: 77.5946,
            address: 'Indiranagar, Bangalore',
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 32).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        is_public: true,
        max_participants: 50,
        attendees_count: 50,
        distance: 850.0
    },
    {
        id: '5',
        title: 'Yoga by the Sea',
        description: 'Morning yoga session at Marine Drive.',
        host_id: 'host5',
        host_name: 'Yoga Life',
        image_url: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80',
        category: 'Health',
        location: {
            latitude: 18.944,
            longitude: 72.823,
            address: 'Marine Drive, Mumbai',
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        is_public: true,
        max_participants: 50,
        attendees_count: 22,
        distance: 12.5
    },
    {
        id: '6',
        title: 'Yoga Life Competition',
        description: 'Join the ultimate Yoga Life Competition! Show off your flexibility and strength.',
        host_id: 'host6',
        host_name: 'Yoga Life',
        image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        category: 'Health',
        location: {
            latitude: 12.8452,
            longitude: 77.6602,
            address: 'M5 Ecity Mall'
        },
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        is_public: true,
        max_participants: 100,
        attendees_count: 89,
        distance: 0.5
    }
];

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    savedEventIds: [],
    loading: false,

    fetchEvents: async (lat: number, long: number) => {
        set({ loading: true });
        // TODO: Implement actual Supabase fetch
        // const { data, error } = await supabase.from('events').select('*');

        // Mark saved events and add trending flags
        setTimeout(() => {
            const { savedEventIds } = get();
            const eventsWithFlags = MOCK_EVENTS.map(event => ({
                ...event,
                is_saved: savedEventIds.includes(event.id),
                is_trending: event.attendees_count > 40 ||
                    (!!event.max_participants && event.attendees_count / event.max_participants > 0.7)
            }));
            set({ loading: false, events: eventsWithFlags });
        }, 300);
    },

    addEvent: async (newEvent: Partial<Event>) => {
        // Mock implementation
        const event: Event = {
            id: Math.random().toString(),
            title: newEvent.title || 'New Event',
            description: newEvent.description || '',
            host_id: 'current_user',
            host_name: 'You',
            image_url: null,
            category: newEvent.category || 'Social',
            location: newEvent.location || {
                latitude: 19.0760,
                longitude: 72.8777,
                address: 'Mumbai, India'
            },
            start_time: newEvent.start_time || new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(), // +1 hour
            created_at: new Date().toISOString(),
            is_public: true,
            max_participants: 100,
            attendees_count: 1,
            distance: 0,
            is_trending: false,
            is_saved: false,
            ...newEvent,
        } as Event;

        set((state) => ({ events: [event, ...state.events] }));
    },

    toggleSaveEvent: (eventId: string) => {
        set((state) => {
            const isSaved = state.savedEventIds.includes(eventId);
            const newSavedIds = isSaved
                ? state.savedEventIds.filter(id => id !== eventId)
                : [...state.savedEventIds, eventId];

            // Update event flags
            const updatedEvents = state.events.map(event =>
                event.id === eventId ? { ...event, is_saved: !isSaved } : event
            );

            return { savedEventIds: newSavedIds, events: updatedEvents };
        });
    },

    isSaved: (eventId: string) => {
        return get().savedEventIds.includes(eventId);
    },

    attendEvent: (eventId: string, userId: string, userName: string, avatarUrl: string) => {
        set((state) => ({
            events: state.events.map(event => {
                if (event.id === eventId) {
                    const newAttendee: Attendee = {
                        user_id: userId,
                        name: userName,
                        avatar_url: avatarUrl,
                        is_friend: false
                    };
                    return {
                        ...event,
                        attendees_count: event.attendees_count + 1,
                        attendees: [...(event.attendees || []), newAttendee]
                    };
                }
                return event;
            })
        }));
    }
}));
