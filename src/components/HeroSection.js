import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Order your favourite food here</h1>
        <p className="hero-desc">Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      </div>
      <img src={require('../assets/salad_image.jpg')} alt="Food" className="hero-img" />
    </section>
  );
}
