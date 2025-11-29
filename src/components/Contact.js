// src/components/Contact.js
import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Aquí podrías enviar el formulario a un servidor
    console.log('Formulario enviado:', formData);
    
    // Limpiar formulario después de 3 segundos
    setTimeout(() => {
      setFormData({ nombre: '', email: '', mensaje: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="container">
        <h2 className="contact-title">Contáctanos 📧</h2>
        <p className="contact-subtitle">
          ¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!
        </p>

        <div className="contact-content">
          {/* Información de Contacto */}
          <div className="contact-info">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <h3>Ubicación</h3>
              <p>Milagro, Guayas, Ecuador</p>
            </div>

            <div className="info-card">
              <span className="info-icon">📞</span>
              <h3>Teléfono</h3>
              <p>+593 999 999 999</p>
              <p>Lun - Vie: 8:00 - 18:00</p>
            </div>

            <div className="info-card">
              <span className="info-icon">📧</span>
              <h3>Email</h3>
              <p>info@agricolafresh.com</p>
              <p>ventas@agricolafresh.com</p>
            </div>

            <div className="info-card">
              <span className="info-icon">💬</span>
              <h3>Redes Sociales</h3>
              <div className="social-links-contact">
                <a href="#facebook">Facebook</a>
                <a href="#instagram">Instagram</a>
                <a href="#whatsapp">WhatsApp</a>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="contact-form-container">
            {submitted ? (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <h3>¡Mensaje Enviado!</h3>
                <p>Gracias por contactarnos. Te responderemos pronto.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Enviar Mensaje 📨
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;