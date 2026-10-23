import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'demo-user-id',
  email: 'wanderer@unfiltered.space',
  username: 'wanderer',
  user_metadata: {
    username: 'wanderer',
    bio: 'Wandering through thoughts, writing what I cannot say out loud.',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'

  const isLive = isSupabaseConfigured();

  // Load user session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isLive && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            await fetchSupabaseProfile(session.user.id);
          } else if (mounted) {
            setUser(null);
            setProfile(null);
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser(session.user);
              await fetchSupabaseProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (err) {
          console.error('Supabase auth init error:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        // Mock Mode: check localStorage for saved demo session
        try {
          const saved = localStorage.getItem('unfiltered_mock_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            setProfile({
              id: parsed.id,
              username: parsed.username || parsed.user_metadata?.username,
              bio: parsed.user_metadata?.bio || 'Writing real thoughts.',
              avatar_url: parsed.user_metadata?.avatar_url || ''
            });
          } else {
            // Default to demo user for frictionless immediate testing
            setUser(DEFAULT_DEMO_USER);
            setProfile({
              id: DEFAULT_DEMO_USER.id,
              username: DEFAULT_DEMO_USER.username,
              bio: DEFAULT_DEMO_USER.user_metadata.bio,
              avatar_url: DEFAULT_DEMO_USER.user_metadata.avatar_url
            });
            localStorage.setItem('unfiltered_mock_user', JSON.stringify(DEFAULT_DEMO_USER));
          }
        } catch {
          setUser(DEFAULT_DEMO_USER);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [isLive]);

  async function fetchSupabaseProfile(userId) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Could not fetch Supabase profile:', err);
    }
  }

  // Sign up
  const signUp = async (email, password, { username, bio = '' }) => {
    if (isLive && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            bio
          }
        }
      });
      if (error) throw error;
      return data;
    }

    // Mock sign up
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      username,
      user_metadata: {
        username,
        bio,
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`
      }
    };
    setUser(mockUser);
    setProfile({
      id: mockUser.id,
      username,
      bio,
      avatar_url: mockUser.user_metadata.avatar_url
    });
    localStorage.setItem('unfiltered_mock_user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  // Sign in
  const signIn = async (email, password) => {
    if (isLive && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    }

    // Mock sign in
    const username = email.split('@')[0] || 'writer';
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      username,
      user_metadata: {
        username,
        bio: 'Reflecting on life, unfiltered.',
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`
      }
    };
    setUser(mockUser);
    setProfile({
      id: mockUser.id,
      username,
      bio: mockUser.user_metadata.bio,
      avatar_url: mockUser.user_metadata.avatar_url
    });
    localStorage.setItem('unfiltered_mock_user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  // Sign out
  const signOut = async () => {
    if (isLive && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('unfiltered_mock_user');
  };

  // Quick switch demo user in mock mode
  const loginAsDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    setProfile({
      id: DEFAULT_DEMO_USER.id,
      username: DEFAULT_DEMO_USER.username,
      bio: DEFAULT_DEMO_USER.user_metadata.bio,
      avatar_url: DEFAULT_DEMO_USER.user_metadata.avatar_url
    });
    localStorage.setItem('unfiltered_mock_user', JSON.stringify(DEFAULT_DEMO_USER));
  };

  // Update profile
  const updateProfile = async ({ username, bio, avatar_url }) => {
    if (!user) throw new Error('Not logged in');

    if (isLive && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    }

    // Mock mode
    const updatedUser = {
      ...user,
      username: username || user.username,
      user_metadata: {
        ...user.user_metadata,
        username: username || user.username,
        bio: bio !== undefined ? bio : user.user_metadata?.bio,
        avatar_url: avatar_url !== undefined ? avatar_url : user.user_metadata?.avatar_url
      }
    };
    setUser(updatedUser);
    const updatedProfile = {
      id: user.id,
      username: updatedUser.username,
      bio: updatedUser.user_metadata.bio,
      avatar_url: updatedUser.user_metadata.avatar_url
    };
    setProfile(updatedProfile);
    localStorage.setItem('unfiltered_mock_user', JSON.stringify(updatedUser));
    return updatedProfile;
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Resend email verification
  const resendVerification = async (email) => {
    if (isLive && supabase) {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) throw error;
      return data;
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLive,
        signUp,
        signIn,
        signOut,
        loginAsDemo,
        updateProfile,
        resendVerification,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
