// src/components/Navbar.js
import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ 
  onLoginClick, 
  isAuthenticated, 
  user, 
  onLogout, 
  onNavigate, 
  currentView = 'home',
  cartCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand" onClick={() => handleNavigation('home')}>
          <span className="brand-icon">🌾</span>
          <span className="brand-text">Agrícola Fresh</span>
        </div>

        {/* Botón menú móvil */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Menú de navegación */}
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <button 
              className={currentView === 'home' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => handleNavigation('home')}
            >
              🏠 Inicio
            </button>
          </li>
          
          <li>
            <button 
              className="nav-btn"
              onClick={() => scrollToSection('productos')}
            >
              🛍️ Productos
            </button>
          </li>

          <li>
            <button 
              className="nav-btn"
              onClick={() => scrollToSection('nosotros')}
            >
              ℹ️ Nosotros
            </button>
          </li>

          <li>
            <button 
              className="nav-btn"
              onClick={() => scrollToSection('contacto')}
            >
              📞 Contacto
            </button>
          </li>
          
          <li>
            <button 
              className={`nav-btn cart-btn ${currentView === 'cart' ? 'active' : ''}`}
              onClick={() => handleNavigation('cart')}
            >
              🛒 Carrito
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <button 
                  className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
                  onClick={() => handleNavigation('profile')}
                >
                  👤 {user?.nombre || 'Perfil'}
                </button>
              </li>

              {user?.rol === 'administrador' && (
                <li>
                  <button 
                    className={`nav-btn admin-btn ${currentView === 'admin' ? 'active' : ''}`}
                    onClick={() => handleNavigation('admin')}
                  >
                    🔧 Admin
                  </button>
                </li>
              )}

              <li>
                <button className="nav-btn logout-btn" onClick={onLogout}>
                  🚪 Salir
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="nav-btn login-btn" onClick={onLoginClick}>
                🔑 Iniciar Sesión
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;