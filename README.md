# CricketScore Master

🏏 Cricket Scoring Platform — Complete Frontend

Build a world-class, production-ready cricket scoring web application using Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, and Socket.io-client. This is a Progressive Web App (PWA) that works offline and can be installed on mobile home screens. The app connects to an existing Node.js/Express backend API.

🎯 PROJECT OVERVIEW

App Name: CricketScorer Pro
Tagline: "Your Cricket Matters"
Target Users: Local cricket teams, tournament organizers, scorers, spectators
Vibe: Premium, modern, dark-mode-first, cricket-themed (green + gold accents)

🛠️ TECH STACK (Strict — Use These Only)

Table

LayerTechnologyFrameworkNext.js 14 (App Router)LanguageTypeScript (strict mode)StylingTailwind CSS 3.4Componentsshadcn/ui (latest)IconsLucide ReactAnimationsFramer MotionState ManagementZustandData FetchingTanStack Query (React Query) v5Real-TimeSocket.io-clientFormsReact Hook Form + ZodChartsRechartsPWAnext-pwa (workbox)Toast NotificationsSonnerDate/Timedate-fnsClass Utilsclsx + tailwind-merge

🎨 DESIGN SYSTEM

Color Palette (Tailwind Config)

JavaScript

colors: {
  // Primary Cricket Green
  cricket: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  // Gold Accents
  gold: {
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
  },
  // Dark Theme Base
  background: '#0a0a0a',
  surface: '#171717',
  'surface-elevated': '#262626',
  border: '#404040',
}

Typography

Headings: Inter (Google Fonts) — font-weight 700-800

Body: Inter — font-weight 400-500

Numbers/Stats: JetBrains Mono (monospace) — for scores, overs, stats

Base size: 16px, line-height 1.5

Component Design Rules

All cards: rounded-2xl, bg-surface, border border-border, shadow-lg

All buttons: rounded-xl, transition-all duration-200, active:scale-95

Primary buttons: bg-cricket-600 hover:bg-cricket-500 text-white

Danger buttons: bg-red-600 hover:bg-red-500

Ghost buttons: hover:bg-surface-elevated

Inputs: bg-surface-elevated border-border rounded-xl focus:ring-2 focus:ring-cricket-500

All interactive elements must have cursor-pointer

Loading states: Skeleton loaders with animate-pulse bg-surface-elevated

📱 PWA REQUIREMENTS

Installable: Add to home screen on iOS/Android

Offline Scoring: Score matches without internet, sync when back online

Splash Screen: Cricket-themed launch screen

Theme Color: #14532d (cricket green)

Icons: Generate all sizes (72x72 to 512x512)

Service Worker: Cache static assets, API responses, match data

Background Sync: Queue ball events when offline, sync automatically

Push Notifications: Notify spectators of key events (wickets, boundaries)

🗂️ PAGE STRUCTURE

1. Landing Page (/)

Hero Section: Full-screen gradient background (dark green to black), animated cricket ball trajectory using Framer Motion, tagline "Your Cricket Matters" with typewriter effect

Features Grid: 6 cards with Lucide icons — Live Scoring, Tournament Mgmt, Player Stats, Leaderboards, Team Profiles, Share Scorecards

Live Matches Section: Horizontal scroll of currently live matches with mini scorecards

CTA: "Start Scoring Free" button → /matches/create

Footer: Links, GitHub repo, "Built with passion for grassroots cricket"

2. Authentication (/auth/login, /auth/register)

Clean split-screen layout: left side cricket illustration, right side form

Login: Phone number + password (with country code selector)

Register: Full name, phone, password, confirm password

Form validation: Zod schema with real-time error messages

Loading states: Button spinner, skeleton on submit

Success toast: "Welcome back, [name]!" using Sonner

Store JWT token in localStorage, refresh before expiry

3. Dashboard (/dashboard)

Stats Cards Row: Total matches played, runs scored, wickets taken, current ranking (animated counters)

Recent Matches: Table with match name, teams, result, date

Upcoming Matches: Cards with countdown timer

Quick Actions: "Create Match", "Create Team", "Join Tournament"

Activity Feed: Recent events (matches scored, milestones achieved)

4. Teams (/teams)

Team Cards Grid: Logo, name, player count, win/loss record, color-coded team jerseys

Create Team Modal: Name, short name (3 letters), primary/secondary color picker, logo upload (drag & drop to MinIO)

Team Detail Page (/teams/[id]):

Team banner with colors

Player roster with jersey numbers, roles (captain, wicketkeeper)

Stats: matches played, wins, losses, NRR

Recent matches list

"Add Player" button (search by phone number)

5. Match Creation (/matches/create)

Stepper Form (3 steps):

Step 1: Match title, format (T20, ODI, Test, T10, Gully), overs, ground, date

Step 2: Select Team A and Team B (dropdown with search)

Step 3: Toss winner, toss decision (bat/bowl), Playing XI selection for both teams

Validation: Both teams must have ≥11 players, Playing XI must be exactly 11

Summary Card: Before submit, show match preview

6. Live Scoring Screen (/matches/[id]/score) — THE MOST IMPORTANT PAGE

This is the heart of the app. Design it like a professional scorer's interface.

Layout (Mobile-First, works on tablet/desktop)

plain

┌─────────────────────────────────────────┐
│ ← Royal Strikers vs Thunder Bolts  ● LIVE│  ← Header with back button, live indicator
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  ROYAL STRIKERS        142/3       │ │  ← Scoreboard Card
│  │  15.2 overs | RR: 9.32 | CRR: 8.5  │ │
│  │  [==========░░░░░░░░] 76% complete │ │  ← Progress bar
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  THUNDER BOLTS       0/0           │ │  ← 2nd innings (if started)
│  │  Yet to bat                         │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  🏏 STRIKER │  │  🏏 NON-STR │      │
│  │  R Sharma   │  │  V Kohli    │      │
│  │  68* (42)   │  │  12 (8)     │      │
│  │  ████████░░ │  │  ███░░░░░░░ │      │  ← Strike rate bars
│  │  SR: 161.9  │  │  SR: 150.0  │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  🎯 Bowler: J Bumrah                │ │
│  │  2.2-0-18-1 | Econ: 8.18 | Maiden:0│ │
│  └─────────────────────────────────────┘ │
│                                         │
│  Current Over:  1  4  .  W  2  6        │  ← Ball-by-ball dots with colors
│                                         │
│  ┌────┬────┬────┬────┬────┬────┐      │
│  │ 0  │ 1  │ 2  │ 3  │ 4  │ 6  │      │  ← RUNS (big touch targets)
│  └────┴────┴────┴────┴────┴────┘      │
│                                         │
│  ┌────┬────┬────┬────┬────┐           │
│  │Wide│ NB │ Bye│LB  │Wkt │           │  ← EXTRAS & WICKET
│  └────┴────┴────┴────┴────┘           │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  [Undo Last Ball]  [More Options ▼] │ │  ← Action bar
│  └─────────────────────────────────────┘ │
│                                         │
│  [View Full Scorecard]  [End Innings]  │
└─────────────────────────────────────────┘

Scoring Button Design

Runs (0-6): Large square buttons, min-h-[72px], text-2xl font-bold

4 = green border + "FOUR" label

6 = gold border + "SIX" label + confetti animation

0 = subtle gray

Extras: Wide (W), No Ball (NB), Bye (B), Leg Bye (LB) — outlined buttons

Wicket: Red button with skull icon, triggers wicket modal

Wicket Modal

Select dismissal type: Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket, Retired Hurt, Retired Out

If caught/run-out: select fielder from dropdown

Select new batsman (from bench players)

Confirm with animation

More Options Menu

Change Bowler (select from bowling team)

Change Batsman (manual swap)

Add Overthrow runs

Add Penalty runs

Set Power Play

Declare innings

Use DLS Calculator

Real-Time Updates

Every ball press → instant UI update (no page reload)

Socket.io emits: BALL_BOWLED, WICKET_FALLEN, OVER_COMPLETE, INNINGS_END

Show "Syncing..." indicator when offline, auto-retry

Confetti animation on boundaries and milestones (50, 100, 5-wicket haul)

7. Scorecard Page (/matches/[id]/scorecard)

Batting Table: Player, Runs, Balls, 4s, 6s, SR, Dismissal

Active batsman highlighted in cricket green

Out batsmen grayed out with wicket info

Bowling Table: Player, Overs, Maidens, Runs, Wickets, Econ, Wides, NBs

Partnerships: Bar chart showing each partnership's runs and balls

Fall of Wickets: Timeline with over number and runs

Extras: Breakdown (wides, no-balls, byes, leg-byes)

Match Info: Toss, venue, date, umpires

Share Button: Generate scorecard image for WhatsApp (html2canvas)

8. Player Profile (/players/[id])

Hero Card: Avatar, name, team, role, jersey number

Career Stats Cards: Matches, Runs, Average, Strike Rate, Highest Score, 50s, 100s, Wickets, Economy

Format Tabs: T20, ODI, Test, Overall

Performance Graph: Runs per match line chart (Recharts)

Recent Matches: Table with performance per match

Batting Map: Wagon wheel visualization (SVG) showing shot placement

MVP Awards: Trophy count, match MVP badges

9. Leaderboard (/leaderboard)

Tabs: Most Runs, Most Wickets, Best Average, Best Strike Rate, Most Catches

Format Filter: All, T20, ODI, Test

Time Filter: All Time, This Year, This Month

Table: Rank, Player, Team, Stat, Trend (↑↓ arrows)

Top 3 Podium: Gold/Silver/Bronze cards for top performers

10. Tournament Manager (/tournaments)

Tournament Cards: Name, format, teams count, progress bar

Create Tournament: Name, format (round-robin, knockout, league+knockout), teams, overs, start/end dates

Tournament Detail (/tournaments/[id]):

Points Table: Team, Played, Won, Lost, Tied, NRR, Points (auto-calculated)

Fixtures: Calendar/Grid view, filter by round

Stats: Top run-scorer, top wicket-taker, best catch

Standings graph over time

11. Settings (/settings)

Profile: Edit name, avatar, phone

Teams: Manage my teams

Preferences: Default match format, notification settings

Theme: Dark/Light/System mode toggle

Language: English, Hindi, Tamil, Telugu (i18n ready)

About: Version, open-source credits, GitHub link

🔌 API INTEGRATION

Base URL: http://localhost:4000/api (configurable via env)

Authentication

Store JWT in localStorage as cricket_token

Attach to every request: Authorization: Bearer <token>

Auto-refresh token before expiry

Redirect to /auth/login on 401

Key Endpoints to Integrate

TypeScript

// Auth
POST /api/auth/register
POST /api/auth/login

// Teams
GET    /api/teams
POST   /api/teams
GET    /api/teams/:id
POST   /api/teams/:id/players

// Matches
GET    /api/matches?status=live&limit=20
POST   /api/matches
GET    /api/matches/:id
POST   /api/matches/:id/start
POST   /api/matches/:id/ball
POST   /api/matches/:id/undo
POST   /api/matches/:id/change-bowler
GET    /api/matches/:id/mvp

// Leaderboard
GET    /api/leaderboard?category=batting&format=t20

// Tournaments
GET    /api/tournaments
POST   /api/tournaments
GET    /api/tournaments/:id

Socket.io Events

TypeScript

// Connect
const socket = io('http://localhost', {
  auth: { token: localStorage.getItem('cricket_token') }
});

// Join match room
socket.emit('join_match', matchId);

// Listen for events
socket.on('BALL_BOWLED', (data) => updateScoreboard(data));
socket.on('WICKET_FALLEN', (data) => showWicketAnimation(data));
socket.on('INNINGS_END', (data) => showInningsBreak(data));
socket.on('MATCH_END', (data) => showMatchResult(data));
socket.on('spectator_count', (data) => updateViewerCount(data.count));

🎭 ANIMATIONS & MICRO-INTERACTIONS

Use Framer Motion for all animations:

Page Transitions: Fade + slide up, duration: 0.3, ease: "easeOut"

Score Updates: Number counter animation (count up/down)

Boundary Hit:

Button press: scale: 0.95 → 1.0 spring

Confetti burst (canvas-confetti) on 4s and 6s

Score number flashes gold then settles

Wicket Fall:

Red flash overlay

Batsman card slides out left

New batsman card slides in right

"WICKET!" toast with sound effect

Over Complete:

Bowler card rotates

Strike indicator swaps with flip animation

Milestone (50/100/5w):

Full-screen celebration overlay

Trophy icon bounces in

Confetti for 5 seconds

Loading States:

Skeleton screens (never show blank)

Pulse animation on cards

Spinner on buttons

Pull-to-Refresh:

On mobile, pull down to refresh match data

Elastic animation

📱 RESPONSIVE BREAKPOINTS

Table

BreakpointLayoutMobile (<640px)Single column, full-width buttons, bottom nav barTablet (640-1024px)Two-column scoring layout, sidebar navDesktop (>1024px)Three-column: scoreboard left, buttons center, stats right

Mobile-First: Design for mobile scorers first, enhance for desktop.

🌐 PWA MANIFEST

Generate manifest.json:

JSON

{
  "name": "CricketScorer Pro",
  "short_name": "CricketScorer",
  "description": "Score cricket matches like a pro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#14532d",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512" }
  ]
}

🧪 TESTING REQUIREMENTS

Unit Tests: Jest + React Testing Library for components

E2E Tests: Playwright for critical flows (create match → score 6 balls → view scorecard)

Performance: Lighthouse score >90 on all metrics

Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support

📦 FOLDER STRUCTURE

plain

app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── dashboard/page.tsx
│   ├── teams/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── create/page.tsx
│   ├── matches/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx (match detail)
│   │       ├── score/page.tsx (scoring screen)
│   │       └── scorecard/page.tsx
│   ├── players/
│   │   └── [id]/page.tsx
│   ├── leaderboard/page.tsx
│   └── tournaments/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── [id]/page.tsx
├── layout.tsx
├── globals.css
├── manifest.ts
└── sw.ts (service worker)

components/
├── ui/           # shadcn/ui components
├── scoring/      # Scoring-specific components
│   ├── Scoreboard.tsx
│   ├── BallButtons.tsx
│   ├── PlayerCard.tsx
│   ├── BowlerCard.tsx
│   ├── OverTimeline.tsx
│   ├── WicketModal.tsx
│   └── MilestoneCelebration.tsx
├── matches/      # Match components
├── teams/        # Team components
├── players/      # Player components
└── shared/       # Layout, Navbar, Sidebar, etc.

hooks/
├── useSocket.ts
├── useMatchState.ts
├── useScoring.ts
└── useOfflineSync.ts

lib/
├── api.ts        # Axios instance + API methods
├── socket.ts     # Socket.io client setup
├── utils.ts      # cn() helper, formatters
└── constants.ts  # App constants

stores/
└── useStore.ts   # Zustand store

types/
└── index.ts      # TypeScript interfaces

public/
├── icons/        # PWA icons
└── sounds/       # Boundary, wicket sounds

🎯 SUCCESS CRITERIA

A scorer can create a match and start scoring in < 30 seconds

Ball entry response time < 100ms (UI feels instant)

Scorecard updates in real-time for all spectators

App works offline — queue balls, sync when online

Installable PWA on iOS and Android

Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)

Responsive across all device sizes

Dark mode is beautiful and default

Animations feel premium, not distracting

Zero external paid dependencies

⚠️ IMPORTANT NOTES

No paid services: Do NOT use Firebase, Auth0, Stripe, or any SaaS. Everything must be self-hosted.

API is ready: The backend API is already built (Node.js/Express). Just connect to it.

TypeScript strict: All components must be fully typed. No any types.

Error handling: Every API call must have loading, error, and empty states.

Mobile-first: The primary user is a scorer holding a phone on the field.

Accessibility: All buttons must have aria-labels, color contrast ≥4.5:1

Build this as a single, cohesive, production-ready Next.js application. Make it feel like a premium sports app — smooth, fast, and delightful to use.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6bd1e309-0bde-489e-a42e-03e20b78382c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
