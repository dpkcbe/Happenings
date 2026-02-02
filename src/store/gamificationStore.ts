import { create } from 'zustand';

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlock_criteria: {
        type: 'events_attended' | 'categories' | 'time_of_day' | 'streak';
        threshold: number;
        category?: string;
        time_start?: number;
        time_end?: number;
    };
}

export interface UserBadge {
    badge_id: string;
    earned_at: string;
}

export interface UserStats {
    events_attended: number;
    streak_days: number;
    last_attendance_date: string | null;
    xp: number;
    level: number;
}

const BADGE_DEFINITIONS: Badge[] = [
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        icon: '🦋',
        description: 'Attend 10 events',
        unlock_criteria: { type: 'events_attended', threshold: 10 }
    },
    {
        id: 'explorer',
        name: 'Explorer',
        icon: '🗺️',
        description: 'Try 5 different categories',
        unlock_criteria: { type: 'categories', threshold: 5 }
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        icon: '🦉',
        description: 'Attend 3 events after 9pm',
        unlock_criteria: { type: 'time_of_day', threshold: 3, time_start: 21, time_end: 5 }
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        icon: '🐦',
        description: 'Attend 3 events before 11am',
        unlock_criteria: { type: 'time_of_day', threshold: 3, time_start: 6, time_end: 11 }
    },
    {
        id: 'streak_master',
        name: 'Streak Master',
        icon: '🔥',
        description: 'Maintain a 7-day streak',
        unlock_criteria: { type: 'streak', threshold: 7 }
    }
];

interface GamificationState {
    badges: Badge[];
    userBadges: UserBadge[];
    stats: UserStats;
    addXP: (amount: number) => void;
    incrementEventsAttended: (eventTime: string, category: string) => void;
    updateStreak: () => void;
    checkAndAwardBadges: () => void;
    resetStats: () => void;
}

const XP_PER_EVENT = 100;
const XP_PER_LEVEL = 500;

const calculateLevel = (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const useGamificationStore = create<GamificationState>((set, get) => ({
    badges: BADGE_DEFINITIONS,
    userBadges: [],
    stats: {
        events_attended: 0,
        streak_days: 0,
        last_attendance_date: null,
        xp: 0,
        level: 1
    },

    addXP: (amount: number) => {
        set((state) => {
            const newXP = state.stats.xp + amount;
            const newLevel = calculateLevel(newXP);
            return {
                stats: {
                    ...state.stats,
                    xp: newXP,
                    level: newLevel
                }
            };
        });
    },

    incrementEventsAttended: (eventTime: string, category: string) => {
        set((state) => ({
            stats: {
                ...state.stats,
                events_attended: state.stats.events_attended + 1,
                last_attendance_date: new Date().toISOString()
            }
        }));

        // Award XP
        get().addXP(XP_PER_EVENT);

        // Update streak
        get().updateStreak();

        // Check for new badges
        get().checkAndAwardBadges();
    },

    updateStreak: () => {
        set((state) => {
            const today = new Date().toDateString();
            const lastDate = state.stats.last_attendance_date
                ? new Date(state.stats.last_attendance_date).toDateString()
                : null;

            if (!lastDate) {
                return { stats: { ...state.stats, streak_days: 1 } };
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastDate === yesterdayStr) {
                return { stats: { ...state.stats, streak_days: state.stats.streak_days + 1 } };
            } else if (lastDate === today) {
                return state;
            } else {
                return { stats: { ...state.stats, streak_days: 1 } };
            }
        });
    },

    checkAndAwardBadges: () => {
        const { badges, userBadges, stats } = get();

        badges.forEach((badge) => {
            const alreadyEarned = userBadges.some(ub => ub.badge_id === badge.id);
            if (alreadyEarned) return;

            let shouldAward = false;

            switch (badge.unlock_criteria.type) {
                case 'events_attended':
                    shouldAward = stats.events_attended >= badge.unlock_criteria.threshold;
                    break;
                case 'streak':
                    shouldAward = stats.streak_days >= badge.unlock_criteria.threshold;
                    break;
                // Add more criteria checking here
                default:
                    break;
            }

            if (shouldAward) {
                set((state) => ({
                    userBadges: [
                        ...state.userBadges,
                        { badge_id: badge.id, earned_at: new Date().toISOString() }
                    ]
                }));
            }
        });
    },

    resetStats: () => {
        set({
            userBadges: [],
            stats: {
                events_attended: 0,
                streak_days: 0,
                last_attendance_date: null,
                xp: 0,
                level: 1
            }
        });
    }
}));
