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
