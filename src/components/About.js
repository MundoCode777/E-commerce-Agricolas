// src/components/About.js
import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about-section" id="nosotros">
      <div className="container">
        <h2 className="about-title">Sobre Nosotros 🌾</h2>
        
        <div className="about-content">
          <div className="about-text">
            <h3>Nuestra Historia</h3>
            <p>
              Agrícola Fresh nació en Milagro, Guayas, con la misión de conectar 
              directamente a los agricultores locales con las familias ecuatorianas. 
              Creemos en productos frescos, orgánicos y de la más alta calidad.
            </p>
            
            <h3>Nuestros Valores</h3>
            <div className="values-grid">
              <div className="value-card">
                <span className="value-icon">🌱</span>
                <h4>100% Orgánico</h4>
                <p>Sin pesticidas ni químicos dañinos</p>
              </div>
              
              <div className="value-card">
                <span className="value-icon">🚜</span>
                <h4>Directo del Campo</h4>
                <p>Cosechado el mismo día de la entrega</p>
              </div>
              
              <div className="value-card">
                <span className="value-icon">✅</span>
                <h4>Calidad Garantizada</h4>
                <p>Productos seleccionados cuidadosamente</p>
              </div>
              
              <div className="value-card">
                <span className="value-icon">🤝</span>
                <h4>Apoyo Local</h4>
                <p>Trabajamos con agricultores de la zona</p>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <div className="image-placeholder">
              <span className="big-emoji">🌾🥕🍅</span>
              <p>Productos frescos todos los días</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;