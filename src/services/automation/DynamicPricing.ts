import { supabase } from '../../lib/supabase';

/**
 * Automatically activates a discount campaign if revenue is below the predefined target.
 * Logic:
 * - Calculate trailing 30-day revenue
 * - Compare with gym's revenue_target
 * - If revenue < target: Activate 10% discount campaign
 */
export const monitorRevenueTarget = async (gymId: string): Promise<void> => {
    try {
        console.log(`[DynamicPricing] Monitoring revenue target for gym ${gymId}...`);

        // 1. Fetch gym target
        const { data: gym, error: gymError } = await supabase
            .from('gyms')
            .select('revenue_target')
            .eq('id', gymId)
            .single();

        if (gymError) throw gymError;
        if (!gym || !gym.revenue_target) {
            console.log(`[DynamicPricing] No revenue target set for gym ${gymId}.`);
            return;
        }

        const target = Number(gym.revenue_target);

        // 2. Calculate last 30 days revenue
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount')
            .eq('gym_id', gymId)
            .eq('status', 'completed')
            .gte('payment_date', thirtyDaysAgo.toISOString());

        if (paymentsError) throw paymentsError;

        const currentRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        console.log(`[DynamicPricing] Gym ${gymId}: Target=${target}, Actual 30D Revenue=${currentRevenue}`);

        // 3. Compare and trigger if needed
        if (currentRevenue < target) {
            // Check if we already have an active auto-campaign to avoid duplicates
            const { data: existingCampaigns } = await supabase
                .from('campaigns')
                .select('id')
                .eq('gym_id', gymId)
                .eq('status', 'Active')
                .like('name', '%Auto Boost%');

            if (existingCampaigns && existingCampaigns.length > 0) {
                console.log(`[DynamicPricing] Active boost campaign already exists for gym ${gymId}.`);
                return;
            }

            // Create a new campaign
            const { error: insertError } = await supabase
                .from('campaigns')
                .insert({
                    gym_id: gymId,
                    name: 'Auto Boost: 10% Off All Plans!',
                    type: 'Discount',
                    status: 'Active'
                });

            if (insertError) throw insertError;

            // Notify admin
            await supabase.from('admin_notifications').insert({
                gym_id: gymId,
                type: 'dynamic_pricing_triggered',
                message: `Intelligence Engine: Revenue is below target (Actual: ${currentRevenue} vs Target: ${target}). Activated a 10% discount campaign to boost sign-ups.`
            });

            console.log(`[DynamicPricing] Successfully activated discount campaign for gym ${gymId}.`);
        } else {
            console.log(`[DynamicPricing] Revenue is on track for gym ${gymId}. No action needed.`);
        }

    } catch (error) {
        console.error('[DynamicPricing] Error:', error);
    }
};
