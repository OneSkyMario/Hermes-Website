import React from 'react';

export default function ContactPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      fontFamily: 'Helvetica, Arial, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(200,0,0,0.10)',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        borderTop: '8px solid #e53935',
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 48, color: '#e53935', fontWeight: 700 }}>📞</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '2.1rem', color: '#e53935', marginBottom: 12, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Contact Us
        </div>
        <div style={{ fontWeight: 700, color: '#e53935', fontSize: '1.1rem', marginBottom: 8, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Phone: +7 708 551 80 96
        </div>
        <div style={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', marginBottom: 24, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Telegram: <a href="https://t.me/SKY_mario" style={{ color: '#e53935', textDecoration: 'none', fontWeight: 700 }}>@SKY_mario</a>
        </div>
      </div>
    </div>
  );
}
