-- ==============================================================================
-- UNFILTERED — Database Schema & Row Level Security (RLS) Setup
-- Run this script in your Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- ==============================================================================

-- 1. Create Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  bio text default '',
  avatar_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  category text not null check (category in ('Life', 'Relationships', 'Overthinking', 'Dreams', 'Failures', 'Unpopular Opinions', 'Random Ideas')),
  tags text[] default '{}',
  is_published boolean default true not null,
  is_anonymous boolean default false not null,
  relate_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Post Relates table ("I relate" reaction)
create table if not exists public.post_relates (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_post_user_relate unique (post_id, user_id)
);

-- 4. Create Reports table for community moderation
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  reporter_id uuid references auth.users on delete set null,
  reason text not null,
  details text default '',
  status text default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_relates enable row level security;
alter table public.reports enable row level security;

-- ==============================================================================
-- RLS POLICIES: PROFILES
-- ==============================================================================
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ==============================================================================
-- RLS POLICIES: POSTS
-- ==============================================================================
-- 1. Read: Public can read published posts; Authors can read their own drafts too.
create policy "Published posts are viewable by everyone, drafts only by author"
  on public.posts for select
  using (is_published = true or auth.uid() = user_id);

-- 2. Create: Authenticated users can create posts linked to their auth id.
create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

-- 3. Update: Only post author can edit their own posts.
create policy "Authors can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

-- 4. Delete: Only post author can delete their own posts.
create policy "Authors can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- RLS POLICIES: POST RELATES ("I Relate")
-- ==============================================================================
create policy "Anyone can view relates"
  on public.post_relates for select
  using (true);

create policy "Authenticated users can relate to a post"
  on public.post_relates for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own relate"
  on public.post_relates for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- RLS POLICIES: REPORTS
-- ==============================================================================
create policy "Authenticated users can submit reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 1. Automatic Profile creation on new Auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, bio, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'bio', 'Writing real thoughts on UNFILTERED.'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the profile handler on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Update relate_count counter cache on posts table
create or replace function public.update_relate_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.posts set relate_count = relate_count + 1 where id = new.post_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.posts set relate_count = greatest(0, relate_count - 1) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_post_relate_change on public.post_relates;
create trigger on_post_relate_change
  after insert or delete on public.post_relates
  for each row execute procedure public.update_relate_count();
