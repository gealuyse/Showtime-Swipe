import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

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

const MovieDetailSkeleton = () => {
    const isMobile = useIsMobile();

    return (
        <div style={{ minHeight: '100vh', background: '#0f1014', overflow: 'hidden' }}>
            {/* Top Banner Placeholder */}
            <SkeletonBlock
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: isMobile ? '50vh' : '60vh', // Mobile: 50vh, Desktop 60vh
                    borderRadius: 0,
                    zIndex: 0
                }}
            />

            {/* Floating Content Sheet */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                marginTop: isMobile ? '40vh' : '45vh', // Approx sync with real layout
                background: '#0f1014',
                minHeight: '60vh',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: isMobile ? '24px 16px' : '0 20px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'stretch' : 'center',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
            }}>
                {/* Movie Info Section (Poster + Title) */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row', // Stack on Mobile
                    alignItems: isMobile ? 'center' : 'flex-end',
                    gap: isMobile ? '20px' : '24px',
                    maxWidth: '1000px',
                    width: '100%',
                    marginTop: isMobile ? '-80px' : '-60px', // Pull up like real one
                    marginBottom: '32px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    {/* Poster Placeholder - Centered on Mobile */}
                    <SkeletonBlock
                        style={{
                            width: isMobile ? '140px' : '160px',
                            aspectRatio: '2/3',
                            borderRadius: '12px',
                            flexShrink: 0,
                            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                        }}
                    />

                    {/* Text Details Placeholders */}
                    <div style={{
                        paddingBottom: isMobile ? 0 : '10px',
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'center' : 'flex-start'
                    }}>
                        {/* Title Bar */}
                        <SkeletonBlock style={{ height: isMobile ? '28px' : '32px', width: '60%', marginBottom: '16px', borderRadius: '6px' }} />

                        {/* Metadata Bars */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                            <SkeletonBlock style={{ height: '20px', width: '40px', borderRadius: '4px' }} />
                            <SkeletonBlock style={{ height: '20px', width: '80px', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                {/* Showtimes Section (Simulate Cards) */}
                <div style={{ maxWidth: '1000px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <SkeletonBlock style={{ height: '24px', width: '80px' }} />
                        <SkeletonBlock style={{ height: '30px', width: '150px', borderRadius: '12px' }} />
                    </div>

                    {/* Responsive Grid Simulation */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', // 1 Col on Mobile
                        gap: '16px'
                    }}>
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonBlock
                                key={i}
                                style={{
                                    height: isMobile ? '120px' : '140px', // Smaller on mobile (Smart Stack)
                                    borderRadius: '16px'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailSkeleton;
