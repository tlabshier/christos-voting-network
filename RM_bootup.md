# Renaissance Ministries Session Bootup Guide

**Location:** `/RM_bootup.md` (at repo root)
**Purpose:** Session-start orientation for humans and Claude sessions beginning content work on Renaissance Ministries projects. Read this first. For repo-mechanical / Voting Network app work, read `CLAUDE.md` instead; the two cross-reference each other.
**Last updated:** April 19, 2026

---

## Why read this file

You are beginning a session on the Renaissance Ministries repository. This file gives you, in one place:

1. What RM is and what it's aiming at.
2. Where every important file lives in the repo.
3. The theological core you need in order to produce faithful content.
4. The fellowship community whose voices feed the work.
5. The session types you will likely be asked to do, and how to do them.

If you read this file in full and then ask Thomas "what do you want to work on today?" you will be ready to be useful without him having to re-explain anything.

---

## 1. What Renaissance Ministries is

Renaissance Ministries is a Christian formation project centered on Sunday fellowship discussions and the development of Kingdom culture. The **Christos** family of modules provides AI-assisted Christian formation across many dimensions of life: theological training, Bible study, interfaith engagement, political citizenship, cultural engagement, home schooling, counseling, historical review, and others.

The working name for the broader project is **Christos Civitas**. This is provisional and may change pending fellowship debate; do not bake it deeply into documents yet.

The core insight that drives all of it: **God is everything** — there is nothing that exists apart from God's sustaining consciousness. Evil is not a second principle but the rejection of God's nature by free creatures. This resolves the problem of evil and provides a framework for engaging intellectual objections to Christianity.

**The aim is manifestation, not description.** The archive, the modules, the Voting Network, the newsletter — none of it exists to be a library for readers. All of it exists to feed work that helps bring a Kingdom-of-Heaven culture into being.

---

## 2. How to access this repo

The repo is public. No authentication needed.

- **Single file read:** fetch `https://raw.githubusercontent.com/Renaissance-Ministries/RM/main/<path>`
- **Whole-repo work:** `git clone https://github.com/Renaissance-Ministries/RM.git` into your sandbox, then browse and edit locally. Sandboxes reset between sessions — re-clone as needed.
- **Production website:** https://www.renaissance-ministries.com (Isak handles deployment from the repo).

There is no GitHub MCP connector wired up. Use fetch or clone.

---

## 3. Repository structure

```
RM/
├── README.md                          ← Repo-level overview (public-facing)
├── RM_bootup.md                       ← THIS FILE — session orientation
├── CLAUDE.md                          ← Repo-mechanical bootstrap (AI/code work)
├── MODULES.md                         ← Master module inventory (single source of truth)
├── RM_Content_Catalog.md              ← Inventory of essays and documents
│
├── templates/                         ← Cross-cutting framework documents
│   ├── Christos_AI_Theological_Grammar_v1.3.md
│   ├── RM_Kingdom_Wisdom_Database_Vision.md
│   ├── RM_wisdom_database_operating_system.md
│   └── CNL_newsletter_operating_system.md
│
├── founders_vision/                   ← Founding vision — three complementary forms
│   ├── README.md                      ← Folder guide — what's here and how it relates
│   ├── founders_vision.md             ← Curated summary (theological intuitions, integrated)
│   ├── YYMMDD_topic_slug.md           ← Dated seed entries (raw, immutable)
│   └── founders_quotes/               ← Topical quote collections (stubbed, scope pending)
│
├── archive/                           ← Superseded documents kept for history
│
├── CCR_christos_conspiracy_review/    ← Sub-project: Conspiracy Review
├── CEA_christos_economic_annex/       ← Sub-project: Economic Annex
├── CHR_christos_historical_review/    ← Sub-project: Historical Review
├── CHS_christos_home_school/          ← Sub-project: Home School
├── CNL_christos_newsletter/           ← Sub-project: Newsletter
│   └── articles/                      ← YYMMDD_slug.md issues
│
├── client/                            ← CVN frontend (React + Vite)
├── server/                            ← CVN backend (Express + SQLite)
├── render.yaml                        ← Deployment blueprint
└── package.json                       ← npm workspaces root
```

Each sub-project folder contains a `{CODE}_operating_system.md` at its root.

---

## 4. Module inventory

**The authoritative inventory is `MODULES.md` at repo root.** Read that for the complete list, statuses, 3-letter codes, and categories. Summary:

- **6 in the repo:** CCR (Conspiracy Review), CEA (Economic Annex), CHR (Historical Review), CHS (Home School), CNL (Newsletter), CVN (Voting Network — live app).
- **11 spec-drafted or planned:** Seminar, Cross-Check, Logos, Commons, Group Leader, Counselor, Professional Module, Diagnostician, Medical Testimony, Life, Council.

**Total: 17 modules** in the current picture (count provisional until Thomas confirms). Every module serves the same aim — manifesting a Kingdom-of-Heaven culture — from a different angle. No module is subordinate to another.

For folder paths, operating system files, open questions, and naming conventions, go to `MODULES.md`. Do not maintain a duplicate list in this file — update `MODULES.md` and let the link do the work.

---

## 5. Key files to read first (by task)

**Theological grounding — read before producing any content:**
- `templates/Christos_AI_Theological_Grammar_v1.3.md` — the foundational framework.
- `templates/RM_Kingdom_Wisdom_Database_Vision.md` — how content fits together.

**Content production — read for the specific sub-project:**
- The sub-project's `{CODE}_operating_system.md` — authoritative voice/scope for that project.
- `templates/RM_wisdom_database_operating_system.md` — how curated positions get generated and versioned.
- `templates/CNL_newsletter_operating_system.md` — newsletter template, rules, workflow.

**Source material — read for the founder's intuition:**
- `founders_vision/founders_vision.md` — Thomas's curated theological intuitions (the WHY behind every essay).
- `founders_vision/README.md` — folder guide explaining the three buckets (summary, seed archive, topical quotes).
- `founders_vision/*.md` — dated seed entries (raw, chronological).

**Code work — read `CLAUDE.md` instead of continuing here.**

---

## 6. Session types and how to handle each

| Type                         | Goal                                                       | Procedure                                                                                   |
|------------------------------|------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Fellowship essay**         | Process source material into a discussion essay.           | Get source material → identify key insights → apply the Grammar → produce essay.            |
| **Newsletter issue**         | Produce a daily CNL article from a news item or source.    | Follow `CNL_newsletter_operating_system.md`. Summarize–Comment–Refer. 15–30 min.            |
| **Seed archive entry**       | Preserve a Thomas statement in the Founders Vision archive.| Follow entry structure in `founders_vision/README.md`. Date, attribute, preserve voice.     |
| **Module development**       | Create or refine a Christos module OS doc.                 | Study existing OS docs for format. Open with intent, state what the module is NOT, then framework and implementation. |
| **Grammar update**           | Integrate new insights into the Theological Grammar.       | Draft an update document first, then integrate into the Grammar and bump version.           |
| **Housekeeping**             | Audit and reconcile repo state.                             | Check docs against actual files. Update stale references. Commit small, focused changes.    |
| **Wisdom Database curation** | Convert seeds and fellowship discussions into curated positions. | Follow `templates/RM_wisdom_database_operating_system.md`. Cite seed entries.           |

---

## 7. The seven foundational perspectives

| # | Perspective                    | Core statement                                                         |
|---|--------------------------------|------------------------------------------------------------------------|
| 1 | God as Foundation              | God is the ground of all existence.                                    |
| 2 | Nature of God                  | God is love, truth, beauty, goodness, and life.                        |
| 3 | Evil as Derivative Negation    | Evil has no independent existence; it is rejection of God's nature.    |
| 4 | Present-Tense Living           | Life is lived now — the kingdom is at hand.                            |
| 5 | Love as Identity               | Loving God is living as God — embodying His nature.                    |
| 6 | Self and Other United          | God is both self and other; loving neighbor IS loving God.             |
| 7 | The Joy of God                 | God experiences joy when loved — our love contributes to divine delight.|

---

## 8. Key theological distinctions

| Distinction                  | Meaning                                                                |
|------------------------------|------------------------------------------------------------------------|
| Archetype vs. Instantiation  | God creates categories; creatures create specific acts.                |
| Standard vs. Execution       | Christianity as taught vs. Christianity as practiced.                  |
| Intentional vs. De Facto     | Explicit conspiracy vs. aligned interests producing convergent behavior.|
| Test vs. Testimony           | Legal requirement (prohibited) vs. voluntary declaration (protected).  |
| Coercion vs. Transformation  | Islam's method vs. Christianity's method.                              |
| Body / Soul / Spirit         | Three-tier model of consciousness.                                     |

Full treatment lives in the Grammar (`templates/Christos_AI_Theological_Grammar_v1.3.md`).

---

## 9. The AI team

| AI               | Primary role                                           | How Thomas communicates        |
|------------------|--------------------------------------------------------|--------------------------------|
| Claude Opus      | Primary collaborator — essays, specifications, integration | Direct chat (claude.ai)     |
| Grok (xAI)       | Independent verifier, alternative perspectives         | Pastebin links, direct chat    |
| Copilot (MS)     | Review, framework building                              | Pastebin links, direct chat    |
| Claude Sonnet    | Hostile/adversarial review when needed                 | Prompted via Claude Opus       |

---

## 10. The fellowship community

**Core members:**
- **Thomas Abshier** — Founder, naturopathic physician, theoretical physicist.
- **Susan** — Discernment, caution about AI, Holy Spirit emphasis.
- **Charlie Gutierrez** — Practical wisdom. "Artificial begins with art."
- **Isak** — Technology perspective, deployment lead. "Tool until proven otherwise."
- **Armond Boulware** — Strategic advisor. "God can work through AI."
- **Leonard** — Regular participant.
- **Michael Sherman** — 60-year friend, philosophical challenger.
- **Margo** — Thomas's wife; research and political analysis.

**Meeting schedule:** Sunday mornings via Zoom. Fellowship + Bible study + current events discussion.

---

## 11. Conventions

**Filenames:**
- Fellowship essays: `Fellowship_Discussion_[Topic]_[Month][Year].md`.
- Newsletter articles: `CNL_christos_newsletter/articles/YYMMDD_slug.md`.
- Seed entries: `founders_vision/YYMMDD_topic_slug.md`.
- Operating systems: `{CODE}_operating_system.md` at sub-project root.
- **No version suffixes in filenames.** The canonical filename stays fixed; version history is tracked in an internal CHANGELOG header inside the file. The Grammar file currently carries `_v1.3` as a known exception predating this convention; new files should not.

**Scripture:** King James Version preferred. Book Chapter:Verse format (e.g., John 3:16).

**Formatting:** Markdown for text documents. HTML for technical specifications requiring CSS styling. PDF for final distribution.

**Folder names:** Sub-projects use `{CODE}_{snake_case_name}/`.

---

## 12. What to update after every session

| Document                                          | What to update                                       |
|---------------------------------------------------|------------------------------------------------------|
| `templates/Christos_AI_Theological_Grammar_v1.X.md` | New insights, distinctions, key quotes.            |
| `RM_Content_Catalog.md`                           | New essays, specifications, articles.                |
| `founders_vision/`                                | New seed entries as the founder speaks them.         |
| `README.md` / `RM_bootup.md` / `CLAUDE.md`        | Only for structural changes, not transient status.   |

Do not update orientation docs for transient session state. Session state lives in commit messages and in the `founders_vision/` seed archive.

---

## 13. Key quotes for reference

### On the central axiom
> There is nothing which exists that is not of God, from God, in God, made by God, sustained by God, and ultimately returning to God.

### On evil
> Evil was not created as a positive thing. Evil is the logical complement of good, arising necessarily when good is defined.

### On AI
> Artificial begins with the word art. It's a creation of man, a thing we've made with our own hands. — Charlie

### On heart transformation
> All of this is completely for nothing if the heart transformation isn't there.

### On the fire
> A passionless Christianity cannot survive contact with a passionate Islam.

### On testimony
> We reject this idol. We name the Name. We testify. And we invite scrutiny.

---

## 14. Connection to CPP

Renaissance Ministries and the Conscious Point Physics (CPP) project are interconnected:

- **CPP provides the ontological ground** — reality is constituted by conscious points (God's mind).
- **RM provides the ethical/spiritual application** — how to live in alignment with that reality.
- **The Absolute Standard** — CPP demonstrates that morality is not preference but ontology.

When CPP is referenced in RM discussions, the key insight is:

> "In Him we live and move and have our being" (Acts 17:28) is not metaphor — it is ontological description.

For CPP details, see the CPP repository and its own `bootup.md`.

---

## 15. Quick-start checklist for a new session

1. Read this file in full.
2. Read the Grammar if you haven't this week: `templates/Christos_AI_Theological_Grammar_v1.3.md`.
3. If the task involves a specific sub-project, read its `{CODE}_operating_system.md`.
4. Check `founders_vision/` for the most recent seed entries — that's where Thomas's latest thinking lives.
5. Ask Thomas: "What would you like to work on today?"
6. Work. Cite sources. Preserve voice. Commit small and often.
7. Before closing: if the session produced a substantive new idea from Thomas, propose filing it as a seed archive entry. If it refined the theological framework, propose a Grammar update.

---

*This file is self-sufficient. A new AI reading ONLY this file knows what Renaissance Ministries is, where everything lives, what to read next, who the community is, what the key concepts are, and what to do. For the complete theological framework, read the Grammar. For the architecture, read the Kingdom Wisdom Database Vision. For code work, read CLAUDE.md.*

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
