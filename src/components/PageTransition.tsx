
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition: Transition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

interface PageTransitionProps {
    children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
