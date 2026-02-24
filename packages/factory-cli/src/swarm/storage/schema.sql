-- ============================================================================
-- SWARM Storage Schema - Multi-Phase Session Tracking
-- ============================================================================

-- ============================================================================
-- MASTER SESSION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS swarm_sessions (
  id TEXT PRIMARY KEY,
  program_id INTEGER NOT NULL,
  program_name TEXT NOT NULL,

  -- Status tracking
  status TEXT NOT NULL CHECK(status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED', 'TO_REVIEW', 'ESCALATED')),
  current_phase TEXT NOT NULL CHECK(current_phase IN ('complexity', 'analysis', 'voting', 'consensus', 'double_vote', 'completed')),

  -- Configuration snapshot
  config_snapshot TEXT NOT NULL,

  -- Timing
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  duration_ms INTEGER,

  -- Results
  final_consensus_score REAL,
  final_decision TEXT CHECK(final_decision IN ('PROCEED', 'REJECT', 'TO_REVIEW') OR final_decision IS NULL),

  -- Performance
  total_rounds INTEGER DEFAULT 0,
  total_tokens_cost_usd REAL DEFAULT 0.0,
  total_agents_used INTEGER DEFAULT 0,

  -- Escalation
  escalated BOOLEAN DEFAULT 0,
  escalation_reason TEXT,
  human_decision TEXT,
  human_decision_timestamp TIMESTAMP,

  -- Output
  output_files TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON swarm_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_program ON swarm_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sessions_phase ON swarm_sessions(current_phase);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON swarm_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON swarm_sessions(started_at); -- K3: For time-range analytics queries

-- ============================================================================
-- PHASE 1: COMPLEXITY ASSESSMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS complexity_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  program_id INTEGER NOT NULL,
  program_name TEXT NOT NULL,

  -- Score breakdown
  score_total INTEGER NOT NULL CHECK(score_total BETWEEN 0 AND 100),
  score_expressions REAL NOT NULL,
  score_tables REAL NOT NULL,
  score_nesting REAL NOT NULL,
  score_flags REAL NOT NULL,

  -- Indicators
  expression_count INTEGER NOT NULL,
  table_count INTEGER NOT NULL,
  nesting_depth INTEGER NOT NULL,
  has_business_logic BOOLEAN NOT NULL,
  has_state_management BOOLEAN NOT NULL,
  has_external_integrations BOOLEAN NOT NULL,
  is_critical BOOLEAN NOT NULL,

  -- Classification
  complexity_level TEXT NOT NULL CHECK(complexity_level IN ('SIMPLE', 'MEDIUM', 'COMPLEX', 'CRITICAL')),
  use_swarm BOOLEAN NOT NULL,
  requires_double_vote BOOLEAN NOT NULL,

  -- Metadata
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES swarm_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_complexity_level ON complexity_assessments(complexity_level);
CREATE INDEX IF NOT EXISTS idx_complexity_score ON complexity_assessments(score_total);

-- ============================================================================
-- PHASE 2: AGENT ANALYSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  agent TEXT NOT NULL CHECK(agent IN ('architect', 'analyst', 'developer', 'tester', 'reviewer', 'documentor')),

  -- Analysis output (JSON)
  analysis_data TEXT NOT NULL,
  proposal_data TEXT NOT NULL,

  -- Performance
  duration_ms INTEGER NOT NULL,
  tokens_input INTEGER,
  tokens_output INTEGER,
  tokens_cost_usd REAL,
  model_used TEXT CHECK(model_used IN ('haiku', 'sonnet', 'opus') OR model_used IS NULL),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES swarm_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_analyses_session_round ON agent_analyses(session_id, round_number);
CREATE INDEX IF NOT EXISTS idx_analyses_agent ON agent_analyses(agent);

-- ============================================================================
-- PHASE 3: VOTING ROUNDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS voting_rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  round_number INTEGER NOT NULL CHECK(round_number BETWEEN 1 AND 10),

  -- Consensus result
  consensus_score REAL NOT NULL CHECK(consensus_score BETWEEN 0 AND 100),
  consensus_threshold REAL NOT NULL,
  consensus_passed BOOLEAN NOT NULL,
  recommendation TEXT NOT NULL CHECK(recommendation IN ('PROCEED', 'REVISE', 'REJECT')),

  -- Concerns summary
  concerns_blocker INTEGER DEFAULT 0,
  concerns_major INTEGER DEFAULT 0,
  concerns_minor INTEGER DEFAULT 0,

  -- Veto detection
  veto_triggered BOOLEAN DEFAULT 0,
  veto_agent TEXT,
  veto_reason TEXT,

  -- Stagnation detection
  stagnation_detected BOOLEAN DEFAULT 0,
  previous_round_score REAL,
  score_delta REAL,

  -- Performance
  duration_ms INTEGER NOT NULL,
  total_tokens_cost_usd REAL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES swarm_sessions(id) ON DELETE CASCADE,
  UNIQUE(session_id, round_number)
);

CREATE INDEX IF NOT EXISTS idx_rounds_session ON voting_rounds(session_id);
CREATE INDEX IF NOT EXISTS idx_rounds_number ON voting_rounds(round_number); -- K3: For consensus trend analytics (GROUP BY round_number)
CREATE INDEX IF NOT EXISTS idx_rounds_stagnation ON voting_rounds(stagnation_detected);
CREATE INDEX IF NOT EXISTS idx_rounds_veto ON voting_rounds(veto_triggered);

-- ============================================================================
-- PHASE 3.1: INDIVIDUAL VOTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id INTEGER NOT NULL,
  agent TEXT NOT NULL CHECK(agent IN ('architect', 'analyst', 'developer', 'tester', 'reviewer', 'documentor')),

  -- Vote details
  vote_value TEXT NOT NULL CHECK(vote_value IN ('APPROVE', 'APPROVE_WITH_CONCERNS', 'NEUTRAL', 'REJECT_WITH_SUGGESTIONS', 'REJECT')),
  vote_numeric REAL NOT NULL CHECK(vote_numeric BETWEEN 0 AND 1),
  confidence INTEGER NOT NULL CHECK(confidence BETWEEN 0 AND 100),
  weight REAL NOT NULL CHECK(weight BETWEEN 0 AND 5),

  -- Weighted calculation
  confidence_adjusted REAL NOT NULL,
  weighted_score REAL NOT NULL,

  -- Justification
  justification TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (round_id) REFERENCES voting_rounds(id) ON DELETE CASCADE,
  UNIQUE(round_id, agent)
);

CREATE INDEX IF NOT EXISTS idx_votes_round ON agent_votes(round_id);
CREATE INDEX IF NOT EXISTS idx_votes_agent ON agent_votes(agent);
CREATE INDEX IF NOT EXISTS idx_votes_value ON agent_votes(vote_value);

-- ============================================================================
-- PHASE 3.2: CONCERNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS vote_concerns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vote_id INTEGER NOT NULL,

  -- Concern details
  concern_text TEXT NOT NULL,
  severity TEXT NOT NULL CHECK(severity IN ('BLOCKER', 'MAJOR', 'MINOR')),
  suggestion TEXT NOT NULL,
  category TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (vote_id) REFERENCES agent_votes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_concerns_vote ON vote_concerns(vote_id);
CREATE INDEX IF NOT EXISTS idx_concerns_severity ON vote_concerns(severity);
CREATE INDEX IF NOT EXISTS idx_concerns_category ON vote_concerns(category);

-- ============================================================================
-- PHASE 3.3: SUGGESTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS vote_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vote_id INTEGER NOT NULL,

  suggestion_text TEXT NOT NULL,
  implemented BOOLEAN DEFAULT 0,

  FOREIGN KEY (vote_id) REFERENCES agent_votes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_suggestions_vote ON vote_suggestions(vote_id);

-- ============================================================================
-- PHASE 4: CONSENSUS DECISIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS consensus_decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,

  -- Decision
  decision TEXT NOT NULL CHECK(decision IN ('PROCEED', 'REVISE', 'REJECT', 'ESCALATE')),
  decision_reason TEXT NOT NULL,

  -- Actions taken
  action_taken TEXT,
  revision_applied TEXT,
  next_round_scheduled BOOLEAN DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES swarm_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_decisions_session ON consensus_decisions(session_id);
CREATE INDEX IF NOT EXISTS idx_decisions_decision ON consensus_decisions(decision);

-- ============================================================================
-- PHASE 5: DOUBLE VOTE SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_vote_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,

  -- First vote
  first_vote_round_id INTEGER NOT NULL,
  first_vote_score REAL NOT NULL,
  first_vote_passed BOOLEAN NOT NULL,

  -- Implementation
  implementation_code TEXT NOT NULL,
  implementation_timestamp TIMESTAMP,

  -- Second vote
  second_vote_round_id INTEGER NOT NULL,
  second_vote_score REAL NOT NULL,
  second_vote_passed BOOLEAN NOT NULL,

  -- Final decision
  approved BOOLEAN NOT NULL,
  recommendation TEXT NOT NULL CHECK(recommendation IN ('APPROVED', 'REJECTED', 'NEEDS_REVISION')),
  final_reason TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES swarm_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (first_vote_round_id) REFERENCES voting_rounds(id),
  FOREIGN KEY (second_vote_round_id) REFERENCES voting_rounds(id)
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update session timestamp
CREATE TRIGGER IF NOT EXISTS update_session_timestamp
AFTER UPDATE ON swarm_sessions
BEGIN
  UPDATE swarm_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Auto-categorize concerns
CREATE TRIGGER IF NOT EXISTS categorize_concern
AFTER INSERT ON vote_concerns
WHEN NEW.category IS NULL
BEGIN
  UPDATE vote_concerns
  SET category = CASE
    WHEN concern_text LIKE '%test%' OR concern_text LIKE '%coverage%' THEN 'tests'
    WHEN concern_text LIKE '%security%' OR concern_text LIKE '%SQL injection%' OR concern_text LIKE '%XSS%' THEN 'security'
    WHEN concern_text LIKE '%performance%' OR concern_text LIKE '%slow%' OR concern_text LIKE '%optimize%' THEN 'performance'
    WHEN concern_text LIKE '%business%' OR concern_text LIKE '%logic%' OR concern_text LIKE '%validation%' THEN 'business_logic'
    ELSE 'other'
  END
  WHERE id = NEW.id;
END;

-- Auto-increment total_rounds
CREATE TRIGGER IF NOT EXISTS increment_round_count
AFTER INSERT ON voting_rounds
BEGIN
  UPDATE swarm_sessions
  SET total_rounds = (SELECT COUNT(*) FROM voting_rounds WHERE session_id = NEW.session_id)
  WHERE id = NEW.session_id;
END;

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Session summary
CREATE VIEW IF NOT EXISTS v_session_summary AS
SELECT
  s.id,
  s.program_id,
  s.program_name,
  s.status,
  s.current_phase,
  c.score_total as complexity_score,
  c.complexity_level,
  s.total_rounds,
  s.final_consensus_score,
  s.final_decision,
  s.total_tokens_cost_usd,
  s.duration_ms,
  s.escalated,
  dv.approved as double_vote_approved
FROM swarm_sessions s
LEFT JOIN complexity_assessments c ON s.id = c.session_id
LEFT JOIN double_vote_sessions dv ON s.id = dv.session_id;

-- Agent performance
CREATE VIEW IF NOT EXISTS v_agent_performance AS
SELECT
  s.id as session_id,
  v.agent,
  AVG(v.vote_numeric) as avg_vote_value,
  AVG(v.confidence) as avg_confidence,
  COUNT(DISTINCT r.round_number) as rounds_participated,
  SUM(CASE WHEN v.vote_value = 'REJECT' THEN 1 ELSE 0 END) as reject_count,
  COUNT(c.id) as total_concerns_raised,
  SUM(CASE WHEN c.severity = 'BLOCKER' THEN 1 ELSE 0 END) as blocker_concerns
FROM swarm_sessions s
JOIN voting_rounds r ON s.id = r.session_id
JOIN agent_votes v ON r.id = v.round_id
LEFT JOIN vote_concerns c ON v.id = c.vote_id
GROUP BY s.id, v.agent;

-- Stagnation patterns
CREATE VIEW IF NOT EXISTS v_stagnation_patterns AS
SELECT
  s.id as session_id,
  COUNT(*) as stagnation_events,
  MIN(r.round_number) as first_stagnation_round,
  AVG(r.consensus_score) as avg_score_at_stagnation
FROM swarm_sessions s
JOIN voting_rounds r ON s.id = r.session_id
WHERE r.stagnation_detected = 1
GROUP BY s.id;

-- Cost breakdown
CREATE VIEW IF NOT EXISTS v_cost_breakdown AS
SELECT
  s.id as session_id,
  SUM(CASE WHEN a.round_number = 1 THEN a.tokens_cost_usd ELSE 0 END) as phase_analysis_cost,
  SUM(a.tokens_cost_usd) as total_analysis_cost,
  s.total_tokens_cost_usd as session_total_cost,
  CAST(s.duration_ms AS REAL) / 1000.0 / 60.0 as duration_minutes
FROM swarm_sessions s
LEFT JOIN agent_analyses a ON s.id = a.session_id
GROUP BY s.id;

-- Round scores for consensus trends analysis (K3)
CREATE VIEW IF NOT EXISTS round_scores AS
SELECT
  r.round_number,
  r.consensus_score,
  r.consensus_passed as passed
FROM voting_rounds r;
