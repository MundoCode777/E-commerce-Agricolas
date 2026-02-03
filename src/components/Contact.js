// src/components/Contact.js - CÓDIGO COMPLETO CON SWEETALERT2
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim() || !formData.mensaje.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor completa todos los campos del formulario',
        confirmButtonColor: '#2e7d32'
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Inválido',
        text: 'Por favor ingresa un email válido',
        confirmButtonColor: '#2e7d32'
      });
      return;
    }

    // Validar teléfono (mínimo 10 dígitos)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      Swal.fire({
        icon: 'warning',
        title: 'Teléfono Inválido',
        text: 'Por favor ingresa un número de teléfono válido (mínimo 10 dígitos)',
        confirmButtonColor: '#2e7d32'
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envío (puedes reemplazar esto con una llamada a tu API)
    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aquí puedes agregar la lógica para enviar el formulario a tu backend
      // const response = await api.post('/contact', formData);

      Swal.fire({
        icon: 'success',
        title: '¡Mensaje Enviado!',
        html: `
          <div style="padding: 1rem;">
            <p style="font-size: 1.1rem; color: #2e7d32; font-weight: bold; margin-bottom: 1rem;">
              ¡Gracias por contactarnos, ${formData.nombre}!
            </p>
            
            <div style="background: #e8f5e9; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
              <p style="color: #1b5e20; font-size: 0.95rem; margin: 0.5rem 0;">
                📧 Hemos recibido tu mensaje
              </p>
              <p style="color: #1b5e20; font-size: 0.95rem; margin: 0.5rem 0;">
                📞 Te contactaremos pronto al <strong>${formData.telefono}</strong>
              </p>
              <p style="color: #1b5e20; font-size: 0.95rem; margin: 0.5rem 0;">
                ✉️ Confirmaremos tu consulta a <strong>${formData.email}</strong>
              </p>
            </div>
            
            <div style="background: #fff9e6; padding: 1rem; border-radius: 10px; margin: 1rem 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0.5rem 0; color: #856404; font-size: 0.9rem;">
                <strong>⏰ Tiempo de Respuesta</strong>
              </p>
              <p style="margin: 0.5rem 0; color: #856404; font-size: 0.85rem;">
                Nuestro equipo responderá en las próximas 24-48 horas hábiles
              </p>
            </div>
            
            <p style="color: #999; font-size: 0.85rem; margin-top: 1rem;">
              Gracias por confiar en Agrícola Fresh 🌾
            </p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2e7d32',
        width: '500px',
        customClass: {
          popup: 'contact-alert-popup',
          confirmButton: 'contact-confirm-btn'
        }
      });

      // Limpiar formulario
      setFormData({ 
        nombre: '', 
        email: '', 
        telefono: '', 
        mensaje: '' 
      });

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al Enviar',
        html: `
          <div style="padding: 1rem;">
            <p style="color: #666; font-size: 1rem; margin: 1rem 0;">
              No pudimos enviar tu mensaje en este momento
            </p>
            <div style="background: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
              <p style="color: #721c24; font-size: 0.9rem; margin: 0;">
                Por favor intenta nuevamente o contáctanos directamente:<br>
                📱 WhatsApp: +593 937 837 9332<br>
                📧 Email: ventas@agricolafresh.com
              </p>
            </div>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsSubmitting(false);
    }
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
                placeholder="Tu Nombre *"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Tu Email *"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                placeholder="Tu Teléfono *"
                value={formData.telefono}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <textarea
                name="mensaje"
                placeholder="¿En qué podemos ayudarte? *"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;