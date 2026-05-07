import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SeatSkeleton from '../components/SeatSkeleton';
import { showtimes, movies, theaters } from '../data/mockData';
import { generateSeatsForSession } from '../utils/seatGenerator';

const ROWS = 8;
const COLS = 10;
const SEAT_PRICE_NORMAL = 200;
const SEAT_PRICE_PREMIUM = 240;

const SeatSelectionPage = ({ isModal }) => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Use pre-generated seats from navigation state (stable) or generate fallback
    const initialSeats = useMemo(() => {
        // Priority: Use seats passed from parent component via state
        if (location.state?.preGeneratedSeats) {
            return location.state.preGeneratedSeats;
        }
        // Fallback: Generate seats (this path is for direct URL access)
        return generateSeatsForSession(sessionId);
    }, [sessionId, location.state?.preGeneratedSeats]);

    const [seats] = useState(initialSeats); // No setter needed - seats are stable
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isMounting, setIsMounting] = useState(true);

    // Derived Booking Data
    // Priority: State passed from Router > Lookup in static mock data
    const session = location.state?.showtimeData || showtimes.find(s => s.id === sessionId);
    const movie = movies.find(m => m.id === (session?.movieId || ''));
    const theater = theaters.find(t => t.id === (session?.theaterId || ''));

    const showDateObj = new Date(session?.startTime);
    const showDate = showDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const showTime = showDateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // No artificial delay
    useEffect(() => {
        setIsMounting(false);
    }, []);

    if (isMounting) return <SeatSkeleton />;


    const handleSeatClick = (seat) => {
        if (seat.status === 'occupied') return;

        const isSelected = selectedSeats.find(s => s.id === seat.id);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };



    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Modal Styling overrides
    const pageStyle = ({ isModal }) => isModal ? {
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)', // Dark transparent backdrop
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    } : {
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column'
    };

    const containerStyle = ({ isModal }) => isModal ? {
        width: '100%',
        maxWidth: '500px',
        background: '#13141a', // Distinct card bg for modal
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh' // Contain height
    } : {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && isModal) {
            navigate(-1);
        }
    };

    const Container = ({ isModal, children }) => {
        if (isModal) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={pageStyle({ isModal: true })}
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ y: 50, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 50, scale: 0.95 }}
                        style={containerStyle({ isModal: true })}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                    >
                        {children}
                    </motion.div>
                </motion.div>
            );
        }
        return (
            <PageTransition style={pageStyle({ isModal: false })}>
                {children}
            </PageTransition>
        );
    };

    return (
        <Container isModal={isModal}>
            <div style={isModal ? { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' } : { flex: 1, display: 'flex', flexDirection: 'column' }}>

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

                        // Determine Colors
                        let borderColor = 'white';
                        let textColor = 'white';

                        if (isOccupied) {
                            borderColor = '#4a4a4a'; // Visible Grey
                            textColor = '#4a4a4a';
                        } else if (isSelected) {
                            borderColor = 'var(--color-primary)';
                            textColor = 'white';
                        } else if (isPremium) {
                            borderColor = '#FFD700'; // Gold for Premium
                            textColor = '#FFD700';
                        }

                        return (
                            <motion.button
                                key={seat.id}
                                whileTap={!isOccupied ? { scale: 0.9 } : {}}
                                onClick={() => handleSeatClick(seat)}
                                style={{
                                    aspectRatio: '1/1',
                                    background: isOccupied ? '#2a2a2a' : isSelected ? 'var(--color-primary)' : 'transparent',
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: isPremium ? '8px 8px 4px 4px' : '6px', // Slightly different shape for Premium
                                    color: textColor,
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                                    opacity: 1, // Fix: Make occupied seats fully visible
                                    boxShadow: isPremium && !isOccupied && !isSelected ? '0 0 5px rgba(255, 215, 0, 0.2)' : 'none'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1px solid white' }}></div>
                        Normal
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1px solid #FFD700', boxShadow: '0 0 5px rgba(255, 215, 0, 0.2)' }}></div>
                        Premium
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#2a2a2a', border: '1px solid #4a4a4a' }}></div>
                        Taken
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}></div>
                        Selected
                    </div>
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
                                theaterHall: "Hall 4", // Mock hall
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
        </Container>
    );
};

export default SeatSelectionPage;
