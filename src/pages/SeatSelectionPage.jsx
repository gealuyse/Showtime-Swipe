import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SeatSkeleton from '../components/SeatSkeleton';
import { showtimes, movies, theaters } from '../data/mockData';
import { generateSeatsForSession } from '../utils/seatGenerator';

const COLS = 10;

// Extracted so React never re-mounts it on selectedSeats changes
const SeatContent = ({
    isModal, navigate, session, theater, movie,
    seats, selectedSeats, handleSeatClick,
    totalPrice, sessionId, showDate, showTime
}) => (
    <div style={isModal
        ? { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }
        : { flex: 1, display: 'flex', flexDirection: 'column' }
    }>
        {/* Header */}
        <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Select Seats</h2>
                <span style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>
                    {theater?.name} • {session?.system.split(' ')[0]}
                </span>
            </div>
        </header>

        {/* Screen */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
                height: '4px', width: '80%', background: 'var(--color-primary)',
                boxShadow: '0 0 20px var(--color-primary)', borderRadius: '4px', marginBottom: '8px'
            }} />
            <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Screen</span>
        </div>

        {/* Seat Map */}
        <div style={{ flex: 1, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: '8px',
                padding: '20px',
                minWidth: '500px',
                maxWidth: '500px',
                margin: '0 auto',
                alignContent: 'center'
            }}>
                {seats.map(seat => {
                    const isSelected = selectedSeats.find(s => s.id === seat.id);
                    const isOccupied = seat.status === 'occupied';
                    const isPremium = seat.type === 'Premium';

                    let borderColor = 'white';
                    let textColor = 'white';
                    if (isOccupied) { borderColor = '#4a4a4a'; textColor = '#4a4a4a'; }
                    else if (isSelected) { borderColor = 'var(--color-primary)'; }
                    else if (isPremium) { borderColor = '#FFD700'; textColor = '#FFD700'; }

                    return (
                        <motion.button
                            key={seat.id}
                            whileTap={!isOccupied ? { scale: 0.9 } : {}}
                            onClick={() => handleSeatClick(seat)}
                            style={{
                                aspectRatio: '1/1',
                                background: isOccupied ? '#2a2a2a' : isSelected ? 'var(--color-primary)' : 'transparent',
                                border: `1px solid ${borderColor}`,
                                borderRadius: isPremium ? '8px 8px 4px 4px' : '6px',
                                color: textColor,
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: 1,
                                boxShadow: isPremium && !isOccupied && !isSelected ? '0 0 5px rgba(255,215,0,0.2)' : 'none'
                            }}
                        >
                            <span style={{ color: isSelected ? 'white' : textColor }}>{seat.row}{seat.number}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '10px', fontSize: '10px', color: 'var(--color-text-dim)', flexWrap: 'wrap' }}>
            {[
                { label: 'Normal', border: '1px solid white' },
                { label: 'Premium', border: '1px solid #FFD700', shadow: '0 0 5px rgba(255,215,0,0.2)' },
                { label: 'Taken', bg: '#2a2a2a', border: '1px solid #4a4a4a' },
                { label: 'Selected', bg: 'var(--color-primary)', border: '1px solid var(--color-primary)' },
            ].map(({ label, bg, border, shadow }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: bg, border, boxShadow: shadow }} />
                    {label}
                </div>
            ))}
        </div>

        {/* Footer Summary */}
        <div style={{
            padding: '24px',
            background: '#1c1e26',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
        }}>
            <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
                    {selectedSeats.length > 0
                        ? `Selected: ${selectedSeats.map(s => s.id).join(', ')}`
                        : 'Select seats'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalPrice.toLocaleString()} ฿</div>
            </div>
            <button
                disabled={selectedSeats.length === 0}
                onClick={() => navigate('/booking/success', {
                    state: {
                        seats: selectedSeats,
                        totalPrice,
                        sessionId,
                        movieTitle: session?.movieTitle || movie?.title,
                        movieImage: session?.poster || movie?.backdrop || movie?.poster,
                        cinemaName: theater?.name,
                        theaterHall: 'Hall 4',
                        showDate,
                        showTime
                    }
                })}
                style={{
                    background: selectedSeats.length === 0 ? '#333' : 'var(--color-primary)',
                    color: selectedSeats.length === 0 ? '#666' : 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                    transition: '0.2s'
                }}
            >
                Book Now
            </button>
        </div>
    </div>
);

const SeatSelectionPage = ({ isModal }) => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const initialSeats = useMemo(() => {
        if (location.state?.preGeneratedSeats) return location.state.preGeneratedSeats;
        return generateSeatsForSession(sessionId);
    }, [sessionId, location.state?.preGeneratedSeats]);

    const [seats] = useState(initialSeats);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isMounting, setIsMounting] = useState(true);

    const session = location.state?.showtimeData || showtimes.find(s => s.id === sessionId);
    const movie = movies.find(m => m.id === (session?.movieId || ''));
    const theater = theaters.find(t => t.id === (session?.theaterId || ''));

    const showDateObj = new Date(session?.startTime);
    const showDate = showDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const showTime = showDateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    useEffect(() => { setIsMounting(false); }, []);

    if (isMounting) return <SeatSkeleton />;

    const handleSeatClick = (seat) => {
        if (seat.status === 'occupied') return;
        setSelectedSeats(prev =>
            prev.find(s => s.id === seat.id)
                ? prev.filter(s => s.id !== seat.id)
                : [...prev, seat]
        );
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const contentProps = {
        isModal, navigate, session, theater, movie,
        seats, selectedSeats, handleSeatClick,
        totalPrice, sessionId, showDate, showTime
    };

    if (isModal) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
                onClick={(e) => { if (e.target === e.currentTarget) navigate(-1); }}
            >
                <motion.div
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 50, scale: 0.95 }}
                    style={{
                        width: '100%', maxWidth: '500px', background: '#13141a',
                        borderRadius: '24px', overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
                        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SeatContent {...contentProps} />
                </motion.div>
            </motion.div>
        );
    }

    return (
        <PageTransition style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
            <SeatContent {...contentProps} />
        </PageTransition>
    );
};

export default SeatSelectionPage;
