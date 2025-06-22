import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/api';

const Responses = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/learned');
        if (!res) return;
        const data = await res.json();
        setResponses(data.data || []);
      } catch (err) {
        console.error('Failed to fetch learned responses:', err);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h3> Learned Responses</h3>
      <ul>
        {responses.map((r, idx) => (
          <li key={idx}>
            <strong>{r.normalizedInput}</strong> → <em>{r.finalResponse}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Responses;
