import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Event {
    id: string;
    title: string;
    description: string;
    host_id: string;
    host_name: string;
    image_url: string | null;
    category: string;
    latitude: number;
    longitude: number;
    start_time: string;
    end_time: string;
    is_public: boolean;
    max_participants: number | null;
    attendees_count: number;
    distance?: number; // Calculated field
}

interface EventState {
    events: Event[];
    loading: boolean;
    fetchEvents: (lat: number, long: number) => Promise<void>;
    addEvent: (event: Partial<Event>) => Promise<void>;
}

// Mock data for initial UI development
const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Sunset Yoga on the Beach',
        description: 'Join us for a relaxing yoga session as the sun goes down. All levels welcome!',
        host_id: 'host1',
        host_name: 'Sarah Jenkins',
        image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee32bede?w=800&q=80',
        category: 'Wellness',
        latitude: 37.7749,
        longitude: -122.4194,
        start_time: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        is_public: true,
        max_participants: 20,
        attendees_count: 12,
        distance: 0.5,
    },
    {
        id: '2',
        title: 'Tech Networking Mixer',
        description: 'Meet local developers and entrepreneurs. Pizza and drinks provided.',
        host_id: 'host2',
        host_name: 'TechHub SF',
        image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
        category: 'Social',
        latitude: 37.7849,
        longitude: -122.4094,
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        is_public: true,
        max_participants: 50,
        attendees_count: 45,
        distance: 1.2,
    },
    {
        id: '3',
        title: 'Live Jazz Night',
        description: 'Enjoy smooth jazz and cocktails at The Blue Note.',
        host_id: 'host3',
        host_name: 'The Blue Note',
        image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
        category: 'Music',
        latitude: 37.7649,
        longitude: -122.4294,
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
        is_public: true,
        max_participants: 100,
        attendees_count: 88,
        distance: 2.5,
    },
];

export const useEventStore = create<EventState>((set) => ({
    events: [],
    loading: false,
    fetchEvents: async (lat: number, long: number) => {
        set({ loading: true });
        // TODO: Implement actual Supabase fetch
        // const { data, error } = await supabase.from('events').select('*');

        // Simulate network delay
        setTimeout(() => {
            set({ loading: false, events: MOCK_EVENTS });
        }, 1000);
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
            latitude: newEvent.latitude || 37.7749,
            longitude: newEvent.longitude || -122.4194,
            start_time: newEvent.start_time || new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(), // +1 hour
            is_public: true,
            max_participants: 100,
            attendees_count: 1,
            distance: 0,
            ...newEvent,
        } as Event;

        set((state) => ({ events: [event, ...state.events] }));
    },
}));
