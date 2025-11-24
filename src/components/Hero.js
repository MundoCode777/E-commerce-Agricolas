// src/components/Hero.js
import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-title fade-in">
          Productos Frescos del Campo 🌱
        </h1>
        <p className="hero-subtitle fade-in">
          Directo de la granja a tu mesa. Calidad garantizada y 100% orgánico
        </p>
        <button className="hero-button fade-in">
          Ver Productos
        </button>
      </div>
    </section>
  );
}

export default Hero;