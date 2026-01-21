// src/components/Testimonials.js - CÓDIGO COMPLETO
import React, { useState, useEffect } from 'react';
import './Testimonials.css';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Carlos Mendoza",
      role: "Agricultor - Bananero",
      location: "Milagro, Guayas",
      image: "👨‍🌾",
      rating: 5,
      text: "Excelente calidad en los fertilizantes. Desde que uso productos de Agrícola Fresh, mi producción de banano ha aumentado un 30%. El servicio de asesoría técnica es excepcional.",
      product: "Fertilizante NPK 15-15-15"
    },
    {
      id: 2,
      name: "María Rodríguez",
      role: "Productora de Cacao",
      location: "Naranjal, Guayas",
      image: "👩‍🌾",
      rating: 5,
      text: "Los productos son de primera calidad y la entrega siempre es puntual. He mejorado significativamente la calidad de mi cacao. Totalmente recomendado para todo agricultor serio.",
      product: "Abono Orgánico Premium"
    },
    {
      id: 3,
      name: "José Vera",
      role: "Productor de Arroz",
      location: "Yaguachi, Guayas",
      image: "👨‍🌾",
      rating: 5,
      text: "Llevo 5 años trabajando con Agrícola Fresh. Su asesoría personalizada y productos certificados han transformado mi negocio. Los precios son justos y la calidad insuperable.",
      product: "Herbicida Selectivo"
    },
    {
      id: 4,
      name: "Ana Torres",
      role: "Agricultora - Hortalizas",
      location: "Milagro, Guayas",
      image: "👩‍🌾",
      rating: 5,
      text: "Encontré todo lo que necesitaba para mi cultivo de hortalizas. El equipo de Agrícola Fresh me ayudó a elegir los mejores insumos. Mis cultivos nunca se vieron mejor.",
      product: "Kit Completo Hortalizas"
    },
    {
      id: 5,
      name: "Pedro Salazar",
      role: "Ganadero y Agricultor",
      location: "El Triunfo, Guayas",
      image: "👨‍🌾",
      rating: 5,
      text: "Compro todos mis insumos aquí. Desde herramientas hasta fertilizantes, todo de excelente calidad. El servicio al cliente es atento y siempre dispuestos a ayudar.",
      product: "Herramientas Agrícolas"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials" id="testimonios">
      <div className="container">
        <h2 className="section-title">Lo Que Dicen Nuestros Clientes</h2>
        <p className="section-subtitle">
          Testimonios reales de agricultores satisfechos con nuestros productos
        </p>

        <div className="testimonials-carousel">
          <button className="carousel-btn prev" onClick={goToPrevious}>
            ‹
          </button>

          <div className="testimonials-wrapper">
            <div 
              className="testimonials-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <span className="avatar-emoji">{testimonial.image}</span>
                    </div>
                    <div className="testimonial-info">
                      <h3 className="testimonial-name">{testimonial.name}</h3>
                      <p className="testimonial-role">{testimonial.role}</p>
                      <p className="testimonial-location">📍 {testimonial.location}</p>
                    </div>
                  </div>

                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="testimonial-text">"{testimonial.text}"</p>

                  <div className="testimonial-product">
                    <span className="product-badge">✓ Producto usado: {testimonial.product}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next" onClick={goToNext}>
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>

        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Calificación Promedio</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">500+</div>
              <div className="stat-label">Clientes Satisfechos</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Pedidos Completados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;