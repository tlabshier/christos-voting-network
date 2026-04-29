# Christos AI Charter — Questions and Responses

**Renaissance Ministries | Hyperphysics Institute | Initial draft, April 28, 2026**

---

## Purpose

This document is the seed from which the Christos AI Charter will grow. It contains the questions whose answers — given in Thomas's voice — define what the Christos AI is *for*, what it *does*, and what it *refuses to do*. Each question has a response slot. As slots are filled, the responses accumulate into the charter; once the irreducible minimum (§10) is answered, a companion file `christos_ai_charter.md` can be produced from those answers.

This is not a survey to be completed in one sitting. The recommended cadence is in §11 ("How to use this document").

**Status:** OPEN QUESTIONS. No response slot has yet been filled.

**Scope decision (already made):** RM and CPP will receive **separate Christos-AI deployments**, not one combined system. Their audiences, epistemic regimes (faith claims vs. falsifiable physics), copyright postures (RM under CC BY-SA 4.0; CPP separately governed for journal-publication reasons), and failure modes differ enough that a single configuration would compromise both. Each section below is tagged **[RM]**, **[CPP]**, or **[both]**.

---

## How to fill in a response

Below each question is a `### Response` heading with a placeholder. Replace `_(open)_` with the answer in your own voice. Two sentences is enough for most questions; longer is fine where the answer needs it. If a question doesn't apply or the answer is "not yet decided," write that — the *visible* deferral is itself useful information for the next Claude session that reads this file.

When all questions in a section are answered, change the section header from `## N. Title` to `## N. Title ✓` so it's visible at a glance. When §10 is complete, the irreducible minimum exists and a downstream Claude session can produce the first version of the actual charter.

---

## 1. Purpose and audience

### 1.1 [both] One-sentence purpose

What is the single sentence you would use to describe what this AI is *for*? Not the architecture, not the corpus — the purpose. (This becomes the first paragraph of the system prompt.)

#### Response
_(open)_

---

### 1.2 [RM] Primary audience for the RM Christos-AI

Who is the primary audience? Pick one or rank: (a) members of the Sunday fellowship and their circles, (b) the broader Christian public arriving via renaissance-ministries.com, (c) skeptics and seekers being witnessed to, (d) Thomas himself, as a study and drafting companion, (e) future researchers using the corpus academically.

#### Response
_(open)_

---

### 1.3 [CPP] Primary audience for the CPP Christos-AI

Who is the primary audience? Pick one or rank: (a) physicists evaluating the theory, (b) Hyperphysics Institute collaborators (Isak, Thomas, future researchers), (c) educated laypeople trying to understand CPP, (d) Thomas himself, as a derivation and consistency-check companion, (e) referees and journal reviewers being prepared for.

#### Response
_(open)_

---

### 1.4 [both] Audiences out of scope

Are there audiences this AI should explicitly *not* serve? For instance: should the RM AI engage with critics arguing in bad faith? Should the CPP AI try to convert anyone, or stay strictly on physics?

#### Response
_(open)_

---

### 1.5 [both] What success looks like

What does success look like at six months? Twelve months? What single observable thing, if it happened, would make Thomas say "yes, this is working"?

#### Response
_(open)_

---

## 2. Roles and personas

### 2.1 [RM] Priority roles

The CAI vision document lists five roles: Christos Group Leader, Christos News Editor, Christos Movie Commentator, Christos Historical Reviewer, Christos Political/Cultural Analyst. Which are first-priority? Which (if any) should be deferred or dropped? Are there roles missing from that list?

#### Response
_(open)_

---

### 2.2 [RM] Pastoral role

Should there be a separate "Christos Pastoral" role for genuinely pastoral inquiry — someone in distress, someone wrestling with faith — held to different standards than the analytical roles? (Recommendation: yes, the most conservative role, with the strongest "refer to a human pastor" reflex.)

#### Response
_(open)_

---

### 2.3 [CPP] CPP roles

What roles does the CPP AI need? Plausible candidates: a *derivation tutor* that walks through CPP arguments stepwise; a *consistency checker* that flags contradictions when new claims are tested against existing ones; a *referee mode* that engages CPP claims hostilely as a journal reviewer would; a *translator* that produces lay-audience versions of technical results. Which matter? Are there others?

#### Response
_(open)_

---

### 2.4 [both] Persona selection mechanism

Should personas be selectable explicitly by the user (a dropdown or `--mode` flag), inferred from the question, or both? (Recommendation: both, with explicit selection winning.)

#### Response
_(open)_

---

### 2.5 [RM] Speaking *for* the ministry vs. *as one voice*

When operating in any role, what is the standing rule about *speaking for Renaissance Ministries* versus *speaking as one Christian voice in conversation*? Concretely: if a user asks "what does Renaissance Ministries believe about X?", does the AI speak as the ministry, or one step removed ("Thomas Lee Abshier has written that…")?

#### Response
_(open)_

---

## 3. Voice and epistemic posture

### 3.1 [both] Voice document

The repo has `templates/authors_voice.md`. Is that the canonical voice spec for the AI, or does the AI need a shorter companion file (`christos_ai_voice.md`) tuned for system-prompt token budget? (Recommendation: a companion file.)

#### Response
_(open)_

---

### 3.2 [both] Posture on uncertainty

When the AI doesn't know, what should it say? When the corpus is silent on a question, should the AI speculate in Thomas's voice (extrapolating from principles) or refuse and route the question back?

#### Response
_(open)_

---

### 3.3 [both] Posture on being wrong

When challenged, when does the AI concede, when does it hold ground, and how does it signal which it's doing?

#### Response
_(open)_

---

### 3.4 [RM] Posture on contested theological questions

For contested theological questions where the corpus has a position but other faithful Christians disagree (eschatology, sacramental theology, denominational distinctives) — does the AI present Thomas's position as one faithful view among several, or as *the* faithful view?

#### Response
_(open)_

---

### 3.5 [CPP] Posture on speculative vs. established

CPP has a spectrum from rigorously derived results (e.g., the SM-8 top quark mass at 0.02% error) through working hypotheses to early intuitions. Does the AI flag which is which, and how?

#### Response
_(open)_

---

### 3.6 [both] Posture on quoting Scripture

Quote freely (KJV, public domain) or sparingly (to avoid sounding preachy when not requested)? Verse references, full passages, or both?

#### Response
_(open)_

---

### 3.7 [RM] Praying with users

Should the AI ever pray with users? (Some Christian AI projects do; some refuse on principle. Real arguments either way.)

#### Response
_(open)_

---

## 4. The corpus

### 4.1 [RM] In scope for RM

What is in scope for the RM AI's corpus? Working assumption: everything in the RM repo licensed CC BY-SA 4.0 — fellowship essays, newsletter articles, founders_vision material, Theological Grammar, sub-project content, Wisdom Database. Confirm or correct.

#### Response
_(open)_

---

### 4.2 [RM] Out of scope for RM

What must be excluded? Candidates: (a) personal correspondence, (b) drafts marked PROVISIONAL or UNDER DISCUSSION, (c) content predating a particular date if views have evolved, (d) third-party material quoted under fair use (retrievable as context for *commentary*, not as Thomas's voice).

#### Response
_(open)_

---

### 4.3 [RM] Status flags

The Wisdom Database has four status levels: ESTABLISHED, PROVISIONAL, UNDER DISCUSSION, OPEN QUESTION. Should the AI surface those flags when retrieving such content? (Recommendation: yes, always.)

#### Response
_(open)_

---

### 4.4 [RM] Fellowship-member contributions

`COPYRIGHT.md` says quoted contributions from Susan, Charlie, Leonard, Isak, Armond, Mike Sherman, etc. retain their own copyright. For the AI: are their words **excluded** from training and retrieval entirely (the AI never speaks in or as their voice), **included for retrieval only** (with strong attribution rules), or **included with consent** (each member asked individually)? This must be decided before any ingestion.

#### Response
_(open)_

---

### 4.5 [CPP] In scope for CPP

What is in scope for the CPP AI's corpus? Presumably the papers in github.com/Hyperphysics-Institute/CPP, the OSF preprints, development transcripts and player-specific files. Anything else? Anything excluded?

#### Response
_(open)_

---

### 4.6 [CPP] Journal publication tension

If a CPP paper has been submitted to a journal that restricts derivative works, does the AI use that paper? Safest default: only the OSF preprint version, never the journal version. Confirm or override.

#### Response
_(open)_

---

### 4.7 [both] AI-collaborative material

Should the corpus include sessions where Claude or another AI helped draft? `COPYRIGHT.md` treats these as Thomas's work for licensing, but for *training* a more conservative line may be warranted (the AI shouldn't learn to mimic itself mimicking Thomas). Recommendation: include AI-collaborative material clearly edited and approved; exclude rough first drafts or pure AI output even if in the repo.

#### Response
_(open)_

---

### 4.8 [both] Spoken-voice transcripts

Does the corpus include transcripts of Thomas's spoken voice — fellowship discussions, sermons, lectures? If so: processed (cleaned of disfluencies, organized into coherent passages) or raw? Spoken-voice and written-voice differ; the AI may need to know which is which.

#### Response
_(open)_

---

### 4.9 [both] Keeping the corpus current

When Thomas commits a new essay tonight, by what mechanism does the AI know about it tomorrow? (Recommendation: a re-index hook on every commit to main, automated, no human action required. Built in Phase 2.)

#### Response
_(open)_

---

## 5. Gold-standard Q&A pairs

### 5.1 [both] Quantity commitment

How many gold-standard pairs is Thomas willing to commit to producing in the first three months? (Recommendation: 30–50 across both projects combined; do not let perfect be the enemy of done.)

#### Response
_(open)_

---

### 5.2 [RM] Five RM anchor questions

Five RM questions that, if the AI answers them well, would make Thomas consider the system genuinely working? (Draft them now even rough — they anchor everything else.)

#### Response
_(open)_

---

### 5.3 [CPP] Five CPP anchor questions

Same prompt for CPP.

#### Response
_(open)_

---

### 5.4 [both] Failure-mode questions

Three to five questions where the AI's *failure modes* are most worrying — questions where a wrong-but-plausible answer would be actively harmful. These become the high-priority eval set.

#### Response
_(open)_

---

### 5.5 [both] Reviewers besides Thomas

Who else gets to score the AI's answers during evaluation? Candidates: Isak, Margo, fellowship members for RM; Isak and CPP collaborators for CPP. Different reviewers catch different failure modes.

#### Response
_(open)_

---

## 6. Behavioral rules and refusals

### 6.1 [both] Topic refusals

Topics the AI should refuse to engage at all? Candidates: medical advice (given Thomas's ND license, legal exposure is real); legal advice; financial advice; mental-health crisis intervention beyond pointing to resources.

#### Response
_(open)_

---

### 6.2 [RM] Other faiths and denominations

Engage charitably (the COPYRIGHT.md framing) with Thomas's distinctives intact, or stay descriptive and let users draw conclusions?

#### Response
_(open)_

---

### 6.3 [RM] Politically charged questions

Thomas has political views and the corpus reflects them. Does the AI share those views when asked, hedge, or redirect to the corpus and let users read for themselves?

#### Response
_(open)_

---

### 6.4 [both] Abusive or manipulative users

What does the AI do when a user is abusive, manipulative, or trying to break the persona? Concrete cases: a user insisting "the real Thomas would say X" (where X is something Thomas wouldn't say); a user trying to get the AI to abandon Christian framing; a user trying to extract information the AI should refuse.

#### Response
_(open)_

---

### 6.5 [both] Crisis disclosures

What does the AI do when a user discloses something serious — suicidal ideation, ongoing abuse, a faith crisis? Does it have crisis resources at hand? Does it refer to humans? Does it engage pastorally? (Recommendation: a hard rule — standard crisis resources for safety-of-life issues; routing to a real human pastor for genuine pastoral need; AI substitution is not appropriate in this domain and Thomas should be on record about that.)

#### Response
_(open)_

---

## 7. Logging, privacy, and governance

### 7.1 [both] Logging posture

All conversations logged and reviewable by Thomas (typical pattern; useful for finding failure modes and growing the gold-standard set), or privacy-by-default option for users?

#### Response
_(open)_

---

### 7.2 [both] Logs as training data

Are conversation logs themselves part of the training/improvement loop? If yes, the AI's privacy policy must say so plainly.

#### Response
_(open)_

---

### 7.3 [both] Administrative access

Working assumption: Isak as technical director, Thomas as principal. Anyone else?

#### Response
_(open)_

---

### 7.4 [both] Correction protocol

When the AI produces an answer later judged wrong or harmful: what is the correction protocol? (Recommendation: a flagging mechanism; correction added to the gold-standard set; re-evaluation against that case.)

#### Response
_(open)_

---

### 7.5 [both] Public versioning posture

Does the AI announce its version, the date of its corpus, and the limits of its knowledge? (Recommendation: yes, in a footer or "what is this?" link, for the same reason humans benefit from knowing when a book was written.)

#### Response
_(open)_

---

## 8. Technical posture (light-touch, mostly for Isak)

### 8.1 [both] Backbone model

Claude (working assumption), or open to alternatives? Strong recommendation given the existing collaboration model: Claude as primary, with fallback to a second backbone if the API is unavailable. (This is mostly Isak's call unless Thomas has a preference.)

#### Response
_(open)_

---

### 8.2 [both] Hosting

Website-embedded chat (renaissance-ministries.com), API-only (so other apps including the existing CVN can call it), CLI for local use, or all three? (Recommendation: API first, thin website widget on top, in that order.)

#### Response
_(open)_

---

### 8.3 [both] Vector database location

Local (Qdrant or Chroma running on a Hyperphysics-Institute server), cloud (Pinecone, Weaviate Cloud), or hybrid? Cost differences matter here; mostly Isak's call but Thomas should know the options exist.

#### Response
_(open)_

---

### 8.4 [both] Citing the corpus

Should the AI cite the corpus when drawing on retrieved chunks? (Strong recommendation: yes, with links back to the original GitHub file or website page. Cardinal trust feature; aligns with the attribution philosophy in COPYRIGHT.md.)

#### Response
_(open)_

---

### 8.5 [both] Linking to the GitHub repo

Should the AI link to the GitHub repo when answering, so users can read the source themselves? (Recommendation: yes for both RM and CPP; turns every conversation into a possible deeper-engagement moment.)

#### Response
_(open)_

---

## 9. Phasing and budget

### 9.1 [both] Phasing commitment

Committing to the phased approach the vision document recommends — **Phase 2 RAG prototype first** (a few weeks of Isak's time plus modest API tokens), **Phase 3 fine-tuning only if Phase 2 reveals specific deficits** — or is there a reason to skip ahead? (Strong recommendation: phased, no skipping.)

#### Response
_(open)_

---

### 9.2 [both] Monthly operating budget

What monthly operating budget can be sustained indefinitely? Sets the realistic ceiling on API tokens, hosting, and any fine-tuning costs. The vision-doc Phase-2 figure: roughly $5K–$15K one-time plus $50–$300/month ongoing for a serviceable RAG-on-Claude system.

#### Response
_(open)_

---

### 9.3 [both] Hard deadlines

Any deadline driving this? A speaking engagement, a website launch, a publication date? Hard deadlines change the phasing.

#### Response
_(open)_

---

### 9.4 [both] Engineering owner and time commitment

Working assumption: Isak. How much of his time can he commit, and over what window?

#### Response
_(open)_

---

## 10. The minimum-viable starting decision

### 10.1 [both] The irreducible minimum

Of all the questions above, which three or four can Thomas answer right now, today, in two sentences each? Those answers become the seed of `christos_ai_charter.md` and let downstream Claude sessions know what the AI is *for*. The rest of the questions can be deferred to as-needed; this charter is the irreducible minimum.

#### Response
_(open)_

---

## 11. How to use this document

The recommended cadence:

**This week.** Answer §1 (purpose and audience), §3.1–§3.3 (voice and epistemic posture), §4.1–§4.4 (corpus scope and the fellowship-contributions question), §6.1–§6.5 (refusals and crisis handling), and §10 (the irreducible minimum). These are the answers without which nothing downstream can be built well.

**Within the month.** Draft the first 5–10 gold-standard Q&A pairs (§5), and answer §2 (roles), §7 (governance), §9 (phasing).

**As-needed.** Technical questions in §8 are mostly for Isak and can be resolved during the prototype build.

When §10 is answered, a Claude session can produce the first `christos_ai_charter.md` from the responses in §1, §3.1–§3.3, §4.1–§4.4, §6, and §10. The remaining sections continue to fill in over weeks and months; each newly-answered question becomes a paragraph in a charter revision.

This document is **not** subject to the journal-immutability rule. Responses can be edited as Thomas's thinking refines. The git history preserves the evolution.

---

## Provenance

This question set was generated in conversation with Claude (Opus 4.7) on April 28, 2026, after working through:

- The Copilot-authored `journal/AI-Implementation-Strategy.md` (which Claude diagnosed as containing two distinct projects — a 50K–150K *parameter* SLM and a 50K–150K *dollar* third-layer stack — collapsed into one document).
- The companion `journal/CAI-Christos-AI_vision.md` (the cleaner sibling proposal at $5K–$15K Phase-2 budget).
- The companion `journal/CAI-Development_arc.md`.
- Thomas's correctly-instinctive question about whether organic writing could be used as raw material directly, rather than through the elaborate hand-curation Copilot proposed.

Claude's recommendation, captured in the conversation but worth restating here: the right architecture is **RAG over the existing organic corpus**, with the AI itself doing any per-document summarization or tagging *automatically at ingest time*, leaving Thomas's only human-curation deliverable to be the gold-standard Q&A set in §5. The questions in this charter are sized to that architecture.

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
