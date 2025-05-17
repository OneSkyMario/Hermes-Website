import React from 'react';

export default function OrderConfirmed({ nickname, handleNewOrder }) {
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
          <span style={{ fontSize: 48, color: '#e53935', fontWeight: 700 }}>🤖</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '2.1rem', color: '#e53935', marginBottom: 12, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Order Confirmed!
        </div>
        <div style={{ fontWeight: 700, color: '#e53935', fontSize: '1.1rem', marginBottom: 8, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          Your order will be delivered to {nickname}
        </div>
        <div style={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', marginBottom: 24, fontFamily: 'Helvetica, Arial, sans-serif' }}>
          A robot will deliver your order to the selected location.
        </div>
        <button
          className="new-order-btn"
          onClick={handleNewOrder}
          style={{
            background: '#e53935',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 2.2rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
          onMouseOut={e => e.currentTarget.style.background = '#e53935'}
        >
          Place New Order
        </button>
      </div>
    </div>
  );
}
