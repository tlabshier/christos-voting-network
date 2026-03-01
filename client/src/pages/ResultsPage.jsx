import { useLocation, useNavigate } from 'react-router-dom';
import ResultsDisplay from '../components/ResultsDisplay';
import WorldviewProfile from '../components/WorldviewProfile';
import ShareButton from '../components/ShareButton';
import CommunitySynthesis from '../components/CommunitySynthesis';

const styles = {
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  retakeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  warning: {
    background: 'rgba(214, 158, 46, 0.1)',
    border: '1px solid rgba(214, 158, 46, 0.3)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 20,
    color: 'var(--warning)',
    fontSize: '0.9rem',
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 32,
  },
  primaryBtn: {
    padding: '12px 28px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  secondaryBtn: {
    padding: '12px 28px',
    background: 'transparent',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  noData: {
    textAlign: 'center',
    padding: 40,
    color: 'var(--text-muted)',
  },
  batchHeader: {
    textAlign: 'center',
    marginBottom: 32,
  },
  batchTitle: {
    fontSize: '1.75rem',
    color: 'var(--primary)',
    marginBottom: 8,
  },
  batchSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  separator: {
    border: 'none',
    borderTop: '2px solid var(--border)',
    margin: '36px 0',
  },
};

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // No data at all
  if (!state?.vote && !state?.batchResults) {
    return (
      <div style={styles.noData}>
        <p>No results to display. Vote on an issue first.</p>
        <button
          style={{ ...styles.primaryBtn, marginTop: 16 }}
          onClick={() => navigate('/')}
        >
          Browse Issues
        </button>
      </div>
    );
  }

  // Batch results
  if (state.isBatch && state.batchResults) {
    const results = state.batchResults;
    return (
      <>
        <div style={styles.topNav}>
          <button
            style={styles.backBtn}
            onClick={() => navigate('/')}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
          >
            ← Home
          </button>
          <button
            style={styles.retakeBtn}
            onClick={() => navigate('/vote')}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
          >
            New Session →
          </button>
        </div>

        <WorldviewProfile votes={results} />

        <div style={styles.batchHeader}>
          <h1 style={styles.batchTitle}>Individual Issue Analysis</h1>
          <p style={styles.batchSubtitle}>
            Detailed breakdown for each of the {results.length} issue{results.length !== 1 ? 's' : ''} you voted on
          </p>
        </div>

        {results.map((vote, idx) => (
          <div key={vote.id}>
            {idx > 0 && <hr style={styles.separator} />}
            {vote.warning && <div style={styles.warning}>{vote.warning}</div>}
            <ResultsDisplay
              analysis={vote.analysis}
              position={vote.position}
              issueTitle={vote.issueTitle}
            />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <ShareButton resultData={results} isBatch={true} />
        </div>

        <div className="results-actions" style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/vote')}
            onMouseEnter={e => { e.target.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--primary)'; }}
          >
            Start New Session
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate('/')}
          >
            Browse Issues
          </button>
        </div>
      </>
    );
  }

  // Single vote result
  const { vote, warning, issueTitle } = state;
  const singleResultData = { ...vote, issueTitle };
  return (
    <>
      <div style={styles.topNav}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          ← Home
        </button>
        <button
          style={styles.retakeBtn}
          onClick={() => navigate('/vote')}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
        >
          Full Session →
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}

      <ResultsDisplay
        analysis={vote.analysis}
        position={vote.position}
        issueTitle={issueTitle}
      />

      {/* Community Synthesis */}
      <CommunitySynthesis
        issueId={vote.issueId}
        userPosition={vote.position}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <ShareButton resultData={singleResultData} isBatch={false} />
      </div>

      <div className="results-actions" style={styles.actions}>
        <button
          style={styles.primaryBtn}
          onClick={() => navigate('/')}
          onMouseEnter={e => { e.target.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.target.style.background = 'var(--primary)'; }}
        >
          Vote on Another Issue
        </button>
        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/vote')}
        >
          Start Full Session
        </button>
      </div>
    </>
  );
}
