import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import BrandBadge from './ui/BrandBadge';
import { generateSeatsForSession } from '../utils/seatGenerator';

const ShowtimeList = ({ showtimes, theaters }) => {
    const location = useLocation();
    const showtimesByTheater = showtimes.reduce((acc, show) => {
        if (!acc[show.theaterId]) acc[show.theaterId] = [];
        acc[show.theaterId].push(show);
        return acc;
    }, {});

    const now = new Date();

    return (
        <div className="showtime-list-container">
            {Object.keys(showtimesByTheater).map((theaterId, index) => {
                const theater = theaters.find(t => t.id === theaterId);
                const theaterRounds = showtimesByTheater[theaterId].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                // Filter for future showtimes only
                const activeRounds = theaterRounds.filter(round => new Date(round.startTime) > new Date());

                // Hide theater if no future showtimes
                if (activeRounds.length === 0) return null;

                return (
                    <motion.div
                        key={theaterId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'linear-gradient(145deg, #1c1e26, #16181d)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Theater Header */}
                        <div style={{
                            padding: '16px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#fff' }}>{theater?.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-dim)', marginTop: '4px' }}>
                                    <MapPin size={14} color="var(--color-primary)" />
                                    <span>{theater?.location?.district}</span>
                                </div>
                            </div>
                            <div style={{
                                fontSize: '11px'
                            }}>
                                <BrandBadge brand={theater?.brand} theaterName={theater?.name} />
                            </div>
                        </div>

                        {/* Rounds Grid */}
                        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px', flex: 1, alignContent: 'start' }}>
                            {activeRounds.map(round => {
                                const startTime = new Date(round.startTime);
                                const timeString = startTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

                                // Logic: Is this showtime currently relevant?
                                const diffMins = (startTime - now) / 60000;
                                const isNext = diffMins >= 0 && diffMins <= 60;

                                return (
                                    <Link
                                        key={round.id}
                                        to={`/booking/${round.id}`}
                                        state={{
                                            showtimeData: round,
                                            backgroundLocation: location,
                                            preGeneratedSeats: generateSeatsForSession(round.id)
                                        }}
                                        style={{ textDecoration: 'none' }}
                                        className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label={`Book ${timeString}, ${round.system} system`}
                                    >
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: isNext
                                                    ? 'linear-gradient(135deg, var(--color-primary), #b91c1c)'
                                                    : 'rgba(255,255,255,0.05)',
                                                padding: '12px 8px',
                                                borderRadius: '12px',
                                                color: 'white',
                                                border: isNext ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                position: 'relative',
                                                boxShadow: isNext ? '0 4px 12px rgba(229, 9, 20, 0.4)' : 'none'
                                            }}
                                        >
                                            {isNext && (
                                                <div style={{
                                                    position: 'absolute', top: -6, right: -6,
                                                    background: '#fff', color: 'var(--color-primary)',
                                                    fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
                                                }}>
                                                    SOON
                                                </div>
                                            )}

                                            <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1' }}>{timeString}</div>

                                            <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.8 }}>
                                                {round.system.split(' ')[0]}
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
            <style>{`
                .showtime-list-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                    padding-bottom: 40px;
                }
                @media (min-width: 768px) {
                    .showtime-list-container {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .showtime-list-container {
                        grid-template-columns: repeat(2, 1fr); /* Keep 2 columns but wider, or go to 3 if fits */
                    }
                }
            `}</style>
        </div>
    );
};

export default ShowtimeList;
