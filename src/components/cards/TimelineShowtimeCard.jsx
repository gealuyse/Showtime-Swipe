import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import SystemBadge from '../ui/SystemBadge';
import BrandBadge from '../ui/BrandBadge';
import { calculateEndTime } from '../../utils/dataTransformer';
import { generateSeatsForSession } from '../../utils/seatGenerator';

const formatPrice = (price) => `${Number(price).toLocaleString('th-TH')} THB`;

const TimelineShowtimeCard = ({ showtime, movieDuration }) => {
    const { id, time, system, price, theater, language } = showtime;
    const navigate = useNavigate();
    const location = useLocation();
    const [hovered, setHovered] = useState(false);

    const endTime = calculateEndTime(time, movieDuration);
    const priceLabel = formatPrice(price);

    const handleNavigation = (e) => {
        e.preventDefault();
        const go = () => navigate(`/booking/${id}`, {
            state: {
                showtimeData: showtime,
                backgroundLocation: location,
                preGeneratedSeats: generateSeatsForSession(id)
            }
        });
        if (document.startViewTransition) {
            document.startViewTransition(go);
        } else {
            go();
        }
    };

    return (
        <a
            href={`/booking/${id}`}
            onClick={handleNavigation}
            aria-label={`Book ${theater.name} at ${time}, ${system}, ${priceLabel}`}
            style={{ display: 'block', textDecoration: 'none', outline: 'none' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                background: hovered ? '#ffffff' : 'rgba(255,255,255,0.88)',
                border: `1px solid ${hovered ? 'rgba(26,92,255,0.22)' : 'rgba(26,92,255,0.1)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                boxShadow: hovered ? '0 12px 28px rgba(13,26,58,0.1)' : '0 6px 18px rgba(13,26,58,0.04)'
            }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{
                        fontSize: '15px', fontWeight: '700', color: 'var(--color-text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                    }}>
                        {theater.name}
                    </span>
                    <div style={{ flexShrink: 0 }}>
                        <BrandBadge brand={theater.brand} theaterName={theater.name} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.5px' }}>
                            {time}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '4px', fontWeight: '500' }}>
                            ~{endTime}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <SystemBadge system={system} />
                            <span style={{ color: 'rgba(13,26,58,0.35)', fontSize: '11px' }}>•</span>
                            <span style={{
                                border: '1px solid rgba(26,92,255,0.12)',
                                background: 'rgba(26,92,255,0.04)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-dim)'
                            }}>
                                {language || 'EN/TH'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-dim)', fontSize: '11px', minWidth: 0 }}>
                            <MapPin size={11} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {theater.location?.district || 'Bangkok'}
                            </span>
                        </div>
                    </div>

                    <div className="timeline-showtime-price" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                        gap: '4px', paddingLeft: '16px',
                        borderLeft: '1px solid rgba(13,26,58,0.08)',
                        color: 'var(--color-text)'
                    }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text)', lineHeight: 1 }}>
                            {priceLabel}
                        </span>
                        <ChevronRight
                            size={18}
                            style={{
                                color: hovered ? 'var(--color-primary)' : 'var(--color-text-dim)',
                                transform: hovered ? 'translateX(2px)' : 'none',
                                transition: 'color 0.2s, transform 0.2s'
                            }}
                        />
                    </div>
                </div>

            </div>
        </a>
    );
};

TimelineShowtimeCard.propTypes = {
    showtime: PropTypes.shape({
        id: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        system: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        theater: PropTypes.shape({
            name: PropTypes.string.isRequired,
            brand: PropTypes.string,
            location: PropTypes.object
        }).isRequired,
        language: PropTypes.string
    }).isRequired,
    movieDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

TimelineShowtimeCard.defaultProps = {
    movieDuration: 120
};

export default React.memo(TimelineShowtimeCard);
