import { useState } from 'react';
import apiClient from '../api/client';

export default function useVote() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);

  const submitVote = async (issueId, position, axes, customResponses) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.post('/votes', {
        issueId,
        position: Math.round(position),
        userId: null,
        axes: axes || null,
        customResponses: customResponses || null,
      });
      setResult(response.data.vote);
      return response.data;
    } catch (err) {
      const errorData = err.response?.data?.error || { message: 'Something went wrong. Please try again.' };
      setError(errorData);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBatchVotes = async (votes) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.post('/votes/batch', {
        votes: votes.map(v => ({
          issueId: v.issueId,
          position: Math.round(v.position),
          axes: v.axes || null,
          customResponses: v.customResponses || null,
        })),
        userId: null,
      });
      setBatchResults(response.data.votes);
      return response.data;
    } catch (err) {
      const errorData = err.response?.data?.error || { message: 'Something went wrong. Please try again.' };
      setError(errorData);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
    setBatchResults(null);
  };

  return { submitVote, submitBatchVotes, isSubmitting, error, result, batchResults, reset };
}
