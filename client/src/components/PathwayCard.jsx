import { useState } from 'react';
import styles from './PathwayCard.module.css';

const PATHWAY_CONFIG = {
  personal_struggle: {
    icon: '💬',
    title: 'Christos Counselor',
    description: 'Your responses suggest this topic carries personal weight. Christos Counselor offers a safe space for guided reflection with trained faith-based counselors.',
  },
  scripture_deep_dive: {
    icon: '📖',
    title: 'Cross-Check',
    description: 'Your engagement with this issue raises deep scriptural questions. Cross-Check helps you explore what the Bible actually says — with context, nuance, and multiple scholarly perspectives.',
  },
  low_biblical_political: {
    icon: '🗳️',
    title: 'Deeper Voting Assessment',
    description: 'Your position on this political topic shows room for deeper biblical exploration. Take our extended assessment to discover how your broader worldview connects with Scripture.',
  },
  health_topic: {
    icon: '🏥',
    title: 'Medical Testimony',
    description: 'This issue touches on health and wellbeing. Medical Testimony connects faith perspectives with evidence-based health information from trusted Christian medical professionals.',
  },
};

export default function PathwayCard({ pathwaySignal }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!pathwaySignal || pathwaySignal.type === 'none') return null;
  if (pathwaySignal.confidence < 40) return null;

  const config = PATHWAY_CONFIG[pathwaySignal.type];
  if (!config) return null;

  return (
    <div className={styles.card}>
      <span className={styles.icon}>{config.icon}</span>
      <div className={styles.content}>
        <div className={styles.label}>Suggested for you</div>
        <div className={styles.title}>{config.title}</div>
        <div className={styles.description}>{config.description}</div>
      </div>
      <button className={styles.dismiss} onClick={() => setDismissed(true)} title="Dismiss">
        ✕
      </button>
    </div>
  );
}
