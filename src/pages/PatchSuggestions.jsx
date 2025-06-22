import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchWithAuth } from '../utils/api';
import './PatchSuggestions.css';

const PatchSuggestions = () => {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPatches = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/patches');
        if (!res.ok) throw new Error('Failed to fetch patch suggestions.');
        const data = await res.json();
        setPatches(data.data || []);
      } catch (err) {
        console.error('Patch load error:', err.message);
        setError('Failed to load patches. Try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPatches();
  }, []);

  return (
    <Layout>
      <div className="patch-container">
        <h2>AI Patch Suggestions</h2>

        {loading && <p>Loading patch suggestions...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && patches.length === 0 && <p>No patch suggestions found.</p>}

        <ul className="patch-list">
          {patches.map((patch, idx) => (
            <li key={idx} className="patch-card">
              <div><strong> Time:</strong> {new Date(patch.timestamp).toLocaleString()}</div>
              <div><strong> File:</strong> {patch.targetFile}</div>
              <div><strong> Context:</strong> {patch.context}</div>
              <div><strong> Suggestion:</strong> {patch.suggestion}</div>
              <pre className="patch-code">
                {patch.proposedPatch}
              </pre>
              {/* Future buttons can go here */}
              {/* <button className="approve-btn">Apply</button> */}
              {/* <button className="delete-btn">🗑 Delete</button> */}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default PatchSuggestions;
