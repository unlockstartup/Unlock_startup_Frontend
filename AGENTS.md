# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

**Unlock Startup** — a Next.js 16 (App Router) marketing + platform site for a startup ecosystem. Public-facing pages (home, blogs, events, competitions, investors, jobs, products, services) plus a "publisher" back-office area for logged-in users to manage their listings.

## Tech Stack

- **Framework**: Next.js ^16.2.2 (App Router, JS/JSX — no TypeScript)
- **UI**: React 19, Bootstrap 5 (+ bootstrap-icons), custom CSS per page/section
- **HTTP**: axios (`src/app/api.js` — shared instance with auth interceptor)
- **State**: React Context (`src/context/AuthContext.jsx`) + local component state; no Redux/Zustand
- **Other libs**: react-select, react-toastify (notifications), recharts (charts), swiper (carousels), date-fns, wowjs, @fancyapps/ui, lucide-react (icons)
- **Linting**: ESLint 9 flat config (`eslint.config.mjs`, `next lint`)
- **Path alias**: `@/*` → `./src/*` (see `jsconfig.json`)

## Structure

```
src/
  app/                  # Next.js App Router — one folder per route
    <route>/page.jsx    # page component; [id] = dynamic segment
    <route>/*.css        # route-scoped stylesheets (imported directly in the page)
    api.js               # shared axios instance (adds Bearer token from localStorage)
    apiServices/         # thin per-domain API wrapper modules (auth, uploads, fundingcalls, ...)
    publisherapi.js       # axios instance/helpers for the publisher back-office
    constants.js          # shared constants (e.g. INDIA_STATES)
    layout.js             # root layout: fonts, global CSS, AuthProvider, ConditionalShell, CookieBanner
    publisher/             # authenticated back-office section (own layout.jsx, own styles/)
  components/
    home/                 # homepage-only sections (hero, testimonials, job listings, etc.)
    uiElements/            # generic reusable UI (cards, modals, dropdowns, accordions)
    navbar/, footer/, breadcrumb/, error404/, notFound/, bootstrapjs/
    ConditionalShell.jsx    # hides Navbar/Footer under /publisher routes
  context/AuthContext.jsx   # user/login/logout, backed by localStorage ("user", "user_token")
  data/                     # static mock/display data (e.g. navLinksData, jobsData) — not API-driven
public/assets/               # css, fonts, images used via next/font/local and direct imports
```

## Conventions

- **Routing**: file-based via `src/app`; dynamic routes use `[id]` folders (blogs, events, competitions, investors, jobs, products, services, publisher/submissions).
- **Client vs server components**: most interactive components start with `"use client"` (forms, context consumers, anything using hooks/browser APIs). Keep components server components by default unless they need interactivity.
- **Styling**: Bootstrap classes for layout/grid; each route or major section typically ships its own scoped `*.css` file imported directly into the page/component. No CSS-in-JS or Tailwind.
- **API calls**: use the shared `api` instance from `src/app/api.js` (public/general endpoints) or `publisherapi.js` (publisher back-office); don't instantiate new axios clients. Auth token is read from `localStorage.getItem("user_token")` and injected as a Bearer header via interceptor.
- **Auth**: `useAuth()` from `src/context/AuthContext.jsx` exposes `{ user, login, logout, loading }`. `login(userData, token)` writes `user_token` and `user` to localStorage; state is refreshed via the `storage` event across tabs.
- **Publisher area**: everything under `/publisher/*` is treated as authenticated back-office and is rendered without the public Navbar/Footer (see `ConditionalShell.jsx`); it has its own `layout.jsx` and `styles/` folder.
- **Env vars**: API base URL comes from `NEXT_PUBLIC_API_BASE_URL`, falling back to a hardcoded DigitalOcean app URL — check `.env.local` before assuming which backend is targeted.

## Commands

```bash
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # run production build
npm run lint    # ESLint via `next lint`
```

There is no test suite configured in this repo currently.

## Notes for Agents

- No TypeScript — don't introduce `.ts`/`.tsx` files or type annotations unless asked.
- Match existing patterns: plain functional components, hooks, Bootstrap classes, per-page CSS files, axios via the shared instances.
- When adding a new public route, mirror an existing simple route (e.g. `src/app/faq/page.jsx`) for structure; for publisher routes, mirror an existing folder under `src/app/publisher/`.
- Reusable presentational pieces go in `src/components/uiElements/`; homepage-only sections go in `src/components/home/<section>/`.
