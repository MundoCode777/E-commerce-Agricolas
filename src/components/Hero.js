// src/components/Hero.js - CÓDIGO COMPLETO
import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1 className="hero-title">🌾 Insumos Agrícolas de Calidad</h1>
          <p className="hero-subtitle">
            Fertilizantes, herramientas y equipos para potenciar tu producción agrícola
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Productos certificados</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Entrega rápida</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Asesoría técnica</span>
            </div>
          </div>
          <button className="hero-button" onClick={() => {
            document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Ver Productos
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;