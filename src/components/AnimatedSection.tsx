
import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
