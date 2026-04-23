# CLAUDE.md — Renaissance Ministries (RM) Repository

**Audience:** a fresh Claude instance (Opus, Sonnet, or Claude Code) opening this repo for the first time in a new context window.
**Purpose:** give you enough repo-mechanical context to be immediately useful without Thomas having to re-explain the project.
**Companion file:** `RM_bootup.md` at repo root (higher-level orientation and session-start ritual, same conventions as the CPP repo). Read that one for content/ministry work; this one is strictly repo-mechanical.

---

## 1. What this repo is

Renaissance Ministries (RM) is a public GitHub repository hosting two layers that share a single tree:

1. **The Christos Voting Network application** — a production React + Express + SQLite + Claude API app that lets users vote on issues via sliders and returns Claude-generated multi-tradition worldview analyses. Deployed on Render (see `render.yaml`). Lives in `/client` and `/server`.
2. **The Christos content ecosystem** — a set of sub-project directories holding operating-system docs, articles, and reference material. Each sub-project has its own top-level folder prefixed with a 3-letter code.

The repo is public. You can fetch any file via its raw URL without authentication. Private data (production DB, `.env`, user votes) is never committed — see `.gitignore`.

Sister repository: `github.com/Hyperphysics-Institute/CPP` (the physics corpus). Conventions here mirror CPP's where possible.

---

## 2. How to access this repo

The repo is public, so access is frictionless. Preference order:

- **Single file read** → fetch the raw URL: `https://raw.githubusercontent.com/Renaissance-Ministries/RM/main/<path>`. Use this for targeted reads (one doc, one source file).
- **Whole-repo work** → `git clone https://github.com/Renaissance-Ministries/RM.git` into your sandbox, then grep/browse/build. The sandbox resets between sessions, so re-clone as needed. Use this for cross-file analysis, refactoring, or structural questions.
- **File tree for planning** → ask Thomas to paste `git ls-files` output, or run it yourself after cloning, then fetch individual files as needed without re-cloning.

There is no GitHub MCP connector currently wired up. Treat fetch and clone as the standard access patterns.

---

## 3. Directory layout

```
RM/
├── client/                              # React + Vite frontend
│   └── src/
│       ├── components/                  # VotingSlider, IssueCard, ResultsDisplay, ...
│       ├── pages/                       # HomePage, VotePage, ResultsPage, AdminPage, ...
│       ├── hooks/                       # useVote
│       └── api/                         # client.js (fetch wrapper)
├── server/                              # Express backend
│   ├── index.js                         # entry point
│   ├── config/                          # env.js, database.js
│   ├── controllers/                     # adminController, issueController, voteController
│   ├── routes/                          # issues, votes, admin, shares, questions, synthesis
│   ├── services/                        # claudeService, voteService, issueService, ...
│   ├── utils/                           # promptBuilder, questionGenerator, responseParser
│   ├── middleware/                      # errorHandler, rateLimiter
│   └── db/                              # schema.sql, seed.sql
├── templates/                           # Shared framework and operating-system docs
│   ├── Christos_AI_Theological_Grammar_v1.3.md
│   ├── RM_Kingdom_Wisdom_Database_Vision.md
│   ├── RM_wisdom_database_operating_system.md
│   └── CNL_newsletter_operating_system.md
├── founders_vision/                     # Seed archive (dated, immutable)
│   ├── README.md                        # Archive policies
│   ├── YYMMDD_topic_slug.md             # Seed entries
│   └── founders_quotes/                 # Topical quote collections (stubbed, pending)
├── archive/                             # Superseded documents kept for history
├── CCR_christos_conspiracy_review/      # Sub-project: Conspiracy Review
├── CEA_christos_economic_annex/         # Sub-project: Economic Annex
├── CHR_christos_historical_review/      # Sub-project: Historical Review
├── CHS_christos_home_school/            # Sub-project: Home School
├── CNL_christos_newsletter/             # Sub-project: Newsletter
│   └── articles/                        # YYMMDD_slug.md
├── render.yaml                          # Render.com deployment blueprint
├── package.json                         # npm workspaces root (client + server)
├── .env.example                         # required env vars
├── README.md                            # repo-level overview (public-facing)
├── RM_bootup.md                         # session orientation (content/ministry work)
├── MODULES.md                           # master module inventory (single source of truth)
├── RM_Content_Catalog.md                # inventory of essays and documents
└── CLAUDE.md                            # this file (repo-mechanical / code work)
```

All sub-project folders follow the `{CODE}_{snake_case_name}/` convention. Preserve existing casing and separators when referencing paths; do not silently "normalize" them.

---

## 4. Sub-project code key

| Code | Full name                      | Directory                              |
|------|--------------------------------|----------------------------------------|
| CCR  | Christos Conspiracy Review     | `CCR_christos_conspiracy_review/`      |
| CEA  | Christos Economic Annex        | `CEA_christos_economic_annex/`         |
| CHR  | Christos Historical Review     | `CHR_christos_historical_review/`      |
| CHS  | Christos Home School           | `CHS_christos_home_school/`            |
| CNL  | Christos Newsletter            | `CNL_christos_newsletter/`             |
| CVN  | Christos Voting Network        | `/client` + `/server` (the app itself) |

When Thomas refers to a sub-project by its code, resolve to the directory above. When producing new sub-project content, match the existing naming convention exactly.

**The full Christos module family is larger than what's in this repo** — 17 modules total in the current inventory, of which 6 live here. For the complete list, statuses, and 3-letter codes of modules not yet materialized as folders, see `MODULES.md` at repo root. That file is the single source of truth; do not maintain duplicate lists elsewhere in the repo.

---

## 5. Filename conventions

- **Operating-system docs:** `{CODE}_operating_system.md` at the root of each sub-project folder (e.g., `CCR_operating_system.md`, `CHR_operating_system.md`). Shared/cross-cutting operating-system docs live in `/templates/` — currently the Grammar, Kingdom Wisdom Database Vision, wisdom database OS, and newsletter OS.
- **Newsletter articles:** `YYMMDD_slug.md` under `CNL_christos_newsletter/articles/` (e.g., `260416_25th_amendment_yates.md`). Six-digit date, lowercase slug, underscores.
- **Seed archive entries:** `YYMMDD_topic_slug.md` under `founders_vision/` (e.g., `260419_seed_archive_establishment.md`). Same date/slug convention as newsletter articles.
- **No version suffixes in filenames.** Mirror the CPP rule: the canonical filename stays fixed; version history is tracked in an internal CHANGELOG header inside the file, never as `_v1.1` in the filename. The Grammar file currently carries `_v1.3` as a known exception predating this convention; new files should not.

---

## 6. Key files to read first (by task)

**Claude-integration / AI-behavior work** — the prompts and model output schemas live here, and changes here change what every user sees:
- `server/services/claudeService.js` — model constant (`claude-sonnet-4-20250514`), retry logic, the three API-facing functions (`analyzeVote`, `generateQuestions`, `generateCommunitySynthesis`).
- `server/utils/promptBuilder.js` — the worldview analysis system prompt and JSON schema (11 traditions, pathway signal taxonomy, etc.).
- `server/utils/questionGenerator.js` — custom per-issue question generation.
- `server/utils/responseParser.js` — robust JSON parsing of model output.

**Data-model / schema work:**
- `server/db/schema.sql` — tables: `users`, `issues`, `votes`, `generated_questions`, `community_synthesis`, `shared_results`. Note: `votes` table has multi-axis dimensions (position, agreement, confidence, importance, biblical_alignment_input, framework) plus JSON-encoded analysis fields.
- `server/db/seed.sql` — initial issues and sample data.

**API / routing work:**
- `server/index.js` — Express setup, CORS, static serving in production.
- `server/routes/index.js` — route mounting map.
- Individual route files under `server/routes/`.

**Frontend work:**
- `client/src/App.jsx` — route map.
- `client/src/components/VotingSlider.jsx`, `MultiAxisPoll.jsx`, `WorldviewProfile.jsx` — the core voting UX.
- `client/src/pages/VotingSessionPage.jsx` — session flow orchestrator.

**Content work (newsletters, articles, operating-system docs):**
- The relevant sub-project's `{CODE}_operating_system.md` is the authoritative voice/scope guide for that sub-project. Read it before producing content for that sub-project.
- `templates/RM_wisdom_database_operating_system.md` — the master framework doc describing the Founders Vision corpus that filters all RM content generation. Companion: `templates/RM_Kingdom_Wisdom_Database_Vision.md` (architecture) and `templates/Christos_AI_Theological_Grammar_v1.3.md` (theological grammar).

---

## 7. Operational rules

**Do:**
- Preserve the existing JSON schemas in `promptBuilder.js` and `claudeService.js` exactly unless Thomas asks for a schema change. Downstream parsers and DB columns depend on them.
- Match the voice of existing operating-system docs when drafting new ones — they open with scripture, state intent, state what the project is NOT, then enumerate framework and implementation.
- When adding a new sub-project, follow the `{CODE}_{snake_case_name}/` folder convention and create a `{CODE}_operating_system.md` as its first file.
- Use Thomas's content framing: Kingdom-of-God oriented, multi-tradition-aware, non-partisan-by-standard, epistemologically careful. The Voting Network is explicitly multi-tradition (11 traditions in the alignment scoring); sub-projects vary but share the same underlying Founders Vision corpus.

**Do not:**
- Commit or echo real API keys. `.env` is gitignored. `CLAUDE_API_KEY` in `.env.example` is a placeholder.
- Rename schema fields without updating seed data, parsers, and the frontend consumers — the votes table has 20+ columns and schema changes ripple.
- Change the model string (`claude-sonnet-4-20250514`) casually. It is pinned intentionally for reproducibility of user-facing analyses.
- Assume `RM_bootup.md` exists in every session — read it if present, otherwise this file stands alone.
- Add version suffixes to filenames (see §5).
- Treat this repo as the CPP repo. Content conventions are similar but the tech stack and scope differ; the CPP repo is documentation-only LaTeX/markdown, this one ships a live application.

---

## 8. Ecosystem context (brief)

This repo is one node in a larger Christos / Renaissance Ministries / Hyperphysics ecosystem. Related repos and ventures carry their own context in Claude's memory about Thomas — you do not need this file to re-explain who Thomas is, who his collaborators are, or what CPP is. This file is strictly repo-mechanical.

If you need ecosystem context you don't have, ask Thomas rather than guessing.

---

## 9. Maintaining this file

Update `CLAUDE.md` when:
- A new sub-project code is added (update §3 and §4).
- A filename or directory convention changes (update §5).
- A new "first-read" key file emerges from refactoring (update §6).
- A new operational rule is established across sessions (update §7).

Do not update it for transient project status, personnel changes, or roadmap notes — that belongs in `RM_bootup.md` or in commit messages. This file should change rarely and remain terse.

---

*End of CLAUDE.md*
