// src/pages/AdminDashboard.js - CÓDIGO COMPLETO
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    precio: '',
    image: '',
    unit: 'kg',
    categoria: 'fertilizantes',
    stock: '',
    beneficios: ['', '', '', '']
  });

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'productos') {
        const response = await api.get('/products');
        setProductos(response.data.products || []);
      } else if (activeTab === 'ordenes') {
        const response = await api.get('/orders');
        setOrdenes(response.data.ordenes || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarNotificacion('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotification({ mensaje, tipo });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBeneficioChange = (index, value) => {
    const newBeneficios = [...formData.beneficios];
    newBeneficios[index] = value;
    setFormData(prev => ({
      ...prev,
      beneficios: newBeneficios
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      mostrarNotificacion('La imagen no debe superar 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    const formDataImage = new FormData();
    formDataImage.append('image', file);

    try {
      const response = await api.post('/products/upload-image', formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));

      mostrarNotificacion('Imagen subida exitosamente', 'success');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      mostrarNotificacion('Error al subir imagen', 'error');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditingProduct(null);
    setImagePreview('');
    setFormData({
      nombre: '',
      descripcion: '',
      descripcionLarga: '',
      precio: '',
      image: '',
      unit: 'kg',
      categoria: 'fertilizantes',
      stock: '',
      beneficios: ['', '', '', '']
    });
    setShowModal(true);
  };

  const abrirModalEditar = (producto) => {
    setEditingProduct(producto);
    setImagePreview('');
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      descripcionLarga: producto.descripcionLarga || '',
      precio: producto.precio,
      image: producto.image,
      unit: producto.unit,
      categoria: producto.categoria,
      stock: producto.stock,
      beneficios: producto.beneficios || ['', '', '', '']
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      mostrarNotificacion('Por favor sube una imagen del producto', 'error');
      return;
    }

    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        beneficios: formData.beneficios.filter(b => b.trim() !== '')
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        mostrarNotificacion('Producto actualizado exitosamente', 'success');
      } else {
        await api.post('/products', productData);
        mostrarNotificacion('Producto creado exitosamente', 'success');
      }

      setShowModal(false);
      setImagePreview('');
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      mostrarNotificacion(error.response?.data?.message || 'Error al guardar producto', 'error');
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        mostrarNotificacion('Producto eliminado exitosamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarNotificacion('Error al eliminar producto', 'error');
      }
    }
  };

  const actualizarEstadoOrden = async (ordenId, nuevoEstado) => {
    try {
      await api.put(`/orders/${ordenId}/estado`, { estado: nuevoEstado });
      mostrarNotificacion('Estado actualizado exitosamente', 'success');
      cargarDatos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      mostrarNotificacion('Error al actualizar estado', 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      {notification && (
        <div className={`notification ${notification.tipo}`}>
          {notification.mensaje}
        </div>
      )}

      <div className="admin-header">
        <h1>🌾 Panel de Administración - Insumos Agrícolas</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === 'productos' ? 'active' : ''}
            onClick={() => setActiveTab('productos')}
          >
            📦 Productos
          </button>
          <button
            className={activeTab === 'ordenes' ? 'active' : ''}
            onClick={() => setActiveTab('ordenes')}
          >
            📋 Órdenes
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'productos' && (
          <div className="productos-section">
            <div className="section-header">
              <h2>Gestión de Insumos Agrícolas</h2>
              <button className="btn-primary" onClick={abrirModalNuevo}>
                ➕ Nuevo Producto
              </button>
            </div>

            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              <div className="productos-grid">
                {productos.map(producto => (
                  <div key={producto._id} className="producto-card-admin">
                    <div className="producto-image">
                      {producto.image.startsWith('/uploads') ? (
                        <img src={`http://localhost:5000${producto.image}`} alt={producto.nombre} />
                      ) : (
                        <span style={{fontSize: '4rem'}}>{producto.image}</span>
                      )}
                    </div>
                    <div className="producto-info">
                      <h3>{producto.nombre}</h3>
                      <p className="producto-desc">{producto.descripcion}</p>
                      <div className="producto-details">
                        <span className="precio">${producto.precio}</span>
                        <span className="stock">Stock: {producto.stock}</span>
                      </div>
                      <div className="producto-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => abrirModalEditar(producto)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => eliminarProducto(producto._id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ordenes' && (
          <div className="ordenes-section">
            <h2>Gestión de Órdenes</h2>
            {loading ? (
              <div className="loading">Cargando órdenes...</div>
            ) : (
              <div className="ordenes-list">
                {ordenes.map(orden => (
                  <div key={orden._id} className="orden-card">
                    <div className="orden-header">
                      <h3>Orden #{orden.numeroOrden}</h3>
                      <span className={`estado-badge ${orden.estado}`}>
                        {orden.estado}
                      </span>
                    </div>
                    <div className="orden-body">
                      <p><strong>Cliente:</strong> {orden.usuario?.nombre || 'N/A'}</p>
                      <p><strong>Total:</strong> ${orden.total?.toFixed(2)}</p>
                      <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</p>
                      <p><strong>Dirección:</strong> {orden.direccionEntrega?.direccion}</p>
                      
                      <div className="orden-items">
                        <strong>Productos:</strong>
                        <ul>
                          {orden.items?.map((item, idx) => (
                            <li key={idx}>
                              {item.nombre} - {item.cantidad} {item.unit} x ${item.precio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="orden-actions">
                        <select
                          value={orden.estado}
                          onChange={(e) => actualizarEstadoOrden(orden._id, e.target.value)}
                          className="estado-select"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="producto-form">
              <div className="form-group full-width">
                <label>Imagen del Producto *</label>
                <div className="image-upload-container">
                  {(imagePreview || formData.image) && (
                    <div className="image-preview">
                      <img 
                        src={imagePreview || `http://localhost:5000${formData.image}`} 
                        alt="Preview" 
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="file-input"
                  />
                  {uploadingImage && <p className="uploading-text">⏳ Subiendo imagen...</p>}
                  <small>Formatos: JPG, PNG, GIF, WEBP (Máx. 5MB)</small>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Fertilizante NPK 15-15-15"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Precio (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="25.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unidad de Medida *</label>
                  <select name="unit" value={formData.unit} onChange={handleInputChange}>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="lb">Libra (lb)</option>
                    <option value="saco">Saco</option>
                    <option value="bulto">Bulto</option>
                    <option value="quintal">Quintal</option>
                    <option value="litro">Litro (L)</option>
                    <option value="galon">Galón</option>
                    <option value="unidad">Unidad</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Categoría *</label>
                  <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                    <option value="fertilizantes">Fertilizantes</option>
                    <option value="abonos">Abonos Orgánicos</option>
                    <option value="pesticidas">Pesticidas</option>
                    <option value="herbicidas">Herbicidas</option>
                    <option value="fungicidas">Fungicidas</option>
                    <option value="insecticidas">Insecticidas</option>
                    <option value="semillas">Semillas</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="equipos">Equipos de Riego</option>
                    <option value="sustratos">Sustratos</option>
                    <option value="otros">Otros Insumos</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Descripción Corta *</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción breve del producto"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción Detallada</label>
                <textarea
                  name="descripcionLarga"
                  value={formData.descripcionLarga}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Descripción completa del producto, modo de uso, beneficios, etc."
                />
              </div>

              <div className="form-section">
                <h3>Características / Beneficios</h3>
                {formData.beneficios.map((beneficio, index) => (
                  <div key={index} className="form-group">
                    <input
                      type="text"
                      value={beneficio}
                      onChange={(e) => handleBeneficioChange(index, e.target.value)}
                      placeholder={`Característica ${index + 1} (Ej: Alto contenido de nitrógeno)`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={uploadingImage || !formData.image}>
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;