import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import IssueCard from '../components/IssueCard';

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: '2rem',
    color: 'var(--primary)',
    marginBottom: 12,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
    maxWidth: 560,
    margin: '0 auto',
  },
  startSessionBtn: {
    display: 'inline-block',
    padding: '14px 36px',
    background: 'var(--accent)',
    color: 'var(--primary-dark)',
    borderRadius: 8,
    fontSize: '1.05rem',
    fontWeight: 700,
    textDecoration: 'none',
    transition: 'background 0.2s, transform 0.2s',
    marginTop: 20,
  },
  orDivider: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    margin: '24px 0 8px',
  },
  issueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: 'var(--text-muted)',
  },
  error: {
    textAlign: 'center',
    padding: 40,
    color: 'var(--error)',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: 'var(--text-muted)',
  },
};

export default function HomePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);

  useEffect(() => {
    apiClient.get('/issues')
      .then(res => setIssues(res.data.issues))
      .catch(err => setError(err.response?.data?.error?.message || 'Failed to load issues'))
      .finally(() => setLoading(false));

    apiClient.get('/rate-limit')
      .then(res => setRateLimit(res.data))
      .catch(() => {}); // silently fail
  }, []);

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Current Issues</h1>
        <p style={styles.subtitle}>
          Vote on the issues below and discover how your views align with various worldviews, religious traditions, and political philosophies.
        </p>

        {rateLimit && (
          <p style={{
            fontSize: '0.85rem',
            color: rateLimit.remaining === 0 ? 'var(--error)' : 'var(--text-muted)',
            marginTop: 12,
          }}>
            {rateLimit.remaining === 0
              ? `Daily analysis limit reached (${rateLimit.limit}/${rateLimit.limit}). Resets at midnight UTC.`
              : `${rateLimit.remaining} of ${rateLimit.limit} free analyses remaining today`}
          </p>
        )}

        {!loading && !error && issues.length > 0 && (
          <div>
            <Link
              to="/vote"
              style={{
                ...styles.startSessionBtn,
                ...(rateLimit?.remaining === 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}),
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--accent-light)'; }}
              onMouseLeave={e => { e.target.style.background = 'var(--accent)'; }}
            >
              Start Voting Session ({issues.length} issues)
            </Link>
          </div>
        )}
      </div>

      {loading && <p style={styles.loading}>Loading issues...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && issues.length === 0 && (
        <p style={styles.empty}>No issues available right now. Check back soon.</p>
      )}

      {!loading && !error && issues.length > 0 && (
        <p style={styles.orDivider}>or vote on individual issues:</p>
      )}

      <div style={styles.issueList}>
        {issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </>
  );
}
