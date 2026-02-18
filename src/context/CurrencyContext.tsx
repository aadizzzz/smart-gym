import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// ─── Currency catalogue ────────────────────────────────────────────────────────
export interface CurrencyOption {
    code: string;   // ISO 4217
    symbol: string;
    name: string;
    flag: string;
}

export const CURRENCIES: CurrencyOption[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
];

export function getCurrencyByCode(code: string): CurrencyOption {
    return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

// ─── Context ───────────────────────────────────────────────────────────────────
interface CurrencyContextType {
    currency: CurrencyOption;
    setCurrency: (code: string) => Promise<void>;
    formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { gymId } = useAuth();
    const [currency, setCurrencyState] = useState<CurrencyOption>(CURRENCIES[0]);

    // Load from DB whenever gymId is known
    useEffect(() => {
        if (!gymId) return;
        supabase
            .from('gyms')
            .select('currency')
            .eq('id', gymId)
            .single()
            .then(({ data }) => {
                if (data?.currency) setCurrencyState(getCurrencyByCode(data.currency));
            });
    }, [gymId]);

    const setCurrency = async (code: string) => {
        if (!gymId) return;
        const opt = getCurrencyByCode(code);
        setCurrencyState(opt);
        await supabase.from('gyms').update({ currency: code }).eq('id', gymId);
    };

    const formatAmount = (amount: number): string => {
        const sym = currency.symbol;
        if (amount >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`;
        if (amount >= 1_000) return `${sym}${(amount / 1_000).toFixed(1)}K`;
        return `${sym}${amount.toFixed(0)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
            {children}
        </CurrencyContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
    return ctx;
};
