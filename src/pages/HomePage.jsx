import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { getNowPlayingMovies } from '../services/api';
import useScrollPosition from '../hooks/useScrollPosition';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isMounting, setIsMounting] = useState(true); // Force Initial Skeleton

    // Restore scroll position when returning from Detail Page
    useScrollPosition('home-scroll-pos');

    const observer = useRef();

    const lastMovieElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Force Load Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounting(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const showInitialSkeleton = isMounting || (loading && movies.length === 0);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            const data = await getNowPlayingMovies(page);
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setMovies(prev => {
                    // Prevent duplicates if React strict mode causes double fetch or fast scroll
                    const existingIds = new Set(prev.map(m => m.id));
                    const uniqueNewMovies = data.filter(m => !existingIds.has(m.id));
                    return [...prev, ...uniqueNewMovies];
                });
            }
            setLoading(false);
        };
        // Debounce search/fetch logic if needed, but here dependent on page increment
        fetchMovies();
    }, [page]);

    // Filter movies based on search
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition
            style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}
        >
            {/* Search Section */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '16px', fontWeight: '800' }}>
                    Find your <span style={{ color: 'var(--color-primary)' }}>movie</span>
                </h1>
                <div style={{
                    background: 'var(--color-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    maxWidth: '600px', // Limit width on desktop
                }}>
                    <Search color="var(--color-text-dim)" size={24} />
                    <input
                        type="text"
                        placeholder="Search movies, cinemas, or genres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '18px',
                            width: '100%',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

            {/* Movies Grid */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', color: 'var(--color-text-dim)', margin: 0 }}>Now Showing</h2>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        {showInitialSkeleton ? 'Loading...' : `Showing ${movies.length} movies`}
                    </span>
                </div>

                {/* Initial Loading Skeletons */}
                {showInitialSkeleton && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '24px'
                    }}>
                        {[...Array(12)].map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Content Grid (Real Data) */}
                {!showInitialSkeleton && movies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '24px'
                        }}>
                            {movies.map((movie, index) => {
                                const isLast = movies.length === index + 1;
                                return (
                                    <motion.div
                                        key={movie.id}
                                        ref={!searchTerm && isLast ? lastMovieElementRef : null}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: (index % 20) * 0.05
                                        }}
                                    >
                                        <MovieCard movie={movie} />
                                    </motion.div>
                                );
                            })}

                            {/* Append Skeletons for Load More (Infinite Scroll) */}
                            {loading && (
                                [...Array(4)].map((_, i) => (
                                    <MovieCardSkeleton key={`skeleton-${i}`} />
                                ))
                            )}
                        </div>

                        {!hasMore && (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-dim)', opacity: 0.5 }}>
                                End of list
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !showInitialSkeleton && movies.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>No movies found.</div>
                )}
            </section>
        </PageTransition>
    );
};

export default HomePage;
