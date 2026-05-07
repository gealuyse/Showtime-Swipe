import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
    // Initialize with actual check to prevent hydration mismatch
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < breakpoint;
        }
        return true; // Default to mobile-first
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Re-check on mount (in case SSR default was wrong)
        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
