import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import styles from './CommunitySynthesis.module.css';

const BUCKET_COUNT = 10; // 0-9, 10-19, ..., 90-100

function buildDistribution(positions) {
  const buckets = new Array(BUCKET_COUNT).fill(0);
  for (const pos of positions) {
    const idx = Math.min(Math.floor(pos / 10), BUCKET_COUNT - 1);
    buckets[idx]++;
  }
  return buckets;
}

function DistributionChart({ positions, userPosition, lowLabel, highLabel }) {
  const buckets = buildDistribution(positions);
  const maxCount = Math.max(...buckets, 1);
  const userBucket = Math.min(Math.floor(userPosition / 10), BUCKET_COUNT - 1);

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartTitle}>Community Position Distribution</div>
      <div className={styles.chart}>
        {buckets.map((count, idx) => (
          <div
            key={idx}
            className={`${styles.chartBar}${idx === userBucket ? ` ${styles.chartBarHighlight}` : ''}`}
            style={{ height: `${Math.max((count / maxCount) * 100, 3)}%` }}
            title={`${idx * 10}-${idx * 10 + 9}: ${count} vote${count !== 1 ? 's' : ''}`}
          />
        ))}
      </div>
      <div className={styles.chartLabels}>
        <span>{lowLabel || '0'}</span>
        <span>{highLabel || '100'}</span>
      </div>

      {/* User position marker */}
      <div className={styles.userMarker}>
        <div className={styles.userMarkerLine}>
          <div
            className={styles.userMarkerDot}
            style={{ left: `${userPosition}%` }}
          />
          <span
            className={styles.userMarkerLabel}
            style={{ left: `${userPosition}%` }}
          >
            You: {userPosition}
          </span>
        </div>
      </div>
    </div>
  );
}

function SynthesisSection({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>{label}</div>
      <ul className={styles.bulletList}>
        {items.map((item, idx) => (
          <li key={idx} className={styles.bulletItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CommunitySynthesis({ issueId, userPosition, lowLabel, highLabel }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!issueId) return;
    setLoading(true);
    apiClient.get(`/synthesis/${issueId}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [issueId]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading community data...</div>
      </div>
    );
  }

  if (!data) return null;

  // Not enough votes
  if (!data.available) {
    const progress = Math.min((data.voteCount / data.threshold) * 100, 100);
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.title}>🏘️ Community Synthesis</span>
        </div>
        <div className={styles.notAvailable}>
          <p>Community synthesis unlocks when this issue reaches {data.threshold} votes.</p>
          <p className={styles.progressText}>
            {data.voteCount} of {data.threshold} votes so far
          </p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  const { synthesis } = data;

  // Build a mock positions array from voteCount for the chart
  // In a full implementation, the API would return actual position data
  // For now we'll just show the synthesis text sections
  const hasChart = false; // Would need positions array from API

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>🏘️ Community Synthesis</span>
        <span className={styles.voteBadge}>{data.voteCount} votes</span>
      </div>

      {/* Community insight */}
      {synthesis.communityInsight && (
        <div className={styles.section}>
          <div className={styles.insight}>{synthesis.communityInsight}</div>
        </div>
      )}

      <SynthesisSection label="Key Perspectives" items={synthesis.keyPerspectives} />
      <SynthesisSection label="Points of Agreement" items={synthesis.pointsOfAgreement} />
      <SynthesisSection label="Points of Tension" items={synthesis.pointsOfTension} />
      <SynthesisSection label="Biblical Touchpoints" items={synthesis.biblicalTouchpoints} />
      <SynthesisSection label="Questions to Explore" items={synthesis.remainingQuestions} />
    </div>
  );
}
