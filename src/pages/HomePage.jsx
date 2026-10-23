import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, SlidersHorizontal, Feather, PlusCircle } from 'lucide-react';
import { CATEGORIES } from '../lib/seedData';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await postService.getPublishedPosts({
        category: selectedCategory,
        search: searchQuery,
        sortBy
      });
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Atmosphere Section */}
      <section className="hero-section" aria-label="Hero Introduction">
        <div className="hero-backdrop" />
        <div className="app-container hero-content">
          <div className="hero-badge">
            <Feather size={14} />
            <span>Digital Reading Sanctuary</span>
          </div>

          <h1 className="hero-title">
            Write what you <span className="highlight">can't always say.</span>
          </h1>

          <p className="hero-subtitle">
            No curated perfection. No influencer metrics. Just genuine thoughts, fears, late-night overthinking, failures, and quiet dreams.
          </p>

          {/* Search Box */}
          <div className="search-box">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search honest stories, thoughts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="home-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="categories-wrapper" role="tablist" aria-label="Categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                role="tab"
                aria-selected={selectedCategory === cat.id}
                id={`cat-pill-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feed Section */}
      <section className="app-container feed-section">
        {/* Feed Header */}
        <div className="feed-header">
          <div className="feed-title-wrap">
            <h2 className="feed-title">
              {selectedCategory === 'All' ? 'Latest Thoughts' : `${selectedCategory} Stories`}
            </h2>
            <span className="feed-count">
              {posts.length} {posts.length === 1 ? 'story' : 'stories'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SlidersHorizontal size={15} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="feed-sort-select"
              id="feed-sort-select"
            >
              <option value="latest">Most Recent</option>
              <option value="relatable">Most Relatable ("I Relate")</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card-glass"
                style={{ height: '240px', padding: '1.75rem', opacity: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div style={{ height: '20px', width: '30%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
                <div style={{ height: '28px', width: '80%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
                <div style={{ height: '40px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <Feather size={32} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No thoughts here yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.75rem', fontSize: '0.92rem' }}>
              {searchQuery
                ? `No stories found matching "${searchQuery}". Try different keywords or browse all categories.`
                : 'Be the first soul to write what you have been keeping inside.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="btn btn-secondary"
              >
                Clear Search & Filters
              </button>
            ) : (
              <Link to="/write" className="btn btn-primary">
                <PlusCircle size={16} />
                <span>Write the First Story</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="stories-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
