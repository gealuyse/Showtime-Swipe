import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import TimelineShowtimeCard from './cards/TimelineShowtimeCard';
import EmptyState from './ui/EmptyState';
import useIsMobile from '../hooks/useIsMobile';

const TimelineShowtimeList = ({ showtimes, theaters, movieDuration, disableAnimation = false }) => {
    const isMobile = useIsMobile();

    // 1. Filter active showtimes - Using Date comparison (not string) for correctness
    const activeShowtimes = useMemo(() => {
        const now = new Date();

        return showtimes
            .map(show => {
                const theater = theaters.find(t => t.id === show.theaterId);
                let processedShow = { ...show, theater };

                // Ensure we have a proper Date object for comparison
                if (processedShow.startTime) {
                    processedShow.startDate = new Date(processedShow.startTime);
                    // Also ensure 'time' string exists for display
                    if (!processedShow.time) {
                        processedShow.time = processedShow.startDate.toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                }
                return processedShow;
            })
            // Filter using Date comparison (handles cross-midnight correctly)
            .filter(show => show.startDate && show.startDate > now)
            // Sort by actual Date object
            .sort((a, b) => a.startDate - b.startDate);
    }, [showtimes, theaters]);

    // 2. Empty State
    if (activeShowtimes.length === 0) {
        return <EmptyState message="No more showtimes today." />;
    }

    // 3. Render - MOBILE: No gap, cards handle their own borders. DESKTOP: gap between cards.
    return (
        <div style={{ paddingBottom: '40px' }}>
            <motion.div
                initial={disableAnimation ? "visible" : "hidden"}
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: disableAnimation ? 0 : 0.05 } }
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? '0px' : '12px' // NO GAP on mobile (cards use border-bottom)
                }}
            >
                {activeShowtimes.map(showtime => (
                    <motion.div
                        key={showtime.id}
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        style={{ width: '100%' }} // Ensure full width
                    >
                        <TimelineShowtimeCard
                            showtime={showtime}
                            movieDuration={movieDuration}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default React.memo(TimelineShowtimeList);
