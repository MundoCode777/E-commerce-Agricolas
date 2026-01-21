// src/components/About.js - CÓDIGO COMPLETO
import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about" id="nosotros">
      <div className="container">
        <h2 className="section-title">Sobre Nosotros</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>🌿 Líderes en Insumos Agrícolas</h3>
            <p>
              En Agrícola Fresh somos especialistas en la distribución de insumos agrícolas 
              de la más alta calidad. Con años de experiencia en el sector, ofrecemos 
              fertilizantes, herramientas, semillas y todo lo necesario para mejorar tu producción.
            </p>
            <p>
              Nuestro compromiso es brindar productos certificados que cumplan con los más 
              altos estándares de calidad, acompañados de asesoría técnica personalizada 
              para optimizar tus cultivos.
            </p>
            
            <div className="about-values">
              <div className="value-item">
                <h4>🎯 Nuestra Misión</h4>
                <p>Proveer insumos agrícolas de calidad que impulsen la productividad del campo ecuatoriano.</p>
              </div>
              <div className="value-item">
                <h4>👁️ Nuestra Visión</h4>
                <p>Ser la empresa líder en distribución de insumos agrícolas en la región costa.</p>
              </div>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Agricultores Satisfechos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Productos Disponibles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Productos Certificados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;