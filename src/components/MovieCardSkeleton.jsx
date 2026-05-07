import React from 'react';
import { motion } from 'framer-motion';

const MovieCardSkeleton = () => {
    return (
        <div style={{
            background: 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            height: '100%',
            position: 'relative'
        }}>
            {/* Shimmer Effect Overlay */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    zIndex: 2,
                    backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />

            {/* Poster Placeholder */}
            <div style={{
                aspectRatio: '2/3',
                width: '100%',
                background: '#2a2a2a',
            }} />

            {/* Content Placeholder */}
            <div style={{ padding: '12px' }}>
                <div style={{ height: '14px', width: '80%', background: '#2a2a2a', marginBottom: '8px', borderRadius: '4px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ height: '10px', width: '20px', background: '#2a2a2a', borderRadius: '2px' }} />
                    <div style={{ height: '10px', width: '30px', background: '#2a2a2a', borderRadius: '2px' }} />
                </div>
            </div>
        </div>
    );
};

export default MovieCardSkeleton;
