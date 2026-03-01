import { useState } from 'react';
import styles from './BinaryVote.module.css';

export default function BinaryVote({ issue, onSubmit, isSubmitting, buttonText }) {
  const [selected, setSelected] = useState(null); // 0 or 100

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Choose Your Position</span>

      <div className={`binary-options ${styles.options}`}>
        <div
          className={`${styles.option}${selected === 0 ? ` ${styles.selected}` : ''}`}
          onClick={() => setSelected(0)}
        >
          <div className={styles.optionLabel}>{issue.scale_label_low}</div>
        </div>

        <div
          className={`${styles.option}${selected === 100 ? ` ${styles.selected}` : ''}`}
          onClick={() => setSelected(100)}
        >
          <div className={styles.optionLabel}>{issue.scale_label_high}</div>
        </div>
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={isSubmitting || selected === null}
      >
        {isSubmitting ? 'Analyzing...' : (selected === null ? 'Select an option' : (buttonText || 'Submit & Analyze'))}
      </button>
    </div>
  );
}
