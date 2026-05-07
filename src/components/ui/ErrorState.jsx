import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { WifiOff, Film, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorState - Reusable error display component
 * Handles different error types with appropriate UI and actions
 */
const ErrorState = ({ type = 'generic', message, onRetry }) => {
    const errorConfig = {
        network: {
            icon: WifiOff,
            title: 'เชื่อมต่อไม่ได้',
            description: 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ',
            showRetry: true,
            showHome: false
        },
        notFound: {
            icon: Film,
            title: 'ไม่พบหนังเรื่องนี้',
            description: 'หนังที่คุณกำลังหาอาจถูกลบออกหรือไม่มีในระบบ',
            showRetry: false,
            showHome: true
        },
        generic: {
            icon: AlertCircle,
            title: 'เกิดข้อผิดพลาด',
            description: message || 'กรุณาลองใหม่อีกครั้ง',
            showRetry: true,
            showHome: true
        }
    };

    const config = errorConfig[type] || errorConfig.generic;
    const Icon = config.icon;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'var(--color-bg, #0f1014)',
            color: 'white',
            textAlign: 'center',
            gap: '16px'
        }}>
            {/* Icon */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
            }}>
                <Icon size={40} style={{ opacity: 0.6 }} />
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
                color: 'white'
            }}>
                {config.title}
            </h2>

            {/* Description */}
            <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
                maxWidth: '300px',
                lineHeight: 1.5
            }}>
                {config.description}
            </p>

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {config.showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'var(--color-primary, #e50914)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={16} />
                        ลองอีกครั้ง
                    </button>
                )}

                {config.showHome && (
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        กลับหน้าหลัก
                    </Link>
                )}
            </div>
        </div>
    );
};

ErrorState.propTypes = {
    type: PropTypes.oneOf(['network', 'notFound', 'generic']),
    message: PropTypes.string,
    onRetry: PropTypes.func
};

export default ErrorState;
