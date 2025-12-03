// src/components/Navbar.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';
import './Navbar.css';

function Navbar({ cartCount, onCartClick }) {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
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
          
          <div className="nav-actions">
            <button className="cart-button" onClick={onCartClick}>
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {isAuthenticated ? (
              <button className="user-button" onClick={() => setShowProfile(true)}>
                <span className="user-avatar">{user?.avatar}</span>
                <span className="user-name">{user?.nombre}</span>
              </button>
            ) : (
              <button className="login-button" onClick={() => setShowLogin(true)}>
                👤 Ingresar
              </button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

export default Navbar;