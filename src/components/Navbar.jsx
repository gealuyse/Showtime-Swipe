import { Film } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const { pathname, state } = location;

    const renderStatusBadge = () => {
        if (pathname.includes('/movie/')) {
            return (
                <div style={badgeStyle}>
                    Movie Detail
                </div>
            );
        }

        if (pathname.includes('/booking/')) {
            const showtime = state?.showtimeData;

            if (showtime) {
                // Determine theater name: 'theater' object (Timeline) or just ID? 
                // Since we rely on passed state, Timeline passes full theater obj. Standard list might only have ID.
                const theaterName = showtime.theater?.name || showtime.theater?.id || 'Cinema';

                // Format Time
                const timeStr = showtime.startTime
                    ? new Date(showtime.startTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                    : '';

                return (
                    <div style={badgeStyle}>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{showtime.movieTitle || 'Movie'}</span>
                        <span style={{ margin: '0 6px', opacity: 0.4 }}>•</span>
                        <span>{theaterName}</span>
                        <span style={{ margin: '0 6px', opacity: 0.4 }}>•</span>
                        <span>{timeStr}</span>
                    </div>
                );
            }

            return (
                <div style={badgeStyle}>
                    Seat Selection
                </div>
            );
        }

        return null;
    };

    const badgeStyle = {
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap'
    };

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'rgba(15, 16, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
                <Film color="var(--color-primary)" size={24} />
                <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    Showtime <span style={{ color: 'var(--color-primary)' }}>Swipe</span>
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {renderStatusBadge()}

                {/* TMDB Attribution */}
                <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        opacity: 0.8,
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                >
                    <span style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>Powered by</span>
                    <img
                        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                        alt="TMDB"
                        style={{ height: '16px', display: 'block' }}
                    />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
