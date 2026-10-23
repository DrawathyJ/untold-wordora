import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Edit3, Send, Trash2, PlusCircle, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

export default function DraftsPage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDrafts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await postService.getUserDrafts(user.id);
      setDrafts(data || []);
    } catch (err) {
      console.error('Failed to load drafts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, [user]);

  const handlePublishNow = async (draft) => {
    if (!window.confirm(`Publish "${draft.title}" to the public feed now?`)) return;

    try {
      const { error } = await postService.updatePost(
        draft.id,
        { ...draft, is_published: true },
        user.id
      );
      if (error) throw error;
      navigate(`/post/${draft.id}`);
    } catch (err) {
      alert(err.message || 'Could not publish draft');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft permanently?')) return;
    try {
      const { error } = await postService.deletePost(id, user.id);
      if (error) throw error;
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete draft');
    }
  };

  if (!user) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--amber-primary)',
          margin: '0 auto 1.5rem'
        }}>
          <Lock size={26} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Your Private Writing Space
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          Drafts are protected by Row Level Security (RLS) and encrypted database access. Sign in to access thoughts you are not ready to publish yet.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn btn-primary" id="btn-login-for-drafts">
          Sign In to Access Drafts
        </button>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in" style={{ padding: '3rem 0 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <Lock size={20} color="var(--amber-primary)" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Private Drafts Vault</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Unpublished writings visible only to you. Take all the time you need.
          </p>
        </div>

        <Link to="/write" className="btn btn-primary" id="btn-create-new-draft">
          <PlusCircle size={16} />
          <span>New Thought</span>
        </Link>
      </div>

      {/* Drafts List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Opening vault...</p>
      ) : drafts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4.5rem 2rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <Sparkles size={36} color="var(--amber-primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your vault is empty</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Have something lingering in your mind? Write it down here without publishing it.
          </p>
          <Link to="/write" className="btn btn-secondary">
            Start a Private Draft
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {drafts.map((draft) => (
            <div key={draft.id} className="card-glass" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  {draft.category || 'Draft'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>
                    Last updated {new Date(draft.updated_at || draft.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                {draft.title || 'Untitled Draft'}
              </h3>

              <p style={{
                fontFamily: 'var(--font-reading-serif)',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1
              }}>
                {draft.content || <em>Empty draft</em>}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/edit/${draft.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handlePublishNow(draft)}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                    title="Publish to public feed"
                  >
                    <Send size={13} />
                    <span>Publish</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(draft.id)}
                  className="btn-ghost"
                  style={{ padding: '0.4rem', color: 'var(--rose-relate)' }}
                  title="Discard draft"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
