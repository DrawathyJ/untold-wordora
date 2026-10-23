import React, { useState } from 'react';
import { Database, ShieldCheck, CheckCircle2, AlertTriangle, Key, ExternalLink, X, RefreshCw } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured, saveRuntimeSupabaseCredentials, clearRuntimeSupabaseCredentials } from '../lib/supabase';
import { postService } from '../services/postService';

export default function SupabaseConfigModal({ onClose }) {
  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isLive = isSupabaseConfigured();

  const handleSave = (e) => {
    e.preventDefault();
    if (!url || !anonKey) return;
    saveRuntimeSupabaseCredentials(url, anonKey);
    setSavedSuccess(true);
  };

  const handleClear = () => {
    clearRuntimeSupabaseCredentials();
  };

  const handleResetSeed = () => {
    if (window.confirm("Reset local sandbox stories back to original seed data?")) {
      postService.resetMockData();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              background: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLive ? '#10b981' : '#f59e0b'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Supabase & Architecture Status</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                PostgreSQL • Row Level Security • Auth
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Current Status Card */}
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: isLive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            {isLive ? (
              <>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontWeight: 700, color: '#6ee7b7' }}>Connected to Live Supabase</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#fcd34d' }}>Operating in Local Sandbox Mode</span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {isLive
              ? 'All CRUD operations, authentication, and RLS policies are being enforced directly by your Supabase PostgreSQL database.'
              : 'The application is running with full CRUD and RLS simulation in the browser sandbox. You can connect your live Supabase project below at any time!'}
          </p>
        </div>

        {/* RLS Highlights */}
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--amber-light)', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Row Level Security (RLS) Enforced:</span>
          </div>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li><strong>Drafts:</strong> Only the author (`auth.uid() = user_id`) can query or view drafts.</li>
            <li><strong>Updates/Deletions:</strong> Strictly blocked for anyone other than the authenticated creator.</li>
            <li><strong>Anonymous stories:</strong> Shield author details publicly while preserving author ownership privately.</li>
          </ul>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Project URL:
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Anon / Public API Key:
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" id="btn-save-supabase-config">
                <Key size={14} />
                <span>Save & Connect</span>
              </button>
              {isLive && (
                <button type="button" onClick={handleClear} className="btn btn-secondary">
                  Disconnect
                </button>
              )}
            </div>

            <button type="button" onClick={handleResetSeed} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
              <RefreshCw size={13} />
              <span>Reset Sandbox Stories</span>
            </button>
          </div>
        </form>

        {/* SQL Schema tip */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Database script ready: </span>
          <code style={{ background: 'var(--bg-deep)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--amber-primary)' }}>
            supabase_schema.sql
          </code>
          <p style={{ marginTop: '0.35rem' }}>
            Run the SQL in your Supabase dashboard to provision tables, triggers, and RLS policies.
          </p>
        </div>
      </div>
    </div>
  );
}
