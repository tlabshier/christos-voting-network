import { useState } from 'react';
import styles from './VotingSlider.module.css';

function getPositionContext(position, issue) {
  const low = issue?.scale_label_low || 'Low';
  const high = issue?.scale_label_high || 'High';
  if (position <= 20) return `Strong alignment with ${low}`;
  if (position <= 40) return `Leaning toward ${low}`;
  if (position <= 60) return 'Balanced / Center';
  if (position <= 80) return `Leaning toward ${high}`;
  return `Strong alignment with ${high}`;
}

function getSliderColor(position) {
  // Blue (0) → Purple (50) → Red-orange (100)
  const r = Math.round(26 + (position / 100) * (212 - 26));
  const g = Math.round(54 + (Math.abs(position - 50) / 50) * (54 - 30));
  const b = Math.round(93 + (1 - position / 100) * (176 - 93));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function VotingSlider({ issue, onSubmit, isSubmitting, buttonText }) {
  const [position, setPosition] = useState(50);
  const color = getSliderColor(position);

  const handleSubmit = () => {
    onSubmit(position);
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Your Position</span>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={e => setPosition(Number(e.target.value))}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, var(--primary-light) 0%, ${color} ${position}%, var(--border) ${position}%, var(--border) 100%)`,
          }}
        />
        <div className={styles.labels}>
          <span>{issue.scale_label_low}</span>
          <span>{issue.scale_label_high}</span>
        </div>
      </div>

      <div className={styles.positionDisplay}>
        <div className={styles.positionNumber} style={{ color }}>{position}</div>
        <div className={styles.positionLabel}>{getPositionContext(position, issue)}</div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={styles.submitBtn}
      >
        {isSubmitting ? 'Analyzing...' : (buttonText || 'Submit & Analyze')}
      </button>
    </div>
  );
}
