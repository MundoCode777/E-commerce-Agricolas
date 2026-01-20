// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './UserProfile.css';

function UserProfile({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: {
      direccion: user?.direccion?.direccion || '',
      ciudad: user?.direccion?.ciudad || '',
      provincia: user?.direccion?.provincia || ''
    }
  });

  useEffect(() => {
    if (activeTab === 'ordenes') {
      cargarOrdenes();
    }
  }, [activeTab]);

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/mis-ordenes');
      setOrdenes(response.data.ordenes || []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('direccion.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [field]: value
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
    try {
      const response = await api.put('/auth/perfil', formData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        alert('✅ Perfil actualizado exitosamente');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('❌ Error al actualizar perfil');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente': return 'badge-pendiente';
      case 'procesando': return 'badge-procesando';
      case 'enviado': return 'badge-enviado';
      case 'entregado': return 'badge-entregado';
      case 'cancelado': return 'badge-cancelado';
      default: return '';
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar || '👤'}
          </div>
          <div className="profile-info">
            <h1>{user?.nombre} {user?.apellido}</h1>
            <p>{user?.email}</p>
            {user?.rol === 'administrador' && (
              <span className="admin-badge">🔧 Administrador</span>
            )}
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === 'perfil' ? 'tab-active' : ''}
            onClick={() => setActiveTab('perfil')}
          >
            👤 Mi Perfil
          </button>
          <button
            className={activeTab === 'ordenes' ? 'tab-active' : ''}
            onClick={() => setActiveTab('ordenes')}
          >
            📦 Mis Órdenes
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'perfil' && (
            <div className="perfil-tab-content">
              {!editMode ? (
                <div className="profile-view">
                  <div className="info-section">
                    <h3>Información Personal</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Nombre:</label>
                        <span>{user?.nombre}</span>
                      </div>
                      <div className="info-item">
                        <label>Apellido:</label>
                        <span>{user?.apellido}</span>
                      </div>
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{user?.email}</span>
                      </div>
                      <div className="info-item">
                        <label>Teléfono:</label>
                        <span>{user?.telefono || 'No registrado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Dirección</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Dirección:</label>
                        <span>{user?.direccion?.direccion || 'No registrada'}</span>
                      </div>
                      <div className="info-item">
                        <label>Ciudad:</label>
                        <span>{user?.direccion?.ciudad || 'No registrada'}</span>
                      </div>
                      <div className="info-item">
                        <label>Provincia:</label>
                        <span>{user?.direccion?.provincia || 'No registrada'}</span>
                      </div>
                    </div>
                  </div>

                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    ✏️ Editar Perfil
                  </button>
                </div>
              ) : (
                <div className="profile-edit">
                  <form onSubmit={handleSubmit} className="profile-edit-form">
                    <h3>Editar Información</h3>
                    
                    <div className="form-row">
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

                    <h3>Dirección</h3>
                    <div className="form-group">
                      <label>Dirección</label>
                      <input
                        type="text"
                        name="direccion.direccion"
                        value={formData.direccion.direccion}
                        onChange={handleChange}
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
                      <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="save-btn">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <button className="logout-btn" onClick={onLogout}>
                🚪 Cerrar Sesión
              </button>
            </div>
          )}

          {activeTab === 'ordenes' && (
            <div className="ordenes-tab-content">
              {loading ? (
                <div className="loading-text">Cargando órdenes...</div>
              ) : ordenes.length === 0 ? (
                <div className="no-ordenes">
                  <span className="no-ordenes-icon">📦</span>
                  <p>No tienes órdenes todavía</p>
                  <button className="btn-shop" onClick={() => onNavigate('home')}>
                    Ir de Compras
                  </button>
                </div>
              ) : (
                <div className="ordenes-list">
                  {ordenes.map(orden => (
                    <div key={orden._id} className="orden-card">
                      <div className="orden-header">
                        <h3>Orden #{orden.numeroOrden}</h3>
                        <span className={`estado-badge ${getEstadoBadgeClass(orden.estado)}`}>
                          {orden.estado}
                        </span>
                      </div>
                      <div className="orden-body">
                        <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${orden.total?.toFixed(2)}</p>
                        <p><strong>Método de Pago:</strong> {orden.metodoPago}</p>
                        <div className="orden-items">
                          <strong>Productos:</strong>
                          <ul>
                            {orden.items?.map((item, idx) => (
                              <li key={idx}>
                                {item.nombre} - {item.cantidad} {item.unit}
                              </li>
                            ))}
                          </ul>
                        </div>
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