import { useState } from 'react';
import styles from './ResultsDisplay.module.css';
import PathwayCard from './PathwayCard';

const RELIGIOUS_TRADITIONS = [
  'Biblical Christianity',
  'Islamic Ethics (Quran)',
  'Judaism (Torah)',
  'Buddhism',
  'Hinduism',
  'Secular Humanism',
];

const POLITICAL_PHILOSOPHIES = [
  'Classical Liberalism',
  'Conservatism',
  'Progressivism',
  'Libertarianism',
  'Communitarianism',
];

function getScoreColor(score) {
  if (score >= 70) return 'var(--success)';
  if (score >= 40) return 'var(--accent)';
  return 'var(--warning)';
}

function ScoreRow({ entry, isLast }) {
  const color = getScoreColor(entry.score);
  return (
    <div className={`${styles.scoreRow} ${isLast ? styles.scoreRowLast : ''}`}>
      <div className={styles.scoreHeader}>
        <span className={styles.scoreTradition}>{entry.tradition}</span>
        <span className={styles.scoreNumber} style={{ color }}>{entry.score}</span>
      </div>
      <div className={styles.scoreBar}>
        <div className={styles.scoreFill} style={{ width: `${entry.score}%`, background: color }} />
      </div>
      {entry.brief && <div className={styles.scoreBrief}>{entry.brief}</div>}
    </div>
  );
}

function ScoreGroup({ title, scores, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  if (!scores || scores.length === 0) return null;

  const avgScore = Math.round(scores.reduce((s, e) => s + e.score, 0) / scores.length);

  return (
    <div>
      <div
        className={`${styles.groupHeader} ${!open ? styles.groupHeaderClosed : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.groupTitle}>{title}</span>
        <span className={styles.groupToggle}>
          avg: {avgScore} {open ? '▲' : '▼'}
        </span>
      </div>
      {open && scores.map((entry, idx) => (
        <ScoreRow key={idx} entry={entry} isLast={idx === scores.length - 1} />
      ))}
    </div>
  );
}

function BulletSection({ label, items, itemClass }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionLabel}>{label}</div>
      <ul className={styles.bulletList}>
        {items.map((item, idx) => (
          <li key={idx} className={`${styles.bulletItem} ${itemClass || ''}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultsDisplay({ analysis, position, issueTitle }) {
  if (!analysis) {
    return (
      <div className={`results-card ${styles.card}`}>
        <p className={styles.summary}>
          Your vote was recorded, but the analysis is temporarily unavailable. Please try again later.
        </p>
      </div>
    );
  }

  const religiousScores = [];
  const politicalScores = [];
  const otherScores = [];

  if (analysis.alignmentScores) {
    for (const entry of analysis.alignmentScores) {
      if (RELIGIOUS_TRADITIONS.some(t => entry.tradition.includes(t.split(' ')[0]))) {
        religiousScores.push(entry);
      } else if (POLITICAL_PHILOSOPHIES.some(t => entry.tradition.includes(t.split(' ')[0]))) {
        politicalScores.push(entry);
      } else {
        otherScores.push(entry);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>{analysis.worldviewLabel}</div>
        <p className={styles.subtitle}>
          Your worldview analysis for: {issueTitle}
        </p>
      </div>

      <div className={styles.positionNote}>
        You voted <strong>{position}</strong> out of 100
      </div>

      {/* Biblical alignment score */}
      {analysis.biblicalAlignmentScore != null && (
        <div className={styles.biblicalScore}>
          <div
            className={styles.biblicalScoreNumber}
            style={{ color: getScoreColor(analysis.biblicalAlignmentScore) }}
          >
            {analysis.biblicalAlignmentScore}
          </div>
          <div className={styles.biblicalScoreLabel}>Biblical Alignment Score</div>
        </div>
      )}

      {/* Alignment Scores */}
      <div className={`results-card ${styles.card}`}>
        <div className={styles.cardLabel}>Alignment Across Traditions & Philosophies</div>

        <ScoreGroup title="Religious & Ethical Traditions" scores={religiousScores} defaultOpen={true} />

        {politicalScores.length > 0 && religiousScores.length > 0 && (
          <div className={styles.spacer} />
        )}

        <ScoreGroup title="Political Philosophies" scores={politicalScores} defaultOpen={true} />

        {otherScores.length > 0 && (
          <>
            <div className={styles.spacer} />
            <ScoreGroup title="Other" scores={otherScores} defaultOpen={true} />
          </>
        )}
      </div>

      {/* Summary */}
      <div className={`results-card ${styles.card}`}>
        <div className={styles.cardLabel}>Analysis</div>
        <p className={styles.summary}>{analysis.summary}</p>
      </div>

      {/* Key Perspectives */}
      <BulletSection label="Key Perspectives" items={analysis.keyPerspectives} />

      {/* Points of Agreement */}
      <BulletSection label="Points of Agreement" items={analysis.pointsOfAgreement} />

      {/* Points of Tension */}
      <BulletSection label="Points of Tension" items={analysis.pointsOfTension} itemClass={styles.tensionItem} />

      {/* Biblical Touchpoints */}
      <BulletSection label="Biblical Touchpoints" items={analysis.biblicalTouchpoints} itemClass={styles.touchpointItem} />

      {/* Questions to Consider */}
      <BulletSection label="Questions to Consider" items={analysis.remainingQuestions} itemClass={styles.questionItem} />

      {/* Suggested Reflections */}
      {analysis.suggestedReflections && analysis.suggestedReflections.length > 0 && (
        <div>
          <div className={styles.cardLabel}>Suggested Reflections</div>
          <div className={styles.reflectionsList}>
            {analysis.suggestedReflections.map((ref, idx) => (
              <div key={idx} className={styles.reflectionCard}>
                <div className={styles.reflectionSource}>{ref.source}</div>
                <p className={styles.reflectionText}>{ref.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pathway Suggestion */}
      <PathwayCard pathwaySignal={analysis.pathwaySignal} />
    </div>
  );
}
