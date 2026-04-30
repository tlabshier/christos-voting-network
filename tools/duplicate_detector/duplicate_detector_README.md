# Duplicate Detector Toolkit

**Location:** `tools/duplicate_detector/`
**Purpose:** Scan the RM repo for duplicate or near-duplicate markdown files and produce a report grouped by suspicion level.

This toolkit was built to clean up after the website-import migration, but it is reusable for any future audit. Run it whenever you want to check for content duplication across the corpus.

---

## What's in this folder

| File | Purpose |
|---|---|
| `find_duplicates.py` | The Python detector. Walks the repo, computes content fingerprints, identifies clusters across five categories. |
| `run_duplicate_check.sh` | Bash wrapper. Runs the detector, places output at `~/duplicate_check_output/`. |
| `duplicate_detector_README.md` | This document. |

---

## Five detection categories

The detector identifies five different kinds of duplication, each requiring different judgment:

### 1. EXACT
Files with byte-identical body content (after stripping YAML frontmatter and normalizing whitespace). Almost certainly real duplicates. Decision: keep one, delete the rest.

### 2. NEAR (≥90% similarity)
Files with very high body-content overlap measured by 8-word shingle Jaccard similarity. Probably the same essay with edits between versions. Decision: review the two openings shown in the report, decide whether they're truly the same essay (delete one) or distinct revisions (keep both).

### 3. PARTIAL (50–90% similarity)
Files with moderate body-content overlap. May be the same essay reworked, or one excerpts the other, or two essays touching the same topic with shared phrasing. Decision: usually keep both; investigate if surprising.

### 4. TITLE_MATCH (≥75% title similarity)
Files with very similar YAML titles regardless of body content. Catches renames or two essays on the same topic. The report shows both title similarity AND body similarity for each pair, so you can distinguish "rename of one essay" (high title + high body) from "two essays on same topic" (high title + low body).

### 5. DRAFT_CLUSTER
Files in `drafts/` folders whose names suggest they're versions of the same essay. Expected — these are development trails preserved by design. Listed for awareness only; no action recommended.

---

## How to run

From the repo root:

```bash
bash tools/duplicate_detector/run_duplicate_check.sh
```

Outputs go to `~/duplicate_check_output/`:

- `duplicates_report.md` — human-readable, grouped by category
- `duplicates.tsv` — machine-readable, openable in Excel
- `cleanup_suggestions.sh` — suggested `git rm` commands (commented out by default)

The detector never modifies the repo. All cleanup decisions are yours.

---

## Cleanup workflow

When the report identifies clusters you want to clean up:

1. **Open `~/duplicate_check_output/cleanup_suggestions.sh`** in a text editor.
2. **Uncomment the `git rm` lines** for files you want to delete. The script generates one `git rm` per file in each cluster, all commented out — uncomment only the ones you want to remove. If a cluster contains 3 identical files and you want to keep one, uncomment 2 of the 3 `git rm` lines.
3. **Run the cleanup script**:
   ```bash
   bash ~/duplicate_check_output/cleanup_suggestions.sh
   ```
4. **Commit and push**:
   ```bash
   git commit -m "Remove duplicate files identified by detector"
   git push origin main
   ```

If you change your mind before pushing, `git reset HEAD~1` undoes the commit and `git checkout -- <file>` restores the working tree.

---

## Detection thresholds (tunable)

The default thresholds work well for the typical RM corpus. Adjust if the detector misses something or flags too many false positives:

```bash
python3 tools/duplicate_detector/find_duplicates.py \
    --repo-root . \
    --output ~/duplicate_check_output \
    --near-threshold 0.85 \
    --partial-threshold 0.40 \
    --title-threshold 0.70
```

Lower thresholds = more findings (more false positives). Higher thresholds = fewer findings (may miss real duplicates).

---

## What's excluded from the scan

The detector deliberately skips:

- Files in `.git/`, `node_modules/`, `templates/`, `tools/`, `INDEX/`, `archive/`, `client/`, `server/`
- Repository governance files: `README.md`, `CLAUDE.md`, `COPYRIGHT.md`, `LICENSE`, `MODULES.md`, `RM_Content_Catalog.md`, `RM_bootup.md`
- Module placeholder files: `Cxx-README.md`, `Cxx_operating_system.md` (these are intentionally similar across modules)

The remaining files are the actual content essays, transcripts, and articles where duplication is meaningful.

---

## Limitations

- **HTML-to-markdown conversion artifacts** can make two copies of the same essay look slightly different (e.g., one preserves a divider while the other doesn't). The shingle-based similarity handles this well; small differences don't break detection.
- **Heavy editing of one copy** can drop similarity below the NEAR threshold. The PARTIAL category catches some of these; very heavily-edited versions may slip through.
- **Translations or paraphrases** are not detected — the detector compares English text by exact word matching.

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
