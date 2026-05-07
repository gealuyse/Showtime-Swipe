import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ProgressiveImage - Loads a low-quality placeholder first, then the full image
 * Creates a smooth "blur-up" effect for better perceived performance
 */
const ProgressiveImage = ({
    src,
    placeholder,
    alt,
    className = '',
    style = {},
    ...props
}) => {
    const [currentSrc, setCurrentSrc] = useState(placeholder || src);
    const [isLoaded, setIsLoaded] = useState(!placeholder);

    useEffect(() => {
        // If no placeholder, nothing to progressively load
        if (!placeholder || placeholder === src) {
            setCurrentSrc(src);
            setIsLoaded(true);
            return;
        }

        // Preload the full image
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
        };
        img.onerror = () => {
            // Fall back to placeholder if full image fails
            console.warn(`Failed to load image: ${src}`);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, placeholder]);

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            style={{
                ...style,
                filter: isLoaded ? 'none' : 'blur(10px)',
                transition: 'filter 0.3s ease-out',
                willChange: isLoaded ? 'auto' : 'filter'
            }}
            {...props}
        />
    );
};

ProgressiveImage.propTypes = {
    src: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
};

/**
 * Helper: Generate TMDB placeholder URL
 * Converts /w500/ to /w92/ for a tiny placeholder
 */
export const getTMDBPlaceholder = (url) => {
    if (!url) return null;
    // TMDB image sizes: w92, w154, w185, w342, w500, w780, original
    return url.replace('/w500/', '/w92/').replace('/w780/', '/w92/').replace('/original/', '/w92/');
};

export default ProgressiveImage;
