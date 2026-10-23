import React, { useState } from 'react';
import { LogIn, UserPlus, X, AlertCircle, Sparkles, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, signIn, signUp, loginAsDemo, isLive } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
      } else {
        if (!username.trim()) throw new Error('Please choose a username');
        await signUp(email, password, { username: username.trim(), bio: bio.trim() });
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    closeAuthModal();
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="btn-ghost"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber-primary)',
            margin: '0 auto 1rem'
          }}>
            <Feather size={24} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {tab === 'login' ? 'Welcome Back' : 'Join UNFILTERED'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            A sanctuary to write what you cannot always say out loud.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-deep)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: tab === 'login' ? 'var(--amber-primary)' : 'var(--text-muted)',
              background: tab === 'login' ? 'var(--bg-surface)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: tab === 'signup' ? 'var(--amber-primary)' : 'var(--text-muted)',
              background: tab === 'signup' ? 'var(--bg-surface)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            fontSize: '0.84rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Username (Pen Name):
              </label>
              <input
                type="text"
                placeholder="e.g. night_wanderer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Email:
            </label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Password:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
            />
          </div>

          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Short Bio (Optional):
              </label>
              <input
                type="text"
                placeholder="A line about who you are when nobody is watching"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : tab === 'login' ? (
              <>
                <LogIn size={16} />
                <span>Sign In to UNFILTERED</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Create Unfiltered Account</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Shortcut */}
        {!isLive && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              Testing without Supabase credentials?
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.84rem' }}
              id="auth-demo-login-btn"
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>Instant 1-Click Demo Login (@wanderer)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
