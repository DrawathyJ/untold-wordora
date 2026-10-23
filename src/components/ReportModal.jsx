import React, { useState } from 'react';
import { Flag, X, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or hate speech' },
  { id: 'doxxing', label: 'Doxxing or exposing private information' },
  { id: 'violence', label: 'Threats, violence, or self-harm encouragement' },
  { id: 'spam', label: 'Commercial spam or malicious links' },
  { id: 'other', label: 'Other violation of community guidelines' }
];

export default function ReportModal({ postId, postTitle, onClose }) {
  const { user } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postService.submitReport({
        postId,
        reason,
        details,
        reporterId: user?.id || null
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '2.2rem',
              height: '2.2rem',
              borderRadius: 'var(--radius-sm)',
              background: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Flag size={15} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Report Content</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Help keep UNFILTERED safe</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Thank You</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Your report has been logged. Our moderation team reviews flagged content in accordance with our community guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Story: </span>
              <strong>"{postTitle}"</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>
                Why are you reporting this story?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {REPORT_REASONS.map(r => (
                  <label
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: reason === r.id ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-input)',
                      border: `1px solid ${reason === r.id ? '#ffffff' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      fontSize: '0.86rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Additional Details (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="Provide any context that helps moderators understand the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading}
                id="btn-submit-report"
              >
                <ShieldAlert size={14} />
                <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
