#!/usr/bin/env bash
# import_website_posts.sh
#
# Lands website-imported markdown files in the RM repo, in tranches,
# one commit per tranche. Each commit is independently reviewable on
# GitHub.
#
# Prerequisites:
#   1. WordPress XML export at $XML_PATH (default: ~/Downloads/website_export.xml)
#   2. tools/website_import/wordpress_to_repo.py present in the repo
#   3. Python 3 available (Git Bash for Windows ships with Python)
#   4. markdownify Python package: pip install --user markdownify
#
# Usage (from the repo root):
#   bash tools/website_import/import_website_posts.sh
#
# Or with a custom XML path:
#   XML_PATH=/path/to/export.xml bash tools/website_import/import_website_posts.sh
#
# Idempotent: previously-landed files are skipped on re-run.

set -euo pipefail

# --- 1. Sanity checks ----------------------------------------------------
if [[ ! -f RM_bootup.md ]] || [[ ! -d templates ]]; then
  echo "ERROR: This does not look like the RM repo root."
  echo "       cd into the repo root and re-run."
  exit 1
fi

CONVERTER="tools/website_import/wordpress_to_repo.py"
if [[ ! -f "$CONVERTER" ]]; then
  echo "ERROR: $CONVERTER not found."
  echo "       The website import toolkit must be committed to the repo first."
  exit 1
fi

XML_PATH="${XML_PATH:-$HOME/Downloads/website_export.xml}"
if [[ ! -f "$XML_PATH" ]]; then
  echo "ERROR: WordPress XML export not found at $XML_PATH"
  echo "       Generate the export from WordPress admin (Tools → Export → Posts)"
  echo "       and place it at that path, or set XML_PATH=/your/path."
  exit 1
fi

# Verify Python and markdownify
if ! command -v python3 &>/dev/null; then
  echo "ERROR: python3 not found. Git Bash for Windows should include it."
  exit 1
fi

if ! python3 -c "import markdownify" 2>/dev/null; then
  echo "Installing markdownify..."
  python3 -m pip install --user markdownify || {
    echo "ERROR: failed to install markdownify."
    echo "       Try: python3 -m pip install --user markdownify"
    exit 1
  }
fi

# --- 2. Run the converter -----------------------------------------------
WORK_DIR="${WORK_DIR:-$HOME/website_import_work}"
mkdir -p "$WORK_DIR"

echo "=== Converting WordPress XML to markdown ==="
echo "  XML:    $XML_PATH"
echo "  Work:   $WORK_DIR"
echo

python3 "$CONVERTER" \
  --xml "$XML_PATH" \
  --output "$WORK_DIR" \
  --tranche-size 30

CONVERTED="$WORK_DIR/converted"
MANIFEST="$WORK_DIR/manifest.tsv"

if [[ ! -d "$CONVERTED" ]]; then
  echo "ERROR: converter did not produce $CONVERTED"
  exit 1
fi

# --- 3. Show summary and pause for review ------------------------------
echo
echo "=== Summary ==="
cat "$WORK_DIR/summary.md"
echo
echo "=== Excluded posts (first 20 of $(grep -c '^\[' "$WORK_DIR/excluded.txt" 2>/dev/null || echo 0)) ==="
head -60 "$WORK_DIR/excluded.txt"
echo
echo "==============================================="
echo "Review the above, then continue to commit?"
echo "  - Manifest:    $MANIFEST"
echo "  - Excluded:    $WORK_DIR/excluded.txt"
echo "  - Converted:   $CONVERTED"
echo "==============================================="
echo
read -r -p "Proceed with commit and push? [y/N] " reply
if [[ "$reply" != "y" && "$reply" != "Y" ]]; then
  echo "Aborted before commit. The converted files remain in $WORK_DIR for inspection."
  exit 0
fi

# --- 4. Copy converted files into the repo and commit in tranches ------
echo
echo "=== Copying converted files into the repo ==="

# Build a list of all markdown files to import (sorted by date, since the
# converter writes them; we re-sort here too so tranching is stable).
FILES=()
while IFS= read -r f; do
  FILES+=("$f")
done < <(find "$CONVERTED" -name '*.md' -print | sort)

echo "  ${#FILES[@]} files to consider."

TRANCHE_SIZE=30
TRANCHE_COUNT=$(( (${#FILES[@]} + TRANCHE_SIZE - 1) / TRANCHE_SIZE ))
echo "  $TRANCHE_COUNT tranches of $TRANCHE_SIZE."
echo

tranche_num=0
files_in_tranche=0
new_files_in_tranche=()
total_new=0

flush_tranche() {
  local tn="$1"
  shift
  local files=("$@")

  if [[ ${#files[@]} -eq 0 ]]; then
    return 0
  fi

  echo
  echo "=== Tranche $tn: ${#files[@]} files ==="
  for f in "${files[@]}"; do
    git add "$f"
  done

  if git diff --cached --quiet; then
    echo "  (no actual changes — files identical to existing repo content)"
    return 0
  fi

  # Determine date range from the staged files (filenames start with YYMMDD)
  local first_date
  local last_date
  first_date=$(printf '%s\n' "${files[@]}" | xargs -n1 basename | grep -oE '^[0-9]{6}' | sort | head -1)
  last_date=$(printf '%s\n' "${files[@]}" | xargs -n1 basename | grep -oE '^[0-9]{6}' | sort | tail -1)

  git commit -m "Import website posts (tranche $tn of $TRANCHE_COUNT, dates ${first_date}–${last_date})

Imports ${#files[@]} markdown files converted from the renaissance-ministries.com
WordPress export, processed by tools/website_import/wordpress_to_repo.py.

This tranche covers post dates ${first_date} through ${last_date} (YYMMDD).

Each file has YAML frontmatter per templates/RM_frontmatter_convention.md,
including title, author, date, module, status (mapped from WordPress status),
type, source_url, and wordpress_post_id for traceability.

Module routing per the per-post overrides and category-based rules in
tools/website_import/wordpress_to_repo.py. Files in NEW module folders
also include placeholder Cxx-README.md and Cxx_operating_system.md
documents (committed once per module on its first appearance).

Manifest of all converted files (this tranche and others):
  tools/website_import/manifest.tsv

Posts excluded from import (CPP papers, test/junk, trashed):
  tools/website_import/excluded.txt"
  echo "  Tranche $tn committed."
}

current_tranche=()
for f in "${FILES[@]}"; do
  # Compute relative path from $CONVERTED to the repo root
  rel="${f#$CONVERTED/}"
  dest="$rel"
  dest_dir="$(dirname "$dest")"

  mkdir -p "$dest_dir"
  if [[ -f "$dest" ]] && cmp -s "$f" "$dest"; then
    # Skip already-identical files
    continue
  fi
  cp "$f" "$dest"
  current_tranche+=("$dest")
  total_new=$((total_new + 1))

  if [[ ${#current_tranche[@]} -ge $TRANCHE_SIZE ]]; then
    tranche_num=$((tranche_num + 1))
    flush_tranche "$tranche_num" "${current_tranche[@]}"
    current_tranche=()
  fi
done

# Flush remaining
if [[ ${#current_tranche[@]} -gt 0 ]]; then
  tranche_num=$((tranche_num + 1))
  flush_tranche "$tranche_num" "${current_tranche[@]}"
fi

# --- 5. Also commit the toolkit's own audit files ---------------------
mkdir -p tools/website_import
cp "$MANIFEST" tools/website_import/manifest.tsv
cp "$WORK_DIR/excluded.txt" tools/website_import/excluded.txt
cp "$WORK_DIR/summary.md" tools/website_import/summary.md

if ! git diff --cached --quiet || ! git diff --quiet tools/website_import/manifest.tsv tools/website_import/excluded.txt tools/website_import/summary.md 2>/dev/null; then
  git add tools/website_import/manifest.tsv tools/website_import/excluded.txt tools/website_import/summary.md
  if ! git diff --cached --quiet; then
    git commit -m "Update website-import audit files (manifest, excluded, summary)

Companions to the website-post import tranches: full manifest of every
post that was processed, the log of excluded posts with reasons, and a
human-readable summary of the run."
  fi
fi

# --- 6. Push -----------------------------------------------------------
if [[ $total_new -eq 0 ]]; then
  echo
  echo "No new files imported. Nothing to push."
  exit 0
fi

echo
echo "=== Pushing all tranches ==="
git push origin main

echo
echo "Done. $total_new files imported across $tranche_num tranches."
echo "Audit files committed at tools/website_import/{manifest.tsv,excluded.txt,summary.md}."
