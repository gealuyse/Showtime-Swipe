import { useEffect } from 'react';

/**
 * Hook to save and restore window scroll position using sessionStorage.
 * @param {string} key - Unique key for sessionStorage to save the scroll position.
 */
const useScrollPosition = (key) => {
    useEffect(() => {
        // Restore scroll position on mount
        const savedPosition = sessionStorage.getItem(key);
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10));
        }

        // Save scroll position on unmount
        const handleUnmount = () => {
            sessionStorage.setItem(key, window.scrollY.toString());
        };

        return () => {
            handleUnmount();
        };
    }, [key]);
};

export default useScrollPosition;
