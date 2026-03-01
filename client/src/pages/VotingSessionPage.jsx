import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import VotingSlider from '../components/VotingSlider';
import BinaryVote from '../components/BinaryVote';
import MultiAxisPoll from '../components/MultiAxisPoll';
import SessionNav from '../components/SessionNav';

const styles = {
  progress: { textAlign: 'center', marginBottom: 24 },
  progressBadge: {
    display: 'inline-block', padding: '6px 16px', background: 'var(--primary)',
    color: 'white', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
  },
  progressBar: {
    width: '100%', height: 4, background: 'var(--border)',
    borderRadius: 2, marginTop: 12, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: 'var(--accent)',
    borderRadius: 2, transition: 'width 0.3s ease',
  },
  issueHeader: { marginBottom: 24 },
  category: {
    display: 'inline-block', fontSize: '0.75rem', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.05em',
    color: 'var(--primary-light)', background: 'rgba(43, 108, 176, 0.08)',
    padding: '4px 10px', borderRadius: 6, marginBottom: 12,
  },
  title: { fontSize: '1.75rem', color: 'var(--primary)', marginBottom: 12 },
  description: { color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 },
  loading: { textAlign: 'center', padding: 40, color: 'var(--text-muted)' },
  error: { textAlign: 'center', padding: '16px 0', color: 'var(--error)' },
  analyzingOverlay: { textAlign: 'center', padding: '40px 20px' },
  analyzingTitle: { fontSize: '1.5rem', color: 'var(--primary)', marginBottom: 12 },
  analyzingText: { color: 'var(--text-muted)', fontSize: '1rem', marginBottom: 28 },
  spinner: {
    display: 'inline-block', width: 40, height: 40,
    border: '4px solid var(--border)', borderTopColor: 'var(--primary)',
    borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 20,
  },
  issueProgressList: { maxWidth: 480, margin: '0 auto', textAlign: 'left' },
  issueProgressItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--border)',
  },
  statusIcon: { width: 20, minWidth: 20, textAlign: 'center', fontSize: '0.85rem' },
  issueProgressTitle: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  analyzing: { color: 'var(--primary)', fontWeight: 600 },
  completed: { color: 'var(--success)' },
  pending: { color: 'var(--text-muted)' },
  analysisProgressBar: {
    width: '100%', height: 6, background: 'var(--border)',
    borderRadius: 3, overflow: 'hidden', marginTop: 20,
  },
  analysisProgressFill: {
    height: '100%', background: 'var(--primary)',
    borderRadius: 3, transition: 'width 0.5s ease',
  },
  submitBar: {
    display: 'flex', justifyContent: 'center', marginTop: 24,
    paddingTop: 16, borderTop: '1px solid var(--border)',
  },
  submitAllBtn: {
    padding: '14px 36px', background: 'var(--accent)', color: 'var(--primary-dark)',
    border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', transition: 'background 0.2s',
  },
  submitAllBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
};

export default function VotingSessionPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positions, setPositions] = useState({});
  const [skipped, setSkipped] = useState(new Set());

  // Per-issue multi-axis data
  const pollDataMap = useRef({}); // { issueId: { axes, customResponses } }

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState([]);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    apiClient.get('/issues')
      .then(res => setIssues(res.data.issues))
      .catch(err => setFetchError(err.response?.data?.error?.message || 'Failed to load issues'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.loading}>Loading issues...</p>;
  if (fetchError) return <p style={{ ...styles.loading, color: 'var(--error)' }}>{fetchError}</p>;
  if (issues.length === 0) return <p style={styles.loading}>No issues available right now.</p>;

  const currentIssue = issues[currentIndex];
  const isLastIssue = currentIndex === issues.length - 1;
  const totalIssues = issues.length;
  const votedCount = Object.keys(positions).length;
  const canSubmit = votedCount > 0;

  const handlePollChange = (data) => {
    pollDataMap.current[currentIssue.id] = data;
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSkip = () => {
    setSkipped(prev => new Set(prev).add(currentIssue.id));
    const newPositions = { ...positions };
    delete newPositions[currentIssue.id];
    setPositions(newPositions);
    if (isLastIssue) {
      if (!canSubmit) setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleExit = () => navigate('/');

  const handleVote = (position) => {
    const newPositions = { ...positions, [currentIssue.id]: position };
    setPositions(newPositions);
    const newSkipped = new Set(skipped);
    newSkipped.delete(currentIssue.id);
    setSkipped(newSkipped);
    if (!isLastIssue) setCurrentIndex(prev => prev + 1);
  };

  const handleSubmitAll = async () => {
    if (!canSubmit) return;
    await processVotesSequentially(positions);
  };

  const processVotesSequentially = async (allPositions) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    const votesToProcess = Object.entries(allPositions).map(([issueId, position]) => {
      const issue = issues.find(i => i.id === Number(issueId));
      const pollData = pollDataMap.current[Number(issueId)] || {};
      return {
        issueId: Number(issueId),
        position,
        title: issue?.title || `Issue #${issueId}`,
        axes: pollData.axes || null,
        customResponses: pollData.customResponses || null,
      };
    });

    setAnalysisProgress(votesToProcess.map(v => ({
      issueId: v.issueId, title: v.title, status: 'pending',
    })));

    const results = [];

    for (let i = 0; i < votesToProcess.length; i++) {
      const vote = votesToProcess[i];

      setAnalysisProgress(prev =>
        prev.map((item, idx) => idx === i ? { ...item, status: 'analyzing' } : item)
      );

      try {
        const response = await apiClient.post('/votes', {
          issueId: vote.issueId,
          position: Math.round(vote.position),
          userId: null,
          axes: vote.axes,
          customResponses: vote.customResponses,
        });

        results.push({
          id: response.data.vote.id,
          issueId: vote.issueId,
          issueTitle: vote.title,
          position: vote.position,
          analysis: response.data.vote.analysis,
          warning: response.data.warning || null,
          createdAt: response.data.vote.createdAt,
        });

        setAnalysisProgress(prev =>
          prev.map((item, idx) => idx === i ? { ...item, status: 'completed' } : item)
        );
      } catch (err) {
        if (err.response?.status === 429) {
          setAnalysisError(err.response?.data?.error?.message || 'Rate limit exceeded.');
          if (results.length > 0) {
            setTimeout(() => {
              navigate('/results', { state: { batchResults: results, isBatch: true } });
            }, 2000);
          }
          return;
        }

        results.push({
          id: null, issueId: vote.issueId, issueTitle: vote.title,
          position: vote.position, analysis: null,
          warning: 'Analysis unavailable for this issue.',
          createdAt: new Date().toISOString(),
        });

        setAnalysisProgress(prev =>
          prev.map((item, idx) => idx === i ? { ...item, status: 'completed' } : item)
        );
      }
    }

    navigate('/results', { state: { batchResults: results, isBatch: true } });
  };

  // Analysis loading screen
  if (isAnalyzing) {
    const completedCount = analysisProgress.filter(p => p.status === 'completed').length;
    const totalCount = analysisProgress.length;
    const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <div style={styles.analyzingOverlay}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {!analysisError && <div style={styles.spinner} />}
        <h2 style={styles.analyzingTitle}>Analyzing Your Worldview</h2>
        <p style={styles.analyzingText}>
          {analysisError
            ? analysisError
            : `Processing ${completedCount} of ${totalCount} issue${totalCount !== 1 ? 's' : ''}...`}
        </p>
        <div style={styles.analysisProgressBar}>
          <div style={{ ...styles.analysisProgressFill, width: `${progressPct}%` }} />
        </div>
        <div className="analysis-progress-list" style={styles.issueProgressList}>
          {analysisProgress.map((item) => (
            <div key={item.issueId} style={styles.issueProgressItem}>
              <span style={styles.statusIcon}>
                {item.status === 'completed' ? '✓' : item.status === 'analyzing' ? '⟳' : '○'}
              </span>
              <span style={{
                ...styles.issueProgressTitle,
                ...(item.status === 'analyzing' ? styles.analyzing : {}),
                ...(item.status === 'completed' ? styles.completed : {}),
                ...(item.status === 'pending' ? styles.pending : {}),
              }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main voting UI
  return (
    <>
      <div style={styles.progress}>
        <span style={styles.progressBadge}>Issue {currentIndex + 1} of {totalIssues}</span>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((currentIndex + 1) / totalIssues) * 100}%` }} />
        </div>
      </div>

      <div style={styles.issueHeader}>
        <span style={styles.category}>{currentIssue.category}</span>
        <h1 style={styles.title}>{currentIssue.title}</h1>
        <p style={styles.description}>{currentIssue.description}</p>
      </div>

      {currentIssue.vote_type === 'binary' ? (
        <BinaryVote
          key={currentIssue.id}
          issue={currentIssue}
          onSubmit={handleVote}
          isSubmitting={false}
          buttonText={isLastIssue ? 'Vote' : 'Vote & Next'}
        />
      ) : (
        <VotingSlider
          key={currentIssue.id}
          issue={currentIssue}
          onSubmit={handleVote}
          isSubmitting={false}
          buttonText={isLastIssue ? 'Vote' : 'Vote & Next'}
        />
      )}

      {/* Multi-axis polling */}
      <MultiAxisPoll
        key={`poll-${currentIssue.id}`}
        issueId={currentIssue.id}
        onChange={handlePollChange}
      />

      <SessionNav
        currentIndex={currentIndex}
        totalIssues={totalIssues}
        onBack={handleBack}
        onSkip={handleSkip}
        onExit={handleExit}
        positions={positions}
        skipped={skipped}
        currentIssueId={currentIssue.id}
      />

      {canSubmit && (
        <div style={styles.submitBar}>
          <button
            style={{ ...styles.submitAllBtn, ...(votedCount === 0 ? styles.submitAllBtnDisabled : {}) }}
            onClick={handleSubmitAll}
            disabled={votedCount === 0}
            onMouseEnter={e => { e.target.style.background = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--accent)'; }}
          >
            Submit {votedCount} Vote{votedCount !== 1 ? 's' : ''} & Analyze
          </button>
        </div>
      )}
    </>
  );
}
