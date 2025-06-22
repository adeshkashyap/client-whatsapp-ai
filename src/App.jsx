import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/DashboardPage';
import Chats from './pages/Chats';
import Feedback from './pages/Feedback';
import Responses from './pages/Responses';
import WhatsAppConnect from './pages/WhatsAppConnect';
import Learned from './pages/Learned';
import PatchSuggestions from './pages/PatchSuggestions';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const ok = await isAuthenticated();
      setAuthed(ok);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>🔒 Checking auth...</div>;

  return authed ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/whatsapp"
          element={
            <ProtectedRoute>
              <WhatsAppConnect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/responses"
          element={
            <ProtectedRoute>
              <Responses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learned"
          element={
            <ProtectedRoute>
              <Learned />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patches"
          element={
            <ProtectedRoute>
              <PatchSuggestions />
            </ProtectedRoute>
          }
        />

        {/* Default fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
