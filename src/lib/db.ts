import { supabase } from './supabase';

export interface Lead {
    id: string;
    email: string;
    createdAt: string;
    status: string;
    gym_id?: string;
}

export const db = {
    addLead: async (email: string, gymId?: string): Promise<Lead> => {
        const { data, error } = await supabase
            .from('leads')
            .insert([{ email, gym_id: gymId }])
            .select()
            .maybeSingle();

        if (error) throw error;

        return {
            id: data.id,
            email: data.email,
            createdAt: data.created_at,
            status: data.status,
            gym_id: data.gym_id
        };
    },

    getLeads: async (gymId?: string): Promise<Lead[]> => {
        let query = supabase
            .from('leads')
            .select('*');

        if (gymId) {
            query = query.eq('gym_id', gymId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching leads:', error);
            return [];
        }

        return data.map(lead => ({
            id: lead.id,
            email: lead.email,
            createdAt: lead.created_at,
            status: lead.status,
            gym_id: lead.gym_id
        }));
    }
};
