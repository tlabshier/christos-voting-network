CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK(subscription_tier IN ('free', 'basic', 'premium')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    vote_type TEXT NOT NULL DEFAULT 'scale' CHECK(vote_type IN ('scale', 'binary')),
    scale_label_low TEXT NOT NULL DEFAULT 'Strongly Disagree',
    scale_label_high TEXT NOT NULL DEFAULT 'Strongly Agree',
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    position INTEGER NOT NULL CHECK(position >= 0 AND position <= 100),
    -- Multi-axis polling dimensions
    agreement INTEGER CHECK(agreement >= 1 AND agreement <= 10),
    confidence INTEGER CHECK(confidence >= 1 AND confidence <= 10),
    importance INTEGER CHECK(importance >= 1 AND importance <= 10),
    biblical_alignment_input INTEGER CHECK(biblical_alignment_input >= 1 AND biblical_alignment_input <= 10),
    framework TEXT,
    custom_responses TEXT,  -- JSON: [{questionId, questionText, answer}]
    ip_address TEXT,
    -- Original analysis fields
    worldview_label TEXT,
    alignment_scores TEXT,
    summary TEXT,
    suggested_reflections TEXT,
    -- Expanded analysis fields
    biblical_alignment_score INTEGER,
    key_perspectives TEXT,       -- JSON array
    points_of_agreement TEXT,    -- JSON array
    points_of_tension TEXT,      -- JSON array
    remaining_questions TEXT,    -- JSON array
    biblical_touchpoints TEXT,   -- JSON array
    pathway_signal TEXT,         -- JSON object
    raw_claude_response TEXT,
    claude_model TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cache AI-generated custom questions per issue
CREATE TABLE IF NOT EXISTS generated_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id),
    questions_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Community synthesis cache per issue
CREATE TABLE IF NOT EXISTS community_synthesis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER UNIQUE NOT NULL REFERENCES issues(id),
    synthesis_json TEXT NOT NULL,
    vote_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shared_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    share_token TEXT UNIQUE NOT NULL,
    result_data TEXT NOT NULL,
    is_batch INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_issues_is_active ON issues(is_active);
CREATE INDEX IF NOT EXISTS idx_shared_results_token ON shared_results(share_token);
CREATE INDEX IF NOT EXISTS idx_generated_questions_issue ON generated_questions(issue_id);
CREATE INDEX IF NOT EXISTS idx_community_synthesis_issue ON community_synthesis(issue_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip ON votes(ip_address);
