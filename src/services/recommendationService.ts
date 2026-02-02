import { Event } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';

export interface RecommendationScore {
    event: Event;
    score: number;
    reasons: string[];
}

// Mock user preferences - in real app this would come from user profile
const getUserPreferences = () => ({
    interests: ['Tech', 'Music', 'Wellness'],
    attendanceHistory: ['Tech', 'Social', 'Music'],
    preferredTimes: ['evening', 'weekend'],
    maxDistance: 25,
});

/**
 * Score an event based on user preferences and behavior
 */
export const scoreEvent = (event: Event, userId: string): RecommendationScore => {
    const prefs = getUserPreferences();
    let score = 0;
    const reasons: string[] = [];

    // Category match (high weight)
    if (prefs.interests.includes(event.category)) {
        score += 40;
        reasons.push(`Matches your interest: ${event.category}`);
    }

    // Past attendance pattern (medium weight)
    if (prefs.attendanceHistory.includes(event.category)) {
        score += 25;
        reasons.push('Similar to events you\'ve attended');
    }

    // Distance (closer is better)
    if (event.distance !== undefined) {
        if (event.distance < 5) {
            score += 30;
            reasons.push('Very close to you');
        } else if (event.distance < 15) {
            score += 15;
            reasons.push('Nearby');
        }
    }

    // Time preference
    const eventTime = new Date(event.start_time);
    const eventHour = eventTime.getHours();
    const dayOfWeek = eventTime.getDay();

    if (prefs.preferredTimes.includes('evening') && eventHour >= 17 && eventHour < 23) {
        score += 15;
        reasons.push('Perfect evening timing');
    }

    if (prefs.preferredTimes.includes('weekend') && (dayOfWeek === 0 || dayOfWeek === 6)) {
        score += 10;
        reasons.push('Weekend event');
    }

    // Trending events get a boost
    if (event.is_trending) {
        score += 20;
        reasons.push('Trending now');
    }

    // Almost full events get FOMO boost
    if (event.max_participants) {
        const fillRate = event.attendees_count / event.max_participants;
        if (fillRate > 0.8) {
            score += 15;
            reasons.push('Almost full - book soon!');
        }
    }

    return { event, score, reasons };
};

/**
 * Get recommended events sorted by relevance score
 */
export const getRecommendedEvents = (events: Event[], userId: string): RecommendationScore[] => {
    const scoredEvents = events.map(event => scoreEvent(event, userId));

    // Sort by score descending
    return scoredEvents.sort((a, b) => b.score - a.score);
};

/**
 * Filter events based on "For You" algorithm
 */
export const getForYouEvents = (events: Event[], userId: string, limit: number = 10): Event[] => {
    const recommended = getRecommendedEvents(events, userId);
    return recommended.slice(0, limit).map(r => r.event);
};
