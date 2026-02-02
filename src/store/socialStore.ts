import { create } from 'zustand';

export interface Friend {
    id: string;
    name: string;
    avatar_url: string;
}

export interface Attendee {
    user_id: string;
    name: string;
    avatar_url: string;
    is_friend: boolean;
}

interface SocialState {
    friends: Friend[];
    addFriend: (friend: Friend) => void;
    removeFriend: (friendId: string) => void;
    getFriendsAttending: (attendees: Attendee[]) => Attendee[];
}

// Mock friends data
const MOCK_FRIENDS: Friend[] = [
    {
        id: 'friend1',
        name: 'Sarah Chen',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
    },
    {
        id: 'friend2',
        name: 'Raj Patel',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
    },
    {
        id: 'friend3',
        name: 'Emma Wilson',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
    }
];

export const useSocialStore = create<SocialState>((set, get) => ({
    friends: MOCK_FRIENDS,

    addFriend: (friend: Friend) => {
        set((state) => ({
            friends: [...state.friends, friend]
        }));
    },

    removeFriend: (friendId: string) => {
        set((state) => ({
            friends: state.friends.filter(f => f.id !== friendId)
        }));
    },

    getFriendsAttending: (attendees: Attendee[]) => {
        const { friends } = get();
        const friendIds = new Set(friends.map(f => f.id));
        return attendees.filter(a => friendIds.has(a.user_id));
    }
}));
