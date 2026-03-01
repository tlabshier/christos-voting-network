const styles = {
  container: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    borderRadius: 'var(--radius)',
    padding: 32,
    color: 'white',
    marginBottom: 32,
    boxShadow: 'var(--shadow-lg)',
  },
  title: {
    fontSize: '1.5rem',
    fontFamily: "'Merriweather', Georgia, serif",
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.9rem',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  topAlignments: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  alignmentChip: {
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: '0.85rem',
    fontWeight: 600,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
  },
  topChip: {
    background: 'var(--accent)',
    color: 'var(--primary-dark)',
    border: '1px solid var(--accent)',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    opacity: 0.6,
    marginBottom: 10,
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    minWidth: 140,
    opacity: 0.9,
  },
  barTrack: {
    flex: 1,
    height: 8,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 1.5s ease-out',
  },
  barScore: {
    fontSize: '0.8rem',
    fontWeight: 700,
    minWidth: 28,
    textAlign: 'right',
  },
  worldviewLabels: {
    textAlign: 'center',
    marginBottom: 20,
  },
  labelsTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    opacity: 0.6,
    marginBottom: 10,
  },
};

const RELIGIOUS = ['Biblical', 'Islamic', 'Judaism', 'Buddhism', 'Hinduism', 'Secular'];
const POLITICAL = ['Classical', 'Conservatism', 'Progressivism', 'Libertarianism', 'Communitarianism'];

function getBarColor(score) {
  if (score >= 70) return 'rgba(56, 161, 105, 0.9)';
  if (score >= 50) return 'rgba(212, 168, 67, 0.9)';
  return 'rgba(255, 255, 255, 0.4)';
}

export default function WorldviewProfile({ votes }) {
  // Only use votes that have analysis
  const analyzed = votes.filter(v => v.analysis && v.analysis.alignmentScores);
  if (analyzed.length === 0) return null;

  // Aggregate scores across all votes
  const scoreMap = {};
  for (const vote of analyzed) {
    for (const entry of vote.analysis.alignmentScores) {
      if (!scoreMap[entry.tradition]) {
        scoreMap[entry.tradition] = { total: 0, count: 0 };
      }
      scoreMap[entry.tradition].total += entry.score;
      scoreMap[entry.tradition].count += 1;
    }
  }

  const avgScores = Object.entries(scoreMap)
    .map(([tradition, { total, count }]) => ({
      tradition,
      score: Math.round(total / count),
    }))
    .sort((a, b) => b.score - a.score);

  const religiousAvg = avgScores.filter(s => RELIGIOUS.some(r => s.tradition.includes(r)));
  const politicalAvg = avgScores.filter(s => POLITICAL.some(p => s.tradition.includes(p)));

  const top3 = avgScores.slice(0, 3);

  // Collect worldview labels
  const labelCounts = {};
  for (const vote of analyzed) {
    const label = vote.analysis.worldviewLabel;
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  }
  const uniqueLabels = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label);

  return (
    <div className="worldview-profile" style={styles.container}>
      <h2 style={styles.title}>Your Worldview Profile</h2>
      <p style={styles.subtitle}>
        Composite analysis across {analyzed.length} issue{analyzed.length !== 1 ? 's' : ''}
      </p>

      {/* Worldview labels */}
      {uniqueLabels.length > 0 && (
        <div style={styles.worldviewLabels}>
          <div style={styles.labelsTitle}>Your Worldview Labels</div>
          <div style={styles.topAlignments}>
            {uniqueLabels.map((label, idx) => (
              <span key={idx} style={styles.alignmentChip}>{label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Top alignments */}
      <div style={styles.topAlignments}>
        <div style={{ ...styles.sectionLabel, width: '100%', textAlign: 'center', marginBottom: 4 }}>
          Strongest Alignments
        </div>
        {top3.map((s, idx) => (
          <span key={idx} style={{ ...styles.alignmentChip, ...(idx === 0 ? styles.topChip : {}) }}>
            {s.tradition}: {s.score}
          </span>
        ))}
      </div>

      {/* Religious traditions */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Religious & Ethical Traditions</div>
        {religiousAvg.map((s, idx) => (
          <div key={idx} className="wp-bar-row" style={styles.barRow}>
            <span className="wp-bar-label" style={styles.barLabel}>{s.tradition}</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${s.score}%`, background: getBarColor(s.score) }} />
            </div>
            <span style={styles.barScore}>{s.score}</span>
          </div>
        ))}
      </div>

      {/* Political philosophies */}
      <div style={{ ...styles.section, marginBottom: 0 }}>
        <div style={styles.sectionLabel}>Political Philosophies</div>
        {politicalAvg.map((s, idx) => (
          <div key={idx} className="wp-bar-row" style={styles.barRow}>
            <span className="wp-bar-label" style={styles.barLabel}>{s.tradition}</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${s.score}%`, background: getBarColor(s.score) }} />
            </div>
            <span style={styles.barScore}>{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
