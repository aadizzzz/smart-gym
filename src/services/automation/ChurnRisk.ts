import { supabase } from '../../lib/supabase';

/**
 * Detects members likely to leave the gym based on lack of attendance and approaching expiry.
 * Risk Conditions:
 * - Attendance dropped >= 50% in last 14 days (Approximated checking check-ins vs expected or just low raw attendance)
 * - Membership expires within 7 days
 * - No assigned trainer
 */
export const evaluateChurnRisk = async (gymId: string): Promise<void> => {
    try {
        console.log(`[ChurnRisk] Evaluating churn risk for gym ${gymId}...`);

        // 1. Get active members
        const { data: members, error: membersError } = await supabase
            .from('members')
            .select('id, user_id, assigned_trainer_id, expiry_date')
            .eq('gym_id', gymId)
            .eq('status', 'active');

        if (membersError) throw membersError;
        if (!members || members.length === 0) return;

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        for (const member of members) {
            let isAtRisk = false;

            // Condition 1: Expiry within 7 days
            if (member.expiry_date && new Date(member.expiry_date) <= sevenDaysFromNow) {
                isAtRisk = true;
            }

            // Condition 2: No trainer assigned (using isolation as a risk factor)
            if (!member.assigned_trainer_id) {
                // Condition 3: Low attendance in last 14 days
                const { count, error: countError } = await supabase
                    .from('attendance')
                    .select('*', { count: 'exact', head: true })
                    .eq('member_id', member.id)
                    .gte('check_in_time', fourteenDaysAgo.toISOString());

                if (!countError && count !== null && count < 3) {
                    isAtRisk = true; // Less than 3 visits in 14 days is alarming for general gym goers
                }
            }

            if (isAtRisk) {
                // Mark as churn risk
                await supabase
                    .from('members')
                    .update({ churn_risk: true })
                    .eq('id', member.id);

                // Notify Admin
                await supabase.from('admin_notifications').insert({
                    gym_id: gymId,
                    type: 'churn_risk_alert',
                    message: `Intelligence Engine: Member ${member.id} detected as high churn risk.`
                });

                // Attempt to send email to user
                try {
                    // We need the user's profile to get the email
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('email, full_name')
                        .eq('id', member.user_id)
                        .single();

                    if (profile?.email) {
                        await supabase.functions.invoke('send-email', {
                            body: {
                                to: profile.email,
                                subject: "We miss you at the Gym! Here is 10% off.",
                                html: `
                                    <h2>Hey ${profile.full_name || 'Member'},</h2>
                                    <p>We noticed you haven't been checking in lately! Staying consistent is the hardest part of fitness, but you've already taken the first step by joining.</p>
                                    <p>To help you get back into the rhythm, we've added a <strong>10% discount</strong> to your next billing cycle.</p>
                                    <p>If you need help or want to talk to a trainer about adjusting your goals, just reply to this email!</p>
                                    <br/>
                                    <p>Best,<br/>Your Gym Admin Team</p>
                                `,
                                fromName: "Gym Admin",
                            }
                        });
                        console.log(`[Gym Intelligence] Success: Automated retention email sent to ${profile.email}.`);
                    }
                } catch (emailError) {
                    console.error(`[Gym Intelligence] Failed to send retention email:`, emailError);
                }

                console.log(`[ChurnRisk] Member ${member.id} marked as churn risk.`);
            } else {
                // Clear churn risk if they recovered
                await supabase
                    .from('members')
                    .update({ churn_risk: false })
                    .eq('id', member.id);
            }
        }

        console.log(`[ChurnRisk] Evaluation complete for gym ${gymId}.`);

    } catch (error) {
        console.error('[ChurnRisk] Error:', error);
    }
};
