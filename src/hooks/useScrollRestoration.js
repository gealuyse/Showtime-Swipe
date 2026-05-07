import { useLayoutEffect } from 'react';

const useScrollRestoration = (key, dependency = null) => {
    useLayoutEffect(() => {
        const savedScrollY = sessionStorage.getItem(key);

        if (savedScrollY) {
            window.scrollTo(0, parseInt(savedScrollY, 10));
        }

        const handleUnmount = () => {
            sessionStorage.setItem(key, window.scrollY.toString());
        };

        // Note: Clean up normally doesn't fire on simple unmount in the same way we want for specific navigation,
        // but adding event listener for 'beforeunload' might be too much.
        // React's cleanup function is the standard way.
        return () => handleUnmount();
    }, [key, dependency]);
};

export default useScrollRestoration;
