import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import MovieDetailSkeleton from './components/MovieDetailSkeleton';
import SeatSkeleton from './components/SeatSkeleton';

// Code Splitting: Lazy load pages for smaller initial bundle
const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SeatSelectionPage = lazy(() => import('./pages/SeatSelectionPage'));
const BookingSuccessPage = lazy(() => import('./pages/BookingSuccessPage'));

// Route-aware loading fallback so navigation feels like the target page is already forming.
const PageLoader = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  if (pathname.includes('/movie/')) return <MovieDetailSkeleton />;
  if (pathname.includes('/booking/')) return <SeatSkeleton />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg, #eef2ff)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(13, 26, 58, 0.12)',
        borderTopColor: 'var(--color-primary, #1a5cff)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const background = location.state && location.state.backgroundLocation;

  const isBooking = location.pathname.includes('/booking/');
  const showNavbar = !location.pathname.includes('/movie/') && !isBooking;

  return (
    <Suspense fallback={<PageLoader />}>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={background || location} key={background ? background.pathname : location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/booking/:sessionId" element={<SeatSelectionPage />} />
          <Route path="/booking/success" element={<BookingSuccessPage />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {background && (
          <Routes>
            <Route path="/booking/:sessionId" element={<SeatSelectionPage isModal={true} />} />
          </Routes>
        )}
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <div style={{ minHeight: '100vh', paddingBottom: '20px' }}>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
