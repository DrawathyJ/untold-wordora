import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_STORIES } from '../lib/seedData';

const MOCK_STORAGE_KEY = 'unfiltered_mock_posts';
const MOCK_RELATES_KEY = 'unfiltered_mock_relates';
const MOCK_REPORTS_KEY = 'unfiltered_mock_reports';

// Initialize mock posts in localStorage if empty
const getMockPosts = () => {
  try {
    const data = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
      return INITIAL_STORIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_STORIES;
  }
};

const saveMockPosts = (posts) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(posts));
};

const getMockRelates = () => {
  try {
    const data = localStorage.getItem(MOCK_RELATES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveMockRelates = (relates) => {
  localStorage.setItem(MOCK_RELATES_KEY, JSON.stringify(relates));
};

export const postService = {
  /**
   * Fetch published posts with optional category, search, and sorting
   */
  async getPublishedPosts({ category = 'All', search = '', sortBy = 'latest' } = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (id, username, bio, avatar_url)
          `)
          .eq('is_published', true);

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        if (sortBy === 'latest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'relatable') {
          query = query.order('relate_count', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;

        let results = (data || []).map((post) => {
          const profile = post.profiles || {};
          return {
            ...post,
            author_name: post.is_anonymous ? 'Anonymous Soul' : (profile.username || 'Unfiltered Writer'),
            author_username: post.is_anonymous ? 'anonymous' : (profile.username || 'writer'),
            author_avatar: post.is_anonymous ? '' : (profile.avatar_url || ''),
            author_bio: post.is_anonymous ? '' : (profile.bio || '')
          };
        });

        if (search && search.trim()) {
          const q = search.toLowerCase();
          results = results.filter(
            p => p.title.toLowerCase().includes(q) ||
                 p.content.toLowerCase().includes(q) ||
                 (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
          );
        }

        return { data: results, error: null };
      } catch (err) {
        console.error('Supabase getPublishedPosts error, falling back:', err);
      }
    }

    // Mock Mode fallback
    let posts = getMockPosts().filter(p => p.is_published);

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        p => p.title.toLowerCase().includes(q) ||
             p.content.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'relatable') {
      posts.sort((a, b) => (b.relate_count || 0) - (a.relate_count || 0));
    } else {
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return { data: posts, error: null };
  },

  /**
   * Fetch a single post by ID
   */
  async getPostById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (id, username, bio, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        const profile = data.profiles || {};
        return {
          data: {
            ...data,
            author_name: data.is_anonymous ? 'Anonymous Soul' : (profile.username || 'Unfiltered Writer'),
            author_username: data.is_anonymous ? 'anonymous' : (profile.username || 'writer'),
            author_avatar: data.is_anonymous ? '' : (profile.avatar_url || ''),
            author_bio: data.is_anonymous ? '' : (profile.bio || '')
          },
          error: null
        };
      } catch (err) {
        console.error('Supabase getPostById error:', err);
      }
    }

    const posts = getMockPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return { data: null, error: new Error('Post not found') };
    return { data: post, error: null };
  },

  /**
   * Create a new post or draft
   */
  async createPost({ title, content, category, tags = [], is_published = true, is_anonymous = false, user }) {
    if (!user) return { data: null, error: new Error('User must be logged in') };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert({
            user_id: user.id,
            title,
            content,
            category,
            tags,
            is_published,
            is_anonymous,
            relate_count: 0
          })
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.error('Supabase createPost error:', err);
        return { data: null, error: err };
      }
    }

    // Mock Mode
    const posts = getMockPosts();
    const newPost = {
      id: 'story-' + Date.now(),
      user_id: user.id,
      author_name: is_anonymous ? 'Anonymous Soul' : (user.user_metadata?.username || user.username || 'You'),
      author_username: is_anonymous ? 'anonymous' : (user.user_metadata?.username || user.username || 'you'),
      author_avatar: is_anonymous ? '' : (user.user_metadata?.avatar_url || ''),
      title,
      content,
      category,
      tags,
      is_published,
      is_anonymous,
      relate_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    posts.unshift(newPost);
    saveMockPosts(posts);
    return { data: newPost, error: null };
  },

  /**
   * Update an existing post (Enforcing user ownership via RLS or logic)
   */
  async updatePost(id, updates, userId) {
    if (!userId) return { data: null, error: new Error('Unauthorized') };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .update({
            title: updates.title,
            content: updates.content,
            category: updates.category,
            tags: updates.tags,
            is_published: updates.is_published,
            is_anonymous: updates.is_anonymous,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', userId) // Enforce user match
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.error('Supabase updatePost error:', err);
        return { data: null, error: err };
      }
    }

    // Mock mode
    const posts = getMockPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return { data: null, error: new Error('Post not found') };

    if (posts[index].user_id !== userId) {
      return { data: null, error: new Error('You do not have permission to edit this post') };
    }

    posts[index] = {
      ...posts[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveMockPosts(posts);
    return { data: posts[index], error: null };
  },

  /**
   * Delete post (Enforces user ownership)
   */
  async deletePost(id, userId) {
    if (!userId) return { error: new Error('Unauthorized') };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return { error: null };
      } catch (err) {
        console.error('Supabase deletePost error:', err);
        return { error: err };
      }
    }

    const posts = getMockPosts();
    const target = posts.find(p => p.id === id);
    if (!target) return { error: new Error('Post not found') };
    if (target.user_id !== userId) return { error: new Error('Unauthorized to delete') };

    const filtered = posts.filter(p => p.id !== id);
    saveMockPosts(filtered);
    return { error: null };
  },

  /**
   * Toggle "I Relate" reaction
   */
  async toggleRelate(postId, userId) {
    if (!userId) return { hasRelated: false, relateCount: 0, error: new Error('Login required') };

    if (isSupabaseConfigured() && supabase) {
      try {
        // Check if relation exists
        const { data: existing } = await supabase
          .from('post_relates')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

        if (existing) {
          // Remove relate
          await supabase.from('post_relates').delete().eq('id', existing.id);
          const { data: post } = await supabase.from('posts').select('relate_count').eq('id', postId).single();
          return { hasRelated: false, relateCount: post?.relate_count || 0, error: null };
        } else {
          // Add relate
          await supabase.from('post_relates').insert({ post_id: postId, user_id: userId });
          const { data: post } = await supabase.from('posts').select('relate_count').eq('id', postId).single();
          return { hasRelated: true, relateCount: post?.relate_count || 0, error: null };
        }
      } catch (err) {
        console.error('Supabase toggleRelate error:', err);
      }
    }

    // Mock Mode
    const relates = getMockRelates();
    const key = `${userId}_${postId}`;
    const posts = getMockPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    let hasRelated = false;
    if (relates[key]) {
      delete relates[key];
      if (postIndex !== -1) {
        posts[postIndex].relate_count = Math.max(0, (posts[postIndex].relate_count || 1) - 1);
      }
      hasRelated = false;
    } else {
      relates[key] = true;
      if (postIndex !== -1) {
        posts[postIndex].relate_count = (posts[postIndex].relate_count || 0) + 1;
      }
      hasRelated = true;
    }

    saveMockRelates(relates);
    saveMockPosts(posts);
    const count = postIndex !== -1 ? posts[postIndex].relate_count : 0;
    return { hasRelated, relateCount: count, error: null };
  },

  /**
   * Check if user has related to a post
   */
  async checkHasRelated(postId, userId) {
    if (!userId) return false;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data } = await supabase
          .from('post_relates')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();
        return !!data;
      } catch (err) {
        console.error('Supabase checkHasRelated error:', err);
      }
    }

    const relates = getMockRelates();
    return !!relates[`${userId}_${postId}`];
  },

  /**
   * Fetch author's private drafts
   */
  async getUserDrafts(userId) {
    if (!userId) return { data: [], error: null };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', userId)
          .eq('is_published', false)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        console.error('Supabase getUserDrafts error:', err);
      }
    }

    const posts = getMockPosts();
    const drafts = posts.filter(p => p.user_id === userId && !p.is_published);
    return { data: drafts, error: null };
  },

  /**
   * Fetch author's published stories (including anonymous ones they authored)
   */
  async getUserStories(userId, isOwner = false) {
    if (!userId) return { data: [], error: null };

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('posts')
          .select('*')
          .eq('user_id', userId)
          .eq('is_published', true);

        // If someone else is visiting profile, hide posts marked anonymous
        if (!isOwner) {
          query = query.eq('is_anonymous', false);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        console.error('Supabase getUserStories error:', err);
      }
    }

    const posts = getMockPosts();
    const stories = posts.filter(p => {
      if (p.user_id !== userId || !p.is_published) return false;
      if (!isOwner && p.is_anonymous) return false;
      return true;
    });
    return { data: stories, error: null };
  },

  /**
   * Submit community report
   */
  async submitReport({ postId, reason, details = '', reporterId }) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .insert({
            post_id: postId,
            reporter_id: reporterId || null,
            reason,
            details,
            status: 'pending'
          });

        if (error) throw error;
        return { success: true, error: null };
      } catch (err) {
        console.error('Supabase submitReport error:', err);
        return { success: false, error: err };
      }
    }

    try {
      const existing = JSON.parse(localStorage.getItem(MOCK_REPORTS_KEY) || '[]');
      existing.push({
        id: 'rep-' + Date.now(),
        postId,
        reason,
        details,
        reporterId,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(existing));
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Reset mock data back to defaults
   */
  resetMockData() {
    localStorage.removeItem(MOCK_STORAGE_KEY);
    localStorage.removeItem(MOCK_RELATES_KEY);
    localStorage.removeItem(MOCK_REPORTS_KEY);
    window.location.reload();
  }
};
