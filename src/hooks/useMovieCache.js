import { useState, useEffect, useCallback, useRef } from 'react';
import { getMovieDetail } from '../services/api';

// Cache TTL: 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Custom hook for fetching and caching movie details.
 * Features:
 * - TTL-based cache invalidation (5 minutes)
 * - Instant load from cache (no flickering on back navigation)
 * - Background refresh when cache is stale
 * - Manual refetch capability for pull-to-refresh
 */
const useMovieCache = (movieId) => {
    // Initialize state from cache if available and not expired
    const [movie, setMovie] = useState(() => {
        try {
            const cached = sessionStorage.getItem(`movie_cache_${movieId}`);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Check if cache is still valid
                if (timestamp && Date.now() - timestamp < CACHE_TTL_MS) {
                    return data;
                }
                // Cache expired - clear it
                sessionStorage.removeItem(`movie_cache_${movieId}`);
            }
            return null;
        } catch (error) {
            console.warn('Error reading movie cache:', error);
            sessionStorage.removeItem(`movie_cache_${movieId}`);
            return null;
        }
    });

    const [loading, setLoading] = useState(!movie);
    const [error, setError] = useState(null);

    const movieRef = useRef(movie);
    movieRef.current = movie;

    // Core fetch function — movieRef used instead of movie to avoid stale-closure loop
    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!movieId) return;

        try {
            if (!movieRef.current || forceRefresh) setLoading(true);
            setError(null);

            const fetchedData = await getMovieDetail(movieId);

            if (fetchedData) {
                setMovie(fetchedData);
                sessionStorage.setItem(`movie_cache_${movieId}`, JSON.stringify({
                    data: fetchedData,
                    timestamp: Date.now()
                }));
            } else {
                setError('notFound');
            }
        } catch (err) {
            console.error('Error fetching movie:', err);
            setError(err.message === 'Failed to fetch' ? 'network' : err.message);
        } finally {
            setLoading(false);
        }
    }, [movieId]);

    // Manual refetch function (for pull-to-refresh)
    const refetch = useCallback(() => {
        sessionStorage.removeItem(`movie_cache_${movieId}`);
        return fetchData(true);
    }, [movieId, fetchData]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieId]);

    return { movie, loading, error, refetch };
};

export default useMovieCache;
