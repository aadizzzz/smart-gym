export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Milestone' | 'Consistency' | 'Specialty' | 'Strength';
    color: string;
}

export const BADGE_REGISTRY: Record<string, Badge> = {
    // Milestones
    first_blood: { id: 'first_blood', title: 'First Blood', description: 'Complete your very first workout.', icon: 'water_drop', category: 'Milestone', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    century_club: { id: 'century_club', title: 'Century Club', description: 'Complete 100 total workouts.', icon: 'military_tech', category: 'Milestone', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    five_hundred: { id: 'five_hundred', title: 'Spartan 500', description: 'Complete 500 total workouts. You are a machine.', icon: 'swords', category: 'Milestone', color: 'text-zinc-300 bg-zinc-400/10 border-zinc-400/30' },

    // Consistency
    streak_7: { id: 'streak_7', title: '7-Day Warrior', description: 'Workout 7 days in a row.', icon: 'local_fire_department', category: 'Consistency', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    streak_14: { id: 'streak_14', title: 'Fortnight Fury', description: 'Workout 14 days in a row.', icon: 'local_fire_department', category: 'Consistency', color: 'text-orange-500 bg-orange-600/10 border-orange-600/30' },
    streak_30: { id: 'streak_30', title: 'Unbreakable', description: 'Workout 30 days in a row.', icon: 'diamond', category: 'Consistency', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    weekend_warrior: { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Complete a workout on both Saturday and Sunday.', icon: 'weekend', category: 'Consistency', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },

    // Specialty
    early_bird: { id: 'early_bird', title: 'Early Bird', description: 'Complete a workout before 6 AM.', icon: 'wb_twilight', category: 'Specialty', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    night_owl: { id: 'night_owl', title: 'Night Owl', description: 'Complete a workout after 10 PM.', icon: 'dark_mode', category: 'Specialty', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },

    // Target Specific
    leg_day_lover: { id: 'leg_day_lover', title: 'Never Skip', description: 'Complete 10 Leg Day focused workouts.', icon: 'airline_seat_legroom_extra', category: 'Strength', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    chest_day_bro: { id: 'chest_day_bro', title: 'International Chest Day', description: 'Complete 10 Chest Day focused workouts.', icon: 'fitness_center', category: 'Strength', color: 'text-blue-500 bg-blue-600/10 border-blue-600/30' },
    cardio_king: { id: 'cardio_king', title: 'Iron Lungs', description: 'Complete 20 Cardio or Active Recovery sessions.', icon: 'directions_run', category: 'Strength', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
};
