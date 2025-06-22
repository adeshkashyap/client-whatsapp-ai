import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import './feedback.css';
import Layout from '../components/Layout';
const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/feedback');
        if (!res.ok) throw new Error('Unauthorized or failed request');
        const data = await res.json();
        setFeedbacks(data.data || []);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Layout>
      <div className="feedback-container">
        <h3>👍 Feedback</h3>
        {loading && <p>Loading feedback...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && feedbacks.length === 0 && !error && <p>No feedback received yet.</p>}
        <ul className="feedback-list">
          {feedbacks.map((f, i) => (
            <li key={i} className="feedback-item">
              <strong>{f.phone}</strong> → {f.feedback === 'up' ? '👍' : '👎'} — <em>"{f.normalizedInput}"</em>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Feedback;
