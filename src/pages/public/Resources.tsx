import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const exerciseCategories = [
    { id: 'chest', name: 'Chest', icon: 'monitor_heart' },
    { id: 'back', name: 'Back', icon: 'accessibility_new' },
    { id: 'legs', name: 'Legs', icon: 'directions_run' },
    { id: 'shoulders', name: 'Shoulders', icon: 'fitness_center' },
    { id: 'arms', name: 'Arms', icon: 'do_not_touch' },
    { id: 'core', name: 'Core', icon: 'self_improvement' },
];

const exercises = [
    {
        id: 1,
        name: 'Bench Press',
        category: 'chest',
        difficulty: 'Intermediate',
        description: 'The bench press is a compound exercise that targets the muscles of the chest, shoulders, and triceps.',
        steps: [
            'Lie on a flat bench with your eyes under the bar.',
            'Grip the bar slightly wider than shoulder-width apart.',
            'Unrack the bar and lower it slowly to your mid-chest.',
            'Press the bar back up to the starting position.',
        ],
    },
    {
        id: 2,
        name: 'Push-Up',
        category: 'chest',
        difficulty: 'Beginner',
        description: 'A classic bodyweight exercise that builds upper body strength.',
        steps: [
            'Start in a plank position with hands shoulder-width apart.',
            'Lower your body until your chest nearly touches the floor.',
            'Push yourself back up to the starting position.',
            'Keep your core tight throughout the movement.',
        ],
    },
    {
        id: 3,
        name: 'Deadlift',
        category: 'back',
        difficulty: 'Advanced',
        description: 'A powerful compound movement that works the entire posterior chain.',
        steps: [
            'Stand with feet hip-width apart, barbell over mid-foot.',
            'Bend at the hips to grip the bar.',
            'Keep your back flat and chest up.',
            'Drive through your heels to lift the bar, standing tall.',
        ],
    },
    {
        id: 4,
        name: 'Pull-Up',
        category: 'back',
        difficulty: 'Intermediate',
        description: 'The ultimate upper body pulling exercise.',
        steps: [
            'Grab the bar with an overhand grip, hands wider than shoulders.',
            'Hang with arms fully extended.',
            'Pull your chin up over the bar.',
            'Lower yourself back down with control.',
        ],
    },
    {
        id: 5,
        name: 'Squat',
        category: 'legs',
        difficulty: 'Intermediate',
        description: 'The king of leg exercises, building strength in the quads, hamstrings, and glutes.',
        steps: [
            'Stand with feet shoulder-width apart.',
            'Lower your hips back and down as if sitting in a chair.',
            'Keep your chest up and knees tracking over toes.',
            'Drive back up to a standing position.',
        ],
    },
    {
        id: 6,
        name: 'Lunge',
        category: 'legs',
        difficulty: 'Beginner',
        description: 'A unilateral leg exercise that improves balance and coordination.',
        steps: [
            'Step forward with one leg.',
            'Lower your hips until both knees are bent at a 90-degree angle.',
            'Push off the front foot to return to the starting position.',
            'Repeat on the other side.',
        ],
    },
    {
        id: 7,
        name: 'Overhead Press',
        category: 'shoulders',
        difficulty: 'Intermediate',
        description: 'A fundamental movement for building strong shoulders.',
        steps: [
            'Stand with the bar at shoulder height.',
            'Press the bar straight up overhead.',
            'Lock out your arms at the top.',
            'Lower the bar back to your shoulders with control.',
        ],
    },
    {
        id: 8,
        name: 'Bicep Curl',
        category: 'arms',
        difficulty: 'Beginner',
        description: 'An isolation exercise for the biceps.',
        steps: [
            'Stand holding dumbbells with palms facing forward.',
            'Curl the weights up towards your shoulders.',
            'Squeeze your biceps at the top.',
            'Lower the weights back down slowly.',
        ],
    },
    {
        id: 9,
        name: 'Plank',
        category: 'core',
        difficulty: 'Beginner',
        description: 'An isometric core exercise that builds stability.',
        steps: [
            'Start in a push-up position but on your forearms.',
            'Keep your body in a straight line from head to heels.',
            'Hold the position for as long as possible.',
            'Don\'t let your hips sag or pike up.',
        ],
    },
];

export const ResourcesPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredExercises = activeCategory === 'all'
        ? exercises
        : exercises.filter(ex => ex.category === activeCategory);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">EXERCISE LIBRARY</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Exercise Guides & Tutorials</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Master your form with our comprehensive collection of exercise guides. Filter by muscle group to find exactly what you need.</p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2 rounded-full border transition-colors ${activeCategory === 'all' ? 'bg-primary text-[#052e16] border-primary font-bold' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'}`}
                        >
                            All
                        </button>
                        {exerciseCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2 rounded-full border transition-colors flex items-center gap-2 ${activeCategory === cat.id ? 'bg-primary text-[#052e16] border-primary font-bold' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Exercise Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExercises.map(exercise => (
                            <div key={exercise.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-primary transition-colors group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${exercise.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {exercise.difficulty}
                                        </span>
                                        <div className="size-8 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--text-secondary)]">
                                            <span className="material-symbols-outlined text-lg">
                                                {exerciseCategories.find(c => c.id === exercise.category)?.icon || 'fitness_center'}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-primary transition-colors">{exercise.name}</h3>
                                    <p className="text-[var(--text-secondary)] text-sm mb-6 min-h-[40px]">{exercise.description}</p>

                                    <div className="bg-[var(--background)] rounded-xl p-4">
                                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">How to perform</h4>
                                        <ol className="list-decimal list-inside space-y-2">
                                            {exercise.steps.map((step, idx) => (
                                                <li key={idx} className="text-sm text-[var(--text-secondary)]">{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
