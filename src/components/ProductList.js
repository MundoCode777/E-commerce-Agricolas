// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { productService } from '../services/productService';
import './ProductList.css';

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      setProducts(response.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
    setLoading(false);
  };

  const handleProductClick = (productId) => {
    setSelectedProduct(productId);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section className="products-section" id="productos">
        <div className="container">
          <h2 className="section-title">Nuestros Productos Frescos</h2>
          <div className="loading-products">
            <div className="spinner-large"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="products-section" id="productos">
        <div className="container">
          <h2 className="section-title">Nuestros Productos Frescos</h2>
          <p className="section-subtitle">
            Productos 100% orgánicos cosechados del día
          </p>
          
          {products.length === 0 ? (
            <div className="no-products">
              <span className="no-products-icon">📦</span>
              <p>No hay productos disponibles en este momento</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.nombre,
                    price: product.precio,
                    image: product.image,
                    description: product.descripcion,
                    unit: product.unit,
                    calificacionPromedio: product.calificacionPromedio,
                    numeroReviews: product.numeroReviews,
                    disponible: product.disponible
                  }}
                  onAddToCart={onAddToCart}
                  onViewDetails={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {showDetail && selectedProduct && (
        <ProductDetail
          productId={selectedProduct}
          onClose={handleCloseDetail}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}

export default ProductList;