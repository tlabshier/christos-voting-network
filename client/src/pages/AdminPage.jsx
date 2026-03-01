import { useState, useEffect } from 'react';
import apiClient from '../api/client';

const styles = {
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: '1.75rem',
    color: 'var(--primary)',
    marginBottom: 8,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  form: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    padding: 28,
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: '1.1rem',
    marginBottom: 20,
    color: 'var(--text)',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: 100,
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'var(--bg-card)',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  rowItem: {
    flex: 1,
  },
  submitBtn: {
    padding: '12px 28px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  success: {
    color: 'var(--success)',
    fontSize: '0.9rem',
    marginTop: 12,
  },
  error: {
    color: 'var(--error)',
    fontSize: '0.9rem',
    marginTop: 12,
  },
  issueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  issueItem: {
    background: 'var(--bg-card)',
    borderRadius: 8,
    padding: '16px 20px',
    border: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  issueCategory: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
};

const emptyForm = {
  title: '',
  description: '',
  category: 'general',
  voteType: 'scale',
  scaleLabelLow: '',
  scaleLabelHigh: '',
};

export default function AdminPage() {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const loadIssues = () => {
    apiClient.get('/issues').then(res => setIssues(res.data.issues));
  };

  useEffect(() => { loadIssues(); }, []);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setMessage({ type: 'error', text: 'Title and description are required.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await apiClient.post('/admin/issues', form);
      setForm(emptyForm);
      setMessage({ type: 'success', text: 'Issue created successfully!' });
      loadIssues();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Failed to create issue.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.subtitle}>Manage issue prompts for the Christos Voting Network.</p>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.formTitle}>Create New Issue</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g., The Role of Government in Healthcare"
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe the issue and what the user should consider..."
          />
        </div>

        <div className="form-row" style={{ ...styles.fieldGroup, ...styles.row }}>
          <div style={styles.rowItem}>
            <label style={styles.label}>Category</label>
            <input
              style={styles.input}
              value={form.category}
              onChange={handleChange('category')}
              placeholder="e.g., governance, culture, ethics"
            />
          </div>
          <div style={styles.rowItem}>
            <label style={styles.label}>Vote Type</label>
            <select
              style={styles.select}
              value={form.voteType}
              onChange={handleChange('voteType')}
            >
              <option value="scale">Scale (Slider)</option>
              <option value="binary">Binary (Yes / No)</option>
            </select>
          </div>
        </div>

        <div className="form-row" style={{ ...styles.fieldGroup, ...styles.row }}>
          <div style={styles.rowItem}>
            <label style={styles.label}>
              {form.voteType === 'binary' ? 'Option A (maps to "No")' : 'Scale Label (Low / 0)'}
            </label>
            <input
              style={styles.input}
              value={form.scaleLabelLow}
              onChange={handleChange('scaleLabelLow')}
              placeholder={form.voteType === 'binary' ? 'e.g., No — Against It' : 'e.g., Strongly Disagree'}
            />
          </div>
          <div style={styles.rowItem}>
            <label style={styles.label}>
              {form.voteType === 'binary' ? 'Option B (maps to "Yes")' : 'Scale Label (High / 100)'}
            </label>
            <input
              style={styles.input}
              value={form.scaleLabelHigh}
              onChange={handleChange('scaleLabelHigh')}
              placeholder={form.voteType === 'binary' ? 'e.g., Yes — Support It' : 'e.g., Strongly Agree'}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Issue'}
        </button>

        {message && (
          <p style={message.type === 'success' ? styles.success : styles.error}>
            {message.text}
          </p>
        )}
      </form>

      <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Existing Issues ({issues.length})</h2>
      <div style={styles.issueList}>
        {issues.map(issue => (
          <div key={issue.id} style={styles.issueItem}>
            <div>
              <div style={styles.issueTitle}>{issue.title}</div>
              <div style={styles.issueCategory}>
                {issue.category}
                {issue.vote_type === 'binary' && (
                  <span style={{ marginLeft: 8, color: 'var(--accent)', fontWeight: 600 }}>• Yes/No</span>
                )}
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: issue.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
              {issue.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
