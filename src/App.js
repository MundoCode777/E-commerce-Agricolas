// src/App.js - VERSIÓN SIN REACT ROUTER
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import UserProfile from './components/UserProfile';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    // Cargar carrito guardado
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('home');
  };

  const navigateTo = (view) => {
    // Verificar autenticación para ciertas vistas
    if ((view === 'checkout' || view === 'profile') && !isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (view === 'admin' && (!isAuthenticated || user?.rol !== 'administrador')) {
      alert('⚠️ Acceso denegado. Solo administradores pueden acceder al panel.');
      return;
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Funciones del carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Renderizar vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero />
            <section className="products-section" id="productos">
              <div className="container">
                <h2 className="section-title">Nuestros Productos Frescos</h2>
                <p className="section-subtitle">
                  Productos 100% orgánicos cosechados del día
                </p>
                <ProductList onAddToCart={addToCart} />
              </div>
            </section>
            <About />
            <Contact />
          </>
        );
      
      case 'cart':
        return (
          <Cart 
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getCartTotal={getCartTotal}
            onNavigate={navigateTo}
          />
        );
      
      case 'checkout':
        return (
          <Checkout 
            cart={cart}
            getCartTotal={getCartTotal}
            clearCart={clearCart}
            onNavigate={navigateTo}
          />
        );
      
      case 'profile':
        return (
          <UserProfile 
            user={user} 
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      
      case 'admin':
        // Importación dinámica del panel admin
        const AdminDashboard = require('./pages/AdminDashboard').default;
        return <AdminDashboard />;
      
      default:
        return (
          <>
            <Hero />
            <section className="products-section" id="productos">
              <div className="container">
                <h2 className="section-title">Nuestros Productos Frescos</h2>
                <p className="section-subtitle">
                  Productos 100% orgánicos cosechados del día
                </p>
                <ProductList onAddToCart={addToCart} />
              </div>
            </section>
            <About />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="App">
      <Navbar 
        onLoginClick={() => setShowLogin(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onNavigate={navigateTo}
        currentView={currentView}
        cartCount={getCartCount()}
      />

      {renderCurrentView()}

      <Footer />

      {/* Modal de Login */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;