// src/components/ProductList.js
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ onAddToCart }) {
  const products = [
    {
      id: 1,
      name: 'Tomates Orgánicos',
      price: 3.50,
      image: '🍅',
      description: 'Tomates frescos y jugosos',
      unit: 'kg'
    },
    {
      id: 2,
      name: 'Lechugas Verdes',
      price: 2.00,
      image: '🥬',
      description: 'Lechugas crocantes y frescas',
      unit: 'unidad'
    },
    {
      id: 3,
      name: 'Zanahorias',
      price: 2.80,
      image: '🥕',
      description: 'Zanahorias dulces y nutritivas',
      unit: 'kg'
    },
    {
      id: 4,
      name: 'Papas',
      price: 1.50,
      image: '🥔',
      description: 'Papas de primera calidad',
      unit: 'kg'
    },
    {
      id: 5,
      name: 'Brócoli',
      price: 3.20,
      image: '🥦',
      description: 'Brócoli fresco y saludable',
      unit: 'kg'
    },
    {
      id: 6,
      name: 'Pimientos',
      price: 4.00,
      image: '🫑',
      description: 'Pimientos rojos y verdes',
      unit: 'kg'
    },
    {
      id: 7,
      name: 'Cebollas',
      price: 1.80,
      image: '🧅',
      description: 'Cebollas blancas y moradas',
      unit: 'kg'
    },
    {
      id: 8,
      name: 'Maíz',
      price: 2.50,
      image: '🌽',
      description: 'Maíz tierno y dulce',
      unit: 'kg'
    }
  ];

  return (
    <section className="products-section" id="productos">
      <div className="container">
        <h2 className="section-title">Nuestros Productos Frescos</h2>
        <p className="section-subtitle">
          Productos 100% orgánicos cosechados del día
        </p>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductList;