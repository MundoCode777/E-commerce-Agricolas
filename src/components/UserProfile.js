// src/components/UserProfile.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import './UserProfile.css';

function UserProfile({ onClose }) {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: {
      calle: user?.direccion?.calle || '',
      ciudad: user?.direccion?.ciudad || 'Milagro',
      provincia: user?.direccion?.provincia || 'Guayas',
      codigoPostal: user?.direccion?.codigoPostal || ''
    }
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setEditing(false);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.ordenes);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    }
    setLoadingOrders(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'ordenes' && orders.length === 0) {
      loadOrders();
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { color: '#ffa502', text: 'Pendiente' },
      confirmado: { color: '#3742fa', text: 'Confirmado' },
      en_camino: { color: '#5f27cd', text: 'En Camino' },
      entregado: { color: '#26de81', text: 'Entregado' },
      cancelado: { color: '#fc5c65', text: 'Cancelado' }
    };
    
    const badge = badges[estado] || badges.pendiente;
    
    return (
      <span 
        className="estado-badge"
        style={{ backgroundColor: badge.color }}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-profile-btn" onClick={onClose}>✕</button>

        <div className="profile-header">
          <div className="profile-avatar">{user?.avatar}</div>
          <h2>{user?.nombre} {user?.apellido}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.rol === 'administrador' && (
            <span className="admin-badge">👑 Administrador</span>
          )}
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => handleTabChange('perfil')}
          >
            👤 Mi Perfil
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ordenes' ? 'active' : ''}`}
            onClick={() => handleTabChange('ordenes')}
          >
            📦 Mis Órdenes
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'perfil' && (
            <div className="profile-tab-content">
              {message.text && (
                <div className={`alert ${message.type}`}>
                  {message.text}
                </div>
              )}

              {!editing ? (
                <div className="profile-info">
                  <div className="info-group">
                    <label>Nombre Completo</label>
                    <p>{user?.nombre} {user?.apellido}</p>
                  </div>

                  <div className="info-group">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>

                  <div className="info-group">
                    <label>Teléfono</label>
                    <p>{user?.telefono || 'No registrado'}</p>
                  </div>

                  <div className="info-group">
                    <label>Dirección</label>
                    <p>
                      {user?.direccion?.calle || 'No registrada'}<br />
                      {user?.direccion?.ciudad}, {user?.direccion?.provincia}
                    </p>
                  </div>

                  <button 
                    className="edit-profile-btn"
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Editar Perfil
                  </button>
                </div>
              ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion.calle"
                      value={formData.direccion.calle}
                      onChange={handleChange}
                      placeholder="Calle y número"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        name="direccion.ciudad"
                        value={formData.direccion.ciudad}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Provincia</label>
                      <input
                        type="text"
                        name="direccion.provincia"
                        value={formData.direccion.provincia}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      💾 Guardar Cambios
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <button className="logout-btn" onClick={logout}>
                🚪 Cerrar Sesión
              </button>
            </div>
          )}

          {activeTab === 'ordenes' && (
            <div className="orders-tab-content">
              {loadingOrders ? (
                <p className="loading-text">Cargando órdenes...</p>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <span className="empty-icon">📦</span>
                  <p>No tienes órdenes aún</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header-info">
                        <h4>Orden #{order.numeroOrden}</h4>
                        {getEstadoBadge(order.estado)}
                      </div>
                      
                      <p className="order-date">
                        📅 {new Date(order.fechaOrden).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>

                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-mini">
                            <span>{item.image}</span>
                            <span>{item.nombre} x{item.cantidad}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;