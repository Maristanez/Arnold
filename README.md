# Arnold — AI-Powered Fitness Platform

**Your gym bro who actually remembers every set, every struggle, every PR.**

---

## What is Arnold?

Arnold is a mobile fitness app that solves the core problem every lifter faces: **generic programs that don't adapt to you.**

Most fitness apps give you a static PDF plan or log your workouts without learning from them. Arnold combines:

- **6 distinct fitness identities** — Beginner, General Fitness, Bodybuilder, Powerlifter, Athletic/Functional, Weight Loss
- **AI-generated personalized programming** with structured roadmaps
- **Built-in macro tracking** — no app-switching to MyFitnessPal
- **Persistent AI memory layer** powered by Backboard.io — the longer you use Arnold, the smarter it gets

**Core thesis:** Every competitor owns one piece of the fitness stack. Arnold owns all of it — for every type of gym-goer. The retention moat is the memory layer: Arnold remembers your last 30 days, your patterns, your feedback, and adapts every session accordingly.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Mobile** | React Native (Expo) | Cross-platform, single codebase, fast iteration |
| **Backend** | Node.js / FastAPI | Flexible, scalable, good LLM integration |
| **Database** | PostgreSQL (Supabase) | Relational data for workout history + user profiles |
| **Auth** | Supabase Auth | Built-in, secure, integrates with database |
| **Memory** | Backboard.io | Persistent fitness context, pattern recognition, adaptive coaching |
| **AI/LLM** | Claude/GPT-4 | Structured output for program generation + coaching |
| **Nutrition** | Open Food Facts API | Barcode scanning + macro lookup |
| **Analytics** | Mixpanel | User behavior tracking, retention analysis |

---

## MVP Scope (Locked)

**Goal:** Ship the smallest version that proves the core thesis — that AI memory creates meaningfully better personalization than static programs.

### In Scope ✅

1. Fitness identity onboarding (all 6 profile types)
2. AI-generated personalized weekly program
3. One-tap workout completion
4. Basic set/rep/weight logging (optional, not required for MVP)
5. Simple macro tracker with food search
6. Backboard.io memory integration — AI remembers last 30 days of training context
7. AI check-in after each session — adjusts next session based on performance and feedback

### Not in MVP ❌

- Social features / leaderboards
- Coach marketplace
- Wearables integration
- Advanced analytics dashboards
- Movement cues / exercise video library
- Community features

**Rule:** If it's not in the "In Scope" list, it doesn't get built this sprint.

---

## Product Roadmap

| Phase | Timeline | Key Features |
|-------|----------|--------------|
| **MVP** | Month 1–2 | Core loop shipped, Backboard integrated, all 6 profiles functional |
| **Beta** | Month 2–3 | Full macro tracker, AI coaching check-ins, roadmap visualization, milestone tracking |
| **V1 Public Launch** | Month 4 | All profiles polished, App Store launch, referral loop, Pro subscription billing |
| **V1.5** | Month 5–6 | Movement cues, advanced analytics, coach marketplace MVP |
| **V2** | Month 7–12 | Wearables, community, goal-specific programming packs |

---

## Architecture

### High-Level System Design

```
┌─────────────────┐
│  React Native   │
│   (Expo App)    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌─────────────┐  ┌──────────────┐
│  Supabase   │  │ Backend API  │
│   - Auth    │  │ (Node/FastAPI)│
│   - DB      │  └──────┬───────┘
└─────────────┘         │
                        ├────────────┐
                        │            │
                        ▼            ▼
                 ┌─────────────┐ ┌──────────────┐
                 │ Backboard.io│ │  LLM (Claude)│
                 │   Memory    │ │  Program Gen │
                 └─────────────┘ └──────────────┘
```

### Key Data Models

**User Profile**
```sql
users
- id
- fitness_identity (enum: beginner, general, bodybuilder, powerlifter, athletic, weight_loss)
- current_goals
- training_history
- preferences
```

**Workout Program**
```sql
programs
- id
- user_id
- week_number
- generated_at
- ai_context (Backboard memory snapshot)
```

**Session Log**
```sql
sessions
- id
- program_id
- completed_at
- performance_notes
- ai_feedback
- next_session_adjustments
```

**Nutrition Tracking**
```sql
meals
- id
- user_id
- logged_at
- foods (JSONB)
- macros_total
```

---

## Backboard.io Integration Strategy

**What Gets Stored:**
- Last 30 days of workout completion data
- User feedback after each session (RPE, soreness, energy)
- Performance trends (weight progression, volume changes)
- Goal milestones and progress markers
- Nutrition patterns (macro adherence, meal timing)

**What Gets Retrieved:**
- Recent performance context before generating next week's program
- User feedback patterns to inform exercise selection
- Injury/limitation history to avoid problematic movements
- Fatigue signals to adjust volume/intensity

**Context Window Strategy:**
- Rolling 30-day window for active training context
- Milestone snapshots stored permanently (PRs, body comp changes)
- Retrieve top 10 most relevant memories per AI generation request

---

## Development Workflow

### Initial Setup

```bash
# Clone repo
git clone https://github.com/bryanmaristanez/arnold.git
cd arnold

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add Supabase, Backboard.io, OpenAI API keys

# Start Expo dev server
npm start
```

### Branch Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feature/*` — individual features
- `hotfix/*` — urgent production fixes

### Sprint Cadence

- **Week 1:** Design + architecture decisions
- **Week 2-3:** Build + integrate
- **Week 4:** Test + polish + ship

---

## Current Sprint (MVP - Week 1)

**Goal:** Fitness identity onboarding + first AI-generated program

### Tasks
- [ ] Design onboarding flow UI (all 6 profiles)
- [ ] Build profile selection component
- [ ] Create goal input forms
- [ ] Set up Supabase schema for user profiles
- [ ] Implement Backboard.io client SDK
- [ ] Design LLM prompt for program generation
- [ ] Test program output for 2 profiles (Beginner + Powerlifter)

**Next Action:** Finalize Supabase schema and deploy initial tables.

---

## Key Decisions

### Why Backboard.io?
- Winner of hackathon we already built with it — we know it works
- Purpose-built for persistent AI memory (better than rolling our own vector DB)
- Handles context retrieval automatically
- Reduces complexity vs. building custom RAG pipeline

### Why React Native (Expo)?
- Single codebase for iOS + Android
- Faster iteration than native Swift/Kotlin
- Expo handles OTA updates + build pipeline
- Bryan already has RN experience

### Why Supabase?
- PostgreSQL + Auth + Realtime in one package
- Better SQL support than Firebase
- Self-hostable if we need to scale later
- Generous free tier for MVP

---

## Contributing

This is a solo founder project (Bryan Maristanez) with occasional co-founder collaboration. Not currently accepting external contributors.

---

## License

Proprietary — All rights reserved.

---

## Contact

**Founder:** Bryan Maristanez  
**Email:** [your-email]  
**Twitter/X:** [your-handle]  

---

**Reminder:** If a feature isn't in the MVP scope, it doesn't get built this sprint. Protect the timeline. Ship fast. Validate the thesis.
