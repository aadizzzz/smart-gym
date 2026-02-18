import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

// ─── Static Data Maps ────────────────────────────────────────────────────────

const EXERCISE_SUGGESTIONS: Record<string, { name: string; desc: string; icon: string; sets: string }[]> = {
    arms: [
        { name: 'Bicep Curls', desc: 'Classic curl for peak bicep development', icon: 'fitness_center', sets: '4×12' },
        { name: 'Tricep Dips', desc: 'Bodyweight movement for strong triceps', icon: 'fitness_center', sets: '3×15' },
        { name: 'Hammer Curls', desc: 'Targets brachialis for arm thickness', icon: 'fitness_center', sets: '3×12' },
    ],
    chest: [
        { name: 'Bench Press', desc: 'King of chest exercises for mass', icon: 'fitness_center', sets: '4×10' },
        { name: 'Push-Ups', desc: 'Bodyweight classic for chest activation', icon: 'fitness_center', sets: '3×20' },
        { name: 'Cable Flyes', desc: 'Isolation for inner chest definition', icon: 'fitness_center', sets: '3×15' },
    ],
    back: [
        { name: 'Pull-Ups', desc: 'Best compound for lat width', icon: 'fitness_center', sets: '4×8' },
        { name: 'Barbell Rows', desc: 'Thickness builder for mid-back', icon: 'fitness_center', sets: '4×10' },
        { name: 'Lat Pulldowns', desc: 'Machine-assisted lat development', icon: 'fitness_center', sets: '3×12' },
    ],
    legs: [
        { name: 'Squats', desc: 'King of all exercises for leg mass', icon: 'fitness_center', sets: '4×10' },
        { name: 'Leg Press', desc: 'Heavy compound for quads and glutes', icon: 'fitness_center', sets: '4×12' },
        { name: 'Romanian Deadlift', desc: 'Hamstring and glute developer', icon: 'fitness_center', sets: '3×12' },
    ],
    abs: [
        { name: 'Plank', desc: 'Core stability and endurance', icon: 'fitness_center', sets: '3×60s' },
        { name: 'Crunches', desc: 'Classic upper ab isolation', icon: 'fitness_center', sets: '4×20' },
        { name: 'Leg Raises', desc: 'Lower ab and hip flexor strength', icon: 'fitness_center', sets: '3×15' },
    ],
    full_body: [
        { name: 'Deadlift', desc: 'Total body strength builder', icon: 'fitness_center', sets: '4×6' },
        { name: 'Burpees', desc: 'Full body cardio and conditioning', icon: 'fitness_center', sets: '3×15' },
        { name: 'Kettlebell Swings', desc: 'Explosive power and endurance', icon: 'fitness_center', sets: '4×20' },
    ],
};

const NUTRITION_TIPS: Record<string, { title: string; tip: string; icon: string; color: string }[]> = {
    weight_loss: [
        { title: 'Calorie Deficit', tip: 'Aim for 300–500 kcal below your TDEE daily for steady fat loss.', icon: 'local_fire_department', color: 'text-orange-400' },
        { title: 'High Protein', tip: 'Eat 1.6–2.2g of protein per kg of bodyweight to preserve muscle.', icon: 'egg', color: 'text-yellow-400' },
        { title: 'Hydration', tip: 'Drink 3–4 litres of water daily. Often hunger is just thirst.', icon: 'water_drop', color: 'text-blue-400' },
    ],
    muscle_build: [
        { title: 'Calorie Surplus', tip: 'Eat 200–300 kcal above TDEE to fuel muscle growth without excess fat.', icon: 'restaurant', color: 'text-green-400' },
        { title: 'Protein Timing', tip: 'Consume 30–40g protein within 2 hours post-workout for recovery.', icon: 'egg', color: 'text-yellow-400' },
        { title: 'Complex Carbs', tip: 'Oats, rice, and sweet potatoes fuel your training sessions.', icon: 'grain', color: 'text-amber-400' },
    ],
    endurance: [
        { title: 'Carb Loading', tip: 'Increase carb intake before long sessions to maximize glycogen stores.', icon: 'grain', color: 'text-amber-400' },
        { title: 'Electrolytes', tip: 'Replenish sodium, potassium, and magnesium after intense cardio.', icon: 'water_drop', color: 'text-blue-400' },
        { title: 'Recovery Meals', tip: 'Eat a balanced meal with carbs + protein within 45 min post-workout.', icon: 'restaurant', color: 'text-green-400' },
    ],
    flexibility: [
        { title: 'Anti-Inflammatory', tip: 'Eat turmeric, ginger, and omega-3s to reduce joint inflammation.', icon: 'spa', color: 'text-purple-400' },
        { title: 'Collagen Support', tip: 'Vitamin C + collagen-rich foods support tendon and ligament health.', icon: 'egg', color: 'text-yellow-400' },
        { title: 'Stay Hydrated', tip: 'Dehydration reduces muscle elasticity. Drink consistently throughout the day.', icon: 'water_drop', color: 'text-blue-400' },
    ],
};

const HEALTH_TIPS = [
    { title: 'Sleep 7–9 Hours', tip: 'Growth hormone peaks during deep sleep. Prioritize recovery.', icon: 'bedtime', color: 'text-indigo-400' },
    { title: 'Active Recovery', tip: 'Light walks or stretching on rest days improve blood flow and reduce soreness.', icon: 'directions_walk', color: 'text-teal-400' },
    { title: 'Stress Management', tip: 'High cortisol from stress can hinder muscle growth and fat loss.', icon: 'self_improvement', color: 'text-pink-400' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SuggestionCard: React.FC<{ icon: string; title: string; subtitle: string; badge?: string; color?: string; delay?: number }> = ({
    icon, title, subtitle, badge, color = 'text-primary', delay = 0
}) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.35 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex gap-4 items-start hover:border-primary/30 transition-all group"
    >
        <div className="size-11 rounded-xl bg-[var(--background)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-[var(--text-primary)] text-sm">{title}</h4>
                {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed">{subtitle}</p>
        </div>
    </motion.div>
);

export const MemberHome: React.FC = () => {
    const { user, gymName } = useAuth();

    // Read goals from localStorage or re-fetch — for now read from profile via a simple fetch
    const [goals, setGoals] = React.useState<{ goals: string[]; targets: string[] }>({ goals: [], targets: [] });
    const [loadingGoals, setLoadingGoals] = React.useState(true);

    React.useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return;
            const { supabase } = await import('../lib/supabase');
            const { data } = await supabase
                .from('profiles')
                .select('fitness_goals')
                .eq('id', user.id)
                .single();
            setGoals({
                goals: data?.fitness_goals?.goals ?? [],
                targets: data?.fitness_goals?.targets ?? [],
            });
            setLoadingGoals(false);
        };
        fetchGoals();
    }, [user]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    // Build exercise suggestions from selected target areas
    const exerciseSuggestions = goals.targets.flatMap(t => EXERCISE_SUGGESTIONS[t] ?? []).slice(0, 6);
    // Fallback if no targets set
    const displayExercises = exerciseSuggestions.length > 0 ? exerciseSuggestions : EXERCISE_SUGGESTIONS['full_body'];

    // Build nutrition tips from selected goals
    const nutritionTips = goals.goals.flatMap(g => NUTRITION_TIPS[g] ?? []).slice(0, 3);
    const displayNutrition = nutritionTips.length > 0 ? nutritionTips : NUTRITION_TIPS['muscle_build'];

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-10">
            {/* Hero Greeting */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 flex items-center gap-5"
            >
                <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-3xl">waving_hand</span>
                </div>
                <div>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">{greeting} 👋</p>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                        {user?.email?.split('@')[0] ?? 'Member'}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-0.5">
                        {gymName ? `Training at ${gymName}` : 'Ready to crush today\'s workout?'}
                    </p>
                </div>
            </motion.div>

            {/* Exercise Suggestions */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">fitness_center</span>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        Recommended Exercises
                        {goals.targets.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
                                — based on your target areas
                            </span>
                        )}
                    </h2>
                </div>
                {loadingGoals ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-[var(--surface)] rounded-2xl animate-pulse border border-[var(--border)]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {displayExercises.map((ex, i) => (
                            <SuggestionCard
                                key={ex.name + i}
                                icon={ex.icon}
                                title={ex.name}
                                subtitle={ex.desc}
                                badge={ex.sets}
                                delay={i * 0.06}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Nutrition Tips */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-orange-400">restaurant</span>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        Nutrition Suggestions
                        {goals.goals.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
                                — tailored to your goals
                            </span>
                        )}
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {displayNutrition.map((tip, i) => (
                        <SuggestionCard
                            key={tip.title}
                            icon={tip.icon}
                            title={tip.title}
                            subtitle={tip.tip}
                            color={tip.color}
                            delay={i * 0.08}
                        />
                    ))}
                </div>
            </section>

            {/* Health Tips */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-teal-400">favorite</span>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Health & Recovery Tips</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {HEALTH_TIPS.map((tip, i) => (
                        <SuggestionCard
                            key={tip.title}
                            icon={tip.icon}
                            title={tip.title}
                            subtitle={tip.tip}
                            color={tip.color}
                            delay={i * 0.08}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
