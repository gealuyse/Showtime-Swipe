import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBlock = ({ style, ...props }) => (
    <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            ...style
        }}
        {...props}
    />
);

const SeatSkeleton = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f1014',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '100px 20px 20px', // Top padding for Navbar space
        }}>
            {/* Movie Header Info */}
            <div style={{ width: '100%', maxWidth: '500px', marginBottom: '40px', display: 'flex', gap: '16px' }}>
                <SkeletonBlock style={{ width: '80px', height: '120px', borderRadius: '8px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                    <SkeletonBlock style={{ width: '80%', height: '24px' }} />
                    <SkeletonBlock style={{ width: '50%', height: '16px' }} />
                    <SkeletonBlock style={{ width: '40%', height: '16px' }} />
                </div>
            </div>

            {/* Screen */}
            <SkeletonBlock style={{
                width: '80%',
                maxWidth: '600px',
                height: '60px',
                borderRadius: '50% 50% 0 0 / 20px 20px 0 0', // Slight curve
                marginBottom: '40px',
                opacity: 0.2
            }} />

            {/* Seat Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {[...Array(6)].map((_, r) => (
                    <div key={r} style={{ display: 'flex', gap: '8px' }}>
                        {[...Array(8)].map((_, c) => (
                            <SkeletonBlock
                                key={c}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: Math.random() > 0.8 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)' // Random "taken" seats
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Bottom Legend */}
            <div style={{ display: 'flex', gap: '24px' }}>
                <SkeletonBlock style={{ width: '60px', height: '20px' }} />
                <SkeletonBlock style={{ width: '60px', height: '20px' }} />
                <SkeletonBlock style={{ width: '60px', height: '20px' }} />
            </div>

            {/* Bottom Action Bar */}
            <SkeletonBlock style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                borderRadius: '24px 24px 0 0'
            }} />
        </div>
    );
};

export default SeatSkeleton;
