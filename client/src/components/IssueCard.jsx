import { Link } from 'react-router-dom';
import styles from './IssueCard.module.css';

export default function IssueCard({ issue }) {
  return (
    <div className={`issue-card ${styles.card}`}>
      <span className={styles.category}>{issue.category}</span>
      {issue.vote_type === 'binary' && (
        <span className={`${styles.category} ${styles.binaryBadge}`}>
          Yes / No
        </span>
      )}
      <h3 className={styles.title}>{issue.title}</h3>
      <p className={styles.description}>{issue.description}</p>
      <div className={`scale-info ${styles.scaleInfo}`}>
        <span>{issue.scale_label_low}</span>
        <span>{issue.scale_label_high}</span>
      </div>
      <Link to={`/vote/${issue.id}`} className={styles.voteButton}>
        Vote on This Issue
      </Link>
    </div>
  );
}
