import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { QrCode, Home, Share2, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const BookingSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    // ... (rest of destructuring logic)
    const {
        seats,
        totalPrice,
        sessionId,
        movieTitle,
        cinemaName,
        theaterHall,
        showTime,
        showDate,
        poster,
        movieImage
    } = location.state || {}; // No defaults

    const displayImage = movieImage || poster || 'https://via.placeholder.com/600x400?text=No+Movie+Image';

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000);
    };

    return (
        <PageTransition
            style={{
                minHeight: '100vh',
                background: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                    width: '60px', height: '60px', background: '#22c55e', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0' }}>Payment Success!</h2>
                <p style={{ color: 'var(--color-text-dim)', margin: 0 }}>Your transaction has been completed.</p>
            </div>

            {/* Ticket Card */}
            <div style={{
                background: 'white',
                color: '#111',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '340px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)', // Enhanced shadow
                position: 'relative'
            }}>
                {/* Poster Header */}
                <div style={{
                    height: '140px',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.6,
                        backgroundImage: `url("${displayImage}")`, // Use displayImage
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#333'
                    }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginBottom: '4px' }}>{cinemaName}</div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: 'white' }}>{movieTitle}</h3>
                    </div>
                </div>

                {/* Ticket Details */}
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Date</div>
                            <div style={{ fontWeight: '600' }}>{showDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Time</div>
                            <div style={{ fontWeight: '600' }}>{showTime}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Hall</div>
                            <div style={{ fontWeight: '600' }}>{theaterHall}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Seats</div>
                            <div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                                {seats.length > 0 ? seats.map(s => s.id).join(', ') : 'E11, E12'}
                            </div>
                        </div>
                    </div>

                    {/* Dashed Line */}
                    <div style={{
                        borderTop: '2px dashed #ddd',
                        margin: '0 -24px 24px -24px',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', left: '-10px', top: '-10px', width: '20px', height: '20px', background: 'var(--color-bg)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '20px', height: '20px', background: 'var(--color-bg)', borderRadius: '50%' }} />
                    </div>

                    {/* QR Code */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <QrCode size={80} color="#111" />
                        <div style={{ fontSize: '10px', color: '#888' }}>ID: {sessionId || '8392849102'}</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', width: '100%', maxWidth: '340px' }}>
                <Link to="/" style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={{
                        width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: '600', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <Home size={18} /> Home
                    </button>
                </Link>
                <div style={{ flex: 1 }}>
                    <button
                        onClick={handleSave}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                            background: 'var(--color-primary)', color: 'white', fontWeight: '600', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                        }}
                    >
                        <Download size={18} /> Save
                    </button>
                </div>
            </div>

            {/* Save Success Overlay */}
            <AnimatePresence>
                {isSaved && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 20 } }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                background: 'rgba(25, 25, 30, 0.9)',
                                padding: '30px', borderRadius: '24px', textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div style={{
                                width: '60px', height: '60px', background: 'rgba(34, 197, 94, 0.2)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px auto', color: '#22c55e'
                            }}>
                                <CheckCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Saved to Gallery</h3>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </PageTransition>
    );
};

export default BookingSuccessPage;
