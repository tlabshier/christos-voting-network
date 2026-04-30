#!/usr/bin/env python3
"""
find_duplicates.py

Scans the RM repo for duplicate or near-duplicate markdown files and
produces a report grouped by suspicion level.

Five kinds of duplicates detected:

1. EXACT — identical body content (after stripping frontmatter and
   normalizing whitespace). Almost certainly a duplicate.

2. NEAR — body content >= 90% similar by shingle overlap. Probably the
   same essay with edits.

3. PARTIAL — distinctive opening phrase shared between files. Possibly
   the same essay or one is an excerpt of the other.

4. DRAFT_CLUSTER — files in a drafts/ folder whose titles or filenames
   suggest they're versions of each other. Expected; flagged for awareness.

5. TITLE_MATCH — different files with very similar YAML titles. Catches
   renames that don't share much body content (or cases where the body
   was rewritten but the topic is the same).

Outputs three files in the output directory:
  duplicates_report.md  — human-readable report grouped by cluster
  duplicates.tsv        — machine-readable per-pair audit
  cleanup_suggestions.sh — suggested git mv / git rm commands (NOT executed)

The script never modifies the repo. Cleanup decisions are case-by-case
and require human review.

Usage:
    python3 find_duplicates.py [--repo-root /path/to/RM] [--output /path/to/out]
"""

import argparse
import hashlib
import re
import sys
from collections import defaultdict
from pathlib import Path


def strip_frontmatter(text):
    """Remove YAML frontmatter from a markdown file."""
    if not text.startswith('---'):
        return text, {}
    end = text.find('\n---', 3)
    if end < 0:
        return text, {}
    fm_block = text[3:end].strip()
    body = text[end + 4:].lstrip()
    fm = {}
    for line in fm_block.split('\n'):
        if ':' in line:
            k, _, v = line.partition(':')
            fm[k.strip()] = v.strip().strip('"').strip("'")
    return body, fm


def normalize(text):
    """Normalize text for comparison: lowercase, collapse whitespace, strip markdown markers."""
    text = re.sub(r'[*_`#>\[\]\(\)\\]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.lower().strip()


def shingles(text, k=8):
    """Word-level k-shingles (sliding window of k consecutive words)."""
    words = text.split()
    if len(words) < k:
        return set()
    return set(' '.join(words[i:i + k]) for i in range(len(words) - k + 1))


def jaccard(a, b):
    """Jaccard similarity between two sets."""
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def first_distinctive_phrase(text, min_words=12, max_words=20):
    """Take the first ~12-20 words from the normalized body."""
    words = text.split()
    if len(words) < min_words:
        return ' '.join(words)
    return ' '.join(words[:max_words])


def title_similarity(t1, t2):
    """Crude title similarity: normalized word-set Jaccard."""
    w1 = set(re.findall(r'\w+', (t1 or '').lower()))
    w2 = set(re.findall(r'\w+', (t2 or '').lower()))
    if not w1 or not w2:
        return 0.0
    return len(w1 & w2) / max(len(w1), len(w2))


def find_md_files(repo_root):
    """Walk the repo and return all markdown files we should consider for duplication."""
    skip_dirs = {'.git', 'node_modules', 'templates', 'tools', 'INDEX', 'archive', 'client', 'server'}
    skip_filenames = {'README.md', 'CLAUDE.md', 'COPYRIGHT.md', 'LICENSE',
                      'MODULES.md', 'RM_Content_Catalog.md', 'RM_bootup.md'}

    results = []
    for path in Path(repo_root).rglob('*.md'):
        # Skip if any parent dir is in skip list
        parts = set(path.relative_to(repo_root).parts)
        if parts & skip_dirs:
            continue
        # Skip module README and OS placeholders
        name = path.name
        if name in skip_filenames:
            continue
        if re.match(r'^C[A-Z]{2}-README\.md$', name):
            continue
        if re.match(r'^C[A-Z]{2}_operating_system\.md$', name):
            continue
        results.append(path)
    return sorted(results)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo-root', default='.', help='Path to the RM repo root')
    parser.add_argument('--output', default='./duplicate_check_output',
                        help='Output directory for the report')
    parser.add_argument('--near-threshold', type=float, default=0.90,
                        help='Jaccard threshold for NEAR duplicates (default 0.90)')
    parser.add_argument('--partial-threshold', type=float, default=0.50,
                        help='Jaccard threshold for PARTIAL matches (default 0.50)')
    parser.add_argument('--title-threshold', type=float, default=0.75,
                        help='Title Jaccard threshold for TITLE_MATCH (default 0.75)')
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Scanning {repo_root}...")
    files = find_md_files(repo_root)
    print(f"Found {len(files)} markdown files to consider.")

    # ─── Load and process every file ───
    file_data = []
    for path in files:
        try:
            text = path.read_text(encoding='utf-8')
        except Exception as e:
            print(f"  WARN: could not read {path}: {e}")
            continue
        body, fm = strip_frontmatter(text)
        norm = normalize(body)
        sh = shingles(norm)
        first = first_distinctive_phrase(norm)
        body_hash = hashlib.sha256(norm.encode('utf-8')).hexdigest()
        file_data.append({
            'path': path,
            'rel_path': str(path.relative_to(repo_root)),
            'body_size': len(body),
            'norm_size': len(norm),
            'fm': fm,
            'title': fm.get('title', ''),
            'date': fm.get('date', ''),
            'module': fm.get('module', ''),
            'wordpress_post_id': fm.get('wordpress_post_id', ''),
            'body_hash': body_hash,
            'shingles': sh,
            'first_phrase': first,
            'is_draft': '/drafts/' in str(path).replace('\\', '/'),
        })

    # ─── 1. EXACT duplicates: same body hash ───
    print("\nFinding EXACT duplicates (identical body content)...")
    by_hash = defaultdict(list)
    for fd in file_data:
        if fd['norm_size'] > 50:  # ignore essentially-empty files
            by_hash[fd['body_hash']].append(fd)
    exact_clusters = [v for v in by_hash.values() if len(v) > 1]

    # ─── 2. NEAR duplicates: high shingle overlap ───
    print("Finding NEAR duplicates (high shingle overlap)...")
    near_pairs = []
    seen_in_exact = set()
    for cluster in exact_clusters:
        for fd in cluster:
            seen_in_exact.add(fd['rel_path'])

    candidates = [fd for fd in file_data
                  if fd['rel_path'] not in seen_in_exact
                  and len(fd['shingles']) > 20]

    for i, a in enumerate(candidates):
        for b in candidates[i + 1:]:
            if len(a['shingles']) < 0.3 * len(b['shingles']) or len(b['shingles']) < 0.3 * len(a['shingles']):
                continue  # too different in size
            sim = jaccard(a['shingles'], b['shingles'])
            if sim >= args.near_threshold:
                near_pairs.append((a, b, sim, 'NEAR'))
            elif sim >= args.partial_threshold:
                near_pairs.append((a, b, sim, 'PARTIAL'))

    near_pairs.sort(key=lambda x: -x[2])

    # ─── 3. TITLE_MATCH: very similar titles even if bodies differ ───
    print("Finding TITLE_MATCH duplicates (similar titles)...")
    title_pairs = []
    already_paired = {(a['rel_path'], b['rel_path']) for a, b, _, _ in near_pairs}
    already_paired |= {(b['rel_path'], a['rel_path']) for a, b, _, _ in near_pairs}

    for i, a in enumerate(file_data):
        if not a['title']:
            continue
        for b in file_data[i + 1:]:
            if not b['title']:
                continue
            if (a['rel_path'], b['rel_path']) in already_paired:
                continue
            ts = title_similarity(a['title'], b['title'])
            if ts >= args.title_threshold:
                # Make sure it's not a coincidence — also check body shingle overlap
                body_sim = jaccard(a['shingles'], b['shingles']) if (a['shingles'] and b['shingles']) else 0.0
                title_pairs.append((a, b, ts, body_sim))

    title_pairs.sort(key=lambda x: -x[2])

    # ─── 4. DRAFT_CLUSTER: drafts of the same essay ───
    print("Finding DRAFT_CLUSTERS...")
    draft_clusters = []
    drafts = [fd for fd in file_data if fd['is_draft']]
    # Group drafts by similar filename roots
    by_root = defaultdict(list)
    for fd in drafts:
        # Strip date prefix and version markers
        stem = Path(fd['rel_path']).stem
        # Remove leading YYMMDD-
        stem = re.sub(r'^\d{6}-', '', stem)
        # Remove draft-version markers
        root = re.sub(r'_(claude|thomas)?_?(first|second|third|fourth|final)?_?draft.*$', '', stem)
        root = re.sub(r'_v\d+(\.\d+)?$', '', root)
        by_root[root].append(fd)
    for root, group in by_root.items():
        if len(group) > 1:
            draft_clusters.append(group)

    # ─── Report ───
    report_path = output_dir / 'duplicates_report.md'
    tsv_path = output_dir / 'duplicates.tsv'
    cleanup_path = output_dir / 'cleanup_suggestions.sh'

    with open(report_path, 'w', encoding='utf-8') as rf, \
         open(tsv_path, 'w', encoding='utf-8') as tf, \
         open(cleanup_path, 'w', encoding='utf-8') as cf:

        cf.write('#!/usr/bin/env bash\n')
        cf.write('# cleanup_suggestions.sh\n')
        cf.write('#\n')
        cf.write('# SUGGESTED git mv / git rm commands for handling detected duplicates.\n')
        cf.write('# DO NOT RUN AS-IS. Each command is a suggestion that requires review.\n')
        cf.write('# Comment out lines that are wrong; uncomment lines you accept.\n')
        cf.write('# Then run from the repo root.\n\n')

        tf.write('cluster_type\tsimilarity\tfile_a\tfile_b\ttitle_a\ttitle_b\tsize_a\tsize_b\tdate_a\tdate_b\twp_id_a\twp_id_b\n')

        rf.write('# Duplicate Detection Report\n\n')
        rf.write(f'**Repo root:** `{repo_root}`\n\n')
        rf.write(f'**Files scanned:** {len(file_data)}\n\n')
        rf.write(f'## Summary\n\n')
        rf.write(f'- EXACT duplicate clusters: {len(exact_clusters)}\n')
        rf.write(f'- NEAR duplicate pairs (>= {args.near_threshold} similarity): '
                 f'{sum(1 for p in near_pairs if p[3] == "NEAR")}\n')
        rf.write(f'- PARTIAL match pairs ({args.partial_threshold}–{args.near_threshold} similarity): '
                 f'{sum(1 for p in near_pairs if p[3] == "PARTIAL")}\n')
        rf.write(f'- TITLE_MATCH pairs (>= {args.title_threshold} title similarity): {len(title_pairs)}\n')
        rf.write(f'- DRAFT clusters: {len(draft_clusters)}\n\n')

        # ─── EXACT ───
        rf.write('## EXACT duplicates\n\n')
        rf.write('Files with byte-identical body content (after frontmatter strip and whitespace normalization). '
                 'These are almost certainly duplicates and one should be removed.\n\n')
        if not exact_clusters:
            rf.write('*(none found)*\n\n')
        for i, cluster in enumerate(exact_clusters, 1):
            rf.write(f'### Cluster E{i} ({len(cluster)} files)\n\n')
            for fd in cluster:
                rf.write(f'- `{fd["rel_path"]}` — {fd["body_size"]:,} bytes — date={fd["date"]} — title={fd["title"]!r}\n')
                tf.write(f'EXACT\t1.0\t{fd["rel_path"]}\t(cluster E{i})\t{fd["title"]}\t\t{fd["body_size"]}\t\t{fd["date"]}\t\t{fd["wordpress_post_id"]}\t\n')
            rf.write('\n')
            cf.write(f'# === EXACT cluster E{i}: {len(cluster)} identical files ===\n')
            cf.write('# Choose ONE to keep, comment-out its line below, run the rest:\n')
            for fd in cluster:
                cf.write(f'git rm "{fd["rel_path"]}"\n')
            cf.write('\n')

        # ─── NEAR ───
        rf.write('## NEAR duplicates\n\n')
        rf.write(f'File pairs with >= {args.near_threshold} body-shingle Jaccard similarity. '
                 'Probably the same essay with edits between versions.\n\n')
        near_only = [p for p in near_pairs if p[3] == 'NEAR']
        if not near_only:
            rf.write('*(none found)*\n\n')
        for i, (a, b, sim, _) in enumerate(near_only, 1):
            rf.write(f'### Pair N{i}: {sim:.0%} similarity\n\n')
            rf.write(f'- `{a["rel_path"]}` ({a["body_size"]:,}B, {a["date"]}) — {a["title"]!r}\n')
            rf.write(f'- `{b["rel_path"]}` ({b["body_size"]:,}B, {b["date"]}) — {b["title"]!r}\n\n')
            rf.write(f'  Opening of A: *{a["first_phrase"][:200]}...*\n\n')
            rf.write(f'  Opening of B: *{b["first_phrase"][:200]}...*\n\n')
            tf.write(f'NEAR\t{sim:.4f}\t{a["rel_path"]}\t{b["rel_path"]}\t{a["title"]}\t{b["title"]}\t{a["body_size"]}\t{b["body_size"]}\t{a["date"]}\t{b["date"]}\t{a["wordpress_post_id"]}\t{b["wordpress_post_id"]}\n')
            cf.write(f'# === NEAR pair N{i}: {sim:.0%} similarity ===\n')
            cf.write(f'# A: {a["rel_path"]} ({a["body_size"]}B, {a["date"]})\n')
            cf.write(f'# B: {b["rel_path"]} ({b["body_size"]}B, {b["date"]})\n')
            cf.write(f'# Decide: keep both (no action), keep one, or merge.\n')
            cf.write(f'# git rm "{a["rel_path"]}"  # uncomment if A is the duplicate\n')
            cf.write(f'# git rm "{b["rel_path"]}"  # uncomment if B is the duplicate\n\n')

        # ─── PARTIAL ───
        rf.write('## PARTIAL matches\n\n')
        rf.write(f'File pairs with {args.partial_threshold}–{args.near_threshold} body-shingle similarity. '
                 'Possibly the same essay reworked, or one excerpts the other.\n\n')
        partial_only = [p for p in near_pairs if p[3] == 'PARTIAL']
        if not partial_only:
            rf.write('*(none found)*\n\n')
        for i, (a, b, sim, _) in enumerate(partial_only, 1):
            rf.write(f'### Pair P{i}: {sim:.0%} similarity\n\n')
            rf.write(f'- `{a["rel_path"]}` ({a["body_size"]:,}B, {a["date"]}) — {a["title"]!r}\n')
            rf.write(f'- `{b["rel_path"]}` ({b["body_size"]:,}B, {b["date"]}) — {b["title"]!r}\n\n')
            tf.write(f'PARTIAL\t{sim:.4f}\t{a["rel_path"]}\t{b["rel_path"]}\t{a["title"]}\t{b["title"]}\t{a["body_size"]}\t{b["body_size"]}\t{a["date"]}\t{b["date"]}\t{a["wordpress_post_id"]}\t{b["wordpress_post_id"]}\n')

        # ─── TITLE_MATCH ───
        rf.write('## TITLE_MATCH (similar titles)\n\n')
        rf.write(f'Files whose YAML titles are >= {args.title_threshold} similar. '
                 'May indicate a rename or two essays on the same topic.\n\n')
        if not title_pairs:
            rf.write('*(none found)*\n\n')
        for i, (a, b, ts, body_sim) in enumerate(title_pairs[:50], 1):  # top 50 only
            rf.write(f'### Pair T{i}: title {ts:.0%} similar, body {body_sim:.0%} similar\n\n')
            rf.write(f'- `{a["rel_path"]}` — {a["title"]!r}\n')
            rf.write(f'- `{b["rel_path"]}` — {b["title"]!r}\n\n')
            tf.write(f'TITLE_MATCH\t{ts:.4f}\t{a["rel_path"]}\t{b["rel_path"]}\t{a["title"]}\t{b["title"]}\t{a["body_size"]}\t{b["body_size"]}\t{a["date"]}\t{b["date"]}\t{a["wordpress_post_id"]}\t{b["wordpress_post_id"]}\n')

        # ─── DRAFT_CLUSTER ───
        rf.write('## DRAFT clusters\n\n')
        rf.write('Files in `drafts/` folders whose names suggest they are versions of the same essay. '
                 'Expected — these are development trails preserved by design. Listed here for awareness.\n\n')
        if not draft_clusters:
            rf.write('*(none found)*\n\n')
        for i, cluster in enumerate(draft_clusters, 1):
            rf.write(f'### Draft cluster D{i} ({len(cluster)} files)\n\n')
            for fd in cluster:
                rf.write(f'- `{fd["rel_path"]}` ({fd["body_size"]:,}B, {fd["date"]})\n')
            rf.write('\n')

    # Make cleanup script executable
    cleanup_path.chmod(0o755)

    print(f"\nDone. Report:")
    print(f"  {report_path}")
    print(f"  {tsv_path}")
    print(f"  {cleanup_path}")
    print(f"\nQuick summary:")
    print(f"  EXACT clusters:  {len(exact_clusters)}")
    print(f"  NEAR pairs:      {sum(1 for p in near_pairs if p[3] == 'NEAR')}")
    print(f"  PARTIAL pairs:   {sum(1 for p in near_pairs if p[3] == 'PARTIAL')}")
    print(f"  TITLE matches:   {len(title_pairs)}")
    print(f"  DRAFT clusters:  {len(draft_clusters)}")


if __name__ == '__main__':
    main()
