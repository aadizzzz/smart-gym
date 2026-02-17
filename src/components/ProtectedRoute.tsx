import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, role, gymId, hasMembership, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111813] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#13ec5b] text-4xl animate-spin">progress_activity</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based redirection logic
    if (role === 'gym_admin') {
        if (!gymId && location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" replace />;
        }
        if (gymId && location.pathname === '/onboarding') {
            return <Navigate to="/admin" replace />;
        }
    }

    if (role === 'member') {
        if (!gymId && location.pathname !== '/choose-gym') {
            return <Navigate to="/choose-gym" replace />;
        }
        if (gymId && !hasMembership && location.pathname !== '/choose-plan' && location.pathname !== '/choose-gym') {
            return <Navigate to="/choose-plan" replace />;
        }
        // Redirect away from selection pages if already set
        if (gymId && location.pathname === '/choose-gym') {
            return <Navigate to="/dashboard" replace />;
        }
        if (hasMembership && location.pathname === '/choose-plan') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard if role is not allowed for this route
        if (role === 'gym_admin') return <Navigate to="/admin" replace />;
        if (role === 'member') return <Navigate to="/dashboard" replace />;
        if (role === 'trainer') return <Navigate to="/trainer" replace />;
        if (role === 'super_admin' || role === 'platform_admin') return <Navigate to="/platform-admin" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
