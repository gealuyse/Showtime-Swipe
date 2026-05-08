import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SeatSkeleton from '../components/SeatSkeleton';
import { showtimes, movies, theaters } from '../data/mockData';
import { generateSeatsForSession } from '../utils/seatGenerator';

const COLS = 10;
const CURRENCY_LABEL = 'THB';

const SeatButton = React.memo(({ seat, isSelected, onSeatClick }) => {
    const isOccupied = seat.status === 'occupied';
    const isPremium = seat.type === 'Premium';

    let borderColor = 'var(--color-text)';
    let textColor = 'var(--color-text)';

    if (isOccupied) {
        borderColor = 'rgba(13,26,58,0.24)';
        textColor = 'rgba(13,26,58,0.28)';
    } else if (isSelected) {
        borderColor = 'var(--color-primary)';
        textColor = '#ffffff';
    } else if (isPremium) {
        borderColor = 'var(--color-primary)';
        textColor = 'var(--color-primary)';
    }

    return (
        <button
            type="button"
            onClick={() => onSeatClick(seat)}
            disabled={isOccupied}
            aria-pressed={isSelected}
            aria-label={`${seat.row}${seat.number} ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
            style={{
                aspectRatio: '1/1',
                background: isOccupied ? 'rgba(13,26,58,0.08)' : isSelected ? 'var(--color-primary)' : '#ffffff',
                border: `1px solid ${borderColor}`,
                borderRadius: isPremium ? '8px 8px 4px 4px' : '6px',
                color: textColor,
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isOccupied ? 'not-allowed' : 'pointer',
                opacity: 1,
                boxShadow: isSelected
                    ? '0 6px 16px rgba(26,92,255,0.22)'
                    : isPremium && !isOccupied
                        ? '0 0 0 3px rgba(26,92,255,0.06)'
                        : 'none',
                transform: isSelected ? 'translateY(-1px)' : 'none',
                transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease'
            }}
        >
            <span style={{ color: textColor }}>{seat.row}{seat.number}</span>
        </button>
    );
});

SeatButton.displayName = 'SeatButton';

const SeatContent = React.memo(({
    isModal, navigate, session, theater, movie,
    seats, selectedSeatIds, selectedSeats, handleSeatClick,
    totalPrice, sessionId, showDate, showTime
}) => (
    <div style={isModal
        ? { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }
        : { flex: 1, display: 'flex', flexDirection: 'column' }
    }>
        <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.76)', borderBottom: '1px solid rgba(26,92,255,0.1)' }}>
            <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
                aria-label="Go back"
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--color-text)' }}>Select Seats</h2>
                <span style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>
                    {theater?.name} • {session?.system.split(' ')[0]}
                </span>
            </div>
        </header>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
                height: '4px', width: '80%', background: 'var(--color-primary)',
                boxShadow: '0 10px 24px rgba(26,92,255,0.24)', borderRadius: '4px', marginBottom: '8px'
            }} />
            <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Screen</span>
        </div>

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
                {seats.map(seat => (
                    <SeatButton
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeatIds.has(seat.id)}
                        onSeatClick={handleSeatClick}
                    />
                ))}
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '10px', fontSize: '10px', color: 'var(--color-text-dim)', flexWrap: 'wrap' }}>
            {[
                { label: 'Normal', border: '1px solid var(--color-text)', bg: '#ffffff' },
                { label: 'Premium', border: '1px solid var(--color-primary)', bg: '#ffffff', shadow: '0 0 0 3px rgba(26,92,255,0.06)' },
                { label: 'Taken', bg: 'rgba(13,26,58,0.08)', border: '1px solid rgba(13,26,58,0.24)' },
                { label: 'Selected', bg: 'var(--color-primary)', border: '1px solid var(--color-primary)' },
            ].map(({ label, bg, border, shadow }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: bg, border, boxShadow: shadow }} />
                    {label}
                </div>
            ))}
        </div>

        <div style={{
            padding: '24px',
            background: '#ffffff',
            borderTop: '1px solid rgba(26,92,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -8px 24px rgba(13,26,58,0.08)'
        }}>
            <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
                    {selectedSeats.length > 0
                        ? `Selected: ${selectedSeats.map(s => s.id).join(', ')}`
                        : 'Select seats'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    {totalPrice.toLocaleString('th-TH')} {CURRENCY_LABEL}
                </div>
            </div>
            <button
                type="button"
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
                    background: selectedSeats.length === 0 ? 'rgba(13,26,58,0.12)' : 'var(--color-primary)',
                    color: selectedSeats.length === 0 ? 'rgba(13,26,58,0.36)' : 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'background 120ms ease, color 120ms ease'
                }}
            >
                Book Now
            </button>
        </div>
    </div>
));

SeatContent.displayName = 'SeatContent';

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

    const selectedSeatIds = useMemo(
        () => new Set(selectedSeats.map(seat => seat.id)),
        [selectedSeats]
    );

    const handleSeatClick = useCallback((seat) => {
        if (seat.status === 'occupied') return;
        setSelectedSeats(prev => {
            const exists = prev.some(s => s.id === seat.id);
            return exists
                ? prev.filter(s => s.id !== seat.id)
                : [...prev, seat];
        });
    }, []);

    const totalPrice = useMemo(
        () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        [selectedSeats]
    );

    if (isMounting) return <SeatSkeleton />;

    const contentProps = {
        isModal, navigate, session, theater, movie,
        seats, selectedSeatIds, selectedSeats, handleSeatClick,
        totalPrice, sessionId, showDate, showTime
    };

    if (isModal) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(13,26,58,0.42)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
                onClick={(e) => { if (e.target === e.currentTarget) navigate(-1); }}
            >
                <motion.div
                    initial={{ y: 24, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 24, scale: 0.98 }}
                    transition={{ type: 'tween', duration: 0.18 }}
                    style={{
                        width: '100%', maxWidth: '500px', background: 'var(--color-bg)',
                        borderRadius: '24px', overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(13,26,58,0.28)',
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
