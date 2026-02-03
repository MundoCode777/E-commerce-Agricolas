// src/App.js - CÓDIGO COMPLETO CON CARRITO CORREGIDO
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
import Testimonials from './components/Testimonials';
import Swal from 'sweetalert2';
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
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        setCart([]);
      }
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
    
    // SweetAlert de bienvenida
    Swal.fire({
      icon: 'success',
      title: `¡Bienvenido ${userData.nombre}!`,
      text: 'Has iniciado sesión correctamente',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true
    });
    
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
    
    // SweetAlert de confirmación
    Swal.fire({
      icon: 'info',
      title: '¡Hasta pronto!',
      text: 'Has cerrado sesión correctamente',
      timer: 1500,
      showConfirmButton: false
    });
    
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
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Por favor inicia sesión para continuar',
        confirmButtonText: 'Iniciar Sesión',
        confirmButtonColor: '#2ecc71',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLogin(true);
        }
      });
      return;
    }

    if (view === 'admin' && (!isAuthenticated || user?.rol !== 'administrador')) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Solo administradores pueden acceder al panel',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Funciones del carrito
  const addToCart = (product, quantity = 1) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        confirmButtonText: 'Iniciar Sesión',
        confirmButtonColor: '#2ecc71',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#95a5a6'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLogin(true);
        }
      });
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
        
        Swal.fire({
          icon: 'success',
          title: 'Cantidad actualizada',
          text: `${product.name} - Cantidad: ${existingItem.quantity + quantity}`,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          timerProgressBar: true
        });
      } else {
        newCart = [...prevCart, { ...product, quantity }];
        
        Swal.fire({
          icon: 'success',
          title: '¡Producto agregado!',
          text: `${product.name} se agregó al carrito`,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          timerProgressBar: true
        });
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
    console.log('🗑️ Limpiando carrito...'); // Debug
    
    // Limpiar estado
    setCart([]);
    
    // Limpiar localStorage
    if (user) {
      const cartKey = `cart_${user.id}`;
      localStorage.removeItem(cartKey);
      localStorage.setItem(cartKey, JSON.stringify([]));
      console.log('✅ Carrito limpiado del localStorage'); // Debug
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
                <h2 className="section-title">Nuestros Insumos Agrícolas</h2>
                <p className="section-subtitle">
                  Fertilizantes, herramientas y equipos de calidad certificada
                </p>
                <ProductList onAddToCart={addToCart} />
              </div>
            </section>
            <Testimonials />
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
            user={user}
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
                <h2 className="section-title">Nuestros Insumos Agrícolas</h2>
                <p className="section-subtitle">
                  Fertilizantes, herramientas y equipos de calidad certificada
                </p>
                <ProductList onAddToCart={addToCart} />
              </div>
            </section>
            <Testimonials />
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