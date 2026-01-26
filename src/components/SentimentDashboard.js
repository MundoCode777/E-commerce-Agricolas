// src/components/SentimentDashboard.js - NUEVO COMPONENTE
import React from 'react';
import './SentimentDashboard.css';

function SentimentDashboard({ products }) {
  // Filtrar productos con reseñas
  const productosConReseñas = products.filter(p => p.numeroReviews > 0);

  // Ordenar por más negativos
  const productosNegativos = [...productosConReseñas]
    .filter(p => p.estadisticasSentimientos?.porcentajes?.muyNegativo > 20 || 
                 p.estadisticasSentimientos?.porcentajes?.negativo > 30)
    .sort((a, b) => {
      const negA = (parseFloat(a.estadisticasSentimientos?.porcentajes?.muyNegativo || 0) + 
                    parseFloat(a.estadisticasSentimientos?.porcentajes?.negativo || 0));
      const negB = (parseFloat(b.estadisticasSentimientos?.porcentajes?.muyNegativo || 0) + 
                    parseFloat(b.estadisticasSentimientos?.porcentajes?.negativo || 0));
      return negB - negA;
    });

  // Productos con sarcasmo
  const productosConSarcasmo = productosConReseñas.filter(
    p => p.estadisticasSentimientos?.sarcasmoDetectado > 0
  );

  // Calcular estadísticas globales
  const totalReseñas = productosConReseñas.reduce((sum, p) => sum + (p.numeroReviews || 0), 0);
  const totalSarcasmo = productosConReseñas.reduce(
    (sum, p) => sum + (p.estadisticasSentimientos?.sarcasmoDetectado || 0), 0
  );

  const promedioSentimientos = {
    muyPositivo: 0,
    positivo: 0,
    neutro: 0,
    negativo: 0,
    muyNegativo: 0
  };

  if (productosConReseñas.length > 0) {
    productosConReseñas.forEach(p => {
      promedioSentimientos.muyPositivo += parseFloat(p.estadisticasSentimientos?.porcentajes?.muyPositivo || 0);
      promedioSentimientos.positivo += parseFloat(p.estadisticasSentimientos?.porcentajes?.positivo || 0);
      promedioSentimientos.neutro += parseFloat(p.estadisticasSentimientos?.porcentajes?.neutro || 0);
      promedioSentimientos.negativo += parseFloat(p.estadisticasSentimientos?.porcentajes?.negativo || 0);
      promedioSentimientos.muyNegativo += parseFloat(p.estadisticasSentimientos?.porcentajes?.muyNegativo || 0);
    });

    Object.keys(promedioSentimientos).forEach(key => {
      promedioSentimientos[key] = (promedioSentimientos[key] / productosConReseñas.length).toFixed(1);
    });
  }

  return (
    <div className="sentiment-dashboard">
      <h2>📊 Dashboard de Análisis de Sentimientos</h2>

      {/* Estadísticas Globales */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{totalReseñas}</div>
            <div className="stat-label">Total Reseñas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{productosConReseñas.length}</div>
            <div className="stat-label">Productos con Reseñas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎭</div>
          <div className="stat-content">
            <div className="stat-number">{totalSarcasmo}</div>
            <div className="stat-label">Sarcasmo Detectado</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">😊</div>
          <div className="stat-content">
            <div className="stat-number">{promedioSentimientos.muyPositivo}%</div>
            <div className="stat-label">Promedio Muy Positivo</div>
          </div>
        </div>
      </div>

      {/* Sentimientos Promedio Globales */}
      <div className="global-sentiment">
        <h3>Distribución General de Sentimientos</h3>
        <div className="sentiment-bars-global">
          <div className="sentiment-bar-global">
            <span className="label">😊 Muy Positivo</span>
            <div className="bar-wrapper">
              <div className="bar bar-very-positive" style={{ width: `${promedioSentimientos.muyPositivo}%` }} />
              <span className="percentage">{promedioSentimientos.muyPositivo}%</span>
            </div>
          </div>

          <div className="sentiment-bar-global">
            <span className="label">🙂 Positivo</span>
            <div className="bar-wrapper">
              <div className="bar bar-positive" style={{ width: `${promedioSentimientos.positivo}%` }} />
              <span className="percentage">{promedioSentimientos.positivo}%</span>
            </div>
          </div>

          <div className="sentiment-bar-global">
            <span className="label">😐 Neutro</span>
            <div className="bar-wrapper">
              <div className="bar bar-neutral" style={{ width: `${promedioSentimientos.neutro}%` }} />
              <span className="percentage">{promedioSentimientos.neutro}%</span>
            </div>
          </div>

          <div className="sentiment-bar-global">
            <span className="label">🙁 Negativo</span>
            <div className="bar-wrapper">
              <div className="bar bar-negative" style={{ width: `${promedioSentimientos.negativo}%` }} />
              <span className="percentage">{promedioSentimientos.negativo}%</span>
            </div>
          </div>

          <div className="sentiment-bar-global">
            <span className="label">😞 Muy Negativo</span>
            <div className="bar-wrapper">
              <div className="bar bar-very-negative" style={{ width: `${promedioSentimientos.muyNegativo}%` }} />
              <span className="percentage">{promedioSentimientos.muyNegativo}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos con Alertas */}
      {productosNegativos.length > 0 && (
        <div className="alert-section">
          <h3>⚠️ Productos que Requieren Atención</h3>
          <p className="alert-description">
            Productos con alto porcentaje de reseñas negativas
          </p>
          <div className="alert-products">
            {productosNegativos.slice(0, 5).map(producto => {
              const negativo = parseFloat(producto.estadisticasSentimientos?.porcentajes?.negativo || 0);
              const muyNegativo = parseFloat(producto.estadisticasSentimientos?.porcentajes?.muyNegativo || 0);
              const totalNegativo = negativo + muyNegativo;

              return (
                <div key={producto._id} className="alert-product-card">
                  <div className="alert-product-header">
                    <h4>{producto.nombre}</h4>
                    <span className="alert-badge">
                      {totalNegativo.toFixed(0)}% Negativo
                    </span>
                  </div>
                  <div className="alert-product-stats">
                    <span>⭐ {producto.calificacionPromedio.toFixed(1)}</span>
                    <span>📝 {producto.numeroReviews} reseñas</span>
                    <span>😞 {muyNegativo.toFixed(0)}% Muy negativo</span>
                    <span>🙁 {negativo.toFixed(0)}% Negativo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Productos con Sarcasmo */}
      {productosConSarcasmo.length > 0 && (
        <div className="sarcasm-section">
          <h3>🎭 Productos con Sarcasmo Detectado</h3>
          <div className="sarcasm-products">
            {productosConSarcasmo.map(producto => (
              <div key={producto._id} className="sarcasm-product-card">
                <h4>{producto.nombre}</h4>
                <div className="sarcasm-info">
                  <span className="sarcasm-count">
                    {producto.estadisticasSentimientos.sarcasmoDetectado} reseña(s) sarcástica(s)
                  </span>
                  <span className="total-reviews">
                    de {producto.numeroReviews} total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SentimentDashboard;