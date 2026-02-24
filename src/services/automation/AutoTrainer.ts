import { supabase } from '../../lib/supabase';

interface Trainer {
    id: string;
    specialization: string | null;
    max_capacity: number;
    current_active_members: number;
    availability_status: boolean;
}

/**
 * Automatically assigns the most suitable trainer to a new member based on a scoring system.
 * Score calculation:
 * - Goal match -> +50
 * - Trainer workload < 70% -> +30
 * - Trainer available today -> +20
 */
export const assignTrainerToMember = async (memberId: string, gymId: string): Promise<string | null> => {
    try {
        // 1. Fetch member details
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select('fitness_goal')
            .eq('id', memberId)
            .single();

        if (memberError || !member) throw new Error(`Failed to fetch member details: ${memberError?.message}`);

        const memberGoal = member.fitness_goal?.toLowerCase() || 'general';

        // 2. Fetch all trainers for this gym
        const { data: trainers, error: trainersError } = await supabase
            .from('trainers')
            .select('id, specialization, max_capacity, current_active_members, availability_status')
            .eq('gym_id', gymId);

        if (trainersError) throw new Error(`Failed to fetch trainers: ${trainersError?.message}`);

        if (!trainers || trainers.length === 0) {
            console.log(`[AutoTrainer] No trainers available in gym ${gymId} for assignment.`);
            return null;
        }

        // 3. Scoring logic
        let bestTrainerId: string | null = null;
        let highestScore = -1;

        for (const trainer of trainers as Trainer[]) {
            // Don't assign to full capacity trainers
            if (trainer.current_active_members >= trainer.max_capacity) {
                continue;
            }

            let score = 0;

            // Rule 1: Goal Match (+50)
            const trainerSpec = trainer.specialization?.toLowerCase() || '';
            if (trainerSpec.includes(memberGoal) || (memberGoal === 'general' && trainerSpec === 'general')) {
                score += 50;
            }

            // Rule 2: Workload < 70% (+30)
            const workloadPercentage = (trainer.current_active_members / trainer.max_capacity) * 100;
            if (workloadPercentage < 70) {
                score += 30;
            }

            // Rule 3: Availability Status (+20)
            if (trainer.availability_status) {
                score += 20;
            }

            if (score > highestScore) {
                highestScore = score;
                bestTrainerId = trainer.id;
            }
        }

        // 4. Assign the best trainer if found
        if (bestTrainerId) {
            const { error: updateError } = await supabase
                .from('members')
                .update({ assigned_trainer_id: bestTrainerId })
                .eq('id', memberId);

            if (updateError) throw new Error(`Failed to assign trainer: ${updateError.message}`);

            // Increment trainer's active payload
            await supabase
                .from('trainers')
                .update({ current_active_members: ((trainers.find(t => t.id === bestTrainerId)?.current_active_members || 0) + 1) })
                .eq('id', bestTrainerId);

            console.log(`[AutoTrainer] Successfully assigned trainer ${bestTrainerId} to member ${memberId} with score ${highestScore}.`);

            // Log notification for admin
            await supabase.from('admin_notifications').insert({
                gym_id: gymId,
                type: 'trainer_auto_assigned',
                message: `AutoTrainer Engine assigned a new trainer to member ${memberId}.`
            });

            return bestTrainerId;
        }

        console.log(`[AutoTrainer] Could not find a suitable trainer for member ${memberId}.`);
        return null;

    } catch (error) {
        console.error('[AutoTrainer] Error:', error);
        return null;
    }
};
