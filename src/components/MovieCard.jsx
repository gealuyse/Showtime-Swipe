import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createSlug } from '../utils/slugify';

const MovieCard = ({ movie }) => {
    const PLACEHOLDER_IMG = 'https://placehold.co/500x750?text=No+Image';
    const [imgSrc, setImgSrc] = React.useState(movie.poster || movie.backdrop || PLACEHOLDER_IMG);

    const handleImageError = () => {
        if (imgSrc === movie.poster && movie.backdrop) {
            setImgSrc(movie.backdrop);
        } else if (imgSrc !== PLACEHOLDER_IMG) {
            setImgSrc(PLACEHOLDER_IMG);
        }
    };

    return (
        <Link to={`/movie/${movie.id}-${createSlug(movie.title)}`}>
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileTap={{ scale: 0.98 }}
                style={{
                    background: 'var(--color-card)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    height: '100%'
                }}
            >
                <div style={{ aspectRatio: '2/3', width: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={imgSrc}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        loading="lazy"
                        onError={handleImageError}
                    />
                </div>
                <div style={{ padding: '12px' }}>
                    <h3 style={{
                        fontSize: '14px',
                        margin: '0 0 6px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: '600'
                    }}>
                        {movie.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-dim)' }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span>{movie.voteAverage.toFixed(1)}</span>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span>{movie.releaseDate.split('-')[0]}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;
