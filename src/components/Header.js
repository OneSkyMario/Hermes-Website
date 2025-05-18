import React from 'react';

export default function Header({ selectedTab, setSelectedTab, handleCartOpen }) {
  return (
    <header className="header">
      <div className="logo-area">
        <img src="/Hermes_Logo.png" alt="Hermes Logo" className="logo-img" />
        <span className="logo-text">Hermes</span>
      </div>
      <nav className="nav-bar">
        <a href="#home" className={`nav-link${selectedTab === 0 ? ' active' : ''}`} onClick={() => setSelectedTab(0)}>home</a>
        <a href="#menu" className={`nav-link${selectedTab === 1 ? ' active' : ''}`} onClick={() => setSelectedTab(1)}>menu</a>
        <a href="#telegram" className={`nav-link${selectedTab === 3 ? ' active' : ''}`} onClick={() => setSelectedTab(3)}>telegram QR (soon)</a>
        {/* <a href="#telegram" className="nav-link">telegram QR (soon)</a> */}
        <a href="#contact" className={`nav-link${selectedTab === 2 ? ' active' : ''}`} onClick={() => setSelectedTab(2)}>contact us</a>
      </nav>
      <div className="header-actions">
        <button className="icon-btn" onClick={handleCartOpen}>
          <span role="img" aria-label="cart">🛒</span>
        </button>
      </div>
    </header>
  );
}
