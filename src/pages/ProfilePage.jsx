import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Edit3, LogOut, BookOpen, EyeOff, Lock, Check, Sparkles, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';

export default function ProfilePage() {
  const { userId } = useParams(); // If viewing someone else
  const { user, profile, updateProfile, signOut, openAuthModal } = useAuth();

  const isSelf = !userId || (user && user.id === userId);
  const targetUserId = userId || user?.id;

  const [activeTab, setActiveTab] = useState('published'); // 'published' | 'anonymous' | 'drafts'
  const [stories, setStories] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditAvatar(profile.avatar_url || '');
    } else if (user) {
      setEditUsername(user.username || user.user_metadata?.username || '');
      setEditBio(user.user_metadata?.bio || '');
      setEditAvatar(user.user_metadata?.avatar_url || '');
    }
  }, [profile, user]);

  const loadUserData = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // Load published stories (passing isOwner flag to include or filter anonymous stories)
      const { data: userStories } = await postService.getUserStories(targetUserId, isSelf);
      setStories(userStories || []);

      if (isSelf) {
        const { data: userDrafts } = await postService.getUserDrafts(targetUserId);
        setDrafts(userDrafts || []);
      }
    } catch (err) {
      console.error('Failed to load user stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [targetUserId, isSelf]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        username: editUsername.trim(),
        bio: editBio.trim(),
        avatar_url: editAvatar.trim()
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (!isSelf && !targetUserId) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Author not found.</p>
      </div>
    );
  }

  if (isSelf && !user) {
    return (
      <div className="app-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <User size={36} color="var(--amber-primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Profile</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Sign in to view your written stories, customize your pen name, and manage your writings.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  const publishedStories = stories.filter(s => !s.is_anonymous);
  const anonymousStories = stories.filter(s => s.is_anonymous);

  const displayedStories =
    activeTab === 'published' ? publishedStories :
    activeTab === 'anonymous' ? anonymousStories :
    drafts;

  return (
    <div className="app-container animate-fade-in" style={{ padding: '3rem 0 6rem' }}>
      {/* Profile Header Card */}
      <div className="card-glass" style={{ padding: '2.5rem', marginBottom: '2.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img
              src={
                profile?.avatar_url ||
                user?.user_metadata?.avatar_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${profile?.username || user?.username || 'user'}`
              }
              alt="Profile"
              style={{
                width: '5.5rem',
                height: '5.5rem',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--border-medium)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  @{profile?.username || user?.username || 'writer'}
                </h1>
                {isSelf && (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                    You
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '520px', fontSize: '0.95rem' }}>
                {profile?.bio || user?.user_metadata?.bio || 'Writing real thoughts on UNFILTERED.'}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span><strong>{publishedStories.length}</strong> public stories</span>
                {isSelf && <span><strong>{anonymousStories.length}</strong> anonymous stories</span>}
                {isSelf && <span><strong>{drafts.length}</strong> private drafts</span>}
              </div>
            </div>
          </div>

          {/* Self Actions */}
          {isSelf && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
                id="btn-edit-profile"
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={signOut}
                className="btn btn-ghost"
                style={{ color: 'var(--rose-relate)' }}
                id="btn-sign-out"
                title="Sign out of account"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Edit Profile Drawer / Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Username:
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Avatar Image URL (Optional):
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Bio:
              </label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" id="btn-save-profile-changes">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div style={{ marginTop: '1rem', color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={16} />
            <span>Profile saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('published')}
          className={`btn btn-ghost ${activeTab === 'published' ? 'active' : ''}`}
          style={{
            color: activeTab === 'published' ? 'var(--amber-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'published' ? 700 : 500,
            gap: '0.45rem'
          }}
          id="tab-profile-published"
        >
          <BookOpen size={16} />
          <span>Public Stories ({publishedStories.length})</span>
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('anonymous')}
            className={`btn btn-ghost ${activeTab === 'anonymous' ? 'active' : ''}`}
            style={{
              color: activeTab === 'anonymous' ? '#c4b5fd' : 'var(--text-muted)',
              fontWeight: activeTab === 'anonymous' ? 700 : 500,
              gap: '0.45rem'
            }}
            id="tab-profile-anonymous"
          >
            <EyeOff size={16} />
            <span>My Anonymous Stories ({anonymousStories.length})</span>
          </button>
        )}

        {isSelf && (
          <button
            onClick={() => setActiveTab('drafts')}
            className={`btn btn-ghost ${activeTab === 'drafts' ? 'active' : ''}`}
            style={{
              color: activeTab === 'drafts' ? '#fbbf24' : 'var(--text-muted)',
              fontWeight: activeTab === 'drafts' ? 700 : 500,
              gap: '0.45rem'
            }}
            id="tab-profile-drafts"
          >
            <Lock size={15} />
            <span>Private Drafts ({drafts.length})</span>
          </button>
        )}
      </div>

      {/* Content List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading stories...</p>
      ) : displayedStories.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Feather size={32} color="var(--amber-primary)" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            No stories in this view
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {activeTab === 'anonymous'
              ? 'Stories you publish anonymously will be accessible here for your eyes only.'
              : 'Start penning your first authentic thought.'}
          </p>
          <Link to="/write" className="btn btn-primary">
            Write a Story
          </Link>
        </div>
      ) : (
        <div className="stories-grid">
          {displayedStories.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
