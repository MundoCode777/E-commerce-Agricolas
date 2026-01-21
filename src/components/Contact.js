// src/components/Contact.js - CÓDIGO COMPLETO
import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias por contactarnos! Nos comunicaremos contigo pronto.');
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
  };

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-subtitle">¿Tienes dudas sobre nuestros insumos? Estamos para ayudarte</p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Dirección</h4>
                <p>Milagro, Guayas, Ecuador</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Teléfono</h4>
                <p>+593 937 837 9332</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h4>Email</h4>
                <p>ventas@agricolafresh.com</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">⏰</span>
              <div>
                <h4>Horario de Atención</h4>
                <p>Lunes - Viernes: 8:00 - 18:00</p>
                <p>Sábado: 8:00 - 14:00</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Envíanos un Mensaje</h3>
            
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Tu Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Tu Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                placeholder="Tu Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="mensaje"
                placeholder="¿En qué podemos ayudarte?"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;