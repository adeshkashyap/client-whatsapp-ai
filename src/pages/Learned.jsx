import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import './learned.css';
import Layout from '../components/Layout';

const Learned = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearned = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/learned');
        if (!res.ok) throw new Error('Failed to fetch learned responses');

        const data = await res.json();
        setResponses(data.data || []);
      } catch (err) {
        console.error('Learned response fetch error:', err);
        setError('Failed to load learned responses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearned();
  }, []);

  return (
    <Layout>
      <div className="learned-container">
        <h3> Learned Responses</h3>
        {loading && <p>Loading learned responses...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && responses.length === 0 && !error && <p>No learned responses available.</p>}
        <ul className="learned-list">
          {responses.map((r, i) => (
            <li key={i} className="learned-item">
              <strong>User:</strong> {r.phone || 'N/A'} <br />
              <strong>Input:</strong> "{r.input}" <br />
              <strong>Response:</strong> {r.finalResponse}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Learned;
