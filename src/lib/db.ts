export interface Lead {
    id: string;
    email: string;
    createdAt: string;
}

const STORAGE_KEY = 'smart_gym_leads';

export const db = {
    addLead: async (email: string): Promise<Lead> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const leads = db.getLeads();
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify([newLead, ...leads]));
        return newLead;
    },

    getLeads: (): Lead[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
};
