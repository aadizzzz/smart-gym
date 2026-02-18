import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Workout Data ─────────────────────────────────────────────────────────────

type Exercise = { name: string; sets: number; reps: string; rest: string; tip: string };
type DayPlan = { day: string; focus: string; exercises: Exercise[] };

const WORKOUT_PLANS: Record<string, DayPlan[]> = {
    arms: [
        {
            day: 'Monday', focus: 'Biceps', exercises: [
                { name: 'Barbell Curl', sets: 4, reps: '10–12', rest: '60s', tip: 'Keep elbows pinned to your sides' },
                { name: 'Hammer Curl', sets: 3, reps: '12', rest: '60s', tip: 'Neutral grip for brachialis' },
                { name: 'Concentration Curl', sets: 3, reps: '15', rest: '45s', tip: 'Full range of motion' },
            ]
        },
        {
            day: 'Wednesday', focus: 'Triceps', exercises: [
                { name: 'Close-Grip Bench Press', sets: 4, reps: '8–10', rest: '90s', tip: 'Elbows tucked in' },
                { name: 'Tricep Dips', sets: 3, reps: '12–15', rest: '60s', tip: 'Lean slightly forward' },
                { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '60s', tip: 'Keep upper arms vertical' },
            ]
        },
        {
            day: 'Friday', focus: 'Arms (Full)', exercises: [
                { name: 'Superset: Curl + Pushdown', sets: 4, reps: '10 each', rest: '90s', tip: 'Minimal rest between exercises' },
                { name: 'Preacher Curl', sets: 3, reps: '12', rest: '60s', tip: 'Slow eccentric for growth' },
                { name: 'Skull Crushers', sets: 3, reps: '10', rest: '75s', tip: 'Lower bar to forehead slowly' },
            ]
        },
        {
            day: 'Tuesday', focus: 'Rest / Cardio', exercises: [
                { name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Keep heart rate at 120–140 bpm' },
            ]
        },
        {
            day: 'Thursday', focus: 'Rest / Stretch', exercises: [
                { name: 'Full Body Stretch', sets: 1, reps: '20 min', rest: '—', tip: 'Hold each stretch 30 seconds' },
            ]
        },
        {
            day: 'Saturday', focus: 'Active Recovery', exercises: [
                { name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Keep it light and enjoyable' },
            ]
        },
        {
            day: 'Sunday', focus: 'Rest', exercises: [
                { name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Sleep 8 hours, eat well' },
            ]
        },
    ],
    chest: [
        {
            day: 'Monday', focus: 'Upper Chest', exercises: [
                { name: 'Incline Bench Press', sets: 4, reps: '8–10', rest: '90s', tip: '30–45° incline for upper chest' },
                { name: 'Incline Dumbbell Fly', sets: 3, reps: '12', rest: '60s', tip: 'Slight bend in elbows' },
                { name: 'Cable Crossover (High)', sets: 3, reps: '15', rest: '60s', tip: 'Pull downward for upper chest' },
            ]
        },
        {
            day: 'Thursday', focus: 'Lower Chest', exercises: [
                { name: 'Flat Bench Press', sets: 4, reps: '8–10', rest: '90s', tip: 'Drive through your heels' },
                { name: 'Decline Push-Ups', sets: 3, reps: '15–20', rest: '60s', tip: 'Feet elevated on bench' },
                { name: 'Dips', sets: 3, reps: '12', rest: '75s', tip: 'Lean forward for chest emphasis' },
            ]
        },
        { day: 'Tuesday', focus: 'Rest / Cardio', exercises: [{ name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Steady state cardio' }] },
        { day: 'Wednesday', focus: 'Active Recovery', exercises: [{ name: 'Stretching', sets: 1, reps: '20 min', rest: '—', tip: 'Focus on chest and shoulders' }] },
        {
            day: 'Friday', focus: 'Full Chest', exercises: [
                { name: 'Push-Up Variations', sets: 4, reps: '15–20', rest: '60s', tip: 'Wide, narrow, and diamond' },
                { name: 'Pec Deck Machine', sets: 3, reps: '15', rest: '60s', tip: 'Squeeze at peak contraction' },
            ]
        },
        { day: 'Saturday', focus: 'Active Recovery', exercises: [{ name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Light movement only' }] },
        { day: 'Sunday', focus: 'Rest', exercises: [{ name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Recovery is growth' }] },
    ],
    legs: [
        {
            day: 'Monday', focus: 'Quads', exercises: [
                { name: 'Barbell Squat', sets: 4, reps: '8–10', rest: '120s', tip: 'Break parallel for full activation' },
                { name: 'Leg Press', sets: 4, reps: '12', rest: '90s', tip: 'Feet shoulder-width apart' },
                { name: 'Leg Extension', sets: 3, reps: '15', rest: '60s', tip: 'Pause at top for quad squeeze' },
            ]
        },
        {
            day: 'Thursday', focus: 'Hamstrings & Glutes', exercises: [
                { name: 'Romanian Deadlift', sets: 4, reps: '10', rest: '90s', tip: 'Hinge at hips, slight knee bend' },
                { name: 'Lying Leg Curl', sets: 3, reps: '12', rest: '60s', tip: 'Full range of motion' },
                { name: 'Hip Thrust', sets: 4, reps: '12', rest: '75s', tip: 'Drive hips up explosively' },
            ]
        },
        { day: 'Tuesday', focus: 'Rest / Cardio', exercises: [{ name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Cycling is easy on legs' }] },
        { day: 'Wednesday', focus: 'Active Recovery', exercises: [{ name: 'Stretching', sets: 1, reps: '20 min', rest: '—', tip: 'Focus on hip flexors and hamstrings' }] },
        {
            day: 'Friday', focus: 'Full Legs', exercises: [
                { name: 'Lunges', sets: 3, reps: '12 each', rest: '60s', tip: 'Keep front knee over ankle' },
                { name: 'Calf Raises', sets: 4, reps: '20', rest: '45s', tip: 'Full range, slow eccentric' },
            ]
        },
        { day: 'Saturday', focus: 'Active Recovery', exercises: [{ name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Light movement only' }] },
        { day: 'Sunday', focus: 'Rest', exercises: [{ name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Sleep 8 hours' }] },
    ],
    back: [
        {
            day: 'Monday', focus: 'Lat Width', exercises: [
                { name: 'Pull-Ups', sets: 4, reps: '6–10', rest: '90s', tip: 'Full hang at bottom, chin over bar' },
                { name: 'Lat Pulldown', sets: 4, reps: '12', rest: '75s', tip: 'Pull to upper chest, not behind neck' },
                { name: 'Straight-Arm Pulldown', sets: 3, reps: '15', rest: '60s', tip: 'Feel the lat stretch at top' },
            ]
        },
        {
            day: 'Thursday', focus: 'Back Thickness', exercises: [
                { name: 'Barbell Row', sets: 4, reps: '8–10', rest: '90s', tip: 'Pull to lower chest, not waist' },
                { name: 'Seated Cable Row', sets: 3, reps: '12', rest: '75s', tip: 'Keep chest up, squeeze shoulder blades' },
                { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '12 each', rest: '60s', tip: 'Full range of motion' },
            ]
        },
        { day: 'Tuesday', focus: 'Rest / Cardio', exercises: [{ name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Steady state cardio' }] },
        { day: 'Wednesday', focus: 'Active Recovery', exercises: [{ name: 'Stretching', sets: 1, reps: '20 min', rest: '—', tip: 'Focus on lats and thoracic spine' }] },
        {
            day: 'Friday', focus: 'Full Back', exercises: [
                { name: 'Deadlift', sets: 4, reps: '5–6', rest: '120s', tip: 'Brace core, neutral spine' },
                { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', tip: 'Great for rear delts and posture' },
            ]
        },
        { day: 'Saturday', focus: 'Active Recovery', exercises: [{ name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Light movement only' }] },
        { day: 'Sunday', focus: 'Rest', exercises: [{ name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Recovery is growth' }] },
    ],
    abs: [
        {
            day: 'Monday', focus: 'Upper Abs', exercises: [
                { name: 'Crunches', sets: 4, reps: '20', rest: '45s', tip: 'Exhale at top, slow eccentric' },
                { name: 'Cable Crunch', sets: 3, reps: '15', rest: '60s', tip: 'Round the spine, don\'t pull with arms' },
                { name: 'Decline Sit-Up', sets: 3, reps: '15', rest: '60s', tip: 'Add weight for progression' },
            ]
        },
        {
            day: 'Wednesday', focus: 'Lower Abs', exercises: [
                { name: 'Hanging Leg Raise', sets: 4, reps: '12', rest: '60s', tip: 'Control the descent' },
                { name: 'Reverse Crunch', sets: 3, reps: '15', rest: '45s', tip: 'Curl hips toward chest' },
                { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '45s', tip: 'Keep hips level' },
            ]
        },
        {
            day: 'Friday', focus: 'Core Stability', exercises: [
                { name: 'Plank', sets: 4, reps: '60s', rest: '45s', tip: 'Squeeze glutes and abs throughout' },
                { name: 'Side Plank', sets: 3, reps: '45s each', rest: '45s', tip: 'Stack feet or stagger for balance' },
                { name: 'Ab Wheel Rollout', sets: 3, reps: '10', rest: '60s', tip: 'Brace core before rolling out' },
            ]
        },
        { day: 'Tuesday', focus: 'Rest / Cardio', exercises: [{ name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Steady state cardio' }] },
        { day: 'Thursday', focus: 'Active Recovery', exercises: [{ name: 'Stretching', sets: 1, reps: '20 min', rest: '—', tip: 'Focus on hip flexors and lower back' }] },
        { day: 'Saturday', focus: 'Active Recovery', exercises: [{ name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Light movement only' }] },
        { day: 'Sunday', focus: 'Rest', exercises: [{ name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Sleep 8 hours' }] },
    ],
    full_body: [
        {
            day: 'Monday', focus: 'Push', exercises: [
                { name: 'Bench Press', sets: 4, reps: '8–10', rest: '90s', tip: 'Chest, shoulders, triceps' },
                { name: 'Overhead Press', sets: 3, reps: '10', rest: '90s', tip: 'Keep core braced' },
                { name: 'Tricep Pushdown', sets: 3, reps: '15', rest: '60s', tip: 'Elbows fixed at sides' },
            ]
        },
        {
            day: 'Tuesday', focus: 'Pull', exercises: [
                { name: 'Deadlift', sets: 4, reps: '6', rest: '120s', tip: 'Neutral spine throughout' },
                { name: 'Pull-Ups', sets: 3, reps: '8', rest: '90s', tip: 'Full range of motion' },
                { name: 'Barbell Row', sets: 3, reps: '10', rest: '90s', tip: 'Pull to lower chest' },
            ]
        },
        {
            day: 'Wednesday', focus: 'Legs', exercises: [
                { name: 'Squat', sets: 4, reps: '10', rest: '120s', tip: 'Break parallel' },
                { name: 'Romanian Deadlift', sets: 3, reps: '12', rest: '90s', tip: 'Hinge at hips' },
                { name: 'Calf Raises', sets: 4, reps: '20', rest: '45s', tip: 'Full range' },
            ]
        },
        { day: 'Thursday', focus: 'Rest / Cardio', exercises: [{ name: 'Light Cardio', sets: 1, reps: '30 min', rest: '—', tip: 'Active recovery' }] },
        {
            day: 'Friday', focus: 'Full Body', exercises: [
                { name: 'Burpees', sets: 4, reps: '15', rest: '60s', tip: 'Explosive jump at top' },
                { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: '60s', tip: 'Hip hinge, not squat' },
                { name: 'Farmer\'s Walk', sets: 3, reps: '40m', rest: '90s', tip: 'Heavy weight, tall posture' },
            ]
        },
        { day: 'Saturday', focus: 'Active Recovery', exercises: [{ name: 'Walk / Yoga', sets: 1, reps: '45 min', rest: '—', tip: 'Light movement only' }] },
        { day: 'Sunday', focus: 'Rest', exercises: [{ name: 'Full Rest', sets: 1, reps: '—', rest: '—', tip: 'Sleep 8 hours' }] },
    ],
};

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FOCUS_COLORS: Record<string, string> = {
    'Rest': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    'Rest / Cardio': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Active Recovery': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

const getFocusColor = (focus: string) =>
    FOCUS_COLORS[focus] ?? 'bg-primary/10 text-primary border-primary/20';

// ─── Component ────────────────────────────────────────────────────────────────

export const MemberExercises: React.FC = () => {
    const { user } = useAuth();
    const [targets, setTargets] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDay, setOpenDay] = useState<string | null>(null);

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setOpenDay(today);
    }, []);

    useEffect(() => {
        const fetchTargets = async () => {
            if (!user) return;
            const { supabase } = await import('../lib/supabase');
            const { data } = await supabase
                .from('profiles')
                .select('fitness_goals')
                .eq('id', user.id)
                .single();
            setTargets(data?.fitness_goals?.targets ?? []);
            setLoading(false);
        };
        fetchTargets();
    }, [user]);

    // Pick the primary target for the plan, fallback to full_body
    const primaryTarget = targets[0] ?? 'full_body';
    const plan = WORKOUT_PLANS[primaryTarget] ?? WORKOUT_PLANS['full_body'];

    // Sort by day order
    const sortedPlan = [...plan].sort((a, b) =>
        DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
    );

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Weekly Workout Plan</h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    {loading ? 'Loading your plan...' : (
                        targets.length > 0
                            ? `Customized for: ${targets.map(t => t.replace('_', ' ')).join(', ')}`
                            : 'Full body training program'
                    )}
                </p>
            </motion.div>

            {/* Stats Row */}
            {!loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-3"
                >
                    {[
                        { label: 'Training Days', value: sortedPlan.filter(d => !d.focus.includes('Rest') && !d.focus.includes('Recovery')).length, icon: 'calendar_month' },
                        { label: 'Rest Days', value: sortedPlan.filter(d => d.focus.includes('Rest') || d.focus.includes('Recovery')).length, icon: 'bedtime' },
                        { label: 'Total Exercises', value: sortedPlan.reduce((acc, d) => acc + d.exercises.length, 0), icon: 'fitness_center' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
                            <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
                            <p className="text-2xl font-extrabold text-[var(--text-primary)] mt-1">{stat.value}</p>
                            <p className="text-[var(--text-secondary)] text-xs">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Day-by-Day Plan */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-[var(--surface)] rounded-2xl animate-pulse border border-[var(--border)]" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedPlan.map((dayPlan, i) => {
                        const isToday = dayPlan.day === today;
                        const isOpen = openDay === dayPlan.day;
                        const isRest = dayPlan.focus.includes('Rest') || dayPlan.focus.includes('Recovery');

                        return (
                            <motion.div
                                key={dayPlan.day}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-[var(--surface)] border rounded-2xl overflow-hidden transition-all ${isToday ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-[var(--border)]'
                                    }`}
                            >
                                {/* Day Header */}
                                <button
                                    onClick={() => setOpenDay(isOpen ? null : dayPlan.day)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--background)] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {isToday && (
                                            <span className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[var(--text-primary)]">{dayPlan.day}</span>
                                                {isToday && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-[#052e16]">TODAY</span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${getFocusColor(dayPlan.focus)}`}>
                                                {dayPlan.focus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!isRest && (
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                {dayPlan.exercises.length} exercises
                                            </span>
                                        )}
                                        <span className={`material-symbols-outlined text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                </button>

                                {/* Exercise List */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 space-y-2 border-t border-[var(--border)] pt-3">
                                                {dayPlan.exercises.map((ex, j) => (
                                                    <div
                                                        key={ex.name}
                                                        className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]"
                                                    >
                                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <span className="text-primary text-xs font-bold">{j + 1}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-[var(--text-primary)] text-sm">{ex.name}</p>
                                                            <p className="text-[var(--text-secondary)] text-xs mt-0.5 italic">{ex.tip}</p>
                                                        </div>
                                                        {ex.sets > 1 ? (
                                                            <div className="text-right shrink-0">
                                                                <p className="text-primary font-bold text-sm">{ex.sets} × {ex.reps}</p>
                                                                <p className="text-[var(--text-secondary)] text-xs">Rest {ex.rest}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-right shrink-0">
                                                                <p className="text-teal-400 font-bold text-sm">{ex.reps}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
