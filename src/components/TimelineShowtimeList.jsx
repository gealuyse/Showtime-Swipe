import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import TimelineShowtimeCard from './cards/TimelineShowtimeCard';
import EmptyState from './ui/EmptyState';
import useIsMobile from '../hooks/useIsMobile';

const toDateKey = (date) => date.toISOString().split('T')[0];

const formatDayLabel = (dateKey) => {
    const today = toDateKey(new Date());
    const tomorrow = toDateKey(new Date(Date.now() + 86400000));
    if (dateKey === today) return 'Today';
    if (dateKey === tomorrow) return 'Tomorrow';
    return new Date(dateKey).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
};

const TimelineShowtimeList = ({ showtimes, theaters, movieDuration, disableAnimation = false }) => {
    const isMobile = useIsMobile();

    const groupedByDay = useMemo(() => {
        const now = new Date();

        const active = showtimes
            .map(show => {
                const theater = theaters.find(t => t.id === show.theaterId);
                const processed = { ...show, theater };

                if (processed.startTime) {
                    processed.startDate = new Date(processed.startTime);
                    if (!processed.time) {
                        processed.time = processed.startDate.toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                }

                // Map audio/subtitle → language for the badge
                if (!processed.language && (processed.audio || processed.subtitle)) {
                    processed.language = [processed.audio, processed.subtitle]
                        .filter(Boolean)
                        .join('/');
                }

                return processed;
            })
            .filter(show => show.startDate && show.startDate > now)
            .sort((a, b) => a.startDate - b.startDate);

        // Group into { dateKey: [showtime, ...] } preserving insertion order
        return active.reduce((acc, show) => {
            const key = toDateKey(show.startDate);
            if (!acc[key]) acc[key] = [];
            acc[key].push(show);
            return acc;
        }, {});
    }, [showtimes, theaters]);

    const dayKeys = Object.keys(groupedByDay);

    if (dayKeys.length === 0) {
        return <EmptyState message="No showtimes available." />;
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            {dayKeys.map(dayKey => (
                <div key={dayKey}>
                    {/* Date header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 0 10px',
                    }}>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: dayKey === toDateKey(new Date())
                                ? 'var(--color-primary)'
                                : 'rgba(255,255,255,0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            whiteSpace: 'nowrap'
                        }}>
                            {formatDayLabel(dayKey)}
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    <motion.div
                        initial={disableAnimation ? "visible" : "hidden"}
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: disableAnimation ? 0 : 0.05 } }
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '0px' : '12px'
                        }}
                    >
                        {groupedByDay[dayKey].map(showtime => (
                            <motion.div
                                key={showtime.id}
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                style={{ width: '100%' }}
                            >
                                <TimelineShowtimeCard
                                    showtime={showtime}
                                    movieDuration={movieDuration}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ))}
        </div>
    );
};

export default React.memo(TimelineShowtimeList);
