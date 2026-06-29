'use client'

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      backgroundColor: '#1a1a2e',
      borderTop: '1px solid #2e2e4d',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <p style={{
        margin: 0,
        color: '#cccccc',
        fontSize: '14px',
        flex: 1,
        minWidth: '200px',
      }}>
        We use cookies to improve your experience on Unlock Startup. By continuing to use our site, you agree to our{' '}
        <a href="/privacy" style={{ color: '#0ec1fe', textDecoration: 'underline' }}>
          Privacy Policy
        </a>.
      </p>
      <button
        onClick={handleAccept}
        style={{
          backgroundColor: '#ec512b',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Accept Cookies
      </button>
    </div>
  );
}