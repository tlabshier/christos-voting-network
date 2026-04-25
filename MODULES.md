# Christos Modules — Master Inventory

**Purpose:** single source of truth for the full Christos module family. Every other document (README, bootup, operating systems, external communications) should link here rather than maintain its own list.

**Status:** DRAFT. Compiled by Claude on April 19, 2026 from the Christos Seminar Technical Specification v1.0, the current repo folder structure, and Thomas's recent statements. Thomas is the final authority on what belongs on this list, the canonical names, the 3-letter codes, and the ordering. Edit freely.

---

## Status legend

| Badge              | Meaning                                                                    |
|--------------------|----------------------------------------------------------------------------|
| **In repo**        | Sub-project folder exists in this repository; has at least an operating system document. |
| **App deployed**   | Live production application in this repo; more than just a spec.           |
| **Spec drafted**   | Technical specification exists (likely in Thomas's private files); no folder in repo yet. |
| **Planned**        | Named and scoped; no specification yet.                                    |

Every module — including planned ones — is intended to serve the same aim: manifesting a Kingdom-of-Heaven culture. No module is subordinate to another.

---

## The modules

| Code | Name                               | Status         | Category                 | Purpose (one line)                                                           | Folder / path                          |
|------|------------------------------------|----------------|--------------------------|------------------------------------------------------------------------------|----------------------------------------|
| CVN  | Christos Voting Network            | App deployed   | Cultural engagement      | Spectrum-based worldview and bias assessment; voting + Claude analysis.      | `CVN_christos_voting_network/` (OS doc) + `/client` + `/server` (app) |
| CNL  | Christos Newsletter                | In repo        | Cultural engagement      | Daily-issue newsletter with Summarize–Comment–Refer analyses.                | `CNL_christos_newsletter/`             |
| CHR  | Christos Historical Review         | In repo        | Cultural engagement      | Christian and political history examined against Kingdom principles.         | `CHR_christos_historical_review/`      |
| CCR  | Christos Conspiracy Review         | In repo        | Cultural engagement      | Rigorous examination of coordinated-influence claims (intentional + de facto). | `CCR_christos_conspiracy_review/`    |
| CEA  | Christos Economic Annex            | In repo        | Cultural engagement      | Economic analysis through a Kingdom lens.                                    | `CEA_christos_economic_annex/`         |
| CHS  | Christos Home School               | In repo        | Whole-life formation     | Educational content and lecture processing.                                  | `CHS_christos_home_school/`            |
| CRF  | Christos Rigorous Framework        | In repo        | Foundation               | Axiom-to-theorem / axiom-to-derivation-structure system; ethical derivations from theological axioms given CPP's conscious ground. Peer sub-project that others may cite for rigorous grounding. | `CRF_christos_rigorous_framework/`     |
| TBD  | Christos Seminar                   | Spec drafted   | Entry point              | Gateway module — 7 perspectives, video, AI engagement. Onboarding to the ecosystem. | —                               |
| TBD  | Christos Cross-Check               | Spec drafted   | Foundation               | Bible study with AI assistance.                                              | —                                      |
| TBD  | Christos Logos                     | Spec drafted   | Foundation               | Theological reasoning; physics-of-divine-consciousness bridge to CPP.        | —                                      |
| TBD  | Christos Commons                   | Spec drafted   | Entry point / cultural   | Public conversation platform — front door for any topic.                     | —                                      |
| TBD  | Christos Group Leader              | Spec drafted   | Community                | Real-time fellowship moderation and facilitation.                            | —                                      |
| TBD  | Christos Counselor *(MyCounselor)* | Spec drafted   | Personal formation       | Pastoral care. Hosted at mycounselor.com; may or may not live in this repo.  | —                                      |
| TBD  | Christos Professional Module       | Spec drafted   | Personal formation       | Tools for licensed counselors.                                               | —                                      |
| TBD  | Christos Diagnostician             | Spec drafted   | Personal formation       | Diagnostic counseling training; physics-grounded.                            | —                                      |
| TBD  | Christos Medical Testimony         | Spec drafted   | Health stewardship       | Health experience sharing; MAHA-aligned.                                     | —                                      |
| TBD  | Christos Life                      | Planned        | Whole-life formation     | Comprehensive life skills and personal formation.                            | —                                      |
| TBD  | Christos Council                   | Planned        | Interfaith               | World religions examined through Christ; especially Islam.                   | —                                      |

**Count:** 7 in repo (1 as deployed app, 5 as content folders, 1 as axiom-to-theorem framework) + 11 spec-drafted or planned = **18 modules total** in the current picture. Thomas has said "15 or more" and this count should be treated as provisional until he reviews.

---

## Naming conventions for this inventory

- **Canonical name:** "Christos [Name]" — no hyphens in the English name. Exception: "Cross-Check" is written with a hyphen by convention.
- **Folder name:** `{CODE}_{snake_case_name}/` where `{CODE}` is the three-letter code.
- **Operating system file:** `{CODE}_operating_system.md` at the folder root. All six in-repo sub-projects follow this convention. CVN's OS doc (provisional — currently a restored developer-setup document pending rewrite as a full operating system) lives at `CVN_christos_voting_network/CVN_operating_system.md` alongside the live application at `/client` and `/server`.
- **3-letter codes:** follow the existing CCR / CEA / CHR / CHS / CNL / CVN pattern. Codes for the eleven modules marked `TBD` above should be assigned by Thomas before their folders are created. Suggested (non-binding) — for discussion only:

  | Module                       | Suggested code |
  |------------------------------|----------------|
  | Christos Seminar             | CSM            |
  | Christos Cross-Check         | CXC            |
  | Christos Logos               | CLG            |
  | Christos Commons             | CCM            |
  | Christos Group Leader        | CGL            |
  | Christos Counselor           | CCO            |
  | Christos Professional Module | CPM            |
  | Christos Diagnostician       | CDG            |
  | Christos Medical Testimony   | CMT            |
  | Christos Life                | CLF            |
  | Christos Council             | CCL            |

  Thomas, please confirm or reassign. Once codes are locked, subsequent folder creation is mechanical.

---

## Categories

The categories above are descriptive, not structural. They come from the Christos Seminar Ecosystem Map (Foundation, Personal Formation, Community, Cultural Engagement, Whole-Life Formation, Entry Point, Health Stewardship, Interfaith). They are useful for navigation and onboarding but do not imply any directory structure — all modules are peers at the repo root.

---

## Known open questions

These should be resolved in a subsequent pass, not fixed in this document:

1. **Counselor / MyCounselor relationship.** Is Christos Counselor the same thing as MyCounselor.com, or are they distinct? If distinct, which one lives in this repo?
2. **Ordering within this document.** Currently: in-repo first (by activity level), then spec-drafted (by category), then planned. Alternatives: alphabetical by code, alphabetical by name, or Seminar-ecosystem-map order. Thomas to decide.

---

## Maintenance

Update MODULES.md when:

- A new module is proposed or named — add as `Planned`, flag open questions.
- A module's status changes — e.g., spec drafted, folder created, app deployed.
- A module is renamed, merged, or deprecated — mark clearly; never silently remove.
- A 3-letter code is assigned.

Do not update for transient status (e.g., "working on the CCR OS today"). That belongs in commits and in the seed archive.

This file is linked from:
- `README.md` (repo overview section)
- `RM_bootup.md` (module inventory section)

Keep those links pointing here rather than duplicating the list elsewhere.

---

*Compiled from: Christos Seminar Technical Specification v1.0 (March 2026); Christos AI Theological Grammar v1.3 Part VI (April 2026); current repo folder structure (April 19, 2026); conversations with Thomas during the April 19 repo-smoothing session.*
