import { useState, useEffect, useCallback } from 'react';

/**
 * usePullToRefresh - Simple pull-to-refresh implementation for mobile
 * Tracks touch gestures and triggers refresh when pulled down enough
 */
const usePullToRefresh = ({ onRefresh, threshold = 80, disabled = false }) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);

    const handleTouchStart = useCallback((e) => {
        if (disabled || isRefreshing) return;
        // Only start pull if at top of page
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    }, [disabled, isRefreshing]);

    const handleTouchMove = useCallback((e) => {
        if (disabled || isRefreshing || startY === 0) return;
        if (window.scrollY > 0) {
            setStartY(0);
            setPullDistance(0);
            return;
        }

        const currentY = e.touches[0].clientY;
        const distance = Math.max(0, currentY - startY);

        // Apply resistance factor for more natural feel
        const resistedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(resistedDistance);

        // Prevent default scroll when pulling
        if (distance > 10) {
            e.preventDefault();
        }
    }, [disabled, isRefreshing, startY, threshold]);

    const handleTouchEnd = useCallback(async () => {
        if (disabled || isRefreshing) return;

        if (pullDistance >= threshold && onRefresh) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
            }
        }

        setStartY(0);
        setPullDistance(0);
    }, [disabled, isRefreshing, pullDistance, threshold, onRefresh]);

    useEffect(() => {
        if (disabled) return;

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        pullDistance,
        isRefreshing,
        // Progress from 0 to 1 (capped at 1)
        progress: Math.min(pullDistance / threshold, 1)
    };
};

export default usePullToRefresh;
