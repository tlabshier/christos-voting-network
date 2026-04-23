# CVN — Christos Voting Network: Operating System

**Status:** Provisional. This file restores the original `README.md` content from commit `3adaa73` (pre-smoothing, April 19, 2026) so the Voting Network sub-project has a peer-equivalent operating system document alongside CCR, CEA, CHR, CHS, and CNL. The content below is currently developer-setup documentation for the live Voting Network application rather than a full operating-system specification in the style of the other sub-projects' OS docs.

**To do:** Rewrite this file as a proper operating system — covering the module's theological framing, the 11-tradition analysis schema, the vote-dimension philosophy, the Founders Vision filter as it applies to political/cultural issue selection, and the relationship between CVN and the broader Christos ecosystem. For now, it preserves the original developer-facing content so the repo layout is consistent and the Voting Network is a named sub-project.

**See also:**
- `CLAUDE.md` at repo root — authoritative repo-mechanical reference for Claude instances working on the CVN application (services, routes, schemas, prompt builder, pinned model string)
- `README.md` at repo root — condensed CVN setup section for quick reference
- `MODULES.md` at repo root — CVN's entry in the master module inventory

---

# Christos Voting Network

A spectrum-based worldview and bias assessment tool. Users vote on current events, political topics, and cultural/religious issues using a sliding scale. Responses are analyzed by the Claude API to show alignment with biblical standards and various ideological perspectives.

Part of the Christos Ecosystem (alongside MyCounselor, Crosscheck, and Christos Council).

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js / Express
- **Database:** SQLite (via better-sqlite3)
- **AI:** Claude API (claude-sonnet-4-20250514)

## Setup

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

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/issues | List active issues |
| GET | /api/issues/:id | Get single issue |
| POST | /api/votes | Submit vote + get Claude analysis |
| POST | /api/admin/issues | Create new issue (admin) |
| PUT | /api/admin/issues/:id | Update an issue (admin) |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/  # VotingSlider, IssueCard, ResultsDisplay
│       ├── pages/       # HomePage, VotePage, ResultsPage, AdminPage
│       └── hooks/       # useVote
├── server/          # Express backend
│   ├── services/    # claudeService, voteService, issueService
│   ├── controllers/ # Route handlers
│   ├── routes/      # API routes
│   ├── utils/       # promptBuilder, responseParser
│   └── db/          # SQLite schema + seed data
└── shared/          # Future shared constants
```

---

## Provenance

This document's body (from "Christos Voting Network" downward) is the verbatim original content of the repo's root `README.md` as of commit `3adaa73` (April 19, 2026), restored here at Thomas's request after the root README was overwritten during the pass-1 repo-smoothing commit `34407d3`.
