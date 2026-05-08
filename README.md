# MKDiaspora

The trusted global Macedonian network — warm introductions, professional networking, diaspora opportunities, mentorship, and local communities.

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Primitive UI components (Button, Badge, Avatar, Input…)
│   ├── layout/      # AppLayout, Sidebar, Header — app shell
│   └── shared/      # Cross-feature components (PlaceholderPage, etc.)
│
├── features/        # One folder per product area
│   ├── auth/        # Login, Signup, onboarding
│   ├── dashboard/   # Personalized home
│   ├── explore/     # Member directory + globe
│   ├── hubs/        # Local diaspora hub pages
│   ├── intros/      # Warm introduction requests
│   ├── opportunities/ # Jobs, investments, co-founders, mentorship
│   ├── events/      # In-person and virtual events
│   └── profile/     # Public user profiles
│
├── hooks/           # Shared React hooks (useApi, useDebounce, etc.)
├── lib/
│   ├── api.ts       # SINGLE gateway to all data — import from here only
│   ├── mock/        # Mock data files — never imported directly by components
│   └── utils.ts     # calculateTier(), formatters, cn()
│
├── routes/          # createBrowserRouter route tree
├── stores/          # Global state (Zustand stores — added in Phase 1)
├── styles/
│   └── globals.css  # Tailwind + global resets
├── types/
│   └── index.ts     # All TypeScript types — single source of truth
│
├── App.tsx
└── main.tsx
```

## Architecture Rules

- **Features import from shared layers only.** A feature may import from `@/components`, `@/lib`, `@/hooks`, and `@/types`. It must not import from another feature.
- **All data access goes through `src/lib/api.ts`.** Components and features never import from `src/lib/mock/` directly.
- **Types live in `src/types/index.ts`.** No inline type definitions in components.
- **Supabase-ready.** The `api.ts` mock implementations are the only thing that changes when the backend is wired up.

## Trust Tier System

| Tier        | Score Range | Color  |
|-------------|-------------|--------|
| Explorer    | 0–39        | Muted  |
| Connector   | 40–69       | Blue   |
| Ambassador  | 70–89       | Red    |
| Pillar      | 90–100      | Gold   |

Calculated by `calculateTier(trustScore)` in `src/lib/utils.ts`.

## Tech Stack

- **React 18** + **TypeScript 5** via **Vite 5**
- **Tailwind CSS 3** — custom design tokens in `tailwind.config.js`
- **Framer Motion** — page and component animations
- **Lucide React** — icon set
- **react-router-dom v6** — file-based-style route tree
- **react-globe.gl** + **Three.js** — 3D globe (Explore page, Phase 1)

## Development

```bash
npm run dev      # start dev server
npm run build    # TypeScript check + production build
npm run preview  # preview production build
```

## Implementation Phases

| Phase | Scope |
|-------|-------|
| **0 (current)** | Foundation — architecture, types, mock data, routes, layout |
| **1** | Core pages — Globe/Explore, Dashboard, Hubs, Opportunities, Events, Profile |
| **2** | Trust system — Intros, Tier display, Trust score, Connections |
| **3** | Auth — Supabase auth, onboarding flow, protected routes |
| **4** | Backend — Supabase tables, RLS, real API calls replacing mocks |
| **5** | Polish — mobile layout, animations, loading states, empty states |
