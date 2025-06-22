import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import { fetchWithAuth } from '../utils/api';
import '../pages/DashboardPage.css';

const WhatsAppConnect = () => {
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasTriggeredConnection, setHasTriggeredConnection] = useState(false);
  const socketRef = useRef(null);

  const triggerWhatsAppClient = useCallback(async () => {
    setIsConnecting(true);
    setHasTriggeredConnection(true);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/whatsapp-connect');

      if (!res || !res.ok) {
        toast.error('WhatsApp connect request failed');
        setIsConnecting(false);
        return;
      }

      const data = await res.json();

      if (data.qr) {
        setQrCode(data.qr);
        setIsConnecting(false);
      } else if (data.connected) {
        toast.success('WhatsApp already connected');
        setIsConnecting(false);
        setWhatsappStatus(data);
      }
    } catch (err) {
      console.error('WhatsApp init error:', err);
      toast.error('Failed to connect WhatsApp');
      setIsConnecting(false);
    }
  }, []);

  const fetchInitialStatus = useCallback(async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/whatsapp-status');

      if (!res || !res.ok) {
        console.warn('Failed to fetch WhatsApp status');
        return;
      }

      const data = await res.json();
      setWhatsappStatus(data);
      setQrCode(data.qr || null);
    } catch (err) {
      console.error('Fetch status failed:', err);
      toast.error('Failed to load WhatsApp status');
    }
  }, []);

  const handleWhatsAppLogout = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/whatsapp-logout', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Logout failed');

      toast.success('WhatsApp disconnected');
      setWhatsappStatus(null);
      setQrCode(null);
      setIsConnecting(false);
      setHasTriggeredConnection(false);
      fetchInitialStatus();
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('WhatsApp logout failed');
    }
  };

  useEffect(() => {
    fetchInitialStatus();

    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('qr', (qrDataUrl) => {
      setQrCode(qrDataUrl);
      setIsConnecting(false);
      setWhatsappStatus(prev => ({ ...prev, connected: false }));
    });

    socketRef.current.on('status', (status) => {
      setWhatsappStatus(status);
      if (status.connected) {
        setQrCode(null);
        setIsConnecting(false);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [fetchInitialStatus]);

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="whatsapp-status-box">
          <h3>WhatsApp Connection</h3>

          {whatsappStatus?.connected ? (
            <div className="status-connected">
              <p>
                Connected to WhatsApp{' '}
                {whatsappStatus.number && <strong>({whatsappStatus.number})</strong>}
              </p>
              <button className="wa-logout-btn" onClick={handleWhatsAppLogout}>
                 WhatsApp Logout
              </button>
            </div>
          ) : (
            <div>
              <p>WhatsApp is not connected</p>

              {!hasTriggeredConnection && (
                <button
                  className="wa-logout-btn"
                  style={{ background: '#4CAF50' }}
                  onClick={triggerWhatsAppClient}
                >
                  🔌 Connect WhatsApp
                </button>
              )}

              {isConnecting && (
                <div className="connecting-status">
                  <span className="loader" /> Connecting...
                </div>
              )}

              {qrCode && (
                <div className="qr-box">
                  <p>Scan this QR in WhatsApp:</p>
                  <img src={qrCode} alt="QR Code" className="qr-image" />
                </div>
              )}
            </div>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Layout>
  );
};

export default WhatsAppConnect;
