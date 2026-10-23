import React, { useState } from 'react';
import { LogIn, UserPlus, X, AlertCircle, Sparkles, Feather, Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, signIn, signUp, loginAsDemo, isLive, resendVerification } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email verification pop-up state
  const [verifyModal, setVerifyModal] = useState({
    isOpen: false,
    email: '',
    title: '',
    description: ''
  });
  const [resendStatus, setResendStatus] = useState('');
  const [resending, setResending] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        closeAuthModal();
      } else {
        if (!username.trim()) throw new Error('Please choose a username');
        const res = await signUp(email, password, { username: username.trim(), bio: bio.trim() });

        // Show the email verification pop-up
        setVerifyModal({
          isOpen: true,
          email: email.trim(),
          title: 'Verify Your Email',
          description: 'A confirmation link has been sent to your email address. Please open your inbox (or spam folder) and verify your email to log in.'
        });
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed';
      if (
        msg.toLowerCase().includes('confirm') ||
        msg.toLowerCase().includes('verify') ||
        msg.toLowerCase().includes('not confirmed')
      ) {
        // Trigger popup message for unverified email on sign-in
        setVerifyModal({
          isOpen: true,
          email: email.trim(),
          title: 'Please Verify Your Email',
          description: 'Your account requires email confirmation before signing in. Check your inbox and click the verification link.'
        });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!verifyModal.email) return;
    setResending(true);
    setResendStatus('');

    try {
      await resendVerification(verifyModal.email);
      setResendStatus('Verification link resent to your email!');
    } catch (err) {
      setResendStatus(err.message || 'Could not resend email. Please try again.');
    } finally {
      setResending(false);
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

        {/* ------------------------------------------------------------- */}
        {/* EMAIL VERIFICATION POP-UP VIEW                                */}
        {/* ------------------------------------------------------------- */}
        {verifyModal.isOpen ? (
          <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }} className="animate-fade-in">
            {/* Mail Icon */}
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
            }}>
              <Mail size={24} />
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 400, marginBottom: '0.6rem' }}>
              {verifyModal.title}
            </h3>

            {/* Email Address Pill */}
            <div style={{
              display: 'inline-block',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.84rem',
              color: '#ffffff',
              marginBottom: '1.25rem'
            }}>
              {verifyModal.email}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {verifyModal.description}
            </p>

            {/* Resend Status Feedback */}
            {resendStatus && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: '#ffffff',
                marginBottom: '1.25rem',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)'
              }}>
                <CheckCircle2 size={15} color="#ffffff" />
                <span>{resendStatus}</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', gap: '0.5rem' }}
                id="btn-resend-verification"
              >
                <RefreshCw size={14} className={resending ? 'spin' : ''} />
                <span>{resending ? 'Resending Link...' : 'Resend Verification Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerifyModal({ isOpen: false, email: '', title: '', description: '' });
                  setTab('login');
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                id="btn-close-verify-popup"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* STANDARD LOGIN / SIGN UP FORM                                 */
          /* ------------------------------------------------------------- */
          <>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-sm)',
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                margin: '0 auto 1.25rem'
              }}>
                <Feather size={18} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 500 }}>
                {tab === 'login' ? 'Welcome Back' : 'Join UNFILTERED'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                A sanctuary to write what you cannot always say out loud.
              </p>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'var(--bg-deep)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-xs)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); }}
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: tab === 'login' ? '#000000' : 'var(--text-muted)',
                  background: tab === 'login' ? '#ffffff' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(''); }}
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: tab === 'signup' ? '#000000' : 'var(--text-muted)',
                  background: tab === 'signup' ? '#ffffff' : 'transparent',
                  transition: 'all 0.15s'
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
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
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

              {/* Discreet verify email link for users who haven't verified yet */}
              {tab === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!email.trim()) {
                        setError('Please enter your email above to verify it.');
                        return;
                      }
                      setVerifyModal({
                        isOpen: true,
                        email: email.trim(),
                        title: 'Verify Your Email',
                        description: 'Click resend below to receive a new verification link for your account.'
                      });
                    }}
                    style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Haven't verified your email yet?
                  </button>
                </div>
              )}

              {tab === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
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
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Shortcut */}
            {!isLive && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  Testing in sandbox mode?
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                  id="auth-demo-login-btn"
                >
                  <Sparkles size={14} color="#ffffff" />
                  <span>1-Click Demo Login (@wanderer)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
