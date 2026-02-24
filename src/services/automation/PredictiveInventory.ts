import { supabase } from '../../lib/supabase';

/**
 * Predicts inventory stock levels and issues warnings before items deplete.
 * Logic:
 * - avgDailySales = last_30_days_sales / 30
 * - daysLeft = currentStock / avgDailySales
 * - Trigger admin alert if daysLeft < 5
 */
export const predictStockLevels = async (gymId: string): Promise<void> => {
    try {
        console.log(`[PredictiveInventory] Evaluating stock levels for gym ${gymId}...`);

        const { data: inventory, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('gym_id', gymId);

        if (error) throw error;
        if (!inventory || (inventory as any[]).length === 0) return;

        for (const item of inventory) {
            const avgDailySales = item.last_30_days_sales / 30;

            // If none sold, skip
            if (avgDailySales <= 0) continue;

            const daysLeft = item.current_stock / avgDailySales;

            if (daysLeft < 5 && daysLeft >= 0) {
                // Create admin alert
                await supabase.from('admin_notifications').insert({
                    gym_id: gymId,
                    type: 'inventory_alert',
                    message: `Predictive Inventory: Action required! Stock for "${item.item_name}" is estimated to run out in ${Math.ceil(daysLeft)} days. Current stock is ${item.current_stock}.`
                });

                console.log(`[PredictiveInventory] Warned admin about ${item.item_name}. Estimated days left: ${daysLeft.toFixed(1)}`);
            }
        }
    } catch (error) {
        console.error('[PredictiveInventory] Error:', error);
    }
};
