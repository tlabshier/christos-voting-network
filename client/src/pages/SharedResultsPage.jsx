import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import ResultsDisplay from '../components/ResultsDisplay';
import WorldviewProfile from '../components/WorldviewProfile';

const styles = {
  loading: {
    textAlign: 'center',
    padding: 60,
    color: 'var(--text-muted)',
  },
  error: {
    textAlign: 'center',
    padding: 60,
    color: 'var(--error)',
  },
  sharedBanner: {
    textAlign: 'center',
    padding: '12px 20px',
    background: 'rgba(43, 108, 176, 0.06)',
    border: '1px solid rgba(43, 108, 176, 0.15)',
    borderRadius: 'var(--radius)',
    marginBottom: 24,
    fontSize: '0.9rem',
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
};

export default function SharedResultsPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get(`/shares/${token}`)
      .then(res => setShare(res.data.share))
      .catch(() => setError('This shared result was not found or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p style={styles.loading}>Loading shared results...</p>;
  if (error) return (
    <div style={styles.error}>
      <p>{error}</p>
      <button
        style={{ ...styles.primaryBtn, marginTop: 16 }}
        onClick={() => navigate('/')}
      >
        Go to Homepage
      </button>
    </div>
  );

  const data = share.result_data;
  const isBatch = share.is_batch;

  // Batch results
  if (isBatch && Array.isArray(data)) {
    return (
      <>
        <div style={styles.sharedBanner}>
          Shared worldview analysis from Voter's Network
        </div>

        <WorldviewProfile votes={data} />

        <div style={styles.batchHeader}>
          <h1 style={styles.batchTitle}>Individual Issue Analysis</h1>
          <p style={styles.batchSubtitle}>
            Detailed breakdown for {data.length} issue{data.length !== 1 ? 's' : ''}
          </p>
        </div>

        {data.map((vote, idx) => (
          <div key={vote.id || idx}>
            {idx > 0 && <hr style={styles.separator} />}
            <ResultsDisplay
              analysis={vote.analysis}
              position={vote.position}
              issueTitle={vote.issueTitle}
            />
          </div>
        ))}

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/vote')}
            onMouseEnter={e => { e.target.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--primary)'; }}
          >
            Take the Assessment
          </button>
        </div>
      </>
    );
  }

  // Single vote result
  return (
    <>
      <div style={styles.sharedBanner}>
        Shared worldview analysis from Voter's Network
      </div>

      <ResultsDisplay
        analysis={data.analysis}
        position={data.position}
        issueTitle={data.issueTitle}
      />

      <div style={styles.actions}>
        <button
          style={styles.primaryBtn}
          onClick={() => navigate('/vote')}
          onMouseEnter={e => { e.target.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.target.style.background = 'var(--primary)'; }}
        >
          Take the Assessment
        </button>
      </div>
    </>
  );
}
