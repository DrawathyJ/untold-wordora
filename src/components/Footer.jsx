import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Shield, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="app-container footer-inner">
        {/* Brand & Manifesto */}
        <div style={{ maxWidth: '360px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <Feather size={18} color="#f59e0b" />
            <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
              UNFILTERED
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            A place to write what you can't always say. Built for genuine, raw expression without the performance pressure of curated social feeds.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <Link to="/" className="footer-link">Home Feed</Link>
          <Link to="/write" className="footer-link">Write a Story</Link>
          <Link to="/guidelines" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} />
            <span>Ethos & Safety</span>
          </Link>
        </div>

        {/* Portfolio Credit */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Code2 size={15} color="#8b5cf6" />
            <span>React + Supabase RLS Architecture</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Designed for authentic expression • 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
