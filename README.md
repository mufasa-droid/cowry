# Cowry BRT Lagos — Frontend Pitch Demo

A mobile-first web app (installable as a PWA in future phases) for Lagos BRT commuters. It shows nearby stops and terminals, which buses depart from them, where each bus is headed, regulated flat fares, and wait estimates.

This is a **frontend-only demo** built for a pitch to **Cowry**. It operates with zero backend, zero database, zero authentication, and zero network costs.

---

## Live Screens & Capabilities

1. **Nearby Stops (`/`)**
   - Geolocation detection with graceful fallback to a manual location picker when coordinates are unavailable or access is denied.
   - Stop and terminal cards with distance in km, route counts, and type badges.
   - Quick destination search selector that jumps directly into the trip planner.
2. **Place Departure Boards (`/place/[slug]`)**
   - **Terminals** (e.g. Ikeja): Compact departure board with route rows, flat fares, and dividers.
   - **Stops** (e.g. Ayobo, Iyana-Ipaja): Single featured card highlighting outbound destination and wait estimates.
   - **In-Memory Queue Reporting**: "I'm here: report buses waiting" button expands an accessible inline panel (0 to 5+ count) and immediately updates the route's status to *"updated just now"*.
3. **Route Detail (`/route/[slug]`)**
   - Prominent `#1558B0` flat fare banner with the clear policy: *"Flat fare: same price wherever you get down"*.
   - Vertical stop timeline: Origin (*"Board here"*) → Intermediate stops (*"You can get down here"*) → Destination (*"Last stop"*).
   - Ground-truth ride time disclosure (*"To be confirmed"*).
   - Quick link to view buses waiting at the origin stop.
4. **Trip Planner (`/plan`)**
   - Point-to-point journey finder supporting direct routes and 1-change trips connecting strictly through terminal hubs (e.g. Ikeja).
   - Automatic route ranking by fewest transfers, then lowest total fare.
   - Swap button and full URL query parameter synchronization (`?from=&to=`).
5. **Transparency & Disclosure (`/about`)**
   - **Real**: Regulated fares sourced from the official LAMATA fare list effective 2 March 2026.
   - **Unverified**: Stop progression order, reverse-direction fare assumptions, and Obalende terminal status.
   - **Sample**: Simulated queue counts and headway wait estimates.
6. **Friendly 404 Fallback (`/not-found`)**
   - Custom, accessible not-found screen with quick navigation back to Nearby.

---

## Lagos BRT Business Rules Enforced

- **One Flat Fare**: A route is one direction with a single flat fare. Commuters pay the same fare regardless of where they disembark or whether they sit or stand.
- **Stops vs. Terminals**: Stops serve single feeder routes where buses pick up; terminals are built hubs with multiple connecting routes. Transfers are only allowed at terminals.
- **Queue Freshness**: Waiting bus reports older than 30 minutes or unrecorded routes display *"No recent update"*, never misleading old data.
- **Estimates**: Headway intervals are always explicitly qualified with the word *"estimate"*.
- **Demo Mode**: A visible *"Demo data"* pill is pinned to the header on every screen.

---

## Architecture & Data Layer

Components never import directly from raw data tables. All screens interface strictly with `lib/brt-local.ts`:

```
┌─────────────────────────────────────────┐
│     App Screens (app/**/*.tsx)          │
│   (Nearby, Place, Route, Plan, About)   │
└────────────────────┬────────────────────┘
                     │  Strict Interface
                     ▼
┌─────────────────────────────────────────┐
│           lib/brt-local.ts              │
│ (getNearbyPlaces, getDepartures,        │
│  planTrip, reportQueue, queueLabel)     │
└────────────────────┬────────────────────┘
                     │  Mock / In-Memory
                     ▼
┌─────────────────────────────────────────┐
│           data/brt-data.ts              │
│ (Places, Routes, Fares, Demo Queues)    │
│  *Shaped like future Supabase tables*   │
└─────────────────────────────────────────┘
```

When transitioning to production, `lib/brt-local.ts` can be replaced with Supabase RPCs/tables without modifying any screen components.

---

## Design System & Cowry Tokens

Designed mobile-first with a **390px** target viewport, strict WCAG AA contrast, $\ge 44\text{px}$ touch targets, visible focus outlines, and `prefers-reduced-motion` compliance:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Primary Blue** | `#1558B0` | Buttons, flat fare banners, active highlights |
| **Text Ink** | `#0B1F3A` | Headings, primary labels |
| **Muted Slate** | `#4A5D78` | Subtitles, supporting notes, timestamps |
| **Border Gray** | `#D6E0EE` | Dividers, card borders, form outlines |
| **Footer Strip** | `#EEF3FA` | Prototype disclaimer background |
| **Pill Background** | `#E8F0FB` | Wait estimate pills, "Demo data" badges |

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.20)
- npm 9+

### Verification Suite

```bash
# Run TypeScript type check
npm run typecheck

# Run Next.js ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## Run and Deploy

### Local Commands

```bash
# Clone the repository
git clone https://github.com/mufasa-droid/cowry.git
cd cowry

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Start production server locally (tests service worker and PWA install)
npm run start
```

### Zero Secrets & Environment Variables
- **Secrets**: None. The repository contains zero private keys, API credentials, or database connection strings.
- **Environment Variables**: None required. `NODE_ENV` is handled automatically by Next.js and hosting platforms.
- **Assumptions**: Modern Evergreen browser (Chrome, Safari, Edge, Firefox) with Service Worker and Cache API support. Geolocation is evaluated locally on the client device.

### Deploying to Free Static / Jamstack Hosts

You can deploy this repository directly to free hosting platforms without modifying code or setting environment variables.

#### Option 1: Vercel (Recommended)
1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Import the `cowry` repository (`https://github.com/mufasa-droid/cowry.git`).
4. Framework preset will automatically detect **Next.js**.
5. Leave all Root Directory, Build Command (`npm run build`), and Output Directory settings at default.
6. Leave **Environment Variables** empty.
7. Click **Deploy**. Vercel will build and assign a free `*.vercel.app` domain with automated HTTPS.

#### Option 2: Netlify
1. Sign in to [Netlify](https://www.netlify.com) using your GitHub account.
2. Click **"Add new site"** → **"Import an existing project"** → **GitHub**.
3. Select `cowry`.
4. Netlify will auto-detect Next.js via the `@netlify/plugin-nextjs`.
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Leave **Environment Variables** empty.
6. Click **Deploy cowry**. Netlify will provision a free `*.netlify.app` domain with automated HTTPS.

