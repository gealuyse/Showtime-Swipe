import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const Preloader = ({ onComplete }) => {
    const isMobile = useIsMobile(); // Use hook for responsive font size

    useEffect(() => {
        const timer = setTimeout(() => {
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        exit: {
            y: '-100%',
            transition: {
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            }
        }
    };

    const textContainerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const logoText = "Showtime Swipe";

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#0f1014',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                overflow: 'hidden' // Prevent any scrollbars during load
            }}
            onAnimationComplete={(definition) => {
                if (definition === 'exit') {
                    onComplete && onComplete();
                }
            }}
        >
            {/* Logo Section */}
            <motion.div
                variants={textContainerVariants}
                initial="hidden"
                animate="show"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // Center content
                    flexWrap: 'nowrap', // Force single line if possible, or wrap gracefully
                    gap: isMobile ? '2px' : '4px', // Tighter gap on mobile
                    marginBottom: '20px',
                    width: '100%', // Ensure centering works
                    padding: '0 20px' // Prevent edge touching
                }}
            >
                {/* Splitting text for stagger effect */}
                {logoText.split("").map((char, index) => {
                    const isSwipe = index >= 9;
                    return (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            style={{
                                fontSize: isMobile ? '1.8rem' : '2.5rem', // Responsive Font Size
                                fontWeight: '800',
                                color: isSwipe ? '#e50914' : '#ffffff',
                                fontFamily: '"Inter", sans-serif',
                                letterSpacing: isMobile ? '-0.5px' : '-1px',
                                whiteSpace: 'pre' // Preserve space character width
                            }}
                        >
                            {char}
                        </motion.span>
                    )
                })}
            </motion.div>

            {/* Progress Bar Container */}
            <div style={{
                width: '200px',
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 0.5 // Start after logo enters
                    }}
                    style={{
                        height: '100%',
                        background: '#e50914',
                        boxShadow: '0 0 10px rgba(229, 9, 20, 0.5)'
                    }}
                    onAnimationComplete={() => {
                        // Once progress bar finishes, we can trigger the parent to remove us
                        // which will then trigger the exit animation defined in containerVariants
                        onComplete();
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Preloader;
