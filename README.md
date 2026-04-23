# Renaissance Ministries

Public repository for the Renaissance Ministries content ecosystem and the Christos Voting Network application. The working name for the broader project is **Christos Civitas**; this is provisional and may change pending fellowship debate.

Sister repository: [Hyperphysics-Institute/CPP](https://github.com/Hyperphysics-Institute/CPP).

---

## What this repo contains

Two layers sharing one tree:

**1. The Christos content ecosystem** — a set of parallel sub-project folders, each prefixed with a 3-letter code, holding operating-system documents, articles, and reference material. No sub-project is subordinate to another; they each serve the same underlying aim (Kingdom-of-Heaven culture) from a different angle.

**2. The Christos Voting Network application** — a production React + Express + SQLite + Claude API app that lets users vote on issues via sliding scales and returns Claude-generated multi-tradition worldview analyses. Lives in `/client` and `/server`, deployed on Render. It is **one module among many**, not the root of the repo.

---

## Modules

The Christos family currently comprises **17 modules** (6 in this repo, 11 spec-drafted or planned), organized as parallel sub-projects rather than a hierarchy. Each addresses the same aim — manifesting a Kingdom-of-Heaven culture — from a different angle.

**The authoritative inventory lives in [`MODULES.md`](./MODULES.md).** Every other document in this repo that references modules should link there rather than maintain its own list.

**Currently in the repo:**

| Code | Name                           | Purpose (one line)                                                        |
|------|--------------------------------|---------------------------------------------------------------------------|
| CCR  | Christos Conspiracy Review     | Rigorous examination of coordinated-influence claims.                     |
| CEA  | Christos Economic Annex        | Economic analysis through a Kingdom lens.                                 |
| CHR  | Christos Historical Review     | Christian and political history examined against Kingdom principles.      |
| CHS  | Christos Home School           | Educational content and lecture processing.                               |
| CNL  | Christos Newsletter            | Daily-issue newsletter with Summarize-Comment-Refer analyses.             |
| CVN  | Christos Voting Network        | Slider-based worldview voting app (`CVN_christos_voting_network/` OS doc + `/client` + `/server` app). |

**Eleven additional modules** — Seminar, Cross-Check, Logos, Commons, Group Leader, Counselor, Professional Module, Diagnostician, Medical Testimony, Life, Council — are spec-drafted or planned. See [`MODULES.md`](./MODULES.md) for full status.

---

## Shared templates and framework documents

`templates/` holds cross-cutting operating-system documents that govern how content is produced across all sub-projects:

| File                                         | Purpose                                                          |
|----------------------------------------------|------------------------------------------------------------------|
| `Christos_AI_Theological_Grammar_v1.3.md`    | Foundational theological framework — the grammar of the ecosystem. |
| `RM_Kingdom_Wisdom_Database_Vision.md`       | Architecture: how all content fits into a coherent worldview.    |
| `RM_wisdom_database_operating_system.md`     | Generation, storage, and evolution of the Wisdom Database.       |
| `CNL_newsletter_operating_system.md`         | Rules and template for the daily newsletter.                     |

---

## Founders Vision archive

`founders_vision/` holds the founding vision of Renaissance Ministries in three complementary forms: `founders_vision.md` (the curated theological-intuitions summary), dated seed entries (the raw chronological record), and `founders_quotes/` (topical quote collections, stubbed). See `founders_vision/README.md` for the folder guide.

---

## Orientation files

- **`RM_bootup.md`** — session-start orientation for humans and Claude sessions. Read this when beginning work on any RM project. Covers the theological core, where everything lives, and session-type workflows.
- **`CLAUDE.md`** — repo-mechanical bootstrap for a fresh Claude (or Claude Code) instance. Terse, code-oriented, lives alongside the app layer.

Pick `RM_bootup.md` for content/ministry work. Pick `CLAUDE.md` for code work on the Voting Network. They cross-reference each other.

---

## Voting Network — quick setup

For detailed development notes on the Voting Network specifically, see `CLAUDE.md`. Short version:

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your CLAUDE_API_KEY

# Start both servers (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

**Tech stack:** React + Vite (frontend), Node.js / Express (backend), SQLite via better-sqlite3 (database), Claude API (`claude-sonnet-4-20250514`, pinned intentionally).

**Core API endpoints:**

| Method | Path                      | Description                                     |
|--------|---------------------------|-------------------------------------------------|
| GET    | /api/issues               | List active issues                              |
| GET    | /api/issues/:id           | Get single issue                                |
| POST   | /api/votes                | Submit vote + get Claude analysis               |
| POST   | /api/admin/issues         | Create new issue (admin)                        |
| PUT    | /api/admin/issues/:id     | Update an issue (admin)                         |

---

## Hosting

Content from this repo is published at [www.renaissance-ministries.com](https://www.renaissance-ministries.com) and its sub-project subdomains. Isak handles deployment. The repo is public; every contributor writes with the awareness that commits are a permanent public record.

---

*"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105*
