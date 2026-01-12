import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },
    initialize: async () => {
        set({ loading: true });

        // FOR DEBUGGING ONLY: Bypass Supabase Auth
        // try {
        //     const { data: { session } } = await supabase.auth.getSession();
        //     set({ session, user: session?.user ?? null, loading: false });
        // } catch (error) {
        console.log('Using Mock User for testing.');
        const MOCK_USER = {
            id: 'mock-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'guest@happenings.app',
            phone: '',
            confirmed_at: new Date().toISOString(),
            app_metadata: { provider: 'email' },
            user_metadata: { full_name: 'Guest User' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as User;

        // @ts-ignore
        set({ session: { user: MOCK_USER, access_token: 'mock', expires_at: 9999999999 }, user: MOCK_USER, loading: false });
        // }

        // supabase.auth.onAuthStateChange((_event, session) => {
        //     set({ session, user: session?.user ?? null });
        // });
    },
}));
