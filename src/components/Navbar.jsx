import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, Feather, Lock, Database, LogIn, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SupabaseConfigModal from './SupabaseConfigModal';

export default function Navbar() {
  const { user, profile, isLive, openAuthModal } = useAuth();
  const location = useLocation();
  const [configModalOpen, setConfigModalOpen] = useState(false);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        <div className="app-container navbar-inner">
          {/* Brand */}
          <Link to="/" className="brand-logo" id="nav-brand-logo">
            <div className="brand-icon">
              <Feather size={20} strokeWidth={2.4} />
            </div>
            <div className="brand-text">
              <span>UNFILTERED</span>
              <span className="brand-subtitle">Real Thoughts</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              id="nav-link-explore"
            >
              <Sparkles size={16} />
              <span>Explore</span>
            </Link>

            {user && (
              <Link
                to="/drafts"
                className={`nav-link ${location.pathname === '/drafts' ? 'active' : ''}`}
                id="nav-link-drafts"
              >
                <Lock size={15} />
                <span>My Drafts</span>
              </Link>
            )}

            <Link
              to="/write"
              className={`btn btn-primary ${location.pathname === '/write' ? 'active' : ''}`}
              id="nav-btn-write"
            >
              <PenTool size={16} />
              <span>Write Story</span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="nav-actions">

            {/* User Profile or Sign In */}
            {user ? (
              <Link to="/profile" className="user-menu-btn" id="nav-user-profile-btn">
                <img
                  src={
                    profile?.avatar_url ||
                    user.user_metadata?.avatar_url ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username || 'user'}`
                  }
                  alt={user.username || 'User'}
                  className="user-avatar-img"
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  @{profile?.username || user.user_metadata?.username || user.username || 'you'}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary"
                id="nav-btn-login"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Supabase Config / Status Drawer Modal */}
      {configModalOpen && (
        <SupabaseConfigModal onClose={() => setConfigModalOpen(false)} />
      )}
    </>
  );
}
