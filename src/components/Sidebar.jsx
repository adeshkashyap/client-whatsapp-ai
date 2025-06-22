import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { fetchWithAuth } from '../utils/api';

const Sidebar = () => {
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  useEffect(() => {
    const checkWhatsAppStatus = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/whatsapp-status');

        if (!res || !res.ok) {
          console.warn('WhatsApp status check failed');
          return;
        }

        const data = await res.json();
        setWhatsappConnected(data.connected || false);
      } catch (err) {
        console.error('Failed to check WhatsApp status:', err.message);
      }
    };

    checkWhatsAppStatus();
  }, []);

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
        <NavLink to="/whatsapp" className="nav-item">
          {whatsappConnected ? 'Connected WhatsApp' : 'Connect WhatsApp'}
        </NavLink>
        <NavLink to="/chats" className="nav-item">Chats</NavLink>
        <NavLink to="/feedback" className="nav-item">Feedback</NavLink>
        <NavLink to="/learned" className="nav-item">Learned</NavLink>
        <NavLink to="/patches" className="nav-item">Patches</NavLink> {/* NEW */}
      </nav>
    </aside>
  );
};

export default Sidebar;
