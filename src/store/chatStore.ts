import { create } from 'zustand';

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    sender_name?: string;
}

export interface ChatRoom {
    id: string;
    event_id?: string;
    name: string;
    last_message?: string;
    last_message_time?: string;
    image_url?: string;
    is_group: boolean;
    unread_count: number;
}

interface ChatState {
    chats: ChatRoom[];
    messages: Record<string, Message[]>; // chat_id -> messages
    loading: boolean;
    sendMessage: (chatId: string, content: string, senderId: string) => Promise<void>;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
}

const MOCK_CHATS: ChatRoom[] = [
    {
        id: '1',
        name: 'Sunset Yoga Group',
        event_id: '1',
        last_message: 'See you all there!',
        last_message_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee32bede?w=200&q=80',
        is_group: true,
        unread_count: 2,
    },
    {
        id: '2',
        name: 'Sarah Jenkins',
        last_message: 'Thanks for hosting!',
        last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        image_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        is_group: false,
        unread_count: 0,
    }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    '1': [
        { id: 'm1', chat_id: '1', sender_id: 'other1', content: 'Is everyone bringing their own mat?', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), sender_name: 'Alice' },
        { id: 'm2', chat_id: '1', sender_id: 'other2', content: 'Yes! I have an extra if needed.', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), sender_name: 'Bob' },
        { id: 'm3', chat_id: '1', sender_id: 'host1', content: 'See you all there!', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), sender_name: 'Sarah' },
    ],
    '2': [
        { id: 'm1', chat_id: '2', sender_id: 'me', content: 'Hey Sarah, great event!', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: 'm2', chat_id: '2', sender_id: 'host1', content: 'Thanks for hosting!', created_at: new Date(Date.now() - 1000 * 60 * 119).toISOString(), sender_name: 'Sarah' },
    ]
};

export const useChatStore = create<ChatState>((set, get) => ({
    chats: MOCK_CHATS,
    messages: MOCK_MESSAGES,
    loading: false,

    fetchChats: async () => {
        // Mock fetch
        set({ loading: true });
        setTimeout(() => {
            set({ loading: false, chats: MOCK_CHATS });
        }, 500);
    },

    fetchMessages: async (chatId: string) => {
        // Messages are already "loaded" in mock
        // In real app, would fetch from Supabase
    },

    sendMessage: async (chatId, content, senderId) => {
        const newMessage: Message = {
            id: Math.random().toString(),
            chat_id: chatId,
            sender_id: senderId,
            content,
            created_at: new Date().toISOString(),
            sender_name: 'You',
        };

        const currentMessages = get().messages[chatId] || [];

        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: [...currentMessages, newMessage],
            }
        }));
    },
}));
