import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

// Code Splitting: Lazy load pages for smaller initial bundle
const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SeatSelectionPage = lazy(() => import('./pages/SeatSelectionPage'));
const BookingSuccessPage = lazy(() => import('./pages/BookingSuccessPage'));

// Minimal loading fallback for Suspense (Preloader handles initial load)
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg, #0f1014)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTopColor: 'var(--color-primary, #e50914)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const background = location.state && location.state.backgroundLocation;

  // Show Navbar logic (hide on booking modal too if strict, but mainly check current location)
  // If showing modal, background path might be /movie/..., so Navbar depends on what's visible?
  // Let's keep specific logic: Hide navbar if we are strictly on booking page (modal or not)
  const isBooking = location.pathname.includes('/booking/');
  const showNavbar = !location.pathname.includes('/movie/') && !isBooking;

  return (
    <Suspense fallback={<PageLoader />}>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={background || location} key={background ? background.pathname : location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          {/* Main route fallback if refreshed directly on /booking/ */}
          <Route path="/booking/:sessionId" element={<SeatSelectionPage />} />
          <Route path="/booking/success" element={<BookingSuccessPage />} />
        </Routes>
      </AnimatePresence>

      {/* Show Modal if background exists */}
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

