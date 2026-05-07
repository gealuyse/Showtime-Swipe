import React from 'react';
import PropTypes from 'prop-types';

const BrandBadge = ({ brand, theaterName }) => {
    // Logic extracted from TheaterList.jsx (ShowtimeList.jsx)
    // Prioritize 'brand' prop, fallback to checking theaterName
    const effectiveBrand = brand
        ? brand
        : (theaterName && theaterName.includes('Major')) ? 'Major'
            : (theaterName && theaterName.includes('SF')) ? 'SF'
                : 'Indie';

    const isMajor = effectiveBrand === 'Major' || effectiveBrand === 'MAJOR';
    const isSF = effectiveBrand === 'SF' || effectiveBrand === 'SF Cinema';

    // Styles from TheaterList.jsx
    const badgeStyle = isMajor
        ? { background: 'rgba(226, 31, 47, 0.2)', color: '#ff4d4d', borderColor: 'rgba(255,255,255,0.1)' } // Major
        : isSF
            ? { background: 'rgba(0, 61, 124, 0.3)', color: '#4dabf7', borderColor: 'rgba(255,255,255,0.1)' } // SF
            : { background: 'rgba(255,255,255,0.1)', color: '#aaa', borderColor: 'rgba(255,255,255,0.1)' }; // Indie/Default

    const label = isMajor ? 'Major' : isSF ? 'SF' : 'Indie';

    return (
        <span style={{
            ...badgeStyle,
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '100px',
            fontWeight: '600',
            border: '1px solid',
            borderColor: badgeStyle.borderColor, // Explicitly enforce border color from style
            display: 'inline-block',
            lineHeight: 1,
            textTransform: 'none' // TheaterList was not uppercase except for brand checks
        }}>
            {label}
        </span>
    );
};

BrandBadge.propTypes = {
    brand: PropTypes.string,
    theaterName: PropTypes.string
};

export default BrandBadge;
