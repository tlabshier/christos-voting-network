import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import styles from './MultiAxisPoll.module.css';

const FRAMEWORKS = [
  { value: 'faith_scripture', label: 'Faith / Scripture' },
  { value: 'individual_rights', label: 'Individual Rights' },
  { value: 'community_good', label: 'Community Good' },
  { value: 'economic_impact', label: 'Economic Impact' },
  { value: 'scientific_evidence', label: 'Scientific Evidence' },
  { value: 'constitutional', label: 'Constitutional Principles' },
  { value: 'social_justice', label: 'Social Justice' },
];

const AXES = [
  { key: 'agreement', label: 'Agreement', hint: 'How much do you agree with this position?', low: 'Disagree', high: 'Agree' },
  { key: 'confidence', label: 'Confidence', hint: 'How confident are you in your stance?', low: 'Uncertain', high: 'Very confident' },
  { key: 'importance', label: 'Importance', hint: 'How important is this issue to you?', low: 'Low priority', high: 'Critical' },
  { key: 'biblicalAlignment', label: 'Biblical Alignment', hint: 'How aligned do you believe this position is with biblical teaching?', low: 'Not aligned', high: 'Strongly aligned' },
];

export default function MultiAxisPoll({ issueId, onChange, values }) {
  const [axes, setAxes] = useState(values?.axes || {
    agreement: 5,
    confidence: 5,
    importance: 5,
    biblicalAlignment: 5,
  });
  const [framework, setFramework] = useState(values?.framework || '');
  const [customQuestions, setCustomQuestions] = useState([]);
  const [customAnswers, setCustomAnswers] = useState(values?.customAnswers || {});
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fetch custom questions for this issue
  useEffect(() => {
    setLoadingQuestions(true);
    apiClient.get(`/questions/${issueId}`)
      .then(res => {
        setCustomQuestions(res.data.questions || []);
      })
      .catch(() => {
        setCustomQuestions([]);
      })
      .finally(() => setLoadingQuestions(false));
  }, [issueId]);

  // Notify parent of changes
  useEffect(() => {
    const customResponses = Object.entries(customAnswers).map(([qId, answer]) => {
      const q = customQuestions.find(cq => cq.id === qId);
      return { questionId: qId, questionText: q?.text || '', answer };
    }).filter(r => r.answer);

    onChange({
      axes: { ...axes, framework },
      customResponses,
    });
  }, [axes, framework, customAnswers, customQuestions]);

  const handleAxisChange = (key, value) => {
    setAxes(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomAnswer = (questionId, value) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionTitle}>📊 Polling Dimensions</div>

      {/* Standard axes */}
      <div className={styles.axisGroup}>
        {AXES.map(axis => (
          <div key={axis.key} className={styles.axisRow}>
            <div className={styles.axisLabel}>
              <span className={styles.axisName}>{axis.label}</span>
              <span className={styles.axisValue}>{axes[axis.key]}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={axes[axis.key]}
              onChange={e => handleAxisChange(axis.key, Number(e.target.value))}
              className={styles.axisSlider}
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((axes[axis.key] - 1) / 9) * 100}%, var(--border) ${((axes[axis.key] - 1) / 9) * 100}%, var(--border) 100%)`,
              }}
            />
            <div className={styles.axisEndpoints}>
              <span>{axis.low}</span>
              <span>{axis.high}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Framework selection */}
      <div className={styles.frameworkGroup}>
        <span className={styles.frameworkLabel}>Primary Framework — What lens most influences your thinking on this issue?</span>
        <div className={styles.frameworkOptions}>
          {FRAMEWORKS.map(f => (
            <button
              key={f.value}
              type="button"
              className={`${styles.frameworkOption}${framework === f.value ? ` ${styles.frameworkSelected}` : ''}`}
              onClick={() => setFramework(framework === f.value ? '' : f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI-generated custom questions */}
      {loadingQuestions ? (
        <div className={styles.loadingQuestions}>
          <span className={styles.loadingSpinner} />
          Generating topic-specific questions...
        </div>
      ) : customQuestions.length > 0 ? (
        <div className={styles.customQuestionsSection}>
          <div className={styles.sectionTitle}>🔍 Topic-Specific Questions</div>
          {customQuestions.map(q => (
            <div key={q.id} className={styles.customQuestion}>
              <div className={styles.customQuestionText}>{q.text}</div>
              <div className={styles.customOptions}>
                {q.options.map(opt => {
                  const isSelected = customAnswers[q.id] === opt.label;
                  return (
                    <div
                      key={opt.value}
                      className={`${styles.customOption}${isSelected ? ` ${styles.customOptionSelected}` : ''}`}
                      onClick={() => handleCustomAnswer(q.id, opt.label)}
                    >
                      <div className={`${styles.customRadio}${isSelected ? ` ${styles.customRadioSelected}` : ''}`}>
                        {isSelected && <div className={styles.customRadioDot} />}
                      </div>
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
