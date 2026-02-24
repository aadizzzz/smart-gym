import { supabase } from '../../lib/supabase';


export const logWorkoutInteraction = async (memberId: string, focus: string) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Log the workout session if not already logged today
        const { data: existingSession } = await supabase
            .from('workout_sessions')
            .select('id')
            .eq('member_id', memberId)
            .eq('date', today)
            .single();

        if (!existingSession) {
            await supabase.from('workout_sessions').insert({
                member_id: memberId,
                date: today,
                completed: true
            });
        }

        // 2. Evaluate Badges
        await evaluateBadges(memberId, focus);

    } catch (e) {
        console.error('Gamification Engine Error', e);
    }
};

const evaluateBadges = async (memberId: string, todayFocus: string) => {
    // Fetch user's current achievements and workout history
    const [achievementsRes, sessionsRes] = await Promise.all([
        supabase.from('member_achievements').select('badge_id').eq('member_id', memberId),
        supabase.from('workout_sessions').select('*').eq('member_id', memberId).order('date', { ascending: true })
    ]);

    const existingBadges = new Set(achievementsRes.data?.map(a => a.badge_id) || []);
    const sessions = sessionsRes.data || [];
    const newUnlocked: string[] = [];

    // --- Badge Logic Evaluation ---

    // 1. First Blood
    if (sessions.length >= 1 && !existingBadges.has('first_blood')) {
        newUnlocked.push('first_blood');
    }

    // 2. Century Club & Spartan 500
    if (sessions.length >= 100 && !existingBadges.has('century_club')) newUnlocked.push('century_club');
    if (sessions.length >= 500 && !existingBadges.has('five_hundred')) newUnlocked.push('five_hundred');

    // 3. Early Bird / Night Owl
    const hour = new Date().getHours();
    if (hour < 6 && hour > 3 && !existingBadges.has('early_bird')) newUnlocked.push('early_bird');
    if (hour >= 22 && !existingBadges.has('night_owl')) newUnlocked.push('night_owl');

    // 4. Custom Focus (This is a simplified mock. Deep tracking requires an exercise_logs table grouping)
    // We will randomly unlock specialized badges as a demo if the user is doing that focus
    if (todayFocus.toLowerCase().includes('leg') && Math.random() > 0.7 && !existingBadges.has('leg_day_lover')) {
        newUnlocked.push('leg_day_lover');
    }
    if (todayFocus.toLowerCase().includes('chest') && Math.random() > 0.7 && !existingBadges.has('chest_day_bro')) {
        newUnlocked.push('chest_day_bro');
    }
    if (todayFocus.toLowerCase().includes('cardio') && Math.random() > 0.7 && !existingBadges.has('cardio_king')) {
        newUnlocked.push('cardio_king');
    }

    // 5. Streaks
    const currentStreak = calculateStreak(sessions.map(s => s.date));
    if (currentStreak >= 7 && !existingBadges.has('streak_7')) newUnlocked.push('streak_7');
    if (currentStreak >= 14 && !existingBadges.has('streak_14')) newUnlocked.push('streak_14');
    if (currentStreak >= 30 && !existingBadges.has('streak_30')) newUnlocked.push('streak_30');

    // --- Insert newly unlocked badges ---
    if (newUnlocked.length > 0) {
        const inserts = newUnlocked.map(badgeId => ({
            member_id: memberId,
            badge_id: badgeId
        }));

        await supabase.from('member_achievements').insert(inserts);

        // Optionally trigger a toast/notification in the UI here via a Custom Event
        window.dispatchEvent(new CustomEvent('badges-unlocked', { detail: newUnlocked }));
    }
};

const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    // Simplistic streak counter assuming dates are sorted ascending
    const uniqueDates = Array.from(new Set(dates)).sort();
    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const d1 = new Date(uniqueDates[i - 1]);
        const d2 = new Date(uniqueDates[i]);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else {
            streak = 1;
        }
    }

    return streak; // Simplified logic, returns current ongoing streak basically
};
