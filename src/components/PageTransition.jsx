import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, className, style }) => {
    // ✅ Scroll to top ONLY when the new page is actually rendered
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={className}
            style={{ width: '100%', ...style }} // Ensure full width
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
