# Vocab Quiz — backlog

> **Purpose:** TRACK — the waiting work for this product: every
> card here is real, unshipped, and pullable into a sprint.
> **Earns its place if:** sprint planning can pull from it without
> re-verifying that cards are still true.
> **Owner:** Bramble (PM). **Status:** living.
> **Last verified:** 2026-10-24 (Doc Sprint 1).

Paper-cut cards waiting for a sprint. PM-seeded from the 2026-10-09 studio
import (code study, not founder requests) — founder confirms priority at
planning. Note: if the merge-into-fluencia decision goes through, this
backlog dissolves into fluencia's.

_Closed cards leave this file — PC-V2 (README rewrite) shipped
2026-10-11; see `SHIPPED.md`. (Doc Sprint 1, 2026-10-24.)_

---

## PC-V1 — Connect GitHub repo for auto-deploys

**Problem:** Repo exists on GitHub (`nachiketmparanjape/vocab_quiz`, pushed
2026-10-09 from the Vercel recovery) but Vercel isn't watching it.

**In scope:** Vercel project → Settings → Git → connect the repo,
production branch `main`; one test push to verify auto-deploy.
**Out of scope:** any code changes; preview-deploy workflow.

**Done looks like:** a push to `main` triggers a Vercel production deploy
with no laptop involved.
**Size:** S.

---

## PC-V3 — Code-split the JS bundle

**Problem:** Production build emits a single 614 KB JS chunk (190 KB
gzipped); Vite warns it's over the 500 KB limit. Slower first load.

**In scope:** route-level `React.lazy` splits (home / upload / quiz /
dashboard) or `manualChunks` for vendor code.
**Out of scope:** rewriting components; SSR.

**Done looks like:** `vite build` shows no chunk over 500 KB and the app
loads identically.
**Size:** S.

*Seeded 2026-10-09 from the studio debug pass (clean build, chunk-size
warning only).*
