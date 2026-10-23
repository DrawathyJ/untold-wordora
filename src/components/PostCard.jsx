import React from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, Clock, Share2 } from 'lucide-react';
import RelateButton from './RelateButton';

// Calculate read time
const getReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Format relative date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function PostCard({ post }) {
  if (!post) return null;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  return (
    <article className="card-glass story-card animate-fade-in" id={`story-card-${post.id}`}>
      {/* Card Header */}
      <div className="story-card-header">
        <span className="badge badge-editorial">
          {post.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          <span>{getReadTime(post.content)}</span>
        </div>
      </div>

      {/* Title */}
      <Link to={`/post/${post.id}`}>
        <h3 className="story-card-title">{post.title}</h3>
      </Link>

      {/* Excerpt */}
      <p className="story-card-excerpt">
        {post.content.replace(/[*#_~`]/g, '')}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="story-tags">
          {post.tags.map((tag, i) => (
            <span key={i} className="story-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="story-card-footer">
        {/* Author info */}
        <div className="story-author-info">
          {post.is_anonymous ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div className="story-author-anon-icon">
                <EyeOff size={12} />
              </div>
              <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                Anonymous Soul
              </span>
            </div>
          ) : (
            <Link
              to={`/author/${post.user_id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  post.author_avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author_username || 'user'}`
                }
                alt={post.author_name}
                className="story-author-avatar"
              />
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                @{post.author_username || 'writer'}
              </span>
            </Link>
          )}
          <span>•</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RelateButton postId={post.id} initialCount={post.relate_count} size="small" />
          <button
            onClick={handleShare}
            className="btn-ghost"
            style={{ padding: '0.35rem', borderRadius: '50%' }}
            title="Share story link"
            aria-label="Share story"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
