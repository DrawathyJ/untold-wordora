import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

export default function RelateButton({ postId, initialCount = 0, size = 'normal' }) {
  const { user, openAuthModal } = useAuth();
  const [relateCount, setRelateCount] = useState(initialCount);
  const [hasRelated, setHasRelated] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRelateCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    let mounted = true;
    if (user && postId) {
      postService.checkHasRelated(postId, user.id).then(res => {
        if (mounted) setHasRelated(res);
      });
    } else {
      setHasRelated(false);
    }
    return () => { mounted = false; };
  }, [postId, user]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal('login');
      return;
    }

    if (loading) return;
    setLoading(true);
    setAnimating(true);

    try {
      const res = await postService.toggleRelate(postId, user.id);
      setHasRelated(res.hasRelated);
      setRelateCount(res.relateCount);
    } catch (err) {
      console.error('Failed to toggle relate:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 500);
    }
  };

  const isSmall = size === 'small';

  return (
    <button
      onClick={handleToggle}
      className={`relate-btn ${hasRelated ? 'active' : ''} ${animating ? 'relate-animate' : ''}`}
      style={{
        padding: isSmall ? '0.28rem 0.65rem' : '0.45rem 0.95rem',
        fontSize: isSmall ? '0.78rem' : '0.86rem'
      }}
      title={hasRelated ? 'You relate to this story' : 'I relate to this'}
      aria-label="I relate to this story"
      id={`relate-btn-${postId}`}
    >
      <Heart
        size={isSmall ? 14 : 16}
        className={hasRelated ? 'fill-rose' : ''}
        style={{
          color: hasRelated ? 'var(--rose-relate)' : 'inherit',
          transition: 'transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
        }}
      />
      <span>{hasRelated ? 'I relate' : 'Relate'}</span>
      <span style={{
        marginLeft: '2px',
        fontWeight: 700,
        opacity: relateCount > 0 ? 1 : 0.6
      }}>
        {relateCount}
      </span>
    </button>
  );
}
