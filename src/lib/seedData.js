// Realistic, authentic starter stories for UNFILTERED
export const INITIAL_STORIES = [
  {
    id: "story-1",
    user_id: "user-maya",
    author_name: "Maya Lin",
    author_username: "mayalin",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "To the friend I quietly outgrew",
    category: "Relationships",
    content: `There was no dramatic screaming match. No betrayal. No moment where one of us slammed a door and swore never to speak again.

Instead, it was a slow fade that took two years. First, responses to texts went from five minutes to five hours, then three days. Then, conversations started feeling like job interviews where we updated each other on our resumes rather than sharing what actually hurt inside our chests.

Yesterday, your birthday notification popped up. I stared at the blinking cursor on my phone for ten minutes before simply writing: *"Happy birthday! Hope you have a wonderful day."*

You replied with a heart emoji. And that was it.

It breaks my heart that people you once shared your 2 AM secrets with can gradually turn back into polite strangers who just know too much about your childhood. If you ever stumble upon this: I don't harbor anger. I'm just grieving the ghost of who we were when the world was smaller.`,
    is_published: true,
    is_anonymous: false,
    relate_count: 84,
    tags: ["friendship", "growing up", "grief"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: "story-2",
    user_id: "user-anon-1",
    author_name: "Anonymous Soul",
    author_username: "anonymous",
    author_avatar: "",
    title: "I'm 26 and I still have no idea what I'm doing",
    category: "Overthinking",
    content: `Everyone on LinkedIn seems to be "thrilled to announce" their promotions, their seed rounds, their keynote speeches.

Meanwhile, I spent twenty minutes this morning sitting on the floor of my shower trying to remember if I actually like my career or if I just picked it because my parents looked relieved when I told them about it four years ago.

I thought adulthood was an arrival. You finish school, you get an apartment, you buy matching dishware, and suddenly a mysterious switch in your brain flips and you feel like a composed grown-up.

Nobody warned me that adulthood is just realizing that nobody in the room has any clue what they are doing. Everyone is winging it. Everyone is terrified of being found out. If you feel like an imposter today, pull up a chair. You're in good company.`,
    is_published: true,
    is_anonymous: true,
    relate_count: 142,
    tags: ["quarterlife", "anxiety", "careers"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: "story-3",
    user_id: "user-elena",
    author_name: "Julian Rivera",
    author_username: "julian_r",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "The company shut down today, and so did my pride",
    category: "Failures",
    content: `At 11:30 AM this morning, I sent the final email to our investors and called our 6 employees into a video meeting to tell them their final paychecks were being issued today.

Three years. Thousands of lines of code. Missing my sister's wedding rehearsal because of a server outage. Putting my life savings into runway extensions.

And in thirty minutes, it was over.

What hurts the most isn't the lost money. It's the sudden, deafening silence. When you're a founder, your identity gets wrapped around the company like ivy on a brick wall. When the wall falls down, who are you?

Right now, I am sitting in an empty cafe eating cold noodles. I don't feel inspiring. I don't feel like this is a "valuable learning opportunity" like tech podcasts claim. It just hurts. But I wrote this down because I refuse to pretend it was all part of the master plan.`,
    is_published: true,
    is_anonymous: false,
    relate_count: 67,
    tags: ["failure", "startups", "honesty"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: "story-4",
    user_id: "user-anon-2",
    author_name: "Anonymous Soul",
    author_username: "anonymous",
    author_avatar: "",
    title: "I want a quiet life, not an impressive one",
    category: "Dreams",
    content: `I don't dream of labor. I don't dream of building a media empire, having 50,000 followers, or being recognized on street corners.

My dream is profoundly unmarketable:
- Waking up without a buzzer alarm vibrating my nightstand.
- Drinking black tea while watching rain trace lines on a kitchen window.
- Having enough money in savings that a dental emergency doesn't ruin my quarter.
- A home filled with used books, healthy houseplants, and a partner who laughs easily.
- Going to bed with a clean conscience and untangled nerves.

Social media makes us feel guilty for contentment. As if existing without aggressive self-monetization is a moral failure. I'm opting out. A quiet, gentle life is enough.`,
    is_published: true,
    is_anonymous: true,
    relate_count: 215,
    tags: ["slow living", "peace", "dreams"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString()
  },
  {
    id: "story-5",
    user_id: "user-sam",
    author_name: "Samantha Wright",
    author_username: "sam_wright",
    author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    title: "Professional networking is deeply unnatural",
    category: "Unpopular Opinions",
    content: `Can we be honest for a second? The entire concept of corporate networking feels like an exercise in sociopathic behavior.

You put on a blazer, walk into a dimly lit hotel conference room, accept a glass of cheap pinot noir, and make transactional small talk with thirty people whose names you will forget within four minutes.

*"So what do you do?"*
Translation: *"Are you useful to my career trajectory?"*

Genuine connection doesn't happen because both parties stand to gain equity or a recommendation letter. It happens when someone drops the polished mask and says something human. Stop treating people like stepping stones.`,
    is_published: true,
    is_anonymous: false,
    relate_count: 119,
    tags: ["work", "authenticity", "unpopular"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: "story-6",
    user_id: "demo-user-id",
    author_name: "You (Demo User)",
    author_username: "wanderer",
    author_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    title: "Things I almost texted you late last night",
    category: "Overthinking",
    content: `Drafting unsent messages in the notes app has become my default coping mechanism.

I wanted to ask you if you heard that song we listened to during that road trip to the coast, and if it still makes your throat tighten the way it does mine. I wanted to tell you I finally read that book you insisted was life-changing. You were right about chapter seven.

Instead, I locked my screen and stared at the ceiling until sleep finally took me. Some bridges don't need to be burned, but maybe they shouldn't be crossed again either.`,
    is_published: false, // Private Draft!
    is_anonymous: false,
    relate_count: 0,
    tags: ["draft", "unsent", "late night"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

export const CATEGORIES = [
  { id: "All", label: "All Stories" },
  { id: "Life", label: "Life" },
  { id: "Relationships", label: "Relationships" },
  { id: "Overthinking", label: "Overthinking" },
  { id: "Dreams", label: "Dreams" },
  { id: "Failures", label: "Failures" },
  { id: "Unpopular Opinions", label: "Unpopular Opinions" },
  { id: "Random Ideas", label: "Random Ideas" }
];
