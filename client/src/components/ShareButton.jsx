import { useState } from 'react';
import apiClient from '../api/client';

const styles = {
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'var(--bg-card)',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnLoading: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  feedback: {
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 6,
    animation: 'fadeIn 0.2s ease-in',
  },
  success: {
    color: 'var(--success)',
    background: 'rgba(72, 187, 120, 0.1)',
  },
  error: {
    color: 'var(--error)',
    background: 'rgba(229, 62, 62, 0.1)',
  },
};

export default function ShareButton({ resultData, isBatch }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleShare = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const res = await apiClient.post('/shares', { resultData, isBatch });
      const token = res.data.shareToken;
      const shareUrl = `${window.location.origin}/shared/${token}`;

      // Try native share first, fall back to clipboard
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Christos Voting Network Results",
            text: 'Check out my worldview analysis!',
            url: shareUrl,
          });
          setFeedback({ type: 'success', text: 'Shared!' });
        } catch (shareErr) {
          // User cancelled or share failed — fall back to clipboard
          if (shareErr.name !== 'AbortError') {
            await copyToClipboard(shareUrl);
          }
        }
      } else {
        await copyToClipboard(shareUrl);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to create share link' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback({ type: 'success', text: 'Link copied!' });
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setFeedback({ type: 'success', text: 'Link copied!' });
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="share-wrapper" style={styles.wrapper}>
      <button
        onClick={handleShare}
        disabled={loading}
        style={{ ...styles.btn, ...(loading ? styles.btnLoading : {}) }}
        onMouseEnter={e => {
          if (!loading) {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }
        }}
        onMouseLeave={e => {
          e.target.style.background = 'var(--bg-card)';
          e.target.style.color = 'var(--primary)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {loading ? 'Creating link...' : 'Share Results'}
      </button>

      {feedback && (
        <span style={{ ...styles.feedback, ...(feedback.type === 'success' ? styles.success : styles.error) }}>
          {feedback.text}
        </span>
      )}
    </div>
  );
}
