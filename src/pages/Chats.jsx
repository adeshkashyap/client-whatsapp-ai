import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import './chat.css';
import Layout from '../components/Layout';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/chats');
        if (!res.ok) {
          throw new Error('Unauthorized or failed request');
        }
        const data = await res.json();
        setChats(data.data || []);
      } catch (err) {
        console.error('Failed to fetch chats:', err.message);
        setError('Failed to load chats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <Layout>
      <div className="chat-container">
        <h3>Chat Messages</h3>
        {loading && <p>Loading chats...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && chats.length === 0 && !error && <p>No chat messages available.</p>}
        <ul className="chat-list">
          {chats.map((chat, idx) => (
            <li key={idx} className="chat-item">
              <strong>{chat.phone}</strong>: {chat.message} → <em>{chat.reply}</em>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Chats;
