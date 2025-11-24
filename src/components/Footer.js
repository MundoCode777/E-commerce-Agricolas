// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>🌾 Agrícola Fresh</h3>
          <p>Productos frescos y orgánicos directo del campo a tu mesa</p>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📞 +593 999 999 999</p>
          <p>📧 info@agricolafresh.com</p>
          <p>📍 Milagro, Guayas, Ecuador</p>
        </div>

        <div className="footer-section">
          <h4>Horarios</h4>
          <p>Lunes - Viernes: 8:00 - 18:00</p>
          <p>Sábado: 8:00 - 14:00</p>
          <p>Domingo: Cerrado</p>
        </div>

        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="#facebook">📘 Facebook</a>
            <a href="#instagram">📷 Instagram</a>
            <a href="#whatsapp">💬 WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Agrícola Fresh. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;