// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

function Navbar({ cartCount, onCartClick }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo" onClick={() => scrollToSection('inicio')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🌾</span>
          <span className="logo-text">Agrícola Fresh</span>
        </div>
        
        <ul className="nav-links">
          <li><button onClick={() => scrollToSection('inicio')}>Inicio</button></li>
          <li><button onClick={() => scrollToSection('productos')}>Productos</button></li>
          <li><button onClick={() => scrollToSection('nosotros')}>Nosotros</button></li>
          <li><button onClick={() => scrollToSection('contacto')}>Contacto</button></li>
        </ul>
        
        <button className="cart-button" onClick={onCartClick}>
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;