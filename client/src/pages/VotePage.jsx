import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import VotingSlider from '../components/VotingSlider';
import BinaryVote from '../components/BinaryVote';
import MultiAxisPoll from '../components/MultiAxisPoll';
import useVote from '../hooks/useVote';

const styles = {
  navRow: {
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
  sessionBtn: {
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
  issueHeader: { marginBottom: 24 },
  category: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--primary-light)',
    background: 'rgba(43, 108, 176, 0.08)',
    padding: '4px 10px',
    borderRadius: 6,
    marginBottom: 12,
  },
  title: { fontSize: '1.75rem', color: 'var(--primary)', marginBottom: 12 },
  description: { color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 },
  loading: { textAlign: 'center', padding: 40, color: 'var(--text-muted)' },
  error: { textAlign: 'center', padding: 40, color: 'var(--error)' },
  issueNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTop: '1px solid var(--border)',
  },
  navBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  navBtnDisabled: { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' },
  navCenter: { fontSize: '0.8rem', color: 'var(--text-muted)' },
};

export default function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { submitVote, isSubmitting, error: voteError } = useVote();
  const pollDataRef = useRef({ axes: null, customResponses: [] });

  useEffect(() => {
    Promise.all([
      apiClient.get(`/issues/${id}`),
      apiClient.get('/issues'),
    ])
      .then(([issueRes, allRes]) => {
        setIssue(issueRes.data.issue);
        setAllIssues(allRes.data.issues);
      })
      .catch(err => setFetchError(err.response?.data?.error?.message || 'Issue not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePollChange = (data) => {
    pollDataRef.current = data;
  };

  const handleSubmit = async (position) => {
    try {
      const { axes, customResponses } = pollDataRef.current;
      const data = await submitVote(Number(id), position, axes, customResponses);
      navigate('/results', { state: { vote: data.vote, warning: data.warning, issueTitle: issue.title } });
    } catch {
      // Error captured in hook
    }
  };

  if (loading) return <p style={styles.loading}>Loading issue...</p>;
  if (fetchError) return <p style={styles.error}>{fetchError}</p>;
  if (!issue) return <p style={styles.error}>Issue not found</p>;

  const currentIdx = allIssues.findIndex(i => i.id === Number(id));
  const prevIssue = currentIdx > 0 ? allIssues[currentIdx - 1] : null;
  const nextIssue = currentIdx < allIssues.length - 1 ? allIssues[currentIdx + 1] : null;

  return (
    <>
      <div style={styles.navRow}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
        >
          ← Back to Issues
        </button>
        <button
          style={styles.sessionBtn}
          onClick={() => navigate('/vote')}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
        >
          Full Session →
        </button>
      </div>

      <div style={styles.issueHeader}>
        <span style={styles.category}>{issue.category}</span>
        <h1 style={styles.title}>{issue.title}</h1>
        <p style={styles.description}>{issue.description}</p>
      </div>

      {issue.vote_type === 'binary' ? (
        <BinaryVote issue={issue} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <VotingSlider issue={issue} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}

      <MultiAxisPoll issueId={issue.id} onChange={handlePollChange} />

      {voteError && (
        <p style={{ ...styles.error, padding: '16px 0' }}>{voteError.message}</p>
      )}

      {allIssues.length > 1 && (
        <div style={styles.issueNav}>
          <button
            style={{ ...styles.navBtn, ...(prevIssue ? {} : styles.navBtnDisabled) }}
            onClick={() => prevIssue && navigate(`/vote/${prevIssue.id}`)}
            disabled={!prevIssue}
            onMouseEnter={e => { if (prevIssue) e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
          >
            ← Prev Issue
          </button>
          <span style={styles.navCenter}>
            {currentIdx >= 0 ? `${currentIdx + 1} of ${allIssues.length}` : ''}
          </span>
          <button
            style={{ ...styles.navBtn, ...(nextIssue ? {} : styles.navBtnDisabled) }}
            onClick={() => nextIssue && navigate(`/vote/${nextIssue.id}`)}
            disabled={!nextIssue}
            onMouseEnter={e => { if (nextIssue) e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; }}
          >
            Next Issue →
          </button>
        </div>
      )}
    </>
  );
}
