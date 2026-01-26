// backend/test-sentiment.js - NUEVO ARCHIVO PARA TESTING
const { analizarSentimiento } = require('./utils/sentimentAnalyzer');

// Casos de prueba
const casosTest = [
  {
    texto: "Excelente producto, mis plantas crecieron muy rápido y saludables",
    calificacion: 5,
    esperado: "muy positivo"
  },
  {
    texto: "Buen fertilizante, funciona bien",
    calificacion: 4,
    esperado: "positivo"
  },
  {
    texto: "Normal, nada especial",
    calificacion: 3,
    esperado: "neutro"
  },
  {
    texto: "No me gustó, caro y no funciona bien",
    calificacion: 2,
    esperado: "negativo"
  },
  {
    texto: "Pésimo producto, mis plantas murieron todas. Perdí mi dinero",
    calificacion: 1,
    esperado: "muy negativo"
  },
  {
    texto: "Claro que sí, súper efectivo 🙄 mis plantas murieron",
    calificacion: 1,
    esperado: "negativo (con sarcasmo)"
  },
  {
    texto: "WOW qué maravilla, no funciona para nada!!!",
    calificacion: 1,
    esperado: "negativo (con sarcasmo)"
  },
  {
    texto: "Genial, excelente producto pero llegó roto",
    calificacion: 2,
    esperado: "mixto (con sarcasmo)"
  }
];

console.log('\n🧪 PROBANDO ANÁLISIS DE SENTIMIENTOS\n');
console.log('='.repeat(80));

casosTest.forEach((caso, index) => {
  console.log(`\n📝 Caso ${index + 1}:`);
  console.log(`Texto: "${caso.texto}"`);
  console.log(`Calificación: ${'⭐'.repeat(caso.calificacion)}`);
  console.log(`Esperado: ${caso.esperado}\n`);
  
  const resultado = analizarSentimiento(caso.texto, caso.calificacion);
  
  console.log(`Resultado:`);
  console.log(`  ${resultado.emoji} Sentimiento: ${resultado.sentimiento}`);
  console.log(`  📊 Score: ${resultado.score.toFixed(3)}`);
  console.log(`  ✅ Confianza: ${(resultado.confianza * 100).toFixed(1)}%`);
  
  if (resultado.esSarcasmo) {
    console.log(`  🎭 SARCASMO DETECTADO`);
    console.log(`  Indicadores: ${resultado.indicadoresSarcasmo.join(', ')}`);
  }
  
  if (resultado.palabrasPositivas.length > 0) {
    console.log(`  ✅ Palabras positivas: ${resultado.palabrasPositivas.join(', ')}`);
  }
  
  if (resultado.palabrasNegativas.length > 0) {
    console.log(`  ❌ Palabras negativas: ${resultado.palabrasNegativas.join(', ')}`);
  }
  
  console.log('-'.repeat(80));
});

console.log('\n✅ Pruebas completadas\n');