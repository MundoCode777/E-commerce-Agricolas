// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import './ProductDetail.css';

function ProductDetail({ productId, onClose, onAddToCart }) {
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    calificacion: 5,
    comentario: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Arreglar el useEffect (solo depende de productId)
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductById(productId);
        setProduct(response.product);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setMessage({ type: 'error', text: 'Error al cargar el producto' });
      }
      setLoading(false);
    };

    if (productId) loadProduct();
  }, [productId]);

  // ✅ Recargar producto para usar en submit/delete review
  const reloadProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(productId);
      setProduct(response.product);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      setMessage({ type: 'error', text: 'Error al cargar el producto' });
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para dejar una reseña' });
      return;
    }

    try {
      await productService.addReview(productId, reviewData);
      setMessage({ type: 'success', text: 'Reseña agregada exitosamente' });
      setShowReviewForm(false);
      setReviewData({ calificacion: 5, comentario: '' });
      reloadProduct(); // ✅ Usar reloadProduct
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al agregar reseña'
      });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await productService.deleteReview(productId, reviewId);
      setMessage({ type: 'success', text: 'Reseña eliminada' });
      reloadProduct(); // ✅ Usar reloadProduct
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar reseña' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart({
          id: product._id,
          name: product.nombre,
          price: product.precio,
          image: product.image,
          unit: product.unit
        });
      }
      setMessage({ type: 'success', text: `${quantity} producto(s) agregado(s) al carrito` });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-overlay">
        <div className="product-detail-modal">
          <div className="loading-spinner">Cargando...</div>
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
          {/* Columna Izquierda - Imagen y galería */}
          <div className="product-detail-left">
            <div className="product-main-image">
              <span className="product-large-emoji">{product.image}</span>
              {!product.disponible && (
                <div className="out-of-stock-badge">Agotado</div>
              )}
            </div>

            <div className="product-thumbnails">
              {product.imagenes?.map((img, index) => (
                <div key={index} className="thumbnail">
                  <span>{img}</span>
                </div>
              ))}
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
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                  </div>
                </div>

                <button className="add-to-cart-detail" onClick={handleAddToCart}>
                  🛒 Agregar al Carrito
                </button>
              </div>
            )}

            {product.beneficios && product.beneficios.length > 0 && (
              <div className="product-benefits">
                <h3>✨ Beneficios</h3>
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
              className={activeTab === 'descripcion' ? 'tab-active' : ''}
              onClick={() => setActiveTab('descripcion')}
            >
              📝 Descripción
            </button>
            <button
              className={activeTab === 'nutricion' ? 'tab-active' : ''}
              onClick={() => setActiveTab('nutricion')}
            >
              🥗 Información Nutricional
            </button>
            <button
              className={activeTab === 'reviews' ? 'tab-active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              ⭐ Reseñas ({product.numeroReviews || 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'descripcion' && (
              <div className="tab-panel">
                <h3>Descripción Detallada</h3>
                <p>{product.descripcionLarga || product.descripcion}</p>
              </div>
            )}

            {activeTab === 'nutricion' && (
              <div className="tab-panel">
                <h3>Información Nutricional</h3>
                {product.informacionNutricional ? (
                  <div className="nutrition-info">
                    <div className="nutrition-item">
                      <strong>Calorías:</strong> {product.informacionNutricional.calorias}
                    </div>
                    <div className="nutrition-item">
                      <strong>Proteínas:</strong> {product.informacionNutricional.proteinas}
                    </div>
                    <div className="nutrition-item">
                      <strong>Carbohidratos:</strong> {product.informacionNutricional.carbohidratos}
                    </div>
                    <div className="nutrition-item">
                      <strong>Grasas:</strong> {product.informacionNutricional.grasas}
                    </div>
                    <div className="nutrition-item">
                      <strong>Fibra:</strong> {product.informacionNutricional.fibra}
                    </div>
                    {product.informacionNutricional.vitaminas && (
                      <div className="nutrition-item vitamins">
                        <strong>Vitaminas:</strong>
                        <div className="vitamin-list">
                          {product.informacionNutricional.vitaminas.map((vit, index) => (
                            <span key={index} className="vitamin-badge">{vit}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Información nutricional no disponible</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel reviews-panel">
                <div className="reviews-header">
                  <h3>Reseñas de Clientes</h3>
                  {isAuthenticated && !showReviewForm && (
                    <button
                      className="btn-add-review"
                      onClick={() => setShowReviewForm(true)}
                    >
                      ✍️ Escribir Reseña
                    </button>
                  )}
                </div>

                {showReviewForm && (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h4>Deja tu opinión</h4>

                    <div className="form-group">
                      <label>Calificación:</label>
                      <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= reviewData.calificacion ? 'star-input filled' : 'star-input'}
                            onClick={() => setReviewData({ ...reviewData, calificacion: star })}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Comentario:</label>
                      <textarea
                        value={reviewData.comentario}
                        onChange={(e) => setReviewData({ ...reviewData, comentario: e.target.value })}
                        placeholder="Cuéntanos tu experiencia con este producto..."
                        required
                        rows="4"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit-review">
                        Publicar Reseña
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-review"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header-card">
                          <div className="reviewer-info">
                            <span className="reviewer-avatar">{review.avatarUsuario}</span>
                            <div>
                              <strong>{review.nombreUsuario}</strong>
                              <div className="review-stars">
                                {renderStars(review.calificacion)}
                              </div>
                            </div>
                          </div>

                          <div className="review-meta">
                            <span className="review-date">
                              {new Date(review.fecha).toLocaleDateString('es-ES')}
                            </span>

                            {/* ✅ Si tu user viene como _id, esto evita fallos */}
                            {user && review.usuario === (user.id || user._id) && (
                              <button
                                className="btn-delete-review"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="review-comment">{review.comentario}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>Aún no hay reseñas para este producto</p>
                      <p>¡Sé el primero en dejarnos tu opinión!</p>
                    </div>
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
