export { assignTrainerToMember } from './AutoTrainer';
export { evaluateChurnRisk } from './ChurnRisk';
export { monitorRevenueTarget } from './DynamicPricing';
export { generateInvoice } from './AutoInvoice';
export { predictStockLevels } from './PredictiveInventory';

import { evaluateChurnRisk } from './ChurnRisk';
import { monitorRevenueTarget } from './DynamicPricing';
import { predictStockLevels } from './PredictiveInventory';

/**
 * Central orchestrator for all "daily cron" type automations.
 * In a pure frontend architecture, you can attach this to an Admin dashboard button 
 * ("Run Daily Analytics") or call it lightly on initial admin dashboard mount (with debouncing/local storage checks).
 * 
 * In a production architecture with a backend, this block gets uploaded to a Supabase Edge Function 
 * triggered by pg_cron.
 */
export const runGymIntelligenceEngine = async (gymId: string): Promise<void> => {
    console.log(`[IntelligenceEngine] Starting daily analysis run for gym ${gymId}...`);

    // We run the tasks independently so one failing doesn't stop the others.
    await Promise.allSettled([
        evaluateChurnRisk(gymId),
        monitorRevenueTarget(gymId),
        predictStockLevels(gymId)
    ]);

    console.log(`[IntelligenceEngine] Daily analysis run complete for gym ${gymId}.`);
};
