#!/usr/bin/env python3
"""
wordpress_to_repo.py

Converts a WordPress XML export into a tree of markdown files with YAML
frontmatter, ready to be committed to the Renaissance Ministries repo.

Usage:
    python3 wordpress_to_repo.py \\
        --xml /path/to/website_export.xml \\
        --output /path/to/output_dir \\
        [--repo-root /path/to/RM/repo]

Without --repo-root, files are written to <output_dir>/converted/ for
inspection. With --repo-root, files are also placed in the corresponding
module folders (creating new module folders as needed) for staging.

Outputs:
    <output_dir>/manifest.tsv     - audit trail: every post + decision
    <output_dir>/converted/       - per-tranche subfolders of converted files
    <output_dir>/excluded.txt     - log of excluded posts with reasons
    <output_dir>/summary.md       - human-readable summary report
"""

import argparse
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

try:
    from markdownify import markdownify as md_convert
except ImportError:
    print("ERROR: markdownify not installed. Run: pip install markdownify", file=sys.stderr)
    sys.exit(1)

# WordPress XML namespaces
NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}


# ──────────────────────────────────────────────────────────────────────
# CATEGORY → MODULE ROUTING
# ──────────────────────────────────────────────────────────────────────

# WordPress category nicename → (RM module ID, optional sub-path, optional topic tag)
# Most specific match wins when a post has multiple categories.
# Specificity ordering: lower index = more specific.
CATEGORY_PRIORITY = [
    'christos-historical-review',
    'christos-conspiracy-review',
    'christos-movie-reviews',
    'christos-grammar',
    'newsletter',
    'apologetics',
    'bible-verse-analysis',
    'world-religions-theology-philosophy',
    'sermon-meeting-discussion-transcripts',
    'politics',
    'important-essential-core-essays',
    'physics-christianity-life',
    'consciousness-physics-spirit',
    'uncategorized',
]

CATEGORY_ROUTES = {
    'christos-historical-review':           ('CHR', 'essays', None),
    'christos-conspiracy-review':           ('CCR', 'essays', None),
    'christos-movie-reviews':               ('CFE', 'essays', 'movie_review'),
    'christos-grammar':                     ('CAI', None,     None),
    'newsletter':                           ('CNL', 'articles', None),
    'apologetics':                          ('CAP', 'essays', None),
    'bible-verse-analysis':                 ('CAP', 'essays', 'bible_verse_analysis'),
    'world-religions-theology-philosophy':  ('CWR', 'essays', None),
    'sermon-meeting-discussion-transcripts': ('CFE', 'transcripts', None),
    'politics':                             ('CFE', 'essays', 'politics'),
    'important-essential-core-essays':      ('CFE', 'essays', 'core'),
    'physics-christianity-life':            ('CFE', 'essays', 'physics_christianity'),
    'consciousness-physics-spirit':         ('CFE', 'essays', 'consciousness_physics_spirit'),
    'uncategorized':                        ('CFE', 'essays', None),
}

# Per-post overrides keyed by WordPress post ID. These trump category routing.
# Format: post_id -> (module, subpath_or_None, [extra_topics], notes)
POST_OVERRIDES = {
    # ─── Christos-XXX module-seed posts ───
    # Each becomes a seed for a new module (or website material for existing modules).

    '3476': ('CCN', None, ['post_scarcity', 'meaning_of_life', 'counseling'],
             'Post-Scarcity Meaning of Life - Christos Counselor — seed for new module CCN'),
    '3485': ('CGL', None, ['equipping_saints', 'group_leader', 'fellowship_leadership'],
             'Equipping the Saints - Christos Group Leader — seed for new module CGL'),
    '3517': ('CDI', None, ['effective_counsel', 'diagnostician', 'counseling_skill'],
             'Effective Counsel - Christos Diagnostician — seed for new module CDI'),
    '3520': ('CMT', None, ['medical_testimony', 'healing'],
             'Christos Medical Testimony — seed for new module CMT'),
    '3522': ('CCK', None, ['cross_check', 'verification'],
             'Christos Cross Check — seed for new module CCK'),
    '3527': ('CVN', 'website', ['voting_network', 'website_seed'],
             'Christos Voting Network — original website page; seeds CVN/website/'),
    '3544': ('CCN', None, ['counseling', 'pastoral_training'],
             'Christos Counselor (Founder Grounding) — secondary seed for new module CCN'),
    '3551': ('CLO', None, ['logos', 'word', 'incarnation'],
             'Christos Logos — seed for new module CLO'),
    '3569': ('CSE', None, ['seminar', 'gateway'],
             'Christos Seminar - The Gateway — seed for new module CSE'),
    '3702': ('CVN', 'website', ['voting_network', 'website_seed', 'v2'],
             'Christos Voting Network V2 — CVN website material'),
    '3712': ('CFE', 'essays', ['life_mandala', 'mike_sherman'],
             'The Life Mandala Incorporating All Perspectives — CFE'),
    '3718': ('CVN', 'website', ['voting_network', 'website_seed', 'v2', 'judgment_persuasion'],
             'Christos Voting Network V2 (Judgment & Persuasion) — CVN website material'),
    '3723': ('CVN', 'website', ['voting_network', 'cvn_v2_full_os', 'website_seed'],
             'CVN-2-Full OS — CVN website material'),
    '3778': ('CCR', 'website', ['conspiracy_review', 'website_seed'],
             'Christos Conspiracy Review — original website page; seeds CCR/website/'),
    '3791': ('CAI', None, ['theological_grammar', 'website_seed'],
             'Christos AI Theological Grammar — website version'),

    # ─── User-requested explicit overrides ───
    # Post 3033: user said to import despite CPP-only categorization
    '3033': ('CFE', 'essays', ['cpp', 'physics_journal_article', 'version_7_2'],
             'CPP journal article version — imported to RM by user request'),
    # Post 2716: Homeopathic Frequency Generator — naturopathic medicine
    '2716': ('CMD', 'essays', ['homeopathy', 'frequency_generator'],
             'Naturopathic medicine — routed to CMD (Christos Medicine)'),
    # Post 2748: Theology and Science Integration in a TOE — preserve in CFE
    '2748': ('CFE', 'essays', ['theology_science_integration', 'toe'],
             'Theology + science integration; preserved in CFE'),
}


# Modules that need to be created (don't exist as folders yet on origin/main).
# Existing modules per taxonomy v1.1: CCR CEA CFE CHR CHS CNL CRF CVN
NEW_MODULE_DEFINITIONS = {
    'CAI': ('Christos AI', 'Meta-module: AI personas, system prompts, eval suites, theological grammar.'),
    'CAP': ('Christos Apologetics', 'Biblical commentary; engagement with other Christian commentators.'),
    'CCN': ('Christos Counselor', 'Pastoral counseling, founder grounding/training, post-scarcity meaning.'),
    'CCK': ('Christos Cross Check', 'Verification, fact-checking, claim auditing in service of truth.'),
    'CDI': ('Christos Diagnostician', 'Counseling diagnosis as gift and skill; holistic system thinking applied to people.'),
    'CGL': ('Christos Group Leader', 'Equipping the saints; small-group/fellowship leadership formation.'),
    'CLO': ('Christos Logos', 'The Word/Logos as creative principle; theology of meaning and incarnation.'),
    'CMD': ('Christos Medicine', 'Anatomy, physiology, naturopathic and conventional medicine.'),
    'CMT': ('Christos Medical Testimony', 'Healing testimonies and medical witness.'),
    'CSE': ('Christos Seminar', 'Christos Seminar series — gateway, foundational teaching.'),
    'CWR': ('Christos World Religions', 'Islam, Hinduism, Buddhism, Shinto, Sikhism, Zoroastrianism, paganism.'),
}


# ──────────────────────────────────────────────────────────────────────
# UTILITIES
# ──────────────────────────────────────────────────────────────────────

def slugify(text, max_length=60):
    """Produce a filesystem-safe slug from arbitrary text."""
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r"[^\w\s-]", '', text).strip().lower()
    text = re.sub(r"[-\s]+", '_', text)
    return text[:max_length].rstrip('_') or 'untitled'


def get_text(elem, default=''):
    """Safely extract text from an XML element."""
    if elem is None:
        return default
    return (elem.text or default).strip()


def parse_date(date_str):
    """Parse 'YYYY-MM-DD HH:MM:SS' or empty into a datetime or None."""
    if not date_str or date_str.startswith('0000'):
        return None
    try:
        return datetime.strptime(date_str.strip(), '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return None


def yaml_string(s):
    """Quote a string for safe YAML output (handles colons, quotes, etc.)."""
    s = (s or '').replace('"', '\\"').replace('\n', ' ').strip()
    return f'"{s}"'


def yaml_list(items):
    """Format a list for YAML inline syntax."""
    if not items:
        return '[]'
    return '[' + ', '.join(items) + ']'


# ──────────────────────────────────────────────────────────────────────
# POST EXTRACTION & CLASSIFICATION
# ──────────────────────────────────────────────────────────────────────

def extract_post(item):
    """Pull all relevant fields from a WordPress <item> element."""
    return {
        'id':          get_text(item.find('wp:post_id', NS)),
        'title':       get_text(item.find('title')),
        'link':        get_text(item.find('link')),
        'creator':     get_text(item.find('dc:creator', NS)),
        'pub_date':    get_text(item.find('wp:post_date', NS)),
        'mod_date':    get_text(item.find('wp:post_modified', NS)),
        'status':      get_text(item.find('wp:status', NS)),
        'post_type':   get_text(item.find('wp:post_type', NS)),
        'post_name':   get_text(item.find('wp:post_name', NS)),
        'body':        get_text(item.find('content:encoded', NS)),
        'excerpt':     get_text(item.find('excerpt:encoded',
                                         {'excerpt': 'http://wordpress.org/export/1.2/excerpt/'})),
        'categories':  [(c.get('domain', ''), c.get('nicename', ''), (c.text or '').strip())
                        for c in item.findall('category')],
    }


def categorize_post(post):
    """
    Decide what to do with a post:
      Returns ('include', module, subpath, topics, notes) or
              ('exclude', reason)
    """
    pid = post['id']
    title = post['title']
    body = post['body']
    status = post['status']
    cats = post['categories']

    # Build the set of category nicenames (domain == 'category')
    cat_nicenames = {nice for (dom, nice, _) in cats if dom == 'category'}
    # And tag nicenames (domain == 'post_tag') — used as topic tags
    tag_nicenames = {nice for (dom, nice, _) in cats if dom == 'post_tag'}

    # ── Per-post override (highest priority) ──
    if pid in POST_OVERRIDES:
        module, subpath, topics, notes = POST_OVERRIDES[pid]
        return ('include', module, subpath, list(topics), 'override: ' + notes)

    # ── Hard exclusions ──
    if status == 'trash':
        return ('exclude', 'status=trash')

    if not title and not body.strip():
        return ('exclude', 'empty title and empty body')

    if len(body) < 1024:
        # Test/junk posts — but allow them through if titled meaningfully
        if any(test_word in (title or '').lower() for test_word in ['test', 'iframe', 'placeholder']):
            return ('exclude', f'test/junk post (size={len(body)} bytes)')
        if not title:
            return ('exclude', f'no title and very short body ({len(body)} bytes)')

    # CPP filter: title-based exclusion catches mis-tagged CPP papers
    # Many RM essays are tagged with CPP categories but are not physics papers.
    # We exclude only when the title clearly indicates a physics paper.
    PHYSICS_TITLE_PATTERNS = [
        r'^Conscious Point Physics',
        r'^CPP\s*[-:—]',
        r'\bCPP\b',
        r'^The Theory of Absolutes',
        r'\bMathematical Formalism\b',
        r'\bQuantum (Tunneling|Chromodynamics|Superposition)\b',
        r'\bQuark (Dipole|Confinement)\b',
        r'\bPair Production\b',
        r'\bMass Calibration\b',
        r'\bElectron Orbital\b',
        r'\bSpeed of Light\b',
        r'\bStandard Model\b',
        r'\bBlack Hol',
        r'\bDipole Sea\b',
        r'\b[A-Z][a-z]* Equation\b',
        r'^Foundations of Quantum',
        r'\bDual Slit\b',
        r'\bDark (Energy|Matter)\b',
        r'\bConscious Point\b',
        r'\bElectroweak Sector\b',
        r'\bPostulates\b.*\bConscious Point\b',
        r'\bTheory of Everything\b',
        r'\bTOE\b',
    ]
    if any(re.search(pat, title, re.IGNORECASE) for pat in PHYSICS_TITLE_PATTERNS):
        return ('exclude', f'title matches physics-paper pattern → CPP repo material')

    # Pure CPP-category posts that survived the title filter: include them in CFE.
    # These are RM-flavored essays that happened to get CPP-only categorization.
    CPP_CATEGORIES = {'consciousness-physics-spirit', 'physics-christianity-life'}
    if cat_nicenames and cat_nicenames <= CPP_CATEGORIES:
        topics_for_cpp = list(tag_nicenames)
        if 'cpp_adjacent' not in topics_for_cpp:
            topics_for_cpp.append('cpp_adjacent')
        return ('include', 'CFE', 'essays', topics_for_cpp,
                f'CPP-tagged but title not physics-paper-pattern; routed to CFE')

    # ── Category-based routing: most specific category wins ──
    chosen_cat = None
    for cat_priority in CATEGORY_PRIORITY:
        if cat_priority in cat_nicenames:
            chosen_cat = cat_priority
            break

    if chosen_cat is None:
        # No recognized category — default to CFE
        return ('include', 'CFE', 'essays', list(tag_nicenames),
                f'no recognized category in {sorted(cat_nicenames)}; defaulted to CFE')

    module, subpath, extra_topic = CATEGORY_ROUTES[chosen_cat]
    topics = list(tag_nicenames)
    if extra_topic and extra_topic not in topics:
        topics.append(extra_topic)

    # Add a tag for any CPP categories the post also has (since we didn't exclude it)
    if cat_nicenames & CPP_CATEGORIES:
        if 'cpp_adjacent' not in topics:
            topics.append('cpp_adjacent')

    return ('include', module, subpath, topics,
            f'category routing: {chosen_cat} → {module}')


# ──────────────────────────────────────────────────────────────────────
# CONVERSION
# ──────────────────────────────────────────────────────────────────────

def html_to_markdown(html):
    """Convert WordPress post HTML to clean markdown."""
    if not html:
        return ''

    # markdownify settings: ATX-style headers, no escape of asterisks/underscores
    md = md_convert(
        html,
        heading_style='ATX',
        bullets='-',
        strip=['script', 'style'],
        escape_asterisks=False,
        escape_underscores=False,
    )

    # Cleanup pass:
    # 1. Collapse runs of 3+ blank lines to 2
    md = re.sub(r'\n{3,}', '\n\n', md)
    # 2. Strip trailing whitespace per line
    md = '\n'.join(line.rstrip() for line in md.split('\n'))
    # 3. Decode WordPress &nbsp; entities that sometimes survive
    md = md.replace('\xa0', ' ')
    # 4. Trim leading/trailing whitespace overall
    md = md.strip() + '\n'

    return md


def build_frontmatter(post, module, topics, status_override=None, notes=None):
    """Build the YAML frontmatter block for a converted post."""
    title = post['title'] or '(untitled)'
    pub_dt = parse_date(post['pub_date']) or parse_date(post['mod_date'])
    date_str = pub_dt.strftime('%Y-%m-%d') if pub_dt else 'unknown'

    # Map WordPress status to RM status
    if status_override:
        rm_status = status_override
    elif post['status'] == 'publish':
        rm_status = 'ESTABLISHED'
    elif post['status'] == 'draft':
        rm_status = 'PROVISIONAL'
    elif post['status'] == 'private':
        rm_status = 'PROVISIONAL'
    else:
        rm_status = 'PROVISIONAL'

    lines = [
        '---',
        f'title: {yaml_string(title)}',
        f'author: "Thomas Lee Abshier, ND"',
        f'date: {date_str}',
        f'module: {module}',
    ]

    if topics:
        # YAML inline-list of topic strings
        topics_yaml = '[' + ', '.join(topics) + ']'
        lines.append(f'topics: {topics_yaml}')

    lines.append(f'status: {rm_status}')
    lines.append(f'type: essay')

    if post['link']:
        lines.append(f'source_url: "{post["link"]}"')

    if post['id']:
        lines.append(f'wordpress_post_id: {post["id"]}')

    if post['status'] == 'draft':
        lines.append(f'wordpress_status: draft')
    elif post['status'] == 'private':
        lines.append(f'wordpress_status: private')

    if notes:
        lines.append(f'import_notes: {yaml_string(notes)}')

    lines.append('---')
    lines.append('')
    return '\n'.join(lines)


def build_filename(post):
    """Build the YYMMDD-slug.md filename per Thomas's convention."""
    pub_dt = parse_date(post['pub_date']) or parse_date(post['mod_date'])
    date_prefix = pub_dt.strftime('%y%m%d') if pub_dt else '000000'

    slug = post['post_name'] or slugify(post['title'])
    if not slug or slug == 'untitled':
        slug = f'untitled_post_{post["id"]}'

    return f'{date_prefix}-{slug}.md'


def build_destination_path(module, subpath, post, output_root):
    """Build the destination path for a converted post."""
    # Module folder follows convention: Cxx_christos_<module_name_underscored>
    # We need the full folder name. Build a lookup.
    MODULE_FOLDERS = {
        'CCR': 'CCR_christos_conspiracy_review',
        'CEA': 'CEA_christos_economic_annex',
        'CFE': 'CFE_christos_fellowship_essays',
        'CHR': 'CHR_christos_historical_review',
        'CHS': 'CHS_christos_home_school',
        'CNL': 'CNL_christos_newsletter',
        'CRF': 'CRF_christos_rigorous_framework',
        'CVN': 'CVN_christos_voting_network',
        'CAI': 'CAI_christos_ai',
        'CAP': 'CAP_christos_apologetics',
        'CAR': 'CAR_christos_arts',
        'CCC': 'CCC_christos_christianity_catalog',
        'CCD': 'CCD_christos_candidate_dossiers',
        'CCG': 'CCG_christos_cults_gurus',
        'CCK': 'CCK_christos_cross_check',
        'CCN': 'CCN_christos_counselor',
        'CDI': 'CDI_christos_diagnostician',
        'CGL': 'CGL_christos_group_leader',
        'CHB': 'CHB_christos_hobbies',
        'CLG': 'CLG_christos_legislation',
        'CLO': 'CLO_christos_logos',
        'CMD': 'CMD_christos_medicine',
        'CMT': 'CMT_christos_medical_testimony',
        'CPL': 'CPL_christos_political_theory',
        'CPS': 'CPS_christos_psychology',
        'CSE': 'CSE_christos_seminar',
        'CSH': 'CSH_christos_secular_humanist',
        'CTC': 'CTC_christos_technology_commentary',
        'CWR': 'CWR_christos_world_religions',
    }

    module_folder = MODULE_FOLDERS[module]
    base = Path(output_root) / module_folder

    # Drafts go to a drafts/ subfolder of whatever subpath was chosen (or essays/ default)
    if post['status'] == 'draft':
        if subpath:
            return base / subpath / 'drafts' / build_filename(post)
        else:
            return base / 'drafts' / build_filename(post)

    if subpath:
        return base / subpath / build_filename(post)
    else:
        # Override posts (Christos seed posts) go directly in module root,
        # and they become the operating-system seed
        return base / build_filename(post)


# ──────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--xml', required=True, help='Path to WordPress XML export')
    parser.add_argument('--output', required=True, help='Output directory for converted files')
    parser.add_argument('--tranche-size', type=int, default=30,
                        help='Files per tranche (default 30)')
    args = parser.parse_args()

    xml_path = Path(args.xml)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    converted_dir = output_dir / 'converted'
    converted_dir.mkdir(exist_ok=True)

    print(f"Parsing {xml_path}...")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find('channel')

    items = channel.findall('item')
    posts = [extract_post(i) for i in items
             if get_text(i.find('wp:post_type', NS)) == 'post']
    print(f"Found {len(posts)} posts (filtering out attachments and other types).")

    # ── Classify ──
    included = []
    excluded = []
    for p in posts:
        result = categorize_post(p)
        if result[0] == 'include':
            _, module, subpath, topics, notes = result
            included.append((p, module, subpath, topics, notes))
        else:
            _, reason = result
            excluded.append((p, reason))

    print(f"\nIncluded: {len(included)}")
    print(f"Excluded: {len(excluded)}")

    # ── Convert each included post ──
    print(f"\nConverting and writing files...")
    module_counts = Counter()
    new_module_seeds = defaultdict(list)  # module -> list of seed posts
    written_files = []

    for (post, module, subpath, topics, notes) in included:
        markdown_body = html_to_markdown(post['body'])
        frontmatter = build_frontmatter(post, module, topics, notes=notes if 'override' in notes or 'no recognized' in notes else None)
        full_text = frontmatter + markdown_body

        dest_path = build_destination_path(module, subpath, post, converted_dir)
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        dest_path.write_text(full_text, encoding='utf-8')

        module_counts[module] += 1
        written_files.append((post, module, subpath, dest_path))

        # Track Christos-XXX seed posts for the new modules
        if post['id'] in POST_OVERRIDES and module in NEW_MODULE_DEFINITIONS:
            new_module_seeds[module].append((post, dest_path))

    # ── Generate seed README + operating_system stubs for new modules ──
    for module, name_desc in NEW_MODULE_DEFINITIONS.items():
        if module_counts[module] == 0:
            continue  # no posts landed in this module; don't create the folder
        full_name, description = name_desc
        module_folder_name = {
            'CAI': 'CAI_christos_ai',
            'CAP': 'CAP_christos_apologetics',
            'CCK': 'CCK_christos_cross_check',
            'CCN': 'CCN_christos_counselor',
            'CDI': 'CDI_christos_diagnostician',
            'CGL': 'CGL_christos_group_leader',
            'CLO': 'CLO_christos_logos',
            'CMD': 'CMD_christos_medicine',
            'CMT': 'CMT_christos_medical_testimony',
            'CSE': 'CSE_christos_seminar',
            'CWR': 'CWR_christos_world_religions',
        }.get(module)
        if not module_folder_name:
            continue

        module_dir = converted_dir / module_folder_name
        module_dir.mkdir(parents=True, exist_ok=True)

        readme_path = module_dir / f'{module}-README.md'
        if not readme_path.exists():
            seed_files = new_module_seeds.get(module, [])
            seed_list = '\n'.join(f'- `{p[1].name}` (WordPress post {p[0]["id"]})' for p in seed_files) or '(none)'
            readme_path.write_text(
                f'''# {full_name} ({module})

**Status:** PROVISIONAL — module created during website import (April 2026).

## Purpose

{description}

## Origin

This module was created as part of the WordPress-to-repo migration. The
website seed material that prompted its creation:

{seed_list}

## Operating system

See `{module}_operating_system.md` (placeholder; to be developed).

## Status

This module is in an early, provisional state. The seed post(s) listed
above are the starting material; module scope, naming, and structure
may be refined as content accrues. See `templates/RM_module_taxonomy.md`
for the canonical module list.

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
''', encoding='utf-8')

        os_path = module_dir / f'{module}_operating_system.md'
        if not os_path.exists():
            os_path.write_text(
                f'''# {full_name} — Operating System (Placeholder)

**Status:** PROVISIONAL — placeholder created during website import.

This is a placeholder operating-system document for the {module} module.
The substantive content for this module's operating system will be
developed from the seed material imported from the website (see
`{module}-README.md`) and from future fellowship discussion.

Until the substantive operating system is written, refer to:
- `templates/RM_module_taxonomy.md` for module convention and folder structure
- `templates/RM_frontmatter_convention.md` for content metadata
- `templates/authors_voice.md` for voice
- The seed post(s) imported from the website as the initial substantive content

---

**Renaissance Ministries | Hyperphysics Institute**
*One heart to make Christ King.*
''', encoding='utf-8')

    # ── Tranching ──
    # Sort included files by date for deterministic tranching
    written_files.sort(key=lambda t: (parse_date(t[0]['pub_date']) or datetime(2000, 1, 1)))
    tranches = []
    for i in range(0, len(written_files), args.tranche_size):
        tranches.append(written_files[i:i + args.tranche_size])

    # ── Write manifest ──
    manifest_path = output_dir / 'manifest.tsv'
    with open(manifest_path, 'w', encoding='utf-8') as mf:
        mf.write('post_id\tdate\ttitle\tstatus\tmodule\tsubpath\tdest_path\ttopics\tnotes\n')
        for (post, module, subpath, dest_path) in written_files:
            pub_dt = parse_date(post['pub_date']) or parse_date(post['mod_date'])
            date_s = pub_dt.strftime('%Y-%m-%d') if pub_dt else 'unknown'
            rel_dest = dest_path.relative_to(converted_dir)
            # find the topics from the included tuple
            topics_for_post = ''
            for (p2, m2, sp2, t2, n2) in included:
                if p2['id'] == post['id']:
                    topics_for_post = ','.join(t2)
                    break
            mf.write(f'{post["id"]}\t{date_s}\t{post["title"]}\t{post["status"]}\t{module}\t{subpath or ""}\t{rel_dest}\t{topics_for_post}\t\n')

    # ── Write excluded log ──
    excluded_path = output_dir / 'excluded.txt'
    with open(excluded_path, 'w', encoding='utf-8') as ef:
        ef.write(f'# Excluded posts: {len(excluded)}\n\n')
        for (post, reason) in excluded:
            ef.write(f'[{post["id"]}] {post["title"][:80]}\n')
            ef.write(f'    REASON: {reason}\n')
            ef.write(f'    URL:    {post["link"]}\n')
            ef.write(f'    SIZE:   {len(post["body"])} bytes\n\n')

    # ── Write summary report ──
    summary_path = output_dir / 'summary.md'
    with open(summary_path, 'w', encoding='utf-8') as sf:
        sf.write('# Website Import Summary\n\n')
        sf.write(f'**Source:** {xml_path}\n')
        sf.write(f'**Run date:** {datetime.now().strftime("%Y-%m-%d %H:%M")}\n\n')
        sf.write(f'## Counts\n\n')
        sf.write(f'- Total posts in XML: {len(posts)}\n')
        sf.write(f'- Included: {len(included)}\n')
        sf.write(f'- Excluded: {len(excluded)}\n')
        sf.write(f'- Tranches: {len(tranches)} (target {args.tranche_size}/tranche)\n\n')

        sf.write(f'## Files per module\n\n')
        sf.write('| Module | Count | Status |\n|---|---|---|\n')
        for module in sorted(module_counts):
            existing = module in {'CCR', 'CEA', 'CFE', 'CHR', 'CHS', 'CNL', 'CRF', 'CVN'}
            sf.write(f'| {module} | {module_counts[module]} | {"existing" if existing else "NEW"} |\n')

        sf.write(f'\n## New modules created\n\n')
        for m, (name, _) in NEW_MODULE_DEFINITIONS.items():
            if module_counts[m] > 0:
                sf.write(f'- **{m}** ({name}): {module_counts[m]} files\n')

        sf.write(f'\n## Tranches\n\n')
        for i, tranche in enumerate(tranches, 1):
            first = tranche[0][0]
            last = tranche[-1][0]
            first_date = (parse_date(first["pub_date"]) or parse_date(first["mod_date"]))
            last_date = (parse_date(last["pub_date"]) or parse_date(last["mod_date"]))
            first_s = first_date.strftime('%Y-%m-%d') if first_date else '?'
            last_s = last_date.strftime('%Y-%m-%d') if last_date else '?'
            sf.write(f'- Tranche {i}: {len(tranche)} files, {first_s} to {last_s}\n')

    print(f"\nDone. Outputs:")
    print(f"  Converted files: {converted_dir}")
    print(f"  Manifest:        {manifest_path}")
    print(f"  Excluded log:    {excluded_path}")
    print(f"  Summary:         {summary_path}")
    print(f"\n{len(included)} files in {len(tranches)} tranches of {args.tranche_size}.")


if __name__ == '__main__':
    main()
