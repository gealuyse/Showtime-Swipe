import React from 'react';
import PropTypes from 'prop-types';
import { Film } from 'lucide-react';

const EmptyState = ({ message }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            color: '#666',
            textAlign: 'center'
        }}>
            <Film size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <span style={{ fontSize: '16px' }}>{message}</span>
        </div>
    );
};

EmptyState.propTypes = {
    message: PropTypes.string
};

EmptyState.defaultProps = {
    message: "No showtimes found."
};

export default EmptyState;
