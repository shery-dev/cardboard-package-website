# CardboardPackage AI context

This directory is the durable handoff for work on CardboardPackage. It was created from source and live-site inspection on 2026-10-15. It is not a substitute for verifying source before edits.

## Recommended reading order

1. `../../AGENTS.md` — operating rules and mandatory updates.
2. `MEMORY.md` — durable constraints and high-priority findings.
3. `TASKS.md` — approved roadmap and current status.
4. `SESSION_HANDOFF.md` — latest work and next action.
5. `PROJECT_OVERVIEW.md` and `PROJECT_STRUCTURE.md` — product scope and location guide.
6. `ARCHITECTURE.md` — data, API, auth, cart, checkout, and 3D flows.
7. `UIUX.md` — approved visual direction and current assessment.
8. `DECISIONS.md` — decisions already made and their rationale.

## Source of truth

- Runtime implementation: `app/`, `components/`, `context/`, `lib/`, and `app/api/v1/`.
- Persistent local data: `data/cardboard.db` (SQLite WAL) and `public/uploads/`.
- Static visual assets and 3D models: `public/`.
- Repository docs may be stale. In particular, root `README.md` still claims active MongoDB/NextAuth usage, while active app routes use SQLite and custom JWT admin login. See `ARCHITECTURE.md`.

## Maintenance

Use the workflow in `../../AGENTS.md` after meaningful work. Do not put secrets, admin credentials, tokens, customer data, or raw database records here.
