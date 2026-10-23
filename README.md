# 🖋️ UNFILTERED
> **"A place to write what you can't always say."**

UNFILTERED is a digital reading sanctuary for authentic, raw human thoughts — where people can write about their experiences, failures, overthinking, quiet dreams, or unpopular opinions without the pressure of curated social feeds or influencer metrics.

---

## 🌟 What Makes UNFILTERED Different?

1. **Anonymous Publishing with Real Ownership:**
   - Authors can toggle *Publish Anonymously*. Publicly, their identity is shielded under the pen name *"Anonymous Soul"* and their profile link is hidden.
   - Internally, their account retains ownership so they can manage, edit, or delete their story from their private dashboard.
   - Transparent privacy disclaimers outline what anonymity protects and its natural limitations.

2. **The "I Relate" Response:**
   - Rather than turning every interaction into a popularity contest or superficial like count, readers connect via **"I relate"** to signal resonance and solidarity (*"You are not alone in feeling this way"*).

3. **Private Writing Space (Drafts Vault):**
   - A locked space for thoughts users aren't ready to share yet. Drafts are enforced at the database level so only the author can read them.

4. **Community Guidelines & Reporting:**
   - Free expression without harassment, doxxing, or hate speech. Stories feature a community reporting workflow that logs violation reasons for moderation review.

5. **Sanctuary Reader Experience:**
   - Intimate late-night ambient theme with candlelit amber & twilight tones.
   - Typography controls: Switch between **Literary Serif** (`Newsreader`) and **Modern Sans** (`Plus Jakarta Sans`), plus adjustable font sizing and live reading progress tracking.

---

## 🛠️ Technology Stack

| Layer | Technology | Why We Used It |
|---|---|---|
| **Frontend UI** | React 19 + JavaScript | Component-based, responsive reactive interface |
| **Styling** | Vanilla CSS Design System | Custom glassmorphism, HSL color tokens, micro-animations |
| **Routing** | React Router v7 | Seamless single-page navigation and protected views |
| **Icons** | Lucide React | Clean, poetic iconography |
| **Auth** | Supabase Auth | Sign up, login, persistent JWT sessions, user metadata |
| **Database** | Supabase PostgreSQL | Relational storage for profiles, posts, relates, and reports |
| **Security** | PostgreSQL Row Level Security (RLS) | Database-level access control restricting edits/deletions |
| **Deployment** | Vercel | Instant global edge deployment |

---

## 🗄️ Database Schema & RLS Policies

All database tables and security policies are defined in [`supabase_schema.sql`](file:///c:/Users/drawa/Downloads/Blogging/supabase_schema.sql).

### Tables:
- `profiles`: Linked to `auth.users` (`id`, `username`, `bio`, `avatar_url`, `created_at`, `updated_at`).
- `posts`: Core stories (`id`, `user_id`, `title`, `content`, `category`, `tags`, `is_published`, `is_anonymous`, `relate_count`, timestamps).
- `post_relates`: Tracks 1 relate per user per post with unique constraints.
- `reports`: Community moderation queue (`id`, `post_id`, `reporter_id`, `reason`, `details`, `status`).

### Row Level Security (RLS) Highlights:
- **Drafts Privacy:**
  ```sql
  create policy "Published posts are viewable by everyone, drafts only by author"
    on public.posts for select
    using (is_published = true or auth.uid() = user_id);
  ```
- **Edit & Delete Protection:**
  ```sql
  create policy "Authors can update their own posts"
    on public.posts for update
    using (auth.uid() = user_id);

  create policy "Authors can delete their own posts"
    on public.posts for delete
    using (auth.uid() = user_id);
  ```

---

## 🚀 Getting Started

### 1. Run Locally
```bash
# Clone the repository
git clone https://github.com/your-username/unfiltered.git
cd unfiltered

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser. The app includes a built-in sandbox with starter stories, so you can test all features immediately without requiring any setup!

### 2. Connect to Supabase
1. Create a free project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the entire script from `supabase_schema.sql`.
3. Copy your project credentials from **Project Settings → API**:
   - Project URL
   - Project Anon / Public Key
4. Either:
   - Create a `.env` file based on `.env.example`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - **Or** click the **"Sandbox DB"** badge in the navbar of the running app and paste your credentials directly into the in-app connection modal!

### 3. Deploy to Vercel
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for UNFILTERED platform"
   git branch -M main
   git remote add origin https://github.com/your-username/unfiltered.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. In Project Settings, add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Click **Deploy**!

---

## 💜 Ethos
> *"You don't have to get the words right. Just get them out."*
