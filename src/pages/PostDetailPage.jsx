import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, EyeOff, Share2, Flag, Edit3, Trash2, BookOpen, Type, Sparkles } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useReadingMode } from '../context/ReadingModeContext';
import RelateButton from '../components/RelateButton';
import ReportModal from '../components/ReportModal';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fontFamily, toggleFontFamily, fontSize, cycleFontSize } = useReadingMode();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Load post
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    postService.getPostById(id).then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data) {
        setError('Story not found or has been removed.');
      } else {
        setPost(data);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleDelete = async () => {
    if (!user || !post) return;
    try {
      const { error } = await postService.deletePost(post.id, user.id);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      alert(err.message || 'Could not delete story');
    }
  };

  if (loading) {
    return (
      <div className="reading-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving words...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="reading-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{error || 'Story not found'}</h2>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Return to Feed</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.user_id;

  // Simple formatting helper for markdown paragraphs and quotes
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;
    const paragraphs = rawText.split(/\n\s*\n/);

    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('>')) {
        return (
          <blockquote key={idx}>
            {trimmed.replace(/^>\s*/, '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: '#fff' }}>
            {trimmed.replace(/^##\s*/, '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s*/, ''));
        return (
          <ul key={idx}>
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="post-detail-page animate-fade-in">
      {/* Reading Progress Top Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="reading-container">
        {/* Navigation & Reader Controls */}
        <div className="post-header-top">
          <Link to="/" className="btn btn-ghost" style={{ paddingLeft: 0, gap: '0.4rem' }}>
            <ArrowLeft size={16} />
            <span>Feed</span>
          </Link>

          {/* Reader Preferences Bar */}
          <div className="post-reader-controls">
            <button
              onClick={toggleFontFamily}
              className="control-pill"
              title={`Switch typography (Currently: ${fontFamily === 'serif' ? 'Literary Serif' : 'Modern Sans'})`}
              id="btn-toggle-font"
            >
              <Type size={13} style={{ display: 'inline', marginRight: '4px' }} />
              <span>{fontFamily === 'serif' ? 'Serif' : 'Sans'}</span>
            </button>

            <button
              onClick={cycleFontSize}
              className="control-pill"
              title="Adjust font size"
              id="btn-cycle-fontsize"
            >
              <span>Size: {fontSize.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Post Header */}
        <header className="post-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span className="badge badge-editorial">
              {post.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>
                {Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} min read
              </span>
            </div>
            {!post.is_published && (
              <span className="badge" style={{ border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                Private Draft
              </span>
            )}
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          {/* Author info row */}
          <div className="post-detail-author-row">
            {post.is_anonymous ? (
              <div className="author-pill-link">
                <div className="author-large-anon">
                  <EyeOff size={18} />
                </div>
                <div>
                  <div className="author-text-name">Anonymous Soul</div>
                  <div className="author-text-meta">Identity shielded for authentic expression</div>
                </div>
              </div>
            ) : (
              <Link to={`/author/${post.user_id}`} className="author-pill-link">
                <img
                  src={
                    post.author_avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author_username || 'user'}`
                  }
                  alt={post.author_name}
                  className="author-large-avatar"
                />
                <div>
                  <div className="author-text-name">@{post.author_username || 'writer'}</div>
                  <div className="author-text-meta">
                    {post.author_bio || 'UNFILTERED Storyteller'}
                  </div>
                </div>
              </Link>
            )}

            {/* Author Quick Actions (if logged in owner) */}
            {isAuthor && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/edit/${post.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                  <Edit3 size={14} />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="btn btn-danger"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Story Body */}
        <section className={`post-body font-${fontFamily} size-${fontSize}`}>
          {renderFormattedContent(post.content)}
        </section>

        {/* Story Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {post.tags.map((t, idx) => (
              <span key={idx} className="story-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Post Reaction Bar */}
        <div className="post-reaction-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <RelateButton postId={post.id} initialCount={post.relate_count} size="normal" />
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Did this connect with you?
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              title="Copy story URL"
            >
              <Share2 size={15} />
              <span>{copiedToast ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="btn-ghost"
              style={{ padding: '0.45rem', borderRadius: '50%' }}
              title="Report inappropriate content"
            >
              <Flag size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportModal
          postId={post.id}
          postTitle={post.title}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--rose-relate)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete this story?</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              This action cannot be undone. The post will be permanently deleted from UNFILTERED.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setDeleteConfirmOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
