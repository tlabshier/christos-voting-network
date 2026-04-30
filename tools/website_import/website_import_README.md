# Website Import Toolkit

**Location:** `tools/website_import/`
**Purpose:** Convert WordPress posts from renaissance-ministries.com into properly-formatted markdown files in the RM repo, with YAML frontmatter, module routing, and tranched commits.

This toolkit was built for the initial bulk import of ~150 website posts not yet in the repo, but it is **reusable**: future "I posted more things on the website, get them into the repo" sessions follow the same procedure. The toolkit is committed to the repo so it remains available for those future runs.

---

## What's in this folder

| File | Purpose |
|---|---|
| `wordpress_to_repo.py` | The Python converter. Reads a WordPress XML export, decides include/exclude per post, converts HTML to markdown, generates YAML frontmatter, and writes per-module folder structure. |
| `import_website_posts.sh` | The bash wrapper. Runs the converter, shows a summary, prompts for confirmation, then copies files into the repo and commits them in tranches of 30 files each. |
| `website_import_README.md` | This document. |
| `manifest.tsv` | (After a run) Per-post audit log of every conversion decision. |
| `excluded.txt` | (After a run) Log of excluded posts with reasons. |
| `summary.md` | (After a run) Human-readable summary of the most recent run. |

---

## Procedure for an import run

### Step 1: Generate the WordPress XML export

In a browser, navigate to:

```
https://renaissance-ministries.com/wp-admin/export.php
```

Log in as administrator, select **Posts** (not "All content"), leave all filters at their defaults (or filter by date if doing an incremental import), and click **Download Export File**. Move the downloaded XML file to `~/Downloads/website_export.xml`.

### Step 2: Pull the latest from origin

```bash
cd ~/Documents/GitHub/RM
git pull origin main
```

### Step 3: Run the import

```bash
bash tools/website_import/import_website_posts.sh
```

The script will:

1. Verify prerequisites (Python 3, markdownify package, the converter file exists, the XML is present).
2. Run the converter against the XML, producing converted markdown files in `~/website_import_work/converted/` plus three audit files (manifest, excluded log, summary) in `~/website_import_work/`.
3. Print a summary report to the terminal showing how many posts will be imported, into which modules, in how many tranches.
4. Prompt: **"Proceed with commit and push?"** Type `y` and Enter to proceed, or anything else to abort. (Aborting leaves the converted files in the work directory for inspection without changing the repo.)
5. Copy the converted files into the repo, committing in tranches of 30 files each — one commit per tranche, individually reviewable on GitHub.
6. Commit the audit files (manifest, excluded, summary) into `tools/website_import/`.
7. Push everything to `origin/main`.

### Step 4: Review the result

After the run, inspect:

- The new tranche commits on GitHub — confirm the files look right and module assignments are sensible.
- `tools/website_import/manifest.tsv` — the full audit log; can be opened in Excel for filtering.
- `tools/website_import/excluded.txt` — list of posts deliberately excluded with reasons.

If anything is mis-classified, use `git mv` to move the file to its correct module folder, edit the frontmatter `module:` field, and commit. The aggressive-import policy explicitly accepts this kind of cleanup as part of the workflow.

---

## How the converter decides

The converter's logic is in `wordpress_to_repo.py`. Three layers of decision-making:

### Layer 1: Per-post overrides (highest priority)

Specific post IDs are routed by the `POST_OVERRIDES` dictionary at the top of the script. This is where Christos-XXX module-seed posts get assigned to their target modules (e.g., post 3520 → CMT, post 3522 → CCK, etc.) and where any user-requested explicit overrides live.

To add a new override, edit the dictionary in `wordpress_to_repo.py`:

```python
POST_OVERRIDES = {
    '1234': ('MODULE', 'subpath_or_None', ['topic1', 'topic2'],
             'human-readable note about why this override exists'),
    ...
}
```

### Layer 2: Hard exclusions

Posts are excluded if any of the following apply:

- Status is `trash`
- Title is empty AND body is empty
- Title or body indicates a test/junk post (matches "test", "iframe", or "placeholder")
- Body is under 1KB and title doesn't suggest meaningful content
- Title matches a physics-paper pattern (regex list in the script): "Conscious Point Physics", "CPP - X", "The Theory of Absolutes", "Quantum Tunneling", "Quark Dipole", etc.

The physics-title patterns are deliberately tuned to catch CPP papers regardless of their WordPress categorization, since some CPP papers are tagged with multiple categories that would otherwise route them into the import set.

### Layer 3: Category-based routing

Posts that pass the hard exclusions are routed by their WordPress category. The `CATEGORY_ROUTES` dictionary in the script maps each WordPress category nicename to a target module:

```python
CATEGORY_ROUTES = {
    'apologetics':                          ('CAP', 'essays', None),
    'christos-historical-review':           ('CHR', 'essays', None),
    'sermon-meeting-discussion-transcripts': ('CFE', 'transcripts', None),
    'politics':                             ('CFE', 'essays', 'politics'),
    'uncategorized':                        ('CFE', 'essays', None),
    ...
}
```

When a post has multiple categories, the most specific category wins per the `CATEGORY_PRIORITY` ordering at the top of the script.

### Special case: CPP-tagged but RM-flavored posts

Many RM essays were tagged with WordPress categories like "Consciousness/Physics/Spirit" or "Physics/Christianity/Life" because they touch CPP themes, even though their primary identity is fellowship/apologetics/theology. The converter handles this by:

1. Excluding posts whose **title** clearly indicates a physics paper (via the physics-title regex patterns).
2. Routing remaining CPP-tagged posts to **CFE** (default fellowship-essay home) with a `cpp_adjacent` topic tag for traceability.

This is the right cut for an aggressive-import policy: any post mistakenly routed to CFE that should have been a physics paper can be excluded later via `git rm`; any post excluded that should have been imported requires re-running the toolkit, which is a higher cost.

---

## Module routing reference

| WordPress category | Default RM module | Subfolder | Notes |
|---|---|---|---|
| `apologetics` | CAP | `essays/` | |
| `bible-verse-analysis` | CAP | `essays/` | tagged `bible_verse_analysis` |
| `christos-historical-review` | CHR | `essays/` | Napoleon series, etc. |
| `christos-conspiracy-review` | CCR | `essays/` | |
| `christos-movie-reviews` | CFE | `essays/` | tagged `movie_review` |
| `christos-grammar` | CAI | `essays/` | |
| `newsletter` | CNL | `articles/` | |
| `politics` | CFE | `essays/` | tagged `politics` |
| `sermon-meeting-discussion-transcripts` | CFE | `transcripts/` | type: transcript |
| `world-religions-theology-philosophy` | CWR | `essays/` | new module |
| `important-essential-core-essays` | CFE | `essays/` | tagged `core` |
| `physics-christianity-life` (only) | CFE | `essays/` | tagged `cpp_adjacent` |
| `consciousness-physics-spirit` (only) | CFE | `essays/` | tagged `cpp_adjacent` |
| `uncategorized` | CFE | `essays/` | |

Note: routing is provisional. The migration policy in `templates/RM_module_taxonomy.md` is **default-to-CFE, reorganize later**. Files can be moved between modules at any time with `git mv` and a frontmatter edit.

---

## New modules created by this toolkit

Several Christos-XXX module-seed posts trigger the creation of new module folders the first time the toolkit runs. Each new module gets a placeholder `Cxx-README.md` and `Cxx_operating_system.md`:

| Module | Name | Origin |
|---|---|---|
| `CAI` | Christos AI | Theological Grammar website post |
| `CAP` | Christos Apologetics | All apologetics-tagged posts |
| `CCK` | Christos Cross Check | "Christos Cross Check" post |
| `CCN` | Christos Counselor | "Christos Counselor" + "Post-Scarcity Meaning of Life" |
| `CDI` | Christos Diagnostician | "Effective Counsel - Christos Diagnostician" |
| `CGL` | Christos Group Leader | "Equipping the Saints" |
| `CLO` | Christos Logos | "Christos Logos" |
| `CMD` | Christos Medicine | "Homeopathic Frequency Generator" |
| `CMT` | Christos Medical Testimony | "Christos Medical Testimony" |
| `CSE` | Christos Seminar | "Christos Seminar - The Gateway" |
| `CWR` | Christos World Religions | World-religions-tagged posts |

After the import, the placeholder operating-system documents should be replaced with substantive content. The taxonomy document at `templates/RM_module_taxonomy.md` may need updating if the module IDs differ from what's listed there (CDI and CGL are not yet in the taxonomy — to be added).

---

## Troubleshooting

### `markdownify` not found

```bash
python3 -m pip install --user markdownify
```

If that fails on Git Bash for Windows, try:

```bash
python -m pip install --user markdownify
```

### XML parsing fails

Check the XML file is valid. Open it in a text editor — it should start with `<?xml version="1.0" encoding="UTF-8" ?>` and contain `<channel>` and many `<item>` blocks. If the file is truncated or corrupted, regenerate the WordPress export.

### Post body looks broken in markdown

The HTML-to-markdown conversion handles standard WordPress post HTML well, but custom shortcodes, Divi-builder blocks, or other plugin-generated markup may not translate cleanly. The aggressive-import policy accepts this — fix individual posts manually post-import as needed.

### Wrong module assignment

Two options:

1. **Quick fix (one post):** `git mv` the file to its correct location and edit the `module:` field in the frontmatter. Commit.
2. **Systematic fix:** edit `wordpress_to_repo.py` to add a per-post override or refine the category routing, re-run the toolkit. The script's idempotency means it won't double-import already-landed files.

### Re-running after partial success

The script is idempotent. Files that already exist in the repo with identical content are skipped. Re-running the script after a partial run picks up only the new/changed files.

---

## Maintenance

When the website grows or categorization conventions change:

1. **New WordPress categories** that don't yet appear in `CATEGORY_ROUTES` will fall through to CFE with a `defaulted to CFE` note in the manifest. Add a route entry in the script when a new category warrants its own routing.
2. **New Christos-XXX posts** that should seed new modules need explicit overrides in `POST_OVERRIDES`. Otherwise they route by their categories.
3. **Refining the physics filter:** add or refine regex patterns in `PHYSICS_TITLE_PATTERNS`. The current patterns were tuned against the April 2026 export; future imports may surface new physics-paper title formats.

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
