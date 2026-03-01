import styles from './SessionNav.module.css';

/**
 * Navigation bar for the voting session.
 * Props:
 *  - currentIndex: current issue index (0-based)
 *  - totalIssues: total number of issues
 *  - onBack: handler for going to previous issue
 *  - onSkip: handler for skipping current issue
 *  - onExit: handler for exiting the session
 *  - positions: object of { issueId: position } for voted issues
 *  - skipped: Set of skipped issue IDs
 *  - currentIssueId: ID of the current issue
 */
export default function SessionNav({
  currentIndex,
  totalIssues,
  onBack,
  onSkip,
  onExit,
  positions = {},
  skipped = new Set(),
  currentIssueId,
}) {
  const isFirst = currentIndex === 0;
  const votedCount = Object.keys(positions).length;
  const skippedCount = skipped.size;
  const answeredCount = votedCount + skippedCount;

  // Status text
  const statusParts = [];
  if (votedCount > 0) statusParts.push(`${votedCount} voted`);
  if (skippedCount > 0) statusParts.push(`${skippedCount} skipped`);
  const statusText = statusParts.length > 0
    ? statusParts.join(', ')
    : 'No votes yet';

  // Check if current issue was already voted on
  const currentVoted = positions.hasOwnProperty(currentIssueId);
  const currentSkipped = skipped.has(currentIssueId);

  return (
    <div className={styles.navBar}>
      {/* Left: Back + Exit */}
      <div className={styles.navLeft}>
        <button
          className={`${styles.btn} ${styles.btnExit}`}
          onClick={onExit}
          title="Exit session and go home"
        >
          <span className={styles.arrow}>✕</span>
          Exit
        </button>

        <button
          className={`${styles.btn} ${styles.btnBack} ${isFirst ? styles.btnDisabled : ''}`}
          onClick={onBack}
          disabled={isFirst}
          title="Go to previous issue"
        >
          <span className={styles.arrow}>←</span>
          Back
        </button>
      </div>

      {/* Center: Status */}
      <div className={styles.navCenter}>
        {statusText}
        {currentVoted && <span className={styles.votedBadge}>✓ answered</span>}
        {currentSkipped && <span className={styles.skippedBadge}>skipped</span>}
      </div>

      {/* Right: Skip */}
      <div className={styles.navRight}>
        <button
          className={`${styles.btn} ${styles.btnSkip}`}
          onClick={onSkip}
          title="Skip this issue"
        >
          Skip
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
}
