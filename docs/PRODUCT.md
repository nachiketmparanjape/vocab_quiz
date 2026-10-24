# Vocab Quiz — product doc

> **Purpose:** ORIENT — a human or AI picking Vocab Quiz up cold reads
> this to know what the app does now, why, and where things live.
> **Earns its place if:** a cold reader can start work from it
> without reading the code first.
> **Owner:** Bramble (PM). **Status:** living.
> **Last verified:** 2026-10-24, against the repo and the live app
> (Doc Sprint 1).

Living reference for humans and AIs picking up this project: what the product
does, grouped by capability, and *why* each exists. Deliberately not verbose.

## Maintaining this doc (read before editing)
- **Revise, don't append.** When a capability changes, rewrite its bullet in
  place. This doc always describes the product *as it is now* — never as a
  history of how it got here.
- **Capabilities, not paper cuts.** Group by what the user can do, not by
  sprint or PR. A paper cut that extends an existing capability edits that
  capability's bullet; only a genuinely new capability earns a new section.
- **Every bullet earns its place with a why.** One line. If you can't say
  why, it doesn't belong here yet.
- **History lives elsewhere.** Per-update detail goes in `SHIPPED.md` and
  sprint plans — never duplicated here.
- **Research ends in a decision, kept compact.** Open topics get findings;
  findings get a decision, even "don't build it." Decided topics stay as a
  short record — question, key findings, decision — so the reasoning remains
  visible.

Not a changelog — per-update history lives in `SHIPPED.md` and the sprint
plans under `sprints/`. If something here disagrees with those, this doc wins
and the history is just history.

## What it is

A standalone vocabulary trainer: upload your own word lists, get quizzed
with spaced repetition. Two modes — flashcards and multiple-choice — with
mastery tracking per word (new → learning → familiar → mastered). The review
session is the core loop — open, clear your due words, watch mastery grow.
Full scope and non-goals: `VISION.md`.

## Tech

React + Vite SPA on Vercel; Firebase Auth (Google sign-in), Firestore;
custom CSS (no Tailwind). SM-2 spaced-repetition algorithm
(`src/utils/srs.js`); quiz engine (`src/utils/quizEngine.js`); CSV import
via PapaParse.

## Capabilities

### Word lists
- **CSV word upload + manual word lists.** Why: vocab is personal — the
  fastest way to start is importing the list you already have, not typing
  words one by one.

### Quizzing (the core loop)
- **Two modes: flashcard and multiple-choice quiz.** Why: recognition
  (flashcard) and recall-under-pressure (quiz) train different retrieval
  paths; setup screen picks mode + word count.
- **SM-2 spaced repetition** (`processAnswer`): correct answers stretch the
  interval by the ease factor (quality-adjusted: easy/hard/normal);
  incorrect answers reset repetitions and schedule immediate review. Why:
  review at the point of forgetting beats fixed schedules.
- **Mastery levels per word** — new / learning / familiar / mastered, with
  color coding on the dashboard. Why: a 500-word list is overwhelming; four
  buckets make progress legible.

### Dashboard
- **Mastery overview + review stats.** Why: the scoreboard for the review
  loop — what's due, what's mastered.

## Open research topics

- **Merge into fluencia?** — fluencia already has vocab SRS with lesson
  integration. This app's distinctive assets are CSV import and the
  flashcard/quiz UI. Decision: port those into fluencia and retire this, or
  keep it as the lightweight standalone. (Seeded 2026-10-09; mirrored in
  fluencia's research topics.)

## Key files

- `src/utils/srs.js` — SM-2 implementation, mastery levels
- `src/utils/quizEngine.js` — word selection, question generation, quiz modes
- `src/components/WordUpload.jsx` — CSV import
- `src/components/Quiz.jsx`, `QuizSetup.jsx` — the quiz flow
- `src/components/Dashboard.jsx` — mastery overview

## Source of truth

- GitHub: https://github.com/nachiketmparanjape/vocab_quiz
- Local: `~/workspace/vercel-recovery/vocab_quiz`
- Docs: this product's documents live in the repo under `docs/`;
  the studio folder `~/workspace/studio/products/vocab_quiz` is a
  symlink to it.
- Deployed: https://vocabquiz-lake.vercel.app (canonical; title-verified by fetch 2026-10-24)
