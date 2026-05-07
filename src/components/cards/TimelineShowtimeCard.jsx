import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import SystemBadge from '../ui/SystemBadge';
import BrandBadge from '../ui/BrandBadge';
import { calculateEndTime } from '../../utils/dataTransformer';
import { generateSeatsForSession } from '../../utils/seatGenerator';

const TimelineShowtimeCard = ({ showtime, movieDuration }) => {
    const { id, time, system, price, theater, language } = showtime;
    const navigate = useNavigate();
    const location = useLocation();
    const [hovered, setHovered] = useState(false);

    const endTime = calculateEndTime(time, movieDuration);

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
            aria-label={`Book ${theater.name} at ${time}, ${system}, ${price} Baht`}
            style={{ display: 'block', textDecoration: 'none', outline: 'none' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                background: hovered ? '#23252e' : '#1c1e26',
                border: `1px solid ${hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'background 0.2s, border-color 0.2s'
            }}>

                {/* Row 1: Theater name + brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{
                        fontSize: '15px', fontWeight: '700', color: 'white',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                    }}>
                        {theater.name}
                    </span>
                    <div style={{ flexShrink: 0 }}>
                        <BrandBadge brand={theater.brand} theaterName={theater.name} />
                    </div>
                </div>

                {/* Row 2: Time block + details + price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

                    {/* Time */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', lineHeight: 1, letterSpacing: '-0.5px' }}>
                            {time}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>
                            ~{endTime}
                        </span>
                    </div>

                    {/* System + language + location */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <SystemBadge system={system} />
                            <span style={{ color: '#4b5563', fontSize: '11px' }}>•</span>
                            <span style={{
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                color: '#9ca3af'
                            }}>
                                {language || 'EN/TH'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '11px' }}>
                            <MapPin size={11} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {theater.location?.district || 'Bangkok'}
                            </span>
                        </div>
                    </div>

                    {/* Price + chevron */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                        gap: '4px', paddingLeft: '16px',
                        borderLeft: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#eab308', lineHeight: 1 }}>
                            {price}฿
                        </span>
                        <ChevronRight
                            size={18}
                            style={{
                                color: hovered ? '#eab308' : '#6b7280',
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
