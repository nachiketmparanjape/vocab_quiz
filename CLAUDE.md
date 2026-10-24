# Vocab Quiz — agent context

> **Purpose:** OPERATE — an AI agent working in this repo reads this
> first: how to run, deploy, and not break the app. Product facts
> live in `docs/` and are linked, never copied here.
> **Last verified:** 2026-10-24 (Doc Sprint 1) — created in this
> sprint; the other studio products already had one.

## Read first

- What the app does and why: [`docs/PRODUCT.md`](docs/PRODUCT.md)
- Scope and non-goals: [`docs/VISION.md`](docs/VISION.md)
- Waiting work: [`docs/BACKLOG.md`](docs/BACKLOG.md)

## The app in two lines

A standalone vocabulary trainer: import your own word lists by CSV,
get quizzed (flashcards + multiple choice) on an SM-2 spaced
schedule, watch words climb new → learning → familiar → mastered.
React + Vite SPA on Vercel; Firebase Auth (Google) and Firestore;
custom CSS (no Tailwind); installable PWA.

## Run / deploy

```bash
npm install
npm run dev     # Vite dev server
npm run build   # production build (known: one ~614 KB chunk — PC-V3 tracks the split)
```

Deploys are hosted on Vercel from `main`; GitHub auto-deploy is not
yet connected (PC-V1 tracks it). Live (canonical):
https://vocabquiz-lake.vercel.app

Firebase config lives in the app's Firebase client setup — point it
at your own Firebase project (Authentication + Firestore) to run an
instance.

## Gotchas

- **Standing question: this app may merge into Fluencia** (PC-F3 in
  Fluencia's backlog). Until that is decided: maintenance, not new
  features — and keep this repo's docs self-contained so a merge (or
  a decision to stay standalone) costs nothing extra.
- **No AI-generated content, by design** — words are user-supplied.
  That is a VISION non-goal, not a missing feature.
