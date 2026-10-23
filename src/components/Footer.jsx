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
            <Feather size={16} color="#ffffff" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.14em', color: '#ffffff' }}>
              UNFILTERED
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            A place to write what you can't always say. Built for genuine, raw expression without the performance pressure of curated social feeds.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <Link to="/" className="footer-link">Feed</Link>
          <Link to="/write" className="footer-link">Write</Link>
          <Link to="/guidelines" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} />
            <span>Ethos & Safety</span>
          </Link>
        </div>

        {/* Portfolio Credit */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Code2 size={14} color="var(--text-muted)" />
            <span>React & Supabase Architecture</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Authentic expression
          </p>
        </div>
      </div>
    </footer>
  );
}
