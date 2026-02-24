import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: string;
    type: string;
    message: string;
    read: boolean;
    created_at: string;
}

export const AdminNotifications: React.FC = () => {
    const { gymId } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (gymId) {
            fetchNotifications();

            // Subscribe to new notifications
            const subscription = supabase
                .channel('admin_notifications_changes')
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'admin_notifications', filter: `gym_id=eq.${gymId}` },
                    (payload) => {
                        console.log('New notification received!', payload);
                        setNotifications(prev => [payload.new as Notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [gymId]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .eq('gym_id', gymId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            const { error } = await supabase
                .from('admin_notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);

            const { error } = await supabase
                .from('admin_notifications')
                .update({ read: true })
                .eq('gym_id', gymId)
                .eq('read', false);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking all as read:', error);
            fetchNotifications();
        }
    };

    const getIconForType = (type: string) => {
        if (type.includes('churn')) return { icon: 'warning', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (type.includes('inventory')) return { icon: 'inventory_2', color: 'text-orange-500', bg: 'bg-orange-500/10' };
        if (type.includes('pricing')) return { icon: 'trending_up', color: 'text-green-500', bg: 'bg-green-500/10' };
        if (type.includes('invoice')) return { icon: 'receipt', color: 'text-blue-500', bg: 'bg-blue-500/10' };
        if (type.includes('trainer')) return { icon: 'sports_kabaddi', color: 'text-purple-500', bg: 'bg-purple-500/10' };
        return { icon: 'notifications', color: 'text-gray-500', bg: 'bg-gray-500/10' };
    };

    const timeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--surface-highlight)]"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 size-2.5 bg-red-500 rounded-full border-2 border-[var(--background)] animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-highlight)]/50">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">Intelligence Alerts</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-bold text-primary hover:text-[#0fd60f] uppercase tracking-wider"
                            >
                                Mark All Read
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-secondary)] flex flex-col items-center">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                                    <p className="text-sm">No new intelligence insights.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[var(--border)]/50">
                                    {notifications.map(notif => {
                                        const { icon, color, bg } = getIconForType(notif.type);
                                        const handleNotificationClick = () => {
                                            if (!notif.read) markAsRead(notif.id);
                                            setIsOpen(false);
                                            if (notif.type.includes('inventory')) navigate('/admin/inventory');
                                            else if (notif.type.includes('invoice') || notif.type.includes('pricing')) navigate('/admin/payments');
                                            else if (notif.type.includes('trainer')) navigate('/admin/trainers');
                                            else navigate('/admin/members');
                                        };
                                        return (
                                            <div
                                                key={notif.id}
                                                onClick={handleNotificationClick}
                                                className={`p-4 flex gap-3 hover:bg-[var(--surface-highlight)] transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-primary/5'}`}
                                            >
                                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
                                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm leading-snug text-[var(--text-primary)] ${!notif.read ? 'font-semibold' : ''}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium uppercase tracking-wider">
                                                        {timeAgo(notif.created_at)}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
