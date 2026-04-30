#!/usr/bin/env bash
# run_duplicate_check.sh
#
# Runs the duplicate detector against the RM repo.
#
# Usage (from repo root):
#   bash tools/duplicate_detector/run_duplicate_check.sh
#
# Outputs three files in ~/duplicate_check_output/:
#   duplicates_report.md      - human-readable report
#   duplicates.tsv            - machine-readable per-pair audit
#   cleanup_suggestions.sh    - suggested git commands (review before running)
#
# The script never modifies the repo. Cleanup decisions are case-by-case.

set -euo pipefail

if [[ ! -f RM_bootup.md ]] || [[ ! -d templates ]]; then
  echo "ERROR: This does not look like the RM repo root."
  echo "       cd into the repo root and re-run."
  exit 1
fi

DETECTOR="tools/duplicate_detector/find_duplicates.py"
if [[ ! -f "$DETECTOR" ]]; then
  echo "ERROR: $DETECTOR not found."
  echo "       Run import_duplicate_detector.sh first to install the toolkit."
  exit 1
fi

OUTPUT_DIR="${OUTPUT_DIR:-$HOME/duplicate_check_output}"
mkdir -p "$OUTPUT_DIR"

echo "Running duplicate detector..."
echo "  Repo:    $(pwd)"
echo "  Output:  $OUTPUT_DIR"
echo

python3 "$DETECTOR" \
  --repo-root . \
  --output "$OUTPUT_DIR"

echo
echo "Done. Open $OUTPUT_DIR/duplicates_report.md to review."
echo
echo "If the report identifies clusters you want to clean up:"
echo "  1. Open $OUTPUT_DIR/cleanup_suggestions.sh in a text editor"
echo "  2. Uncomment the 'git rm' lines you want to execute"
echo "  3. Run from the repo root:"
echo "       bash $OUTPUT_DIR/cleanup_suggestions.sh"
echo "       git commit -m 'Remove duplicate files identified by detector'"
echo "       git push origin main"
