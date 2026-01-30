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
            ...newEvent,
        } as Event;

        set((state) => ({ events: [event, ...state.events] }));
    },
}));
