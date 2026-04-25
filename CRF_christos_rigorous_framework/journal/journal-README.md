# CRF Session Journal

**Purpose:** A CPP-style record of CRF sessions in two complementary streams. Each session leaves both a *raw transcript* (the live conversation, preserved verbatim) and a *synthesized summary* (the structured account that distills decisions, deliberation, and open threads). The two streams together preserve both the working substance and the considered conclusion.

---

## Folder layout

- `summary/` — synthesized session summaries. Distilled deliberation, key decisions, voice of the collaboration, open threads. Read first when picking up the project after time away.
- `transcript/` — raw conversation transcripts from the working sessions. The source material from which the summaries were drawn. Optional context; useful when a summary's reasoning needs to be traced back to its working source.
- `journal-README.md` — this file.

Both subdirectories use the same filename convention.

---

## Filename convention

`YYMMDD_NN-Topic_words.md`

- `YYMMDD` — six-digit date (e.g., `260419` = April 19, 2026).
- `_NN` — two-digit sequence number within the day (`_01`, `_02`, ...). Underscore separator.
- `-` — hyphen separator before the topic.
- `Topic_words` — short descriptive topic, multi-word topics joined by underscores. Capitalize the first letter of each word.

Examples:
- `260419_01-CRF_establishment.md`
- `260423_01-CRF_Development.md`
- `260423_02-Voice_development.md`

---

## Why two streams

The April 19 summary entry states the purpose of journaling directly:

> *"Its purpose is not to summarize what was committed — the commits themselves do that — but to preserve the reasoning, the voice of the collaboration, the tensions that had to be resolved, and the proposal for the future direction of the project that emerged at the end. The next Claude session reading this should come away knowing not just what was decided but how it was decided, and what the two of us were wrestling with when we made each call."*

Summaries serve that purpose. Transcripts serve a different and complementary one — they preserve the actual deliberative work, in voice, before any synthesis was imposed. A summary distills; a transcript witnesses. Both are valuable; neither replaces the other. When a future session needs to understand why a CRF axiom was defended a particular way, the summary will usually answer; when the summary itself is in question, the transcript is the appeal layer.

---

## Relation to commits

Commits record *what* changed. Journal entries record *why* and *how*. All three layers (commits, summaries, transcripts) are part of the record.

---

## Entries

### Summaries

| File | Date | Topic |
|------|------|-------|
| `summary/260419_01-CRF_establishment.md` | April 19, 2026 | The session that established CRF. Four-pass repo smoothing; authors_voice.md captured; CRF proposal raised; three cautions surfaced; Thomas concurs with "soft-lensing" framing; open threads preserved for next session. |

### Transcripts

| File | Date | Topic |
|------|------|-------|
| `transcript/260423_01-CRF_Development.md` | April 23, 2026 (committed; conversation produced over preceding days) | Raw working transcript of the CRF development sessions that culminated in the April 19 summary. Substantial — the bulk of the working dialogue. |
| `transcript/260423_02-Voice_development.md` | April 23, 2026 | Raw working transcript of the voice-capture conversation. Ends mid-deliberation pending exemplar selection. |

---

## Writing an entry

### Summaries

No strict template. The April 19 summary uses an eight-section structure (starting state → session arc → proposal → reply and convergence → observations for the record → committed vs. deferred → open threads → closing note), and that structure may become canonical if it proves useful across several entries. For now, treat it as a reference rather than a constraint.

Both voices should appear when the session involved collaboration. The April 19 entry demonstrates how to represent Claude's reservations and Thomas's framing faithfully without flattening either.

### Transcripts

No template at all — paste the conversation as it occurred, preserving question/answer turns and tool-call notations. Light editing for legibility (line breaks, formatting fixes) is acceptable; rewriting content is not.

---

## Immutability

Entries are immutable once committed. Revisions happen only to correct factual errors (typos, wrong commit hashes, misattributed quotes) — never to rewrite the reasoning. If later sessions change course, a new entry records that. Reorganization (renames, moves) is permitted but should be tracked in commit messages.

---

## Renames history

For traceability when older references are encountered:

- `journal_entry_260419-01.md` (original) → `summary/260419_01-CRF_establishment.md` (current). Renamed to match the YYMMDD convention. The body of the entry retains its original filename references for historical fidelity.
- `260423_02_Voice_development.md` (original) → `transcript/260423_02-Voice_development.md` (current). Underscore-before-topic normalized to hyphen-before-topic.
- `260423_01-CRF_Development.md` — moved to `transcript/`; filename unchanged.

---

*"Iron sharpeneth iron; so a man sharpeneth the countenance of his friend."* — Proverbs 27:17
