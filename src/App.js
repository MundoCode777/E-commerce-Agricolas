// src/App.js - CÓDIGO COMPLETO CON CARRITO POR USUARIO
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

  // Cargar autenticación y carrito al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsAuthenticated(true);
      setUser(parsedUser);
      
      // Cargar carrito específico del usuario
      loadUserCart(parsedUser.id);
    }
  }, []);

  // Función para cargar el carrito del usuario
  const loadUserCart = (userId) => {
    const cartKey = `cart_${userId}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  };

  // Función para guardar el carrito del usuario
  const saveUserCart = (userId, cartData) => {
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cartData));
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowLogin(false);
    
    // Cargar carrito del usuario que acaba de iniciar sesión
    loadUserCart(userData.id);
    
    // Redirigir según el rol
    if (userData.rol === 'administrador') {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    // Guardar carrito antes de cerrar sesión
    if (user) {
      saveUserCart(user.id, cart);
    }
    
    // Limpiar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
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
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para agregar productos al carrito');
      setShowLogin(true);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      // Guardar carrito del usuario
      if (user) {
        saveUserCart(user.id, newCart);
      }
      
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      
      // Guardar carrito del usuario
      if (user) {
        saveUserCart(user.id, newCart);
      }
      
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      // Guardar carrito del usuario
      if (user) {
        saveUserCart(user.id, newCart);
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    
    // Limpiar carrito del usuario en localStorage
    if (user) {
      saveUserCart(user.id, []);
    }
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