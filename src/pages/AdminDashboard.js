// src/pages/AdminDashboard.js - CÓDIGO COMPLETO CON SWEETALERT2 Y Z-INDEX CORREGIDO
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SentimentDashboard from '../components/SentimentDashboard';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
      if (activeTab === 'productos' || activeTab === 'sentimientos') {
        const response = await api.get('/products');
        setProductos(response.data.products || []);
      } else if (activeTab === 'ordenes') {
        const response = await api.get('/orders');
        setOrdenes(response.data.ordenes || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar datos',
        text: error.response?.data?.message || 'No se pudieron cargar los datos',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setLoading(false);
    }
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

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'La imagen no debe superar 5MB',
        confirmButtonColor: '#e74c3c',
        customClass: {
          container: 'swal-high-zindex'
        }
      });
      e.target.value = '';
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Solo se permiten archivos de imagen',
        confirmButtonColor: '#e74c3c',
        customClass: {
          container: 'swal-high-zindex'
        }
      });
      e.target.value = '';
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir a servidor
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

      Swal.fire({
        icon: 'success',
        title: '¡Imagen subida!',
        text: 'La imagen se subió correctamente',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al subir imagen',
        text: error.response?.data?.message || 'No se pudo subir la imagen',
        confirmButtonColor: '#e74c3c',
        customClass: {
          container: 'swal-high-zindex'
        }
      });
      setImagePreview('');
      e.target.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar imagen?',
      text: 'Tendrás que seleccionar una nueva imagen',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      customClass: {
        container: 'swal-high-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setImagePreview('');
        setFormData(prev => ({
          ...prev,
          image: ''
        }));
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';

        Swal.fire({
          icon: 'success',
          title: 'Imagen eliminada',
          timer: 1000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
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
    setTimeout(() => {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }, 0);
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
    
    setTimeout(() => {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Imagen requerida',
        text: 'Por favor sube una imagen del producto',
        confirmButtonColor: '#f39c12',
        customClass: {
          container: 'swal-high-zindex'
        }
      });
      return;
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
      icon: 'question',
      title: editingProduct ? '¿Actualizar producto?' : '¿Crear producto?',
      text: editingProduct 
        ? `Se actualizará el producto "${formData.nombre}"`
        : `Se creará el producto "${formData.nombre}"`,
      showCancelButton: true,
      confirmButtonText: editingProduct ? 'Actualizar' : 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#95a5a6',
      customClass: {
        container: 'swal-high-zindex'
      }
    });

    if (!result.isConfirmed) return;

    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        beneficios: formData.beneficios.filter(b => b.trim() !== '')
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        
        await Swal.fire({
          icon: 'success',
          title: '¡Producto actualizado!',
          text: `${formData.nombre} se actualizó correctamente`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          customClass: {
            container: 'swal-high-zindex'
          }
        });
      } else {
        await api.post('/products', productData);
        
        await Swal.fire({
          icon: 'success',
          title: '¡Producto creado!',
          text: `${formData.nombre} se creó correctamente`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          customClass: {
            container: 'swal-high-zindex'
          }
        });
      }

      setShowModal(false);
      setImagePreview('');
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.response?.data?.message || 'No se pudo guardar el producto',
        confirmButtonColor: '#e74c3c',
        customClass: {
          container: 'swal-high-zindex'
        }
      });
    }
  };

  const eliminarProducto = async (producto) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      html: `
        <p>¿Estás seguro de eliminar <strong>${producto.nombre}</strong>?</p>
        <p style="color: #e74c3c; font-size: 0.9rem;">Esta acción no se puede deshacer</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      focusCancel: true
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/products/${producto._id}`);
      
      Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: `${producto.nombre} se eliminó correctamente`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: error.response?.data?.message || 'No se pudo eliminar el producto',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const actualizarEstadoOrden = async (ordenId, nuevoEstado, numeroOrden) => {
    const estadosEmojis = {
      pendiente: '⏳ Pendiente',
      procesando: '⚙️ Procesando',
      enviado: '🚚 Enviado',
      entregado: '✅ Entregado',
      cancelado: '❌ Cancelado'
    };

    const result = await Swal.fire({
      icon: 'question',
      title: '¿Actualizar estado de la orden?',
      html: `
        <p>Orden <strong>#${numeroOrden}</strong></p>
        <p>Cambiar estado a: <strong>${estadosEmojis[nuevoEstado]}</strong></p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#95a5a6'
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/orders/${ordenId}/estado`, { estado: nuevoEstado });
      
      Swal.fire({
        icon: 'success',
        title: '¡Estado actualizado!',
        text: `La orden ahora está en estado: ${estadosEmojis[nuevoEstado]}`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        position: 'top-end'
      });
      
      cargarDatos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        html: `
          <p><strong>No se pudo actualizar el estado</strong></p>
          <p>${error.response?.data?.message || 'Error desconocido'}</p>
          ${error.response?.data?.error ? `<small style="color: #666;">${error.response.data.error}</small>` : ''}
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setImagePreview('');
    setEditingProduct(null);
    setTimeout(() => {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }, 0);
  };

  return (
    <div className="admin-dashboard">
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
          <button
            className={activeTab === 'sentimientos' ? 'active' : ''}
            onClick={() => setActiveTab('sentimientos')}
          >
            🤖 Análisis de Sentimientos
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
            ) : productos.length === 0 ? (
              <div className="empty-state">
                <p>📦 No hay productos registrados</p>
                <button className="btn-primary" onClick={abrirModalNuevo}>
                  Crear primer producto
                </button>
              </div>
            ) : (
              <div className="productos-grid">
                {productos.map(producto => (
                  <div key={producto._id} className="producto-card-admin">
                    <div className="producto-image">
                      {producto.image && producto.image.startsWith('/uploads') ? (
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
                      
                      {producto.numeroReviews > 0 && producto.estadisticasSentimientos && (
                        <div className="producto-sentiment-mini">
                          <span className="reviews-count">
                            ⭐ {producto.calificacionPromedio.toFixed(1)} ({producto.numeroReviews})
                          </span>
                          {parseFloat(producto.estadisticasSentimientos.porcentajes?.muyNegativo || 0) + 
                           parseFloat(producto.estadisticasSentimientos.porcentajes?.negativo || 0) > 30 && (
                            <span className="alert-indicator" title="Alto porcentaje de reseñas negativas">
                              ⚠️
                            </span>
                          )}
                          {producto.estadisticasSentimientos.sarcasmoDetectado > 0 && (
                            <span className="sarcasm-indicator" title={`${producto.estadisticasSentimientos.sarcasmoDetectado} sarcasmo(s) detectado(s)`}>
                              🎭
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="producto-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => abrirModalEditar(producto)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => eliminarProducto(producto)}
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
            ) : ordenes.length === 0 ? (
              <div className="empty-state">
                <p>📦 No hay órdenes registradas</p>
              </div>
            ) : (
              <div className="ordenes-list">
                {ordenes.map(orden => (
                  <div key={orden._id} className="orden-card">
                    <div className="orden-header">
                      <h3>Orden #{orden.numeroOrden}</h3>
                      <span className={`estado-badge ${orden.estado}`}>
                        {orden.estado === 'pendiente' && '⏳ Pendiente'}
                        {orden.estado === 'procesando' && '⚙️ Procesando'}
                        {orden.estado === 'enviado' && '🚚 Enviado'}
                        {orden.estado === 'entregado' && '✅ Entregado'}
                        {orden.estado === 'cancelado' && '❌ Cancelado'}
                      </span>
                    </div>
                    <div className="orden-body">
                      <p><strong>Cliente:</strong> {orden.usuario?.nombre || 'N/A'}</p>
                      <p><strong>Email:</strong> {orden.usuario?.email || 'N/A'}</p>
                      <p><strong>Total:</strong> ${orden.total?.toFixed(2)}</p>
                      <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString('es-EC', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                      <p><strong>Dirección:</strong> {orden.direccionEntrega?.direccion}, {orden.direccionEntrega?.ciudad}</p>
                      <p><strong>Teléfono:</strong> {orden.direccionEntrega?.telefono}</p>
                      <p><strong>Método de Pago:</strong> {
                        orden.metodoPago === 'efectivo' ? '💵 Efectivo' :
                        orden.metodoPago === 'transferencia' ? '🏦 Transferencia' :
                        '💳 Tarjeta'
                      }</p>
                      
                      <div className="orden-items">
                        <strong>Productos:</strong>
                        <ul>
                          {orden.items?.map((item, idx) => (
                            <li key={idx}>
                              {item.nombre} - {item.cantidad} {item.unit || 'unidad(es)'} x ${item.precio.toFixed(2)}
                              <span className="item-subtotal"> = ${(item.cantidad * item.precio).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="orden-totales">
                          <p><strong>Subtotal:</strong> ${orden.subtotal?.toFixed(2)}</p>
                          <p><strong>Envío:</strong> ${orden.costoEnvio?.toFixed(2)}</p>
                          <p className="total-final"><strong>TOTAL:</strong> ${orden.total?.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="orden-actions">
                        <label><strong>Actualizar Estado:</strong></label>
                        <select
                          value={orden.estado}
                          onChange={(e) => actualizarEstadoOrden(orden._id, e.target.value, orden.numeroOrden)}
                          className="estado-select"
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="procesando">⚙️ Procesando</option>
                          <option value="enviado">🚚 Enviado</option>
                          <option value="entregado">✅ Entregado</option>
                          <option value="cancelado">❌ Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sentimientos' && (
          <div className="sentimientos-section">
            {loading ? (
              <div className="loading">Cargando análisis de sentimientos...</div>
            ) : (
              <SentimentDashboard products={productos} />
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="producto-form">
              <div className="form-group full-width">
                <label>Imagen del Producto *</label>
                <div className="image-upload-container">
                  {(imagePreview || (formData.image && !imagePreview)) && (
                    <div className="image-preview-wrapper">
                      <div className="image-preview">
                        <img 
                          src={imagePreview || `http://localhost:5000${formData.image}`} 
                          alt="Preview" 
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove-image"
                        onClick={handleRemoveImage}
                      >
                        ✕ {imagePreview ? 'Eliminar nueva imagen' : 'Cambiar imagen'}
                      </button>
                    </div>
                  )}
                  
                  {!imagePreview && !formData.image && (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <p>Arrastra una imagen aquí o haz click para seleccionar</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="file-input"
                    id="file-upload"
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
                <button type="button" className="btn-cancel" onClick={cerrarModal}>
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