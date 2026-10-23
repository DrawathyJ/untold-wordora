import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Feather, Eye, EyeOff, Save, Send, Sparkles, AlertCircle, Bold, Italic, Quote, Heading, List, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { CATEGORIES } from '../lib/seedData';

export default function WritePage() {
  const { id } = useParams(); // If editing an existing post
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Overthinking');
  const [tagsInput, setTagsInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  // If editing, load post
  useEffect(() => {
    if (id) {
      postService.getPostById(id).then(({ data, error }) => {
        if (error || !data) {
          setError('Could not load story for editing.');
        } else {
          setTitle(data.title || '');
          setContent(data.content || '');
          setCategory(data.category || 'Overthinking');
          setTagsInput((data.tags || []).join(', '));
          setIsAnonymous(!!data.is_anonymous);
        }
        setInitialLoading(false);
      });
    }
  }, [id]);

  // Insert markdown helper at cursor
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('write-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async (isPublishing) => {
    setError('');
    setStatusMessage('');

    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your thoughts.');
      return;
    }

    if (!content.trim()) {
      setError('Write a few words to get started.');
      return;
    }

    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    try {
      if (id) {
        // Update existing post
        const { error: updateErr } = await postService.updatePost(
          id,
          {
            title: title.trim(),
            content: content.trim(),
            category,
            tags,
            is_published: isPublishing,
            is_anonymous: isAnonymous
          },
          user.id
        );

        if (updateErr) throw updateErr;

        setStatusMessage(isPublishing ? 'Story published!' : 'Draft saved!');
        setTimeout(() => {
          navigate(isPublishing ? `/post/${id}` : '/drafts');
        }, 800);
      } else {
        // Create new post
        const { data, error: createErr } = await postService.createPost({
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          is_published: isPublishing,
          is_anonymous: isAnonymous,
          user
        });

        if (createErr) throw createErr;

        setStatusMessage(isPublishing ? 'Story published!' : 'Draft saved!');
        setTimeout(() => {
          navigate(isPublishing ? `/post/${data.id}` : '/drafts');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Failed to save story.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading story...</p>
      </div>
    );
  }

  return (
    <div className="app-container write-page animate-fade-in">
      {/* Inspirational Sanctuary Banner */}
      <div className="write-mantra-banner">
        <p className="write-mantra-text">
          "You don't have to get the words right. Just get them out."
        </p>
        <p className="write-mantra-sub">
          No algorithmic pressure. No need for polished rhetoric. Write what is true to you.
        </p>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fda4af',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {statusMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <Check size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="write-form">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Give your thoughts a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="write-title-input"
          id="write-title-input"
          maxLength={150}
        />

        {/* Category & Anonymity Bar */}
        <div className="write-meta-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Category Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Topic Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
                id="write-category-select"
              >
                {CATEGORIES.filter(c => c.id !== 'All').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Tags (comma separated):
              </label>
              <input
                type="text"
                placeholder="anxiety, late night, confession"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
                id="write-tags-input"
              />
            </div>
          </div>

          {/* Anonymous Switch */}
          <div className="anon-toggle-wrap" onClick={() => setIsAnonymous(!isAnonymous)}>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => {}}
                aria-label="Publish anonymously"
                id="write-anonymous-toggle"
              />
              <span className="slider" />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
              {isAnonymous ? <EyeOff size={16} color="#c4b5fd" /> : <Eye size={16} color="var(--text-muted)" />}
              <span>{isAnonymous ? 'Publish Anonymously' : 'Public Attribution'}</span>
            </div>
          </div>
        </div>

        {/* Anonymous Privacy Disclaimer */}
        {isAnonymous && (
          <div className="anon-privacy-callout">
            <EyeOff size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Anonymous Publishing Active:</strong>
              <p style={{ marginTop: '0.25rem' }}>
                Your story will appear under the pen name <em>"Anonymous Soul"</em> and your profile link will be hidden from readers. Internally, your account maintains ownership so you can edit or delete this post from your private drafts dashboard.
              </p>
              <p style={{ fontSize: '0.78rem', color: '#a78bfa', marginTop: '0.35rem' }}>
                *Note: Anonymous publishing protects public visibility, but please never share identifying personally identifiable details or sensitive credentials in the text.
              </p>
            </div>
          </div>
        )}

        {/* Editor vs Preview Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`btn btn-ghost ${activeTab === 'write' ? 'active' : ''}`}
              style={{
                color: activeTab === 'write' ? 'var(--amber-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'write' ? 700 : 500
              }}
              id="tab-btn-write"
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`btn btn-ghost ${activeTab === 'preview' ? 'active' : ''}`}
              style={{
                color: activeTab === 'preview' ? 'var(--amber-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'preview' ? 700 : 500
              }}
              id="tab-btn-preview"
            >
              Live Preview
            </button>
          </div>

          <div className="write-stats">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readTime} min read</span>
          </div>
        </div>

        {/* Content Body Editor or Preview */}
        {activeTab === 'write' ? (
          <div>
            {/* Markdown Toolbar */}
            <div className="editor-toolbar">
              <button type="button" onClick={() => insertMarkdown('**', '**')} className="toolbar-btn" title="Bold">
                <Bold size={15} />
              </button>
              <button type="button" onClick={() => insertMarkdown('*', '*')} className="toolbar-btn" title="Italic">
                <Italic size={15} />
              </button>
              <button type="button" onClick={() => insertMarkdown('> ')} className="toolbar-btn" title="Quote">
                <Quote size={15} />
              </button>
              <button type="button" onClick={() => insertMarkdown('## ')} className="toolbar-btn" title="Heading">
                <Heading size={15} />
              </button>
              <button type="button" onClick={() => insertMarkdown('- ')} className="toolbar-btn" title="Bullet List">
                <List size={15} />
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                Markdown supported
              </span>
            </div>

            <textarea
              id="write-content-textarea"
              placeholder="Start writing without overthinking. What is weighing on your mind today? What happened that nobody else knows? What are you afraid to admit? Let it flow..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="write-textarea"
            />
          </div>
        ) : (
          <div
            className="card-glass"
            style={{
              minHeight: '380px',
              padding: '2rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <span className="badge badge-life" style={{ marginBottom: '0.5rem' }}>{category}</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{title || 'Untitled Story'}</h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Author: {isAnonymous ? 'Anonymous Soul (Hidden)' : (user?.username || 'You')}
              </p>
            </div>
            <div
              className="post-body font-serif size-medium"
              style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}
            >
              {content || <em>Your story preview will appear here as you write...</em>}
            </div>
          </div>
        )}

        {/* Action Buttons: Save Draft vs Publish */}
        <div className="write-actions-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="btn btn-secondary"
              id="btn-save-draft"
            >
              <Save size={16} />
              <span>Save as Draft</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Drafts remain private to you
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={loading}
            className="btn btn-primary"
            id="btn-publish-story"
          >
            <Send size={16} />
            <span>{id ? 'Update Story' : 'Publish to Feed'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
