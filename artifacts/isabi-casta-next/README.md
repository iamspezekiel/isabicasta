# IsabiCasta — Next.js

A lightweight, open-source, browser-only tool for deciding when you are stuck,
inspired by the biblical practice of casting lots.

**It works entirely in your browser.** No account, no ads, no analytics, no
backend, and no network request is ever made to arrive at a decision. Everything
you enter stays on your device.

## What it does

- **Onboarding** — a six-slide introduction to the biblical basis for casting
  lots, with Skip always available. Completion is remembered locally, and a
  refresh mid-intro resumes where you left off.
- **Flip a Coin** — a fair binary flip with two labellings: **Yes / No** and the
  classic **Heads / Tails**, switched just above the coin. Decide against
  `crypto.getRandomValues`, never `Math.random` alone.
- **Cast Lots** — enter your options one per line and draw one. Live validation
  requires at least two options before the draw is allowed.
- **A result you can act on** — the outcome, a reserved acknowledgement and a
  Try again action. Editing your options preserves what you typed.
- **Recent activity** — a dense, day-grouped record kept in `localStorage`
  (capped at 50 entries), with an inline confirmation before it is cleared.
- **How it works** — what is stored, where, and the real state of offline
  access.

The app states plainly that it does **not** claim a random result reveals God's
specific will. That disclaimer is on the last intro slide and is always
reachable later from **How it works**.

## Offline

A hand-written service worker (`public/sw.js`) precaches the app shell, serves
navigations network-first with a cached fallback, and serves hashed build assets
stale-while-revalidate. The **How it works** screen reports the *actual* state —
ready, preparing or unavailable — measured from Cache Storage rather than
assumed from `navigator.onLine`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, with the design tokens declared in `app/globals.css`
- `next-themes` for the light/dark switch (class strategy)
- `@tabler/icons-react` for line icons
- Google Fonts via `next/font` — Source Serif 4 for the voice, Inter for the UI

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Structure

```
app/
  layout.tsx          Fonts, metadata, theme provider
  globals.css         Design tokens (light + dark), motion
  (app)/
    layout.tsx        Onboarding gate + offline provider
    page.tsx          Home — the two actions
    coin/page.tsx     Flip a coin, both labellings
    lots/page.tsx     Cast lots, options and result
    history/page.tsx  Recent activity
    local/page.tsx    How it works
components/           UI primitives and screen pieces
lib/                  Randomness, storage, copy, formatting
hooks/                useHistory, useOfflineStatus
public/               Service worker, manifest, icon
```

## Notes

- Every `localStorage` access is wrapped so that disabled storage or a corrupt
  value degrades quietly instead of throwing.
- Dark mode is a re-toning of the same identity, not a second design. The coin
  keeps its gold faces in both themes.
- Motion only ever reports state and only animates `transform`/`opacity`.
