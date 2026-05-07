import React from 'react';
import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';

/**
 * RefreshIndicator - Visual feedback for pull-to-refresh action
 * Shows spinner when refreshing, arrow when pulling
 */
const RefreshIndicator = ({ progress, isRefreshing, pullDistance }) => {
    if (pullDistance <= 0 && !isRefreshing) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: `translateX(-50%) translateY(${Math.min(pullDistance, 60)}px)`,
            zIndex: 100,
            transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-bg, #0f1014)',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                opacity: Math.min(progress * 2, 1)
            }}>
                <RefreshCw
                    size={20}
                    style={{
                        color: progress >= 1 ? 'var(--color-primary, #e50914)' : 'rgba(255,255,255,0.5)',
                        transform: `rotate(${progress * 360}deg)`,
                        transition: 'color 0.2s',
                        animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none'
                    }}
                />
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

RefreshIndicator.propTypes = {
    progress: PropTypes.number.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    pullDistance: PropTypes.number.isRequired
};

export default RefreshIndicator;
