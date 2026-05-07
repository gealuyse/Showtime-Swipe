import React from 'react';
import PropTypes from 'prop-types';

const SystemBadge = ({ system }) => {
    // Styling Logic
    const isSpecial = system.includes('IMAX') || system.includes('4DX');

    const style = {
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold',
        backgroundColor: isSpecial ? '#ffc107' : '#333',
        color: isSpecial ? '#000' : '#fff',
        marginLeft: '8px',
        textTransform: 'uppercase'
    };

    return <span style={style}>{system}</span>;
};

SystemBadge.propTypes = {
    system: PropTypes.string.isRequired
};

export default SystemBadge;
