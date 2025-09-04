import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import './index.css';
import Quiz from './pages/Quiz';
import MatchReveal from './pages/MatchReveal';
import SelfieUpload from './pages/SelfieUpload';
import MashupViewer from './pages/MashupViewer';
import Share from './pages/Share';

// PUBLIC_INTERFACE
function App() {
  /** Main SPA wrapper with retro neon/space layout and routing. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <div className="app-root starfield-bg">
        <header className="retro-header">
          <div className="logo-lockup">
            <div className="logo-neon">SWCG</div>
            <div className="logo-sub">Star Wars Character Glam</div>
          </div>
          <nav className="top-nav">
            <Link to="/" className="nav-link">Quiz</Link>
            <Link to="/reveal" className="nav-link">Reveal</Link>
            <Link to="/selfie" className="nav-link">Selfie</Link>
            <Link to="/mashup" className="nav-link">Mashup</Link>
            <Link to="/share" className="nav-link">Share</Link>
          </nav>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <main className="stage neon-border">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/reveal" element={<MatchReveal />} />
            <Route path="/selfie" element={<SelfieUpload />} />
            <Route path="/mashup" element={<MashupViewer />} />
            <Route path="/share" element={<Share />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="retro-footer">
          <div className="footer-actions">
            <Link to="/share" className="btn btn-neon">Share the Glam ✨</Link>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} SWCG — May the glam be with you.</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
