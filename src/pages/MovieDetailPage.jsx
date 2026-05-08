import React, { useEffect, useState } from 'react';
import usePersistedState from '../hooks/usePersistedState';
import useScrollRestoration from '../hooks/useScrollRestoration';
import useMovieCache from '../hooks/useMovieCache';
import useIsMobile from '../hooks/useIsMobile';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { getNowPlayingMovies, getMovieDetail } from '../services/api';
import { generateShowtimesForMovies } from '../utils/dataGenerator';
import { theaters } from '../data/mockData';
import ShowtimeList from '../components/ShowtimeList';
import TimelineShowtimeList from '../components/TimelineShowtimeList';
import MovieDetailSkeleton from '../components/MovieDetailSkeleton';
import PageTransition from '../components/PageTransition';
import ErrorState from '../components/ui/ErrorState';
import ProgressiveImage, { getTMDBPlaceholder } from '../components/ui/ProgressiveImage';
import RefreshIndicator from '../components/ui/RefreshIndicator';
import usePullToRefresh from '../hooks/usePullToRefresh';

const MovieDetailPage = () => {
    const { id } = useParams();
    // Parse the numeric ID from the slug (e.g., "123-movie-title" -> "123")
    const movieId = id?.match(/^(\d+)/)?.[1] ?? null;

    // Use Cache Hook for Instant "Back" (now with refetch support)
    const { movie, loading, error, refetch } = useMovieCache(movieId);

    // Use persisted state for View Mode to remember user choice
    const [viewMode, setViewMode] = usePersistedState('movie_detail_view_mode', 'theater');
    const [isMounting, setIsMounting] = useState(true); // Force Initial Skeleton

    const isMobile = useIsMobile();

    // Pull-to-Refresh (mobile only)
    const { pullDistance, isRefreshing, progress } = usePullToRefresh({
        onRefresh: refetch,
        disabled: !isMobile || loading
    });

    // Derived Showtimes (Sync with movie load to ensure height is correct for scroll restoration)
    const showtimes = React.useMemo(() => {
        if (!movie) return [];
        return generateShowtimesForMovies([movie]);
    }, [movie]);

    // Restore scroll position when returning to this page
    useScrollRestoration('movie_detail_scroll', loading);

    const { scrollY } = useScroll();
    const [hasScrolledHero, setHasScrolledHero] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setHasScrolledHero(latest > 40);
    });

    // Cinematic Scroll Effects (Desktop Only mostly, but subtle on mobile)
    const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
    const blur = useTransform(scrollY, [0, 500], [0, 10]);

    // No artificial delay needed for production feel
    useEffect(() => {
        setIsMounting(false);
    }, []);

    // Dynamic Title
    useEffect(() => {
        if (movie) {
            document.title = `${movie.title} | Showtime Swipe`;
        }
        return () => {
            document.title = 'Showtime Swipe';
        };
    }, [movie]);

    if (loading || isMounting) return <MovieDetailSkeleton />;

    // Handle error states with proper UI
    if (error) {
        return <ErrorState type={error} onRetry={refetch} />;
    }

    if (!movie) {
        return <ErrorState type="notFound" />;
    }

    // Animation Variants - Skip if instant load (cached)
    const shouldAnimate = loading; // Only animate if genuinely loading

    // Mobile-Simple vs Desktop-Fancy Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: isMobile ? 0.05 : 0.1 } }
    };

    return (
        <>
            {/* Back Button (Floating top-left) */}
            <Link to="/"
                aria-label="Back to Home"
                className="focus:outline-none focus:ring-2 focus:ring-white rounded-full block"
                style={{
                    position: 'fixed',
                    top: isMobile ? '16px' : '20px',
                    left: isMobile ? '16px' : '20px',
                    color: 'white',
                    zIndex: 50,
                    cursor: 'pointer'
                }}>
                <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    padding: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    backdropFilter: 'blur(8px)'
                }}>
                    <ArrowLeft size={isMobile ? 20 : 24} />
                </div>
            </Link>

            {/* Pull-to-Refresh Indicator (Mobile) */}
            {isMobile && (
                <RefreshIndicator
                    progress={progress}
                    isRefreshing={isRefreshing}
                    pullDistance={pullDistance}
                />
            )}

            <PageTransition style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

                {/* HERO SECTION */}
                <motion.div
                    style={{
                        position: 'fixed', // Parallax
                        top: 0, left: 0, right: 0,
                        height: '100vh', // UNIFIED: Full height on mobile too
                        zIndex: 0,
                        scale: isMobile ? 1 : scale, // Disable heavy scale on mobile
                        filter: isMobile ? 'blur(8px)' : `blur(${blur}px)` // Stronger blur on Mobile
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${movie.poster})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: isMobile ? 0.4 : 1 // Dim poster on mobile
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${movie.backdrop})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: movie.backdrop ? 1 : 0
                    }} />

                    {/* Gradient Overlay: tuned for light theme and bright posters/backdrops */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: isMobile
                            ? 'linear-gradient(to top, var(--color-bg) 0%, rgba(238, 242, 255, 0.94) 35%, rgba(13, 26, 58, 0.42) 100%)'
                            : 'linear-gradient(to bottom, rgba(13, 26, 58, 0.18) 0%, rgba(238, 242, 255, 0.2) 45%, var(--color-bg) 100%)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 24%, rgba(255,255,255,0.08), transparent 34%), linear-gradient(to right, rgba(13,26,58,0.42), transparent 28%, transparent 72%, rgba(13,26,58,0.28))',
                        pointerEvents: 'none'
                    }} />
                </motion.div>

                {/* CONTENT CONTAINER */}
                <motion.div
                    variants={containerVariants}
                    initial={shouldAnimate ? "hidden" : "visible"}
                    animate="visible"
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        marginTop: isMobile ? '35vh' : '45vh', // Pull up logic
                        background: 'linear-gradient(180deg, rgba(238,242,255,0.98), var(--color-bg) 160px)',
                        minHeight: '65vh',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        boxShadow: '0 -10px 40px rgba(13, 26, 58, 0.18)',
                        padding: isMobile ? '24px 16px' : '0 20px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'stretch' : 'center'
                    }}
                >
                    {/* INFO HEADER (Title & Stats) */}
                    <motion.div
                        style={{
                            maxWidth: '1000px',
                            width: '100%',
                            marginTop: isMobile ? '-80px' : '-60px', // Mobile: Pull poster up more into hero
                            marginBottom: '24px',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'center' : 'flex-end', // Hybrid Alignment
                            gap: '24px',
                            textAlign: isMobile ? 'center' : 'left', // Hybrid Search
                        }}
                    >
                        {/* Poster - Visible on ALL screens (Hybrid) */}
                        <div
                            style={{
                                width: isMobile ? '140px' : '160px',
                                aspectRatio: '2/3',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                                flexShrink: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                position: 'relative',
                                zIndex: 20 // Ensure above content bg
                            }}>
                            <ProgressiveImage
                                src={movie.poster}
                                placeholder={getTMDBPlaceholder(movie.poster)}
                                alt={movie.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div style={{
                            padding: isMobile ? '14px 16px' : '16px 18px',
                            paddingBottom: isMobile ? '14px' : '16px',
                            width: '100%',
                            borderRadius: '18px',
                            background: isMobile || !hasScrolledHero
                                ? 'rgba(255, 255, 255, 0.86)'
                                : 'rgba(255, 255, 255, 0.72)',
                            border: '1px solid rgba(26, 92, 255, 0.12)',
                            boxShadow: '0 16px 40px rgba(13, 26, 58, 0.18)',
                            backdropFilter: 'blur(14px)'
                        }}>
                            <h1 style={{
                                fontSize: isMobile ? '26px' : '32px',
                                fontWeight: '800',
                                margin: '0 0 12px 0',
                                textShadow: 'none',
                                lineHeight: 1.12,
                                color: 'var(--color-text)',
                                letterSpacing: '-0.02em'
                            }}>{movie.title}</h1>

                            {/* Meta Info */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                fontSize: '13px',
                                color: 'var(--color-text-dim)',
                                alignItems: 'center',
                                justifyContent: isMobile ? 'center' : 'flex-start'
                            }}>
                                <span style={{
                                    background: 'rgba(26,92,255,0.1)',
                                    border: '1px solid rgba(26,92,255,0.18)',
                                    color: 'var(--color-primary)',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    fontSize: '11px'
                                }}>{movie.rating || 'NR'}</span>

                                <span style={{ opacity: 0.5 }}>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
                                </span>
                                <span style={{ opacity: 0.5 }}>•</span>
                                <span>{movie.genreIds?.map(id => {
                                    // Quick mapping
                                    const genres = {
                                        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
                                        18: 'Drama', 14: 'Fantasy', 27: 'Horror', 878: 'Sci-Fi', 53: 'Thriller'
                                    };
                                    return genres[id] || 'Movie';
                                }).slice(0, 2).join(', ') || 'Genre'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* TABS (Sticky on Mobile) */}
                    <div style={{
                        maxWidth: '1000px',
                        width: '100%',
                        position: 'sticky',
                        top: '0',
                        zIndex: 40,
                        background: 'rgba(238,242,255,0.92)',
                        backdropFilter: 'blur(12px)',
                        padding: '10px 0',
                        marginBottom: '16px'
                    }}>
                        <div
                            role="tablist"
                            aria-label="View Mode Selection"
                            style={{
                                background: 'rgba(13,26,58,0.06)',
                                border: '1px solid rgba(26,92,255,0.1)',
                                padding: '4px',
                                borderRadius: '12px',
                                display: 'flex',
                                width: '100%'
                            }}>
                            <button
                                role="tab"
                                aria-selected={viewMode === 'theater'}
                                onClick={() => setViewMode('theater')}
                                className="focus:outline-none focus:ring-2 focus:ring-white/50"
                                style={{
                                    flex: 1, // Full width tabs
                                    background: viewMode === 'theater' ? '#ffffff' : 'transparent',
                                    color: viewMode === 'theater' ? 'var(--color-primary)' : 'var(--color-text-dim)',
                                    boxShadow: viewMode === 'theater' ? '0 8px 18px rgba(13,26,58,0.08)' : 'none',
                                    border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                            >
                                By Theater
                            </button>
                            <button
                                role="tab"
                                aria-selected={viewMode === 'timeline'}
                                onClick={() => setViewMode('timeline')}
                                className="focus:outline-none focus:ring-2 focus:ring-white/50"
                                style={{
                                    flex: 1,
                                    background: viewMode === 'timeline' ? '#ffffff' : 'transparent',
                                    color: viewMode === 'timeline' ? 'var(--color-primary)' : 'var(--color-text-dim)',
                                    boxShadow: viewMode === 'timeline' ? '0 8px 18px rgba(13,26,58,0.08)' : 'none',
                                    border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                            >
                                Timeline
                            </button>
                        </div>
                    </div>

                    {/* LIST CONTENT */}
                    <motion.div style={{ maxWidth: '1000px', width: '100%', minHeight: '500px' }}>
                        {viewMode === 'theater' ? (
                            <ShowtimeList showtimes={showtimes} theaters={theaters} />
                        ) : (
                            <TimelineShowtimeList
                                showtimes={showtimes}
                                theaters={theaters}
                                movieDuration={movie.durationMinutes}
                                disableAnimation={!shouldAnimate}
                            />
                        )}
                    </motion.div>

                </motion.div>
            </PageTransition>
        </>
    );
};

export default MovieDetailPage;
