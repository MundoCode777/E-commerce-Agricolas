// src/components/ProductDetail.js - CÓDIGO COMPLETO SIN MINIATURAS
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import './ProductDetail.css';

function ProductDetail({ productId, onClose, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reviewForm, setReviewForm] = useState({ calificacion: 5, comentario: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (productId) {
      setProduct(null);
      setQuantity(1);
      setActiveTab('descripcion');
      setMessage({ type: '', text: '' });
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(productId);
      setProduct(response.product);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      setMessage({ type: 'error', text: 'Error al cargar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart({
        id: product._id,
        name: product.nombre,
        price: product.precio,
        image: product.image,
        unit: product.unit
      }, quantity);
      
      setMessage({ type: 'success', text: '✅ Producto agregado al carrito' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para dejar una reseña' });
      return;
    }

    setSubmittingReview(true);
    try {
      await productService.addReview(productId, reviewForm);
      setMessage({ type: 'success', text: '✅ Reseña agregada exitosamente' });
      setReviewForm({ calificacion: 5, comentario: '' });
      loadProduct();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al agregar reseña' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await productService.deleteReview(productId, reviewId);
      setMessage({ type: 'success', text: '✅ Reseña eliminada' });
      loadProduct();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar reseña' });
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span key={star} className={star <= rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-overlay">
        <div className="product-detail-modal">
          <div className="loading-spinner">⏳ Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-detail-btn" onClick={onClose}>✕</button>

        {message.text && (
          <div className={`detail-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="product-detail-content">
          {/* Columna Izquierda - Solo imagen principal */}
          <div className="product-detail-left">
            <div className="product-main-image">
              {product.image && product.image.startsWith('/uploads') ? (
                <img 
                  src={`http://localhost:5000${product.image}`} 
                  alt={product.nombre}
                  className="product-main-img"
                  key={`${product._id}-${product.image}`}
                />
              ) : (
                <span className="product-large-emoji">{product.image}</span>
              )}
              {!product.disponible && (
                <div className="out-of-stock-badge">Agotado</div>
              )}
            </div>
          </div>

          {/* Columna Derecha - Información */}
          <div className="product-detail-right">
            <div className="product-header-info">
              <h1>{product.nombre}</h1>
              <span className="product-category-badge">{product.categoria}</span>
            </div>

            <div className="product-rating-section">
              <div className="rating-stars">
                {renderStars(Math.round(product.calificacionPromedio || 0))}
                <span className="rating-number">
                  {(product.calificacionPromedio || 0).toFixed(1)}
                </span>
              </div>
              <span className="review-count">
                ({product.numeroReviews || 0} {(product.numeroReviews || 0) === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>

            <p className="product-short-description">{product.descripcion}</p>

            <div className="product-price-section">
              <span className="product-price-large">${Number(product.precio || 0).toFixed(2)}</span>
              <span className="product-price-unit">/{product.unit}</span>
            </div>

            <div className="product-stock-info">
              {product.disponible ? (
                <>
                  <span className="stock-badge available">✓ En stock</span>
                  <span className="stock-quantity">({product.stock} disponibles)</span>
                </>
              ) : (
                <span className="stock-badge unavailable">✗ Agotado</span>
              )}
            </div>

            {product.disponible && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Cantidad:</label>
                  <div className="quantity-controls-detail">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className="add-to-cart-detail" 
                  onClick={handleAddToCart}
                  type="button"
                >
                  🛒 Agregar al Carrito
                </button>
              </div>
            )}

            {product.beneficios && product.beneficios.length > 0 && (
              <div className="product-benefits">
                <h3>✨ Características</h3>
                <ul>
                  {product.beneficios.map((beneficio, index) => (
                    <li key={index}>{beneficio}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs de información adicional */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              type="button"
              className={activeTab === 'descripcion' ? 'tab-active' : ''}
              onClick={() => setActiveTab('descripcion')}
            >
              📝 Descripción
            </button>
            <button
              type="button"
              className={activeTab === 'reviews' ? 'tab-active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              ⭐ Reseñas ({product.numeroReviews || 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'descripcion' && (
              <div className="tab-pane">
                <p>{product.descripcionLarga || product.descripcion}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                {isAuthenticated && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h3>Deja tu Reseña</h3>
                    <div className="rating-input">
                      <label>Calificación:</label>
                      <select 
                        value={reviewForm.calificacion}
                        onChange={(e) => setReviewForm({...reviewForm, calificacion: Number(e.target.value)})}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                        <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
                        <option value="3">⭐⭐⭐ Bueno</option>
                        <option value="2">⭐⭐ Regular</option>
                        <option value="1">⭐ Malo</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Escribe tu opinión sobre este producto..."
                      value={reviewForm.comentario}
                      onChange={(e) => setReviewForm({...reviewForm, comentario: e.target.value})}
                      required
                    />
                    <button type="submit" disabled={submittingReview}>
                      {submittingReview ? 'Enviando...' : 'Publicar Reseña'}
                    </button>
                  </form>
                )}

                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="review-author">
                            <span className="author-avatar">{review.avatarUsuario || '👤'}</span>
                            <strong>{review.nombreUsuario}</strong>
                          </div>
                          <div className="review-rating">
                            {renderStars(review.calificacion)}
                          </div>
                        </div>
                        <p className="review-comment">{review.comentario}</p>
                        <span className="review-date">
                          {new Date(review.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {isAuthenticated && review.usuario === user.id && (
                          <button 
                            type="button"
                            className="delete-review-btn"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">
                      No hay reseñas todavía. ¡Sé el primero en dejar una!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;