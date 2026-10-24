# Vocab Quiz — personal vocabulary that sticks

**Live app: https://vocabquiz-lake.vercel.app**

## The idea

Learn the words you actually need — not a textbook's list.

Vocab Quiz takes your own word list (imported from a CSV), quizzes you on
a spaced schedule, and tracks every word as it climbs from new to mastered.
Five minutes a day, and the dashboard shows the pile of "mastered" words
growing week over week.

## What the current version does

- **CSV import** — bring your own word lists; no pre-built packs
- **Two study modes** — flashcards and multiple-choice quizzes, with a
  configurable number of words per session
- **SM-2 spaced repetition** — review intervals adapt per word, with
  ease-factor adjustment based on how well you recalled it
- **Mastery levels** — every word moves new → learning → familiar →
  mastered, tracked per word
- **Dashboard** — your vocabulary's progress at a glance
- **Google sign-in** — your lists and progress follow you

## Tech stack

- **Framework:** React + Vite
- **Auth & database:** Firebase Authentication (Google) and Cloud Firestore
- **PWA:** vite-plugin-pwa (installable, offline shell)

## Run it locally

```bash
npm install
npm run dev   # Vite dev server
```

Firebase config lives in the app's Firebase client setup — point it at your
own Firebase project (Authentication + Firestore) to run your own instance.

## Deployment

Hosted on Vercel from this repo's `main` branch.

## Status

Standalone for now. A merge into its sibling app
[Fluencia](https://github.com/nachiketmparanjape/fluencia) (which has its
own vocab system) is under consideration — until that's decided, this repo
gets maintenance, not new features.

## Documentation

The product's working documents live in [`docs/`](docs/):

- [`docs/VISION.md`](docs/VISION.md) — purpose, scope, non-goals
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — what the current version does, and why
- [`docs/BACKLOG.md`](docs/BACKLOG.md) — waiting work
- [`docs/SHIPPED.md`](docs/SHIPPED.md) — per-update history
- [`CLAUDE.md`](CLAUDE.md) — agent context: run/deploy, gotchas

---

Part of a one-person studio building focus tools for scattered brains —
small apps, each built around one daily loop.
