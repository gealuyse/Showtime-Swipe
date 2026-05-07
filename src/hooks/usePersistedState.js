import { useState, useEffect } from 'react';

const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const persistedValue = sessionStorage.getItem(key);
            return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            sessionStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error writing sessionStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};

export default usePersistedState;
