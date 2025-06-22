import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchWithAuth } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardPage.css';

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [learned, setLearned] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const safeJson = async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    throw new Error('Invalid response format');
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const authed = await isAuthenticated();
      if (!authed) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      try {
        const [chatsRes, feedbackRes, learnedRes] = await Promise.all([
          fetchWithAuth('http://localhost:5000/api/admin/chats'),
          fetchWithAuth('http://localhost:5000/api/admin/feedback'),
          fetchWithAuth('http://localhost:5000/api/admin/learned'),
        ]);

        if (!chatsRes || !feedbackRes || !learnedRes) {
          toast.error('Unauthorized or session invalid.');
          navigate('/login');
          return;
        }

        const chatsData = await safeJson(chatsRes);
        const feedbackData = await safeJson(feedbackRes);
        const learnedData = await safeJson(learnedRes);

        setChats(chatsData.data || []);
        setFeedback(feedbackData.data || []);
        setLearned(learnedData.data || []);
      } catch (err) {
        console.error('Dashboard data load error:', err);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  return (
    <Layout>
      <div className="dashboard-container">
        <h2>Admin Overview</h2>
        <p>Bingo tacts</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            <li>Total Chats: <strong>{chats.length}</strong></li>
            <li>Feedback Received: <strong>{feedback.length}</strong></li>
            <li>Learned Responses: <strong>{learned.length}</strong></li>
          </ul>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Layout>
  );
};

export default Dashboard;
