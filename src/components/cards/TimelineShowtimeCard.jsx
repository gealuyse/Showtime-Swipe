import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import SystemBadge from '../ui/SystemBadge';
import BrandBadge from '../ui/BrandBadge';
import { calculateEndTime } from '../../utils/dataTransformer';
import { generateSeatsForSession } from '../../utils/seatGenerator';

/**
 * TimelineShowtimeCard - Modern Cinema Card
 * Unified responsive layout matching "Theater List" aesthetic.
 * Single structure that gracefully adapts to screen size.
 */
const TimelineShowtimeCard = ({ showtime, movieDuration }) => {
    const { id, time, system, price, theater, language } = showtime;
    const navigate = useNavigate();
    const location = useLocation();

    const endTime = calculateEndTime(time, movieDuration);

    const handleNavigation = (e) => {
        e.preventDefault();
        const navigateToBooking = () => {
            navigate(`/booking/${id}`, {
                state: {
                    showtimeData: showtime,
                    backgroundLocation: location,
                    preGeneratedSeats: generateSeatsForSession(id)
                }
            });
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => navigateToBooking());
        } else {
            navigateToBooking();
        }
    };

    return (
        <a
            href={`/booking/${id}`}
            onClick={handleNavigation}
            className="block w-full no-underline cursor-pointer group rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Book ${theater.name} at ${time}, ${system} system, Price ${price} Baht`}
        >
            {/* Main Container Card */}
            <div className="
                bg-[#1C1E26] border border-white/5 rounded-xl overflow-hidden
                transition-all duration-200
                hover:border-white/20 hover:bg-[#23252e]
                p-4 flex flex-col gap-3
                md:flex-row md:items-center md:justify-between md:gap-6
            ">

                {/* Section 1: Theater Header */}
                <div className="flex items-center gap-2 md:flex-1 md:min-w-0">
                    <span className="text-base font-bold text-white leading-tight truncate">
                        {theater.name}
                    </span>
                    <div className="shrink-0">
                        <BrandBadge brand={theater.brand} theaterName={theater.name} />
                    </div>
                </div>

                {/* Section 2: Time & Details Block */}
                <div className="flex flex-row items-start justify-between md:justify-start md:items-center md:gap-8">

                    {/* Time Group */}
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-white leading-none tracking-tight">
                            {time}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 font-medium">
                            ~{endTime}
                        </span>
                    </div>

                    {/* Details Group */}
                    <div className="flex flex-col items-end md:items-start gap-1 text-xs text-gray-400">
                        {/* System + Language Row */}
                        <div className="flex items-center gap-2">
                            <SystemBadge system={system} />
                            <span className="text-gray-600">•</span>
                            <span className="border border-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase text-gray-400">
                                {language || 'EN/TH'}
                            </span>
                        </div>

                        {/* Location Row */}
                        <div className="flex items-center gap-1 text-gray-500">
                            <MapPin size={11} />
                            <span className="truncate max-w-[150px]">
                                {theater.location?.district || 'Bangkok'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Price & Action */}
                <div className="
                    flex items-center justify-between gap-2 pt-2 border-t border-white/5
                    md:flex-col md:items-end md:justify-center md:pt-0 md:border-t-0 md:pl-4 md:border-l md:border-white/5
                ">
                    <span className="text-xl font-black text-yellow-500 leading-none">
                        {price}฿
                    </span>
                    <ChevronRight
                        size={20}
                        className="text-gray-500 transition-all group-hover:text-yellow-500 group-hover:translate-x-1"
                    />
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
    movieDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

TimelineShowtimeCard.defaultProps = {
    movieDuration: 120
};

export default React.memo(TimelineShowtimeCard);
